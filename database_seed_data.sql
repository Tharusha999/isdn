-- ISDN Database Seed Data
-- Insert initial data for products, orders, transactions, staff members, and partners

-- ============================================
-- Clear existing data (safe to re-run)
-- ============================================
DELETE FROM admin_users WHERE TRUE;
DELETE FROM customer_users WHERE TRUE;
DELETE FROM driver_users WHERE TRUE;

-- ============================================
-- Insert User Accounts
-- ============================================

-- Admin Users (password: admin123 - should be hashed in production)
INSERT INTO admin_users (id, username, password, email, full_name, phone, is_active) VALUES
('ADMIN-001', 'admin', '$2y$10$Z0TqJhzLWcVHQQsLqakxS.Lc.RfPqbA9lkH8P0KnzKl9jKl9jKl9jK', 'admin@isdn.lk', 'Admin User', '+94 11 123 4567', TRUE),
('ADMIN-002', 'manager', '$2y$10$Z0TqJhzLWcVHQQsLqakxS.Lc.RfPqbA9lkH8P0KnzKl9jKl9jKl9jK', 'manager@isdn.lk', 'Manager User', '+94 11 234 5678', TRUE);

-- Customer Users (password: customer123 - should be hashed in production)
INSERT INTO customer_users (id, username, password, email, full_name, phone, company_name, city, is_active) VALUES
('CUST-USER-001', 'singer_mega', '$2y$10$Z0TqJhzLWcVHQQsLqakxS.Lc.RfPqbA9lkH8P0KnzKl9jKl9jKl9jK', 'contact@singermega.lk', 'Singer Mega', '+94 11 234 5678', 'Singer Mega - Colombo', 'Colombo', TRUE),
('CUST-USER-002', 'softlogic_galle', '$2y$10$Z0TqJhzLWcVHQQsLqakxS.Lc.RfPqbA9lkH8P0KnzKl9jKl9jKl9jK', 'galle@softlogic.lk', 'Softlogic Retail', '+94 91 234 5678', 'Softlogic Retail - Galle', 'Galle', TRUE),
('CUST-USER-003', 'abans_kandy', '$2y$10$Z0TqJhzLWcVHQQsLqakxS.Lc.RfPqbA9lkH8P0KnzKl9jKl9jKl9jK', 'kandy@abans.lk', 'Abans PLC', '+94 81 234 5678', 'Abans PLC - Kandy', 'Kandy', TRUE);

-- Driver Users (password: driver123 - should be hashed in production)
INSERT INTO driver_users (id, username, password, email, full_name, phone, license_number, license_expiry, vehicle_assigned, rdc_hub, is_active) VALUES
('DRIVER-001', 'john_driver', '$2y$10$Z0TqJhzLWcVHQQsLqakxS.Lc.RfPqbA9lkH8P0KnzKl9jKl9jKl9jK', 'john@isdn.lk', 'John Driver', '+94 77 123 4567', 'DL-2022-001', '2027-03-01', 'IS-VAN-782', 'West (Colombo)', TRUE),
('DRIVER-002', 'mike_driver', '$2y$10$Z0TqJhzLWcVHQQsLqakxS.Lc.RfPqbA9lkH8P0KnzKl9jKl9jKl9jK', 'mike@isdn.lk', 'Mike Driver', '+94 77 345 6789', 'DL-2022-002', '2027-06-01', 'IS-VAN-783', 'South (Galle)', TRUE),
('DRIVER-003', 'david_driver', '$2y$10$Z0TqJhzLWcVHQQsLqakxS.Lc.RfPqbA9lkH8P0KnzKl9jKl9jKl9jK', 'david@isdn.lk', 'David Driver', '+94 77 567 8901', 'DL-2022-003', '2027-08-01', 'IS-VAN-784', 'Central (Kandy)', TRUE);

-- Insert Products
INSERT INTO products (id, sku, name, category, price, image, description) VALUES
('P001', 'ISDN-FD-101', 'Premium Ceylon White Rice (5kg)', 'Packaged Food', 1250, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400', 'High-quality basmati rice sourced from local farmers.'),
('P002', 'ISDN-BV-202', 'Ginger Beer (Pack of 6)', 'Beverages', 980, 'https://www.grocerylanka.com/cdn/shop/products/Ginger-Beer-330ml-can_1024x1024.jpg?v=1525742624?auto=format&fit=crop&q=80&w=400', 'Classic Sri Lankan ginger beer with a spicy kick.'),
('P003', 'ISDN-CL-303', 'PureHome Surface Cleaner (5L)', 'Home Cleaning', 2250, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRGGl92stChsIjQqxDlcFwVpIKsh9-p6bjsA&s?auto=format&fit=crop&q=80&w=400', 'Eco-friendly multi-surface cleaner.'),
('P004', 'ISDN-PC-404', 'Soap (100g)', 'Personal Care', 120, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD5SXTfVm14Z1KL-J9RfmTHCWfMA0MTV9R2Q&s?auto=format&fit=crop&q=80&w=400', 'Moisturizing soap.'),
('P005', 'ISDN-BV-205', 'Ceylon High-Grown Tea (500g)', 'Beverages', 2450, 'https://www.aicr.org/wp-content/uploads/2020/06/peppermint-tea-on-teacup-1417945.jpg?auto=format&fit=crop&q=80&w=400', 'Premium black tea from the central highlands.');

-- Insert Product Stock by RDC
INSERT INTO product_stock (product_id, rdc, quantity) VALUES
-- P001 Stock
('P001', 'Central (Kandy)', 1200),
('P001', 'North (Jaffna)', 450),
('P001', 'South (Galle)', 300),
('P001', 'East (Trincomalee)', 150),
('P001', 'West (Colombo)', 800),
-- P002 Stock
('P002', 'Central (Kandy)', 800),
('P002', 'North (Jaffna)', 200),
('P002', 'South (Galle)', 500),
('P002', 'East (Trincomalee)', 200),
('P002', 'West (Colombo)', 1200),
-- P003 Stock
('P003', 'Central (Kandy)', 500),
('P003', 'North (Jaffna)', 100),
('P003', 'South (Galle)', 100),
('P003', 'East (Trincomalee)', 50),
('P003', 'West (Colombo)', 600),
-- P004 Stock
('P004', 'Central (Kandy)', 2000),
('P004', 'North (Jaffna)', 500),
('P004', 'South (Galle)', 800),
('P004', 'East (Trincomalee)', 300),
('P004', 'West (Colombo)', 1500),
-- P005 Stock
('P005', 'Central (Kandy)', 5000),
('P005', 'North (Jaffna)', 1000),
('P005', 'South (Galle)', 800),
('P005', 'East (Trincomalee)', 400),
('P005', 'West (Colombo)', 2500);

-- Insert Customers
INSERT INTO customers (id, name, email, phone) VALUES
('CUST-001', 'Singer Mega - Colombo 03', 'contact@singermega.lk', '+94 11 234 5678'),
('CUST-002', 'Softlogic Retail - Galle', 'galle@softlogic.lk', '+94 91 234 5678'),
('CUST-003', 'Abans PLC - Kandy', 'kandy@abans.lk', '+94 81 234 5678');

-- Insert Orders
INSERT INTO orders (id, customer_id, total, status, rdc, date, eta) VALUES
('ORD-9921', 'CUST-001', 12500, 'In Transit', 'West (Colombo)', '2026-02-18', '2026-02-20'),
('ORD-9922', 'CUST-002', 49000, 'Delivered', 'South (Galle)', '2026-02-15', '2026-02-17'),
('ORD-9923', 'CUST-003', 245000, 'Pending', 'Central (Kandy)', '2026-02-18', '2026-02-19');

-- Insert Order Items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
('ORD-9921', 'P001', 10, 1250),
('ORD-9922', 'P002', 50, 980),
('ORD-9923', 'P005', 100, 2450);

-- Insert Transactions
INSERT INTO transactions (id, order_id, customer, amount, date, status, method) VALUES
('INV-2026-101', 'ORD-9922', 'Singer Mega - Colombo 03', 145000.00, '2026-02-18', 'PAID', 'Credit Card'),
('INV-2026-102', 'ORD-9923', 'Softlogic Retail - Galle', 245000.00, '2026-02-18', 'PENDING', 'Bank Transfer'),
('INV-2026-103', NULL, 'Abans PLC - Kandy', 212500.00, '2026-02-17', 'PAID', 'Online Banking');

-- Insert Staff Members
INSERT INTO staff (id, name, role, status, email, phone, join_date, department, location, bio) VALUES
('STAFF-001', 'John Doe', 'Warehouse Manager', 'Active', 'john@isdn.lk', '+94 77 123 4567', '2022-03-01', 'Logistics', 'Colombo HQ', 'Experienced warehouse manager with over 10 years in logistics and supply chain management. Expert in inventory optimization.'),
('STAFF-002', 'Jane Smith', 'Logistics Coordinator', 'Away', 'jane@isdn.lk', '+94 77 234 5678', '2023-01-01', 'Operations', 'Kandy Branch', 'Dedicated coordinator ensuring smooth operations between fleet and warehouse. Specialist in route planning.'),
('STAFF-003', 'Mike Johnson', 'Driver', 'On Route', 'mike@isdn.lk', '+94 77 345 6789', '2023-06-01', 'Transport', 'Galle Hub', 'Reliable senior driver with a perfect safety record. Knows the southern routes like the back of his hand.'),
('STAFF-004', 'Sarah Williams', 'Inventory Specialist', 'Active', 'sarah@isdn.lk', '+94 77 456 7890', '2023-08-01', 'Inventory', 'Colombo HQ', 'Detail-oriented specialist focused on stock accuracy and minimizing shrinkage. Implemented the new RFID system.');

-- Insert Staff Activity
INSERT INTO staff_activity (staff_id, action, activity_date, activity_time) VALUES
('STAFF-001', 'Approved shipment #4432', '2026-02-19', '10:30:00'),
('STAFF-001', 'Updated inventory logs', '2026-02-19', '09:15:00'),
('STAFF-001', 'Staff meeting', '2026-02-18', '14:00:00'),
('STAFF-002', 'Scheduled fleet maintenance', '2026-02-19', '11:00:00'),
('STAFF-002', 'Client call', '2026-02-18', '16:30:00'),
('STAFF-003', 'Started route #882', '2026-02-19', '06:00:00'),
('STAFF-003', 'Delivered package #998', '2026-02-18', '17:00:00'),
('STAFF-004', 'Stock audit completed', '2026-02-19', '14:00:00');

-- Insert Staff Performance
INSERT INTO staff_performance (staff_id, deliveries_completed, on_time_rate, hours_worked, rating) VALUES
('STAFF-001', 1240, '98%', 160, 4.8),
('STAFF-002', 850, '95%', 155, 4.7),
('STAFF-003', 2100, '99%', 180, 4.9),
('STAFF-004', 1050, '96%', 150, 4.6);

-- Insert RDC Partners
INSERT INTO rdc_partners (id, name, type, hub, contact, email, phone, status, rating, contract_start, contract_end, agreement_type, compliance_score, bio) VALUES
('PARTNER-001', 'Lanka Logistics & Co.', 'Prime Logistics', 'Central (Kandy)', 'Damien Silva', 'contact@lanka-log.lk', '+94 11 234 5678', 'Active', 4.8, '2022-01-01', '2025-12-31', 'Tier 1 Logistics', 98, 'Lanka Logistics & Co. is our primary partner for the central region, specializing in bulk distribution and last-mile delivery. They have consistently exceeded performance targets for the past three years.'),
('PARTNER-002', 'Island Wide Distributors', 'Regional Distributor', 'North (Jaffna)', 'K. Rathnam', 'jaffna-dist@iwd.lk', '+94 21 888 1234', 'Active', 4.5, '2023-03-01', '2026-02-28', 'Regional Distribution', 92, 'Focused on northern regional distribution, Island Wide Distributors provides critical access to Jaffna and surrounding areas. Their fleet is optimized for northern terrain.'),
('PARTNER-003', 'Eco-Fleet Express', 'Eco Delivery Partner', 'West (Colombo)', 'Sarah Perera', 'fleet@ecofleet.com', '+94 77 123 4455', 'Review', 4.2, '2023-06-01', '2024-06-30', 'Specialized Delivery', 85, 'An eco-friendly fleet trial partner focusing on zero-emission deliveries within the Colombo municipality. Currently under review for contract extension.'),
('PARTNER-004', 'Southern Speed Logistics', 'Prime Logistics', 'South (Galle)', 'Roshan Kumara', 'ops@southernspeed.lk', '+94 91 555 6789', 'Active', 4.9, '2022-08-01', '2025-08-31', 'Tier 1 Logistics', 99, 'Southern Speed Logistics manages our southern corridor with exceptional efficiency. They are known for their rapid turnaround times at the Galle hub.');

-- Insert Partner Audits
INSERT INTO partner_audits (partner_id, audit_date, result, inspector) VALUES
('PARTNER-001', '2024-01-15', 'Excellent', 'R. Jayasinghe'),
('PARTNER-001', '2023-07-20', 'Good', 'S. Fernando'),
('PARTNER-002', '2024-02-10', 'Good', 'M. Perera'),
('PARTNER-003', '2023-12-05', 'Satisfactory', 'A. Wickramasinghe'),
('PARTNER-004', '2024-01-22', 'Excellent', 'K. Gunawardena');

-- Insert Missions
INSERT INTO missions (id, driver_id, driver_name, vehicle, current_location, km_traversed, status, progress, fuel_level, temperature, load_weight) VALUES
('RT-2280', 'STAFF-003', 'Mike Johnson', 'IS-VAN-782', 'Pettah Distribution Center', '142.5 KM', 'In Transit', 65, '42%', '88°C', '840kg');

-- Insert Mission Tasks
INSERT INTO mission_tasks (mission_id, task_time, task_label, location, completed) VALUES
('RT-2280', '08:00:00', 'Payload Picked Up', 'Central RDC', TRUE),
('RT-2280', '10:30:00', 'Keells Super - Colombo 03', 'Kollupitiya', TRUE),
('RT-2280', '14:15:00', 'Cargills Food City - Nugegoda', 'Nugegoda High St', FALSE),
('RT-2280', '16:45:00', 'Arpico - Hyde Park', 'Union Place', FALSE);