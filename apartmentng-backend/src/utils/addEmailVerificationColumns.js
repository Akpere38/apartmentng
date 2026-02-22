import db from '../config/database.js';

const addEmailVerificationFields = () => {
  const queries = [
    'ALTER TABLE agents ADD COLUMN email_verified INTEGER DEFAULT 0',
    'ALTER TABLE agents ADD COLUMN verification_token TEXT',
    'ALTER TABLE agents ADD COLUMN verification_token_expires DATETIME',
    'ALTER TABLE agents ADD COLUMN new_email TEXT',
    'ALTER TABLE agents ADD COLUMN new_email_token TEXT',
    'ALTER TABLE agents ADD COLUMN new_email_token_expires DATETIME'
  ];

  let completed = 0;

  queries.forEach((query, index) => {
    db.run(query, (err) => {
      if (err) {
        if (err.message.includes('duplicate column')) {
          console.log(`✅ Column ${index + 1} already exists`);
        } else {
          console.error('❌ Error:', err);
        }
      } else {
        console.log(`✅ Column ${index + 1} added successfully`);
      }
      
      completed++;
      if (completed === queries.length) {
        console.log('✅ All email verification fields added!');
        process.exit(0);
      }
    });
  });
};

addEmailVerificationFields();