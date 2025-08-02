-- Madhur Fashion Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image TEXT,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    rating DECIMAL(3,2) DEFAULT 4.0,
    reviews INTEGER DEFAULT 0,
    occasion TEXT[] DEFAULT '{}',
    color TEXT[] DEFAULT '{}',
    size TEXT[] DEFAULT '{}',
    in_stock BOOLEAN DEFAULT true,
    stock_count INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff Table
CREATE TABLE IF NOT EXISTS staff (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('owner', 'staff')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table (for customer management)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    role VARCHAR(20) CHECK (role IN ('customer', 'staff', 'owner')) DEFAULT 'customer',
    avatar TEXT,
    profile_complete BOOLEAN DEFAULT false,
    measurements JSONB,
    preferences JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_products_occasion ON products USING GIN(occasion);

-- Row Level Security (RLS) Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Products policies (everyone can read, only staff/owners can modify)
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

CREATE POLICY "Staff can insert products" ON products
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff can update products" ON products
    FOR UPDATE USING (true);

CREATE POLICY "Staff can delete products" ON products
    FOR DELETE USING (true);

-- Staff policies (only owners can manage staff)
CREATE POLICY "Staff are viewable by authenticated users" ON staff
    FOR SELECT USING (true);

CREATE POLICY "Owners can manage staff" ON staff
    FOR ALL USING (true);

-- Users policies
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (true);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user and staff members
INSERT INTO staff (username, email, role) VALUES 
    ('kailashjeswani', 'kailashjeswani@madhurfashion.com', 'owner'),
    ('staff1', 'staff1@madhurfashion.com', 'staff'),
    ('staff2', 'staff2@madhurfashion.com', 'staff'),
    ('manager', 'manager@madhurfashion.com', 'staff')
ON CONFLICT (username) DO NOTHING;

-- Sample products for testing (optional)
INSERT INTO products (name, description, price, category, subcategory, occasion, color, size, stock_count, in_stock, tags) VALUES 
    (
        'Royal Blue Sherwani',
        'Elegant royal blue sherwani perfect for weddings and special occasions. Made with premium silk fabric.',
        2499.00,
        'Traditional',
        'Sherwanis',
        ARRAY['Wedding', 'Reception', 'Sangeet'],
        ARRAY['Blue', 'Gold'],
        ARRAY['M', 'L', 'XL'],
        15,
        true,
        ARRAY['wedding', 'traditional', 'sherwani', 'blue', 'formal']
    ),
    (
        'Black Formal Blazer',
        'Classic black formal blazer for business meetings and formal events. Slim fit design.',
        1899.00,
        'Formal',
        'Blazers',
        ARRAY['Business', 'Formal'],
        ARRAY['Black'],
        ARRAY['S', 'M', 'L', 'XL'],
        25,
        true,
        ARRAY['formal', 'blazer', 'business', 'black', 'professional']
    ),
    (
        'Maroon Lehenga Set',
        'Beautiful maroon lehenga with intricate embroidery work. Perfect for festivals and celebrations.',
        3299.00,
        'Traditional',
        'Lehengas',
        ARRAY['Wedding', 'Festival', 'Party'],
        ARRAY['Maroon', 'Gold'],
        ARRAY['S', 'M', 'L'],
        8,
        true,
        ARRAY['traditional', 'lehenga', 'maroon', 'embroidery', 'festival']
    )
ON CONFLICT DO NOTHING;
