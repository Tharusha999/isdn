# User Authentication & Role-Based Dashboards Setup

## Overview

This guide explains how the ISDN system now supports three separate user roles (Admin, Customer, Driver) with dedicated dashboards and authentication.

## Database Tables Created

### 1. `admin_users`

- **Purpose**: Store admin user accounts
- **Key Fields**:
  - `username` (unique)
  - `password` (hashed)
  - `email` (unique)
  - `full_name`
  - `phone`
  - `is_active`
  - `last_login`

### 2. `customer_users`

- **Purpose**: Store customer/retailer user accounts
- **Key Fields**:
  - `username` (unique)
  - `password` (hashed)
  - `email` (unique)
  - `full_name`
  - `phone`
  - `company_name`
  - `address`
  - `city`
  - `is_active`
  - `last_login`

### 3. `driver_users`

- **Purpose**: Store driver user accounts
- **Key Fields**:
  - `username` (unique)
  - `password` (hashed)
  - `email` (unique)
  - `full_name`
  - `phone`
  - `license_number` (unique)
  - `license_expiry`
  - `vehicle_assigned`
  - `rdc_hub` (which regional distribution center they serve)
  - `is_active`
  - `last_login`

## Login Flow

### 1. User Visits Login Page (`/login`)

- User enters username and password
- System attempts authentication in this order:
  1. Check `admin_users` table
  2. Check `customer_users` table
  3. Check `driver_users` table
- On success, user is redirected to their role-specific dashboard
- On failure, error message is displayed

### 2. Authentication Functions

Located in `public/src/supabaseClient.js`:

```javascript
// Universal login (tries all user types)
const user = await loginUser(username, password);

// Role-specific logins
const adminUser = await loginAdmin(username, password);
const customerUser = await loginCustomer(username, password);
const driverUser = await loginDriver(username, password);
```

## Dashboard Routes

### Admin Dashboard

- **Route**: `/dashboard`
- **Access**: Admin users only
- **Features**: Full system management (already exists)

### Customer Dashboard

- **Route**: `/customer-dashboard`
- **Access**: Customer users only
- **Features**:
  - View all orders
  - Track order status
  - View transactions
  - Revenue analytics

### Driver Dashboard

- **Route**: `/driver-dashboard`
- **Access**: Driver users only
- **Features**:
  - View assigned missions
  - Track current location
  - Monitor vehicle telemetry (fuel, temperature, load)
  - Track delivery tasks
  - View mission progress

## Demo Credentials

Use these credentials to test the system:

### Admin

```
Username: admin
Password: admin123
```

### Customer

```
Username: singer_mega
Password: customer123
```

### Driver

```
Username: john_driver
Password: driver123
```

## Adding New Users

### Add Admin User

```javascript
import { createAdminUser } from "@/public/src/supabaseClient";

await createAdminUser({
  id: "ADMIN-003",
  username: "newadmin",
  password: "hashed_password", // Should be bcrypt hashed
  email: "newadmin@isdn.lk",
  full_name: "New Admin",
  phone: "+94 11 xxx xxxx",
  is_active: true,
});
```

### Add Customer User

```javascript
import { createCustomerUser } from "@/public/src/supabaseClient";

await createCustomerUser({
  id: "CUST-USER-004",
  username: "new_customer",
  password: "hashed_password", // Should be bcrypt hashed
  email: "customer@retailer.lk",
  full_name: "New Customer",
  phone: "+94 xx xxx xxxx",
  company_name: "Retailer Company",
  city: "Colombo",
  is_active: true,
});
```

### Add Driver User

```javascript
import { createDriverUser } from "@/public/src/supabaseClient";

await createDriverUser({
  id: "DRIVER-004",
  username: "new_driver",
  password: "hashed_password", // Should be bcrypt hashed
  email: "driver@isdn.lk",
  full_name: "New Driver",
  phone: "+94 77 xxx xxxx",
  license_number: "DL-2024-004",
  license_expiry: "2028-12-31",
  vehicle_assigned: "IS-VAN-785",
  rdc_hub: "North (Jaffna)",
  is_active: true,
});
```

## Security Considerations

### Current Implementation (Development)

- Passwords are stored as plain text in demo seed data
- **IMPORTANT**: This is for development only

### Production Implementation

1. **Password Hashing**:
   - Install `bcryptjs`: `npm install bcryptjs`
   - Hash passwords before storing:

   ```javascript
   import bcrypt from "bcryptjs";
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **Update Login Functions**:

   ```javascript
   const storedPassword = await getStoredPasswordHash(username);
   const isValid = await bcrypt.compare(password, storedPassword);
   ```

3. **Enable RLS Policies**:
   - Restrict user access to only their own data
   - Update RLS policies from permissive to restrictive

4. **Use Environment Variables**:
   - Store Supabase keys in `.env.local`
   - Never commit credentials to git

5. **Implement JWT Tokens**:
   - Use Supabase Auth for OAuth/JWT management
   - Implement token refresh logic

## File Structure

```
app/
├── login/
│   └── page.tsx              # Login page component
├── customer-dashboard/
│   └── page.tsx              # Customer dashboard
├── driver-dashboard/
│   └── page.tsx              # Driver dashboard
└── dashboard/
    └── page.tsx              # Admin dashboard (existing)

lib/
└── database-types.ts         # TypeScript types (updated)

public/src/
└── supabaseClient.js         # Authentication functions (updated)

database_migrations.sql        # User table schemas (updated)
database_seed_data.sql        # Demo user accounts (updated)
```

## Session Management

### Storing Session Data

```javascript
// On successful login
localStorage.setItem(
  "authUser",
  JSON.stringify({
    id: user.id,
    username: user.username,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
  }),
);
```

### Retrieving Session Data

```javascript
const authUser = JSON.parse(localStorage.getItem("authUser"));
```

### Clearing Session

```javascript
// On logout
localStorage.removeItem("authUser");
```

## API Integration Examples

### In a Component

```typescript
import { loginUser, fetchOrders } from "@/public/src/supabaseClient";

// Login
const user = await loginUser(username, password);

// Fetch data for customer
const orders = await fetchOrders();

// Fetch missions for driver
const missions = await fetchMissions();
```

## Testing the Authentication

1. **Run the application**:

   ```bash
   npm run dev
   ```

2. **Visit login page**:

   ```
   http://localhost:3000/login
   ```

3. **Test credentials**:
   - Admin: `admin` / `admin123` → `/dashboard`
   - Customer: `singer_mega` / `customer123` → `/customer-dashboard`
   - Driver: `john_driver` / `driver123` → `/driver-dashboard`

## Next Steps

1. **Implement Password Hashing** (URGENT for production)
2. **Set up Supabase Authentication** with OAuth providers
3. **Add User Management Panel** in admin dashboard
4. **Implement Session Timeout** and refresh tokens
5. **Add Email Verification** for new user registration
6. **Create Admin Panel** for user management
7. **Implement Audit Logging** for user actions
8. **Set up Role-Based Access Control (RBAC)** in RLS policies

## Troubleshooting

### Users can't login

- Check username/password in database
- Verify user `is_active` status is `true`
- Check browser console for error messages

### Wrong dashboard after login

- Verify user role in database
- Check redirect logic in dashboard components
- Clear localStorage and try again

### Session lost on page reload

- Implement persistent session storage
- Use Next.js middleware for automatic route protection
- Consider using Supabase Authentication

## Support

For Supabase authentication best practices, visit:
https://supabase.com/docs/guides/auth

For Next.js authentication patterns:
https://nextjs.org/docs/app/building-your-application/authentication
