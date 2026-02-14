import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import db from '../config/database.js';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read and execute schema.sql
const initDatabase = async () => {
  try {
    console.log('🔧 Initializing database...');
    
    // Read schema file
    const schemaPath = join(__dirname, '../models/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split into individual statements
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    // Execute each statement
    for (const statement of statements) {
      await new Promise((resolve, reject) => {
        db.run(statement, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
    
    console.log('✅ Database tables created successfully');
    
    // Create default admin account
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT OR IGNORE INTO admins (email, password, name) VALUES (?, ?, ?)',
        ['admin@apartmentng.com', hashedPassword, 'Admin'],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    console.log('✅ Default admin created (email: admin@apartmentng.com, password: admin123)');
    console.log('⚠️  CHANGE THIS PASSWORD IN PRODUCTION!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
};

initDatabase();