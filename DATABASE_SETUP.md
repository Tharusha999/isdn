# ISDN Supabase Database Setup Guide

## Overview

This guide provides instructions for setting up the ISDN (Integrated Supply Distribution Network) database on Supabase. The system includes tables for products, orders, transactions, staff management, partner logistics, and mission tracking.

## Prerequisites

- A Supabase account (https://supabase.com)
- A Supabase project created
- Access to the Supabase SQL Editor

## Files Included

1. **database_migrations.sql** - Contains the complete database schema with all tables, ENUMs, indexes, and RLS policies
2. **database_seed_data.sql** - Contains initial data for development and testing
3. **supabaseClient.js** - The frontend client configuration (already configured)

## Database URL and API Keys

Your Supabase credentials are already configured in `public/src/supabaseClient.js`:

- **Project URL**: `https://rlssokpqvqqcgtvqbpjl.supabase.co`
- **Anon Key**: Used for client-side requests

## Setup Instructions

### Step 1: Create the Database Schema

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Click "New Query"
4. Copy and paste the entire contents of `database_migrations.sql`
5. Click "Run" to execute all migration commands

### Step 2: Seed Initial Data

1. In the SQL Editor, click "New Query"
2. Copy and paste the entire contents of `database_seed_data.sql`
3. Click "Run" to insert the initial data

## Database Schema Overview

### Tables Created

#### Products Management

- **products** - Main product catalog with SKU, name, category, price, image, and description
- **product_stock** - Inventory levels by RDC (Regional Distribution Center)

#### Order Management

- **customers** - Customer information
- **orders** - Order records with status tracking
- **order_items** - Line items within each order

#### Financial Management

- **transactions** - Payment and transaction records

#### Staff Management

- **staff** - Employee records with role and location
- **staff_activity** - Activity log for each staff member
- **staff_performance** - Performance metrics and ratings

#### Logistics Partners

- **rdc_partners** - Regional distribution center partner information
- **partner_audits** - Audit records for compliance tracking

#### Mission Management

- **missions** - Delivery missions with driver and vehicle info
- **mission_tasks** - Individual tasks within each mission

### Data Types (ENUMs)

- `product_category` - Packaged Food, Beverages, Home Cleaning, Personal Care
- `rdc_type` - North (Jaffna), South (Galle), East (Trincomalee), West (Colombo), Central (Kandy)
- `order_status` - Pending, In Transit, Delivered, Cancelled
- `transaction_status` - PAID, PENDING, FAILED
- `payment_method` - Credit Card, Bank Transfer, Online Banking, Cash on Delivery
- `staff_status` - Active, Away, On Route, Offline
- `mission_status` - In Transit, Maintenance, Idle
- `partner_status` - Active, Review, Inactive

## Indexes

Indexes have been created on frequently queried columns for optimal performance:

- Product queries (category)
- Order queries (customer_id, status, rdc, date)
- Transaction queries (order_id, status, date)
- Staff queries (department, status)
- Partner queries (hub, status)
- Mission queries (driver_id, status)

## Row Level Security (RLS)

RLS policies have been enabled on all tables with permissive rules that allow:

- All users to read data
- Authenticated users to insert, update, and delete data

**IMPORTANT**: For production, customize these policies to enforce proper authorization rules.

## Initial Data Included

### Products (5 items)

- Premium Ceylon White Rice (5kg) - 1250 LKR
- Ginger Beer (Pack of 6) - 980 LKR
- PureHome Surface Cleaner (5L) - 2250 LKR
- Soap (100g) - 120 LKR
- Ceylon High-Grown Tea (500g) - 2450 LKR

### Orders (3 sample orders)

- ORD-9921: Rice order (In Transit)
- ORD-9922: Ginger Beer order (Delivered)
- ORD-9923: Tea order (Pending)

### Transactions (3 sample transactions)

- Various payment records with different statuses and methods

### Staff (4 team members)

- John Doe - Warehouse Manager
- Jane Smith - Logistics Coordinator
- Mike Johnson - Driver
- Sarah Williams - Inventory Specialist

### Partners (4 logistics partners)

- Lanka Logistics & Co.
- Island Wide Distributors
- Eco-Fleet Express
- Southern Speed Logistics

### Missions (1 active mission)

- RT-2280: Active delivery mission with multiple tasks

## Frontend Integration

The Supabase client is already configured in `public/src/supabaseClient.js`. Use it in your React/Next.js components:

```javascript
import { supabase } from "@/public/src/supabaseClient";

// Fetch products
const { data: products, error } = await supabase.from("products").select("*");

// Fetch orders
const { data: orders, error } = await supabase.from("orders").select("*");
```

## Common Queries

### Get All Products with Stock

```sql
SELECT p.*, ps.rdc, ps.quantity
FROM products p
LEFT JOIN product_stock ps ON p.id = ps.product_id
ORDER BY p.category, p.name;
```

### Get Orders with Customer Information

```sql
SELECT o.*, c.full_name as customer_name, c.email
FROM orders o
JOIN customer_users c ON o.customer_id = c.id
ORDER BY o.date DESC;
```

### Get Staff Performance

```sql
SELECT s.name, s.role, sp.deliveries_completed, sp.on_time_rate, sp.rating
FROM staff s
LEFT JOIN staff_performance sp ON s.id = sp.staff_id
ORDER BY sp.rating DESC;
```

## Troubleshooting

### Tables Not Appearing

- Ensure you're in the correct database/schema
- Check the SQL Editor output for any errors
- Verify all migration SQL executed successfully

### Permission Errors

- Check RLS policies are properly configured
- Verify your authentication token/API key
- Ensure the anon key has sufficient permissions

### Data Not Showing

- Run the seed data script
- Check customer_users foreign key references
- Verify order and order_item relationships

## Next Steps

1. Update RLS policies for production security
2. Create authentication/authorization rules
3. Set up Supabase webhooks for real-time updates
4. Configure backups and disaster recovery
5. Set up monitoring and alerts

## Support

For detailed Supabase documentation, visit: https://supabase.com/docs
