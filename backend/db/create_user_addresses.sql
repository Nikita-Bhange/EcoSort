-- Run this SQL once to create the `user_addresses` table
CREATE TABLE IF NOT EXISTS user_addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userid INT NOT NULL,
  address VARCHAR(250),
  city VARCHAR(45),
  pincode VARCHAR(10),
  state VARCHAR(45),
  contact VARCHAR(20),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_userid (userid)
);
