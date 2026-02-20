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
('ADMIN-001', 'admin@isdn.ops', '$2y$10$Z0TqJhzLWcVHQQsLqakxS.Lc.RfPqbA9lkH8P0KnzKl9jKl9jKl9jK', 'admin@isdn.ops', 'Operations Admin', '+94 11 123 4567', TRUE),
('ADMIN-002', 'manager@isdn.ops', '$2y$10$Z0TqJhzLWcVHQQsLqakxS.Lc.RfPqbA9lkH8P0KnzKl9jKl9jKl9jK', 'manager@isdn.ops', 'Logistics Manager', '+94 11 234 5678', TRUE);

-- Customer Users (password: customer123 - should be hashed in production)
INSERT INTO customer_users (id, username, password, email, full_name, phone, company_name, city, is_active) VALUES
('CUST-USER-001', 'retail_west_1', '$2y$10$Z0TqJhzLWcVHQQsLqakxS.Lc.RfPqbA9lkH8P0KnzKl9jKl9jKl9jK', 'contact@retail-west1.isdn', 'Retail Partner - West 1', '+94 11 234 5678', 'Retail Partner Hub - Colombo', 'Colombo', TRUE),
('CUST-USER-002', 'retail_south_1', '$2y$10$Z0TqJhzLWcVHQQsLqakxS.Lc.RfPqbA9lkH8P0KnzKl9jKl9jKl9jK', 'galle@retail-south.isdn', 'Retail Partner - South 1', '+94 91 234 5678', 'Retail Partner Hub - Galle', 'Galle', TRUE),
('CUST-USER-003', 'retail_central_1', '$2y$10$Z0TqJhzLWcVHQQsLqakxS.Lc.RfPqbA9lkH8P0KnzKl9jKl9jKl9jK', 'kandy@retail-central.isdn', 'Retail Partner - Central 1', '+94 81 234 5678', 'Retail Partner Hub - Kandy', 'Kandy', TRUE);

-- Driver Users (password: driver123 - should be hashed in production)
INSERT INTO driver_users (id, username, password, email, full_name, phone, license_number, license_expiry, vehicle_assigned, rdc_hub, is_active) VALUES
('DRIVER-001', 'driver_01', '$2y$10$Z0TqJhzLWcVHQQsLqakxS.Lc.RfPqbA9lkH8P0KnzKl9jKl9jKl9jK', 'driver01@isdn.ops', 'Logistics Driver 1', '+94 77 123 4567', 'DL-2022-001', '2027-03-01', 'IS-VAN-782', 'West (Colombo)', TRUE),
('DRIVER-002', 'driver_02', '$2y$10$Z0TqJhzLWcVHQQsLqakxS.Lc.RfPqbA9lkH8P0KnzKl9jKl9jKl9jK', 'driver02@isdn.ops', 'Logistics Driver 2', '+94 77 345 6789', 'DL-2022-002', '2027-06-01', 'IS-VAN-783', 'South (Galle)', TRUE),
('DRIVER-003', 'driver_03', '$2y$10$Z0TqJhzLWcVHQQsLqakxS.Lc.RfPqbA9lkH8P0KnzKl9jKl9jKl9jK', 'driver03@isdn.ops', 'Logistics Driver 3', '+94 77 567 8901', 'DL-2022-003', '2027-08-01', 'IS-VAN-784', 'Central (Kandy)', TRUE);

-- Insert Products
INSERT INTO products (id, sku, name, category, price, image, description) VALUES
('P001', 'ISDN-FD-101', 'Staple Grid Item 101', 'Packaged Food', 1250, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400', 'High-quality essential goods sourced for regional distribution.'),
('P002', 'ISDN-BV-202', 'Grid Beverage Unit 202', 'Beverages', 980, 'https://images.unsplash.com/photo-1527960669566-f882ba85a4c6?auto=format&fit=crop&q=80&w=400', 'Standardized beverage unit for regional nodes.'),
('P003', 'ISDN-CL-303', 'Node Cleaning Agent 303', 'Home Cleaning', 2250, 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=400', 'Industrial grade cleaning agent for retail hub maintenance.'),
('P004', 'ISDN-PC-404', 'Personal Care Unit 404', 'Personal Care', 120, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400', 'Standard personal care asset for distribution.'),
('P005', 'ISDN-BV-205', 'Grid Tea Asset 205', 'Beverages', 2450, 'https://images.unsplash.com/photo-1544787210-2211d7c928c7?auto=format&fit=crop&q=80&w=400', 'High-grade beverage asset for centralized logistics.');

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
('P003', 'バランス (Trincomalee)', 50),
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

-- Insert Orders
INSERT INTO orders (id, customer_id, total, status, rdc, date, eta) VALUES
('ORD-9921', 'CUST-USER-001', 12500, 'In Transit', 'West (Colombo)', '2026-02-18', '2026-02-20'),
('ORD-9922', 'CUST-USER-002', 49000, 'Delivered', 'South (Galle)', '2026-02-15', '2026-02-17'),
('ORD-9923', 'CUST-USER-003', 245000, 'Pending', 'Central (Kandy)', '2026-02-18', '2026-02-19');

-- Insert Order Items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
('ORD-9921', 'P001', 10, 1250),
('ORD-9922', 'P002', 50, 980),
('ORD-9923', 'P005', 100, 2450);

-- Insert Transactions
INSERT INTO transactions (id, order_id, customer, amount, date, status, method) VALUES
('INV-2026-101', 'ORD-9922', 'Retail Partner - West 1', 145000.00, '2026-02-18', 'PAID', 'Credit Card'),
('INV-2026-102', 'ORD-9923', 'Retail Partner - South 1', 245000.00, '2026-02-18', 'PENDING', 'Bank Transfer'),
('INV-2026-103', NULL, 'Retail Partner - Central 1', 212500.00, '2026-02-17', 'PAID', 'Online Banking');

-- Insert Staff Members
INSERT INTO staff (id, name, role, status, email, phone, join_date, department, location, bio) VALUES
('STAFF-001', 'Logistics Lead Alpha', 'Warehouse Manager', 'Active', 'ops-lead@isdn.ops', '+94 11 123 4567', '2022-03-01', 'Logistics', 'Colombo HQ', 'Lead warehouse coordination specialist with over 10 years in grid inventory management.'),
('STAFF-002', 'Operations Specialist Beta', 'Logistics Coordinator', 'Away', 'ops-beta@isdn.ops', '+94 11 234 5678', '2023-01-01', 'Operations', 'Kandy Branch', 'Dedicated node coordinator ensuring optimal fleet synchronization across regional hubs.'),
('STAFF-003', 'Logistics Driver 1', 'Driver', 'On Route', 'driver01@isdn.ops', '+94 77 123 4567', '2023-06-01', 'Transport', 'Galle Hub', 'Senior driver asset with extensive Southern corridor navigational experience.'),
('STAFF-004', 'Inventory Analyst Gamma', 'Inventory Specialist', 'Active', 'ops-gamma@isdn.ops', '+94 77 456 7890', '2023-08-01', 'Inventory', 'Colombo HQ', 'Accuracy-focused systems analyst maintaining centralized inventory ledger integrity.');

-- Insert Staff Activity
INSERT INTO staff_activity (staff_id, action, activity_date, activity_time) VALUES
('STAFF-001', 'Authorized mission #4432', '2026-02-19', '10:30:00'),
('STAFF-001', 'Updated grid ledger', '2026-02-19', '09:15:00'),
('STAFF-001', 'Regional briefing', '2026-02-18', '14:00:00'),
('STAFF-002', 'Coordinated fleet maintenance', '2026-02-19', '11:00:00'),
('STAFF-002', 'Partner link verification', '2026-02-18', '16:30:00'),
('STAFF-003', 'Initiated mission #882', '2026-02-19', '06:00:00'),
('STAFF-003', 'Finalized delivery #998', '2026-02-18', '17:00:00'),
('STAFF-004', 'Grid audit completed', '2026-02-19', '14:00:00');

-- Insert Staff Performance
INSERT INTO staff_performance (staff_id, deliveries_completed, on_time_rate, hours_worked, rating) VALUES
('STAFF-001', 1240, '98%', 160, 4.8),
('STAFF-002', 850, '95%', 155, 4.7),
('STAFF-003', 2100, '99%', 180, 4.9),
('STAFF-004', 1050, '96%', 150, 4.6);

-- Insert RDC Partners
INSERT INTO rdc_partners (id, name, type, hub, contact, email, phone, status, rating, contract_start, contract_end, agreement_type, compliance_score, bio) VALUES
('PARTNER-001', 'Regional Logistics Group A', 'Prime Logistics', 'Central (Kandy)', 'Operations Contact 1', 'rdc-a@isdn.ops', '+94 11 234 5678', 'Active', 4.8, '2022-01-01', '2025-12-31', 'Tier 1 Logistics', 98, 'Primary logistics partner for the central hub, managing bulk throughput and regional node distribution.'),
('PARTNER-002', 'Northern Distribution Network', 'Regional Distributor', 'North (Jaffna)', 'Operations Contact 2', 'rdc-north@isdn.ops', '+94 21 888 1234', 'Active', 4.5, '2023-03-01', '2026-02-28', 'Regional Distribution', 92, 'Critical access partner for the Northern grid, maintaining high reliability in challenging terrain nodes.'),
('PARTNER-003', 'Urban Fleet Solutions', 'Eco Delivery Partner', 'West (Colombo)', 'Operations Contact 3', 'rdc-west@isdn.ops', '+94 77 123 4455', 'Review', 4.2, '2023-06-01', '2024-06-30', 'Specialized Delivery', 85, 'Specialized urban delivery partner currently in pilot for zero-emission node distribution in Colombo.'),
('PARTNER-004', 'Southern Expressway Logistics', 'Prime Logistics', 'South (Galle)', 'Operations Contact 4', 'rdc-south@isdn.ops', '+94 91 555 6789', 'Active', 4.9, '2022-08-01', '2025-08-31', 'Tier 1 Logistics', 99, 'High-efficiency partner managing the southern logistics corridor with exceptional turnaround telemetry.');

-- Insert Partner Audits
INSERT INTO partner_audits (partner_id, audit_date, result, inspector) VALUES
('PARTNER-001', '2024-01-15', 'Excellent', 'Grid Inspector 1'),
('PARTNER-001', '2023-07-20', 'Good', 'Grid Inspector 2'),
('PARTNER-002', '2024-02-10', 'Good', 'Grid Inspector 1'),
('PARTNER-003', '2023-12-05', 'Satisfactory', 'Grid Inspector 3'),
('PARTNER-004', '2024-01-22', 'Excellent', 'Grid Inspector 4');

-- Insert Missions
INSERT INTO missions (id, driver_id, driver_name, vehicle, current_location, km_traversed, status, progress, fuel_level, temperature, load_weight) VALUES
('RT-2280', 'STAFF-003', 'Logistics Driver 1', 'IS-VAN-782', 'Pettah Distribution Hub', '142.5 KM', 'In Transit', 65, '42%', '88°C', '840kg');

-- Insert Mission Tasks
INSERT INTO mission_tasks (mission_id, task_time, task_label, location, completed) VALUES
('RT-2280', '08:00:00', 'Payload Integration', 'Central RDC', TRUE),
('RT-2280', '10:30:00', 'Retail Node 1 - Colombo 03', 'Kollupitiya Hub', TRUE),
('RT-2280', '14:15:00', 'Retail Node 2 - Nugegoda', 'Nugegoda Sector', FALSE),
('RT-2280', '16:45:00', 'Retail Node 3 - Hyde Park', 'Union Place Hub', FALSE);
