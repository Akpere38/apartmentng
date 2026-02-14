import db from '../config/database.js';

const addAmenitiesColumn = () => {
  db.run(
    'ALTER TABLE apartments ADD COLUMN amenities TEXT',
    (err) => {
      if (err) {
        if (err.message.includes('duplicate column')) {
          console.log('✅ Amenities column already exists');
        } else {
          console.error('❌ Error adding amenities column:', err);
        }
      } else {
        console.log('✅ Amenities column added successfully');
      }
      process.exit(0);
    }
  );
};

addAmenitiesColumn();