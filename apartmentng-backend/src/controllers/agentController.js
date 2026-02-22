import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { get, query, run } from '../config/database.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryHelper.js';

// Agent registration
export const agentRegister = async (req, res) => {
  try {
    const { name, email, password, phone, company_name } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingAgent = await get('SELECT * FROM agents WHERE email = ?', [email]);

    if (existingAgent) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await run(
      'INSERT INTO agents (name, email, password, phone, company_name) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, company_name]
    );

    res.status(201).json({ message: 'Registration successful. Waiting for admin approval.' });
  } catch (error) {
    console.error('Agent registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Agent login
export const agentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const agent = await get('SELECT * FROM agents WHERE email = ?', [email]);

    if (!agent) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, agent.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (agent.is_approved === 0) {
      return res.status(403).json({ error: 'Your account is pending approval' });
    }

    const token = jwt.sign(
      { id: agent.id, role: 'agent' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: agent.id,
        name: agent.name,
        email: agent.email,
        role: 'agent'
      }
    });
  } catch (error) {
    console.error('Agent login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all agents (admin only)
export const getAllAgents = async (req, res) => {
  try {
    const agents = await query(
      'SELECT id, name, email, phone, company_name, is_approved, created_at FROM agents ORDER BY created_at DESC'
    );
    res.json(agents);
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Approve/suspend agent (admin only)
export const approveAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_approved } = req.body;

    await run('UPDATE agents SET is_approved = ? WHERE id = ?', [is_approved ? 1 : 0, id]);

    res.json({ message: 'Agent status updated' });
  } catch (error) {
    console.error('Approve agent error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete agent (admin only)
export const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;

    await run('DELETE FROM agents WHERE id = ?', [id]);

    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Delete agent error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get agent by ID with apartments (admin only)
export const getAgentById = async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await get(
      'SELECT id, name, email, phone, company_name, is_approved, created_at FROM agents WHERE id = ?',
      [id]
    );

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const apartments = await query(
      `SELECT a.*,
        (SELECT image_url FROM apartment_images WHERE apartment_id = a.id AND is_primary = 1 LIMIT 1) as primary_image,
        (SELECT COUNT(*) FROM apartment_images WHERE apartment_id = a.id) as image_count
       FROM apartments a
       WHERE a.agent_id = ?
       ORDER BY a.created_at DESC`,
      [id]
    );

    const stats = {
      total_apartments: apartments.length,
      approved_apartments: apartments.filter(a => a.is_approved === 1).length,
      pending_apartments: apartments.filter(a => a.is_approved === 0).length,
      available_apartments: apartments.filter(a => a.is_available === 1).length,
      booked_apartments: apartments.filter(a => a.is_available === 0).length,
      featured_apartments: apartments.filter(a => a.is_featured === 1).length,
    };

    res.json({
      agent,
      apartments,
      stats
    });
  } catch (error) {
    console.error('Get agent by ID error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// NOW ADD THE NEW TASK 2 FUNCTIONS BELOW:

// Get current agent's own profile
export const getCurrentAgentProfile = async (req, res) => {
  try {
    const agentId = req.user.id;

    const agent = await get(
      'SELECT id, name, email, phone, company_name, is_approved, created_at FROM agents WHERE id = ?',
      [agentId]
    );

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const documents = await query(
      'SELECT id, document_type, file_url, status, rejection_reason, uploaded_at, verified_at FROM agent_documents WHERE agent_id = ?',
      [agentId]
    );

    const apartmentStats = await get(
      'SELECT COUNT(*) as total FROM apartments WHERE agent_id = ?',
      [agentId]
    );

    res.json({
      ...agent,
      documents,
      apartment_count: apartmentStats.total
    });
  } catch (error) {
    console.error('Get agent profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update agent profile
export const updateCurrentAgentProfile = async (req, res) => {
  try {
    const agentId = req.user.id;
    const { name, phone, company_name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    await run(
      'UPDATE agents SET name = ?, phone = ?, company_name = ? WHERE id = ?',
      [name, phone, company_name, agentId]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update agent profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Change password
export const changeCurrentAgentPassword = async (req, res) => {
  try {
    const agentId = req.user.id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const agent = await get('SELECT password FROM agents WHERE id = ?', [agentId]);

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const isPasswordValid = await bcrypt.compare(current_password, agent.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await run('UPDATE agents SET password = ? WHERE id = ?', [hashedPassword, agentId]);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Upload document
export const uploadCurrentAgentDocument = async (req, res) => {
  try {
    const agentId = req.user.id;
    const { document_type } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!['id_card_front', 'id_card_back', 'business_registration', 'proof_of_address'].includes(document_type)) {
      return res.status(400).json({ error: 'Invalid document type' });
    }

    const uploadResult = await uploadToCloudinary(req.file.path, 'agent_documents');

    const existingDoc = await get(
      'SELECT cloudinary_id FROM agent_documents WHERE agent_id = ? AND document_type = ?',
      [agentId, document_type]
    );

    if (existingDoc) {
      await deleteFromCloudinary(existingDoc.cloudinary_id);
      await run(
        'DELETE FROM agent_documents WHERE agent_id = ? AND document_type = ?',
        [agentId, document_type]
      );
    }

    await run(
      'INSERT INTO agent_documents (agent_id, document_type, file_url, cloudinary_id) VALUES (?, ?, ?, ?)',
      [agentId, document_type, uploadResult.secure_url, uploadResult.public_id]
    );

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: {
        document_type,
        file_url: uploadResult.secure_url,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete document
export const deleteCurrentAgentDocument = async (req, res) => {
  try {
    const agentId = req.user.id;
    const { id } = req.params;

    const document = await get(
      'SELECT * FROM agent_documents WHERE id = ? AND agent_id = ?',
      [id, agentId]
    );

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    await deleteFromCloudinary(document.cloudinary_id);

    await run('DELETE FROM agent_documents WHERE id = ?', [id]);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};