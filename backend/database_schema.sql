-- =====================================================
-- Second Hand Store Database Schema
-- Database Name: secondhandstoredb
-- =====================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS secondhandstoredb;
USE secondhandstoredb;

-- =====================================================
-- TABLE 1: USERS
-- Purpose: Store user and admin information
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    is_verified TINYINT(1) NOT NULL DEFAULT 0,
    verification_token VARCHAR(255) DEFAULT NULL,
    verification_token_expires_at DATETIME DEFAULT NULL,
    verified_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE 2: CATEGORY
-- Purpose: Store product categories (managed by admin)
-- =====================================================
CREATE TABLE IF NOT EXISTS category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cat_name VARCHAR(100) NOT NULL UNIQUE,
    cat_image VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO category (cat_name) VALUES 
('Clothes'),
('Cars'),
('Mobiles'),
('Books'),
('Pets'),
('Appliances'),
('Toys'),
('Bikes'),
('Furniture');

-- =====================================================
-- TABLE 3: PRODUCT
-- Purpose: Store products posted by sellers
-- =====================================================
CREATE TABLE IF NOT EXISTS product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    c_id INT NOT NULL,
    seller_id INT NOT NULL,
    p_name VARCHAR(255) NOT NULL,
    p_desc TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    used_duration VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    negotiable ENUM('Yes', 'No') DEFAULT 'No',
    image JSON DEFAULT NULL,
    status ENUM('available', 'sold') DEFAULT 'available',
    posting_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (c_id) REFERENCES category(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE 4: PROFILES
-- Purpose: Store user profile information and address
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userid INT NOT NULL UNIQUE,
    profileimage VARCHAR(500) DEFAULT NULL,
    address VARCHAR(500) DEFAULT NULL,
    city VARCHAR(100) DEFAULT NULL,
    pincode VARCHAR(10) DEFAULT NULL,
    state VARCHAR(100) DEFAULT NULL,
    contact VARCHAR(20) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE 5: CART
-- Purpose: Store user's cart items
-- =====================================================
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    p_id INT NOT NULL,
    u_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (p_id) REFERENCES product(id) ON DELETE CASCADE,
    FOREIGN KEY (u_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE 6: ORDER_DETAIL
-- Purpose: Store order/purchase history
-- =====================================================
CREATE TABLE IF NOT EXISTS order_detail (
    id INT AUTO_INCREMENT PRIMARY KEY,
    p_id INT NOT NULL,
    seller_id INT NOT NULL,
    buyer_id INT NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    payment_status ENUM('Pending', 'Completed', 'Failed', 'Refunded') DEFAULT 'Pending',
    payment_method VARCHAR(50) DEFAULT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (p_id) REFERENCES product(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE 7: CHAT (Optional - for buyer-seller negotiation)
-- Purpose: Store chat messages between buyer and seller
-- =====================================================
CREATE TABLE IF NOT EXISTS chat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    p_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (p_id) REFERENCES product(id) ON DELETE CASCADE
);

-- =====================================================
-- TABLE 8: INVOICE (Optional - for order invoices)
-- Purpose: Store invoice details
-- =====================================================
CREATE TABLE IF NOT EXISTS invoice (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    buyer_name VARCHAR(100) NOT NULL,
    buyer_email VARCHAR(255) NOT NULL,
    buyer_address VARCHAR(500) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    invoice_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES order_detail(id) ON DELETE CASCADE
);

-- =====================================================
-- INDEXES for better query performance
-- =====================================================
CREATE INDEX idx_product_seller ON product(seller_id);
CREATE INDEX idx_product_category ON product(c_id);
CREATE INDEX idx_product_status ON product(status);
CREATE INDEX idx_cart_user ON cart(u_id);
CREATE INDEX idx_order_buyer ON order_detail(buyer_id);
CREATE INDEX idx_order_seller ON order_detail(seller_id);
CREATE INDEX idx_chat_sender ON chat(sender_id);
CREATE INDEX idx_chat_receiver ON chat(receiver_id);
