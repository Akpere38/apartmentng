import db from '../config/database.js';

const createAgentDocumentsTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS agent_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agent_id INTEGER NOT NULL,
      document_type TEXT NOT NULL CHECK(document_type IN ('id_card_front', 'id_card_back', 'business_registration', 'proof_of_address')),
      file_url TEXT NOT NULL,
      cloudinary_id TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      rejection_reason TEXT,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      verified_at DATETIME,
      verified_by INTEGER,
      FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
      FOREIGN KEY (verified_by) REFERENCES admins(id)
    )
  `;

  db.run(sql, (err) => {
    if (err) {
      console.error('❌ Error creating agent_documents table:', err);
    } else {
      console.log('✅ agent_documents table created successfully');
    }
    process.exit(0);
  });
};

createAgentDocumentsTable();