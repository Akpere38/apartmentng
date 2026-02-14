-- ADMINS TABLE
-- Stores admin users who can manage everything
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AGENTS TABLE
-- Stores registered agents who can list apartments
CREATE TABLE IF NOT EXISTS agents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  is_approved INTEGER DEFAULT 0,  -- 0 = pending, 1 = approved
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- APARTMENTS TABLE
-- Main table for all apartment listings
CREATE TABLE IF NOT EXISTS apartments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  price_per_night REAL,
  is_available INTEGER DEFAULT 1,  -- 0 = unavailable, 1 = available
  is_featured INTEGER DEFAULT 0,   -- 0 = not featured, 1 = featured
  is_approved INTEGER DEFAULT 0,   -- 0 = pending, 1 = approved (for agent listings)
  agent_id INTEGER,                -- NULL if platform-owned
  created_by TEXT DEFAULT 'admin', -- 'admin' or 'agent'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL
);

-- APARTMENT_IMAGES TABLE
-- Stores multiple images for each apartment
CREATE TABLE IF NOT EXISTS apartment_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  apartment_id INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  cloudinary_id TEXT,
  is_primary INTEGER DEFAULT 0,    -- 0 = regular, 1 = primary/cover image
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE CASCADE
);

-- APARTMENT_VIDEOS TABLE
-- Stores videos for apartments (optional)
CREATE TABLE IF NOT EXISTS apartment_videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  apartment_id INTEGER NOT NULL,
  video_url TEXT NOT NULL,
  cloudinary_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_apartments_agent ON apartments(agent_id);
CREATE INDEX IF NOT EXISTS idx_apartments_featured ON apartments(is_featured);
CREATE INDEX IF NOT EXISTS idx_apartments_available ON apartments(is_available);
CREATE INDEX IF NOT EXISTS idx_images_apartment ON apartment_images(apartment_id);
CREATE INDEX IF NOT EXISTS idx_videos_apartment ON apartment_videos(apartment_id);