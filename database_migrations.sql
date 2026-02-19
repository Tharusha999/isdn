-- ISDN Database Schema Migration
-- This file contains all the SQL needed to set up the Supabase database for the ISDN system

-- Drop existing ENUM types if they exist (safe to re-run)
DROP TYPE IF EXISTS product_category CASCADE;
DROP TYPE IF EXISTS rdc_type CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS transaction_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS staff_status CASCADE;
DROP TYPE IF EXISTS mission_status CASCADE;
DROP TYPE IF EXISTS partner_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Create ENUM types for status fields
CREATE TYPE product_category AS ENUM ('Packaged Food', 'Beverages', 'Home Cleaning', 'Personal Care');
CREATE TYPE rdc_type AS ENUM ('North (Jaffna)', 'South (Galle)', 'East (Trincomalee)', 'West (Colombo)', 'Central (Kandy)');
CREATE TYPE order_status AS ENUM ('Pending', 'In Transit', 'Delivered', 'Cancelled');
CREATE TYPE transaction_status AS ENUM ('PAID', 'PENDING', 'FAILED');
CREATE TYPE payment_method AS ENUM ('Credit Card', 'Bank Transfer', 'Online Banking', 'Cash on Delivery');
CREATE TYPE staff_status AS ENUM ('Active', 'Away', 'On Route', 'Offline');
CREATE TYPE mission_status AS ENUM ('In Transit', 'Maintenance', 'Idle');
CREATE TYPE partner_status AS ENUM ('Active', 'Review', 'Inactive');
CREATE TYPE user_role AS ENUM ('admin', 'customer', 'driver');

-- ============================================
-- User Authentication Tables
-- ============================================

-- Admin Users Table
CREATE TABLE admin_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role DEFAULT 'admin' NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Customer Users Table
CREATE TABLE customer_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  address TEXT,
  city TEXT,
  role user_role DEFAULT 'customer' NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Driver Users Table
CREATE TABLE driver_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  license_number TEXT UNIQUE NOT NULL,
  license_expiry DATE,
  vehicle_assigned TEXT,
  rdc_hub rdc_type,
  role user_role DEFAULT 'driver' NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Products Table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category product_category NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Product Stock by RDC
CREATE TABLE product_stock (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  rdc rdc_type NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(product_id, rdc)
);

-- Customers Table
CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Orders Table
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  total DECIMAL(12, 2) NOT NULL,
  status order_status NOT NULL,
  rdc rdc_type NOT NULL,
  date DATE NOT NULL,
  eta DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Order Items (Line Items)
CREATE TABLE order_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Transactions Table
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE SET NULL,
  customer TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  date DATE NOT NULL,
  status transaction_status NOT NULL,
  method payment_method NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Staff Members Table
CREATE TABLE staff (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  status staff_status NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  join_date DATE NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Staff Recent Activity
CREATE TABLE staff_activity (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  staff_id TEXT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  activity_date DATE NOT NULL,
  activity_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Staff Performance Metrics
CREATE TABLE staff_performance (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  staff_id TEXT NOT NULL UNIQUE REFERENCES staff(id) ON DELETE CASCADE,
  deliveries_completed INTEGER NOT NULL DEFAULT 0,
  on_time_rate TEXT NOT NULL,
  hours_worked INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(3, 1) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- RDC Partners Table
CREATE TABLE rdc_partners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  hub rdc_type NOT NULL,
  contact TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  status partner_status NOT NULL,
  rating DECIMAL(3, 2) NOT NULL,
  contract_start DATE NOT NULL,
  contract_end DATE NOT NULL,
  agreement_type TEXT NOT NULL,
  compliance_score INTEGER NOT NULL DEFAULT 0,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Partner Audits
CREATE TABLE partner_audits (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  partner_id TEXT NOT NULL REFERENCES rdc_partners(id) ON DELETE CASCADE,
  audit_date DATE NOT NULL,
  result TEXT NOT NULL,
  inspector TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Missions Table
CREATE TABLE missions (
  id TEXT PRIMARY KEY,
  driver_id TEXT NOT NULL REFERENCES staff(id) ON DELETE RESTRICT,
  driver_name TEXT NOT NULL,
  vehicle TEXT NOT NULL,
  current_location TEXT NOT NULL,
  km_traversed TEXT NOT NULL,
  status mission_status NOT NULL,
  progress INTEGER NOT NULL,
  fuel_level TEXT NOT NULL,
  temperature TEXT NOT NULL,
  load_weight TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Mission Tasks
CREATE TABLE mission_tasks (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  mission_id TEXT NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  task_time TIME NOT NULL,
  task_label TEXT NOT NULL,
  location TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create Indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_product_stock_rdc ON product_stock(rdc);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_rdc ON orders(rdc);
CREATE INDEX idx_orders_date ON orders(date);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_transactions_order_id ON transactions(order_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_staff_department ON staff(department);
CREATE INDEX idx_staff_status ON staff(status);
CREATE INDEX idx_staff_activity_staff_id ON staff_activity(staff_id);
CREATE INDEX idx_staff_activity_date ON staff_activity(activity_date);
CREATE INDEX idx_rdc_partners_hub ON rdc_partners(hub);
CREATE INDEX idx_rdc_partners_status ON rdc_partners(status);
CREATE INDEX idx_partner_audits_partner_id ON partner_audits(partner_id);
CREATE INDEX idx_missions_driver_id ON missions(driver_id);
CREATE INDEX idx_missions_status ON missions(status);
CREATE INDEX idx_mission_tasks_mission_id ON mission_tasks(mission_id);

-- User Table Indexes
CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_is_active ON admin_users(is_active);
CREATE INDEX idx_customer_users_username ON customer_users(username);
CREATE INDEX idx_customer_users_email ON customer_users(email);
CREATE INDEX idx_customer_users_is_active ON customer_users(is_active);
CREATE INDEX idx_driver_users_username ON driver_users(username);
CREATE INDEX idx_driver_users_email ON driver_users(email);
CREATE INDEX idx_driver_users_license_number ON driver_users(license_number);
CREATE INDEX idx_driver_users_is_active ON driver_users(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE rdc_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (Allow all operations for now - restrict as needed for security)
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for authenticated users" ON products FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Enable update for authenticated users" ON products FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Enable read access for all users" ON product_stock FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for authenticated users" ON product_stock FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Enable update for authenticated users" ON product_stock FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Enable read access for all users" ON customers FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for authenticated users" ON customers FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Enable update for authenticated users" ON customers FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Enable read access for all users" ON orders FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for authenticated users" ON orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Enable update for authenticated users" ON orders FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Enable read access for all users" ON order_items FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for authenticated users" ON order_items FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Enable read access for all users" ON transactions FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for authenticated users" ON transactions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Enable update for authenticated users" ON transactions FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Enable read access for all users" ON staff FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for authenticated users" ON staff FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Enable update for authenticated users" ON staff FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Enable read access for all users" ON staff_activity FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for authenticated users" ON staff_activity FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Enable read access for all users" ON staff_performance FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for authenticated users" ON staff_performance FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Enable update for authenticated users" ON staff_performance FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

-- User Authentication RLS Policies
CREATE POLICY "Enable read access for admin users" ON admin_users FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for admin users" ON admin_users FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Enable update for admin users" ON admin_users FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Enable read access for customer users" ON customer_users FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for customer users" ON customer_users FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Enable update for customer users" ON customer_users FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Enable read access for driver users" ON driver_users FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for driver users" ON driver_users FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Enable update for driver users" ON driver_users FOR UPDATE USING (TRUE) WITH CHECK (TRUE);CREATE POLICY "Enable read access for all users" ON rdc_partners FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for authenticated users" ON rdc_partners FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Enable update for authenticated users" ON rdc_partners FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Enable read access for all users" ON partner_audits FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for authenticated users" ON partner_audits FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Enable read access for all users" ON missions FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for authenticated users" ON missions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Enable update for authenticated users" ON missions FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Enable read access for all users" ON mission_tasks FOR SELECT USING (TRUE);
CREATE POLICY "Enable insert for authenticated users" ON mission_tasks FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Enable update for authenticated users" ON mission_tasks FOR UPDATE USING (TRUE) WITH CHECK (TRUE);
