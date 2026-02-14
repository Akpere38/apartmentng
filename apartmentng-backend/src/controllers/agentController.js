import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { get, run, query } from '../config/database.js';

// Agent registration
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, company_name } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if email already exists
    const existingAgent = await get('SELECT id FROM agents WHERE email = ?', [email]);

    if (existingAgent) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert agent
    const result = await run(
      'INSERT INTO agents (name, email, password, phone, company_name) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone || null, company_name || null]
    );

    res.status(201).json({
      message: 'Registration successful. Please wait for admin approval.',
      agent: {
        id: result.id,
        name,
        email,
        is_approved: 0
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// Agent login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find agent
    const agent = await get('SELECT * FROM agents WHERE email = ?', [email]);

    if (!agent) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if approved
    if (!agent.is_approved) {
      return res.status(403).json({ error: 'Your account is pending approval' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, agent.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: agent.id, email: agent.email, role: 'agent' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      agent: {
        id: agent.id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        company_name: agent.company_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// Get agent profile
export const getProfile = async (req, res) => {
  try {
    const agent = await get(
      'SELECT id, name, email, phone, company_name, is_approved, created_at FROM agents WHERE id = ?',
      [req.user.id]
    );

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json(agent);
  } catch (error) {
    console.error('Get profile error:', error);
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

// Approve agent (admin only)
export const approveAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_approved } = req.body;

    await run('UPDATE agents SET is_approved = ? WHERE id = ?', [is_approved ? 1 : 0, id]);

    res.json({ message: 'Agent approval status updated' });
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