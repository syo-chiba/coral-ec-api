-- Initial release minimum schema for coral EC site

-- Extend existing users table from V1
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
  ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Backfill safety for existing rows
UPDATE users SET password_hash = COALESCE(password_hash, 'TEMP_HASH_CHANGE_ME');
ALTER TABLE users ALTER COLUMN password_hash SET NOT NULL;

-- profiles (1:1 with users)
CREATE TABLE IF NOT EXISTS profiles (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  location VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- items (product listings)
CREATE TABLE IF NOT EXISTS items (
  id BIGSERIAL PRIMARY KEY,
  seller_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  category VARCHAR(100),
  condition VARCHAR(20) NOT NULL CHECK (condition IN ('new', 'used')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'sold', 'hidden')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- favorites
CREATE TABLE IF NOT EXISTS favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id BIGINT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_favorites_user_item UNIQUE (user_id, item_id)
);

-- comments
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  item_id BIGINT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- chat rooms
CREATE TABLE IF NOT EXISTS chat_rooms (
  id BIGSERIAL PRIMARY KEY,
  item_id BIGINT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  buyer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_chat_rooms_item_buyer UNIQUE (item_id, buyer_id),
  CONSTRAINT chk_chat_room_buyer_seller_diff CHECK (buyer_id <> seller_id)
);

-- chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGSERIAL PRIMARY KEY,
  room_id BIGINT NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- reviews
CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  item_id BIGINT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  reviewer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_reviewer_reviewee_diff CHECK (reviewer_id <> reviewee_id)
);

-- reports
CREATE TABLE IF NOT EXISTS reports (
  id BIGSERIAL PRIMARY KEY,
  reporter_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('user', 'item', 'comment', 'message')),
  target_id BIGINT NOT NULL,
  reason_code VARCHAR(50) NOT NULL,
  reason_text TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewed', 'closed')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- blocks
CREATE TABLE IF NOT EXISTS blocks (
  id BIGSERIAL PRIMARY KEY,
  blocker_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_blocks_blocker_blocked UNIQUE (blocker_id, blocked_id),
  CONSTRAINT chk_block_self_block CHECK (blocker_id <> blocked_id)
);

-- indexes for list/search/chat
CREATE INDEX IF NOT EXISTS idx_items_seller_id ON items(seller_id);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_price ON items(price);
CREATE INDEX IF NOT EXISTS idx_comments_item_id ON comments(item_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id_created_at ON chat_messages(room_id, created_at);
CREATE INDEX IF NOT EXISTS idx_reports_target ON reports(target_type, target_id);
