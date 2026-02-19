import { createClient } from "@supabase/supabase-js";

// Supabase Configuration
// Project URL: https://rlssokpqvqqcgtvqbpjl.supabase.co
const supabaseUrl = "https://rlssokpqvqqcgtvqbpjl.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsc3Nva3BxdnFxY2d0dnFicGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MzY1OTEsImV4cCI6MjA4NzAxMjU5MX0.n8ZefoWpW1F6RtqYZc40yUEsLQfgerb2uHkPmMsr2BM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// Helper Functions for Common Database Operations
// ============================================

// Products
export const fetchProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data;
};

export const fetchProductById = async (id) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const fetchProductsByCategory = async (category) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category);
  if (error) throw error;
  return data;
};

export const createProduct = async (productData) => {
  const { data, error } = await supabase
    .from("products")
    .insert([productData])
    .select();
  if (error) throw error;
  return data[0];
};

export const createProductStock = async (productId, rdc, quantity) => {
  const { data, error } = await supabase
    .from("product_stock")
    .insert([{ product_id: productId, rdc, quantity }])
    .select();
  if (error) throw error;
  return data[0];
};

export const updateProduct = async (id, productData) => {
  const { data, error } = await supabase
    .from("products")
    .update(productData)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteProduct = async (id) => {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
};

// Product Stock
export const fetchProductStock = async (productId, rdc) => {
  const { data, error } = await supabase
    .from("product_stock")
    .select("*")
    .eq("product_id", productId)
    .eq("rdc", rdc)
    .single();
  if (error) throw error;
  return data;
};

export const updateProductStock = async (productId, rdc, quantity) => {
  const { data, error } = await supabase
    .from("product_stock")
    .update({ quantity: quantity })
    .eq("product_id", productId)
    .eq("rdc", rdc)
    .select();
  if (error) throw error;
  return data;
};

export const fetchAllProductStocks = async () => {
  const { data, error } = await supabase
    .from("product_stock")
    .select("*");
  if (error) throw error;
  return data;
};

export const createOrderWithItems = async (orderData, items, transactionData) => {
  // Step 1: Create the Order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([orderData])
    .select();
  if (orderError) throw orderError;

  // Step 2: Create Order Items
  const itemsWithOrderId = items.map(item => ({ ...item, order_id: order[0].id }));
  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsWithOrderId);
  if (itemsError) throw itemsError;

  // Step 3: Create Transaction (if provided)
  if (transactionData) {
    const { error: transError } = await supabase
      .from("transactions")
      .insert([{ ...transactionData, order_id: order[0].id }]);
    if (transError) throw transError;
  }

  // Step 4: Decrement Stock for each item
  for (const item of items) {
    await decrementProductStock(item.product_id, orderData.rdc, item.quantity);
  }

  return order[0];
};

export const decrementProductStock = async (productId, rdc, quantity) => {
  // 1. Decrement from RDC node
  // First, get current stock for that RDC
  const { data: currentStock, error: fetchError } = await supabase
    .from("product_stock")
    .select("quantity")
    .eq("product_id", productId)
    .eq("rdc", rdc)
    .single();

  if (fetchError) throw fetchError;

  const newRdcQuantity = (currentStock?.quantity || 0) - quantity;

  const { error: rdcError } = await supabase
    .from("product_stock")
    .update({ quantity: Math.max(0, newRdcQuantity) })
    .eq("product_id", productId)
    .eq("rdc", rdc);

  if (rdcError) throw rdcError;

  // 2. Decrement from master product table
  const { data: product, error: pFetchError } = await supabase
    .from("products")
    .select("stock")
    .eq("id", productId)
    .single();

  if (pFetchError) throw pFetchError;

  const newTotalStock = (product?.stock || 0) - quantity;

  const { error: pError } = await supabase
    .from("products")
    .update({ stock: Math.max(0, newTotalStock) })
    .eq("id", productId);

  if (pError) throw pError;
};

// Orders
export const fetchOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;

  // Try to join with customer_users if possible, or just return basic data
  // The UI currently falls back to "General Distribution" if customers is missing
  return data;
};

export const fetchOrdersByStatus = async (status) => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      customers:customer_id ( name, email, phone )
    `,
    )
    .eq("status", status)
    .order("date", { ascending: false });
  if (error) throw error;
  return data;
};

export const fetchOrdersByRDC = async (rdc) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("rdc", rdc)
    .order("date", { ascending: false });
  if (error) throw error;
  return data;
};

export const createOrder = async (orderData) => {
  const { data, error } = await supabase
    .from("orders")
    .insert([orderData])
    .select();
  if (error) throw error;
  return data[0];
};

export const updateOrderStatus = async (orderId, status) => {
  const { data, error } = await supabase
    .from("orders")
    .update({ status: status })
    .eq("id", orderId)
    .select();
  if (error) throw error;
  return data[0];
};

// Customers
export const fetchCustomers = async () => {
  const { data, error } = await supabase
    .from("customer_users")
    .select("*")
    .order("full_name", { ascending: true });
  if (error) throw error;

  // Map full_name to name for UI compatibility
  return data.map(c => ({
    ...c,
    name: c.full_name
  }));
};

export const createCustomer = async (customerData) => {
  // Map name back to full_name if coming from UI
  const payload = {
    ...customerData,
    full_name: customerData.name || customerData.full_name,
    password: customerData.password || 'password123' // Default password for admin-created nodes
  };
  delete payload.name;

  const { data, error } = await supabase
    .from("customer_users")
    .insert([payload])
    .select();
  if (error) throw error;
  return { ...data[0], name: data[0].full_name };
};

export const updateCustomer = async (id, customerData) => {
  const payload = { ...customerData };
  if (payload.name) {
    payload.full_name = payload.name;
    delete payload.name;
  }

  const { data, error } = await supabase
    .from("customer_users")
    .update(payload)
    .eq("id", id)
    .select();
  if (error) throw error;
  return { ...data[0], name: data[0].full_name };
};

export const deleteCustomer = async (id) => {
  const { error } = await supabase
    .from("customer_users")
    .delete()
    .eq("id", id);
  if (error) throw error;
};

// Transactions
export const fetchTransactions = async () => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return data;
};

export const fetchTransactionsByStatus = async (status) => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("status", status)
    .order("date", { ascending: false });
  if (error) throw error;
  return data;
};

export const createTransaction = async (transactionData) => {
  const { data, error } = await supabase
    .from("transactions")
    .insert([transactionData])
    .select();
  if (error) throw error;
  return data[0];
};

// Staff
export const fetchStaff = async () => {
  const { data, error } = await supabase
    .from("staff")
    .select(
      `
      *,
      staff_performance (*),
      staff_activity (*)
    `,
    )
    .order("name", { ascending: true });
  if (error) throw error;
  return data;
};

export const fetchStaffByDepartment = async (department) => {
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .eq("department", department);
  if (error) throw error;
  return data;
};

export const fetchStaffById = async (id) => {
  const { data, error } = await supabase
    .from("staff")
    .select(
      `
      *,
      staff_performance (*),
      staff_activity (*)
    `,
    )
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const createStaffMember = async (staffData) => {
  const { data, error } = await supabase
    .from("staff")
    .insert([staffData])
    .select();
  if (error) throw error;
  return data[0];
};

export const updateStaffStatus = async (staffId, status) => {
  const { data, error } = await supabase
    .from("staff")
    .update({ status: status })
    .eq("id", staffId)
    .select();
  if (error) throw error;
  return data[0];
};

export const updateStaffMember = async (id, staffData) => {
  const { data, error } = await supabase
    .from("staff")
    .update(staffData)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteStaffMember = async (id) => {
  const { error } = await supabase
    .from("staff")
    .delete()
    .eq("id", id);
  if (error) throw error;
};

// RDC Partners
export const fetchPartners = async () => {
  const { data, error } = await supabase
    .from("rdc_partners")
    .select(
      `
      *,
      partner_audits (*)
    `,
    )
    .order("rating", { ascending: false });
  if (error) throw error;
  return data;
};

export const fetchPartnersByStatus = async (status) => {
  const { data, error } = await supabase
    .from("rdc_partners")
    .select("*")
    .eq("status", status);
  if (error) throw error;
  return data;
};

export const fetchPartnersByRDC = async (hub) => {
  const { data, error } = await supabase
    .from("rdc_partners")
    .select("*")
    .eq("hub", hub);
  if (error) throw error;
  return data;
};

// Missions
export const fetchMissions = async () => {
  const { data, error } = await supabase
    .from("missions")
    .select(
      `
      *,
      mission_tasks (*)
    `,
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const fetchMissionById = async (id) => {
  const { data, error } = await supabase
    .from("missions")
    .select(
      `
      *,
      mission_tasks (*)
    `,
    )
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const fetchMissionsByDriver = async (driverId) => {
  const { data, error } = await supabase
    .from("missions")
    .select(
      `
      *,
      mission_tasks (*)
    `,
    )
    .eq("driver_id", driverId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const updateMissionStatus = async (missionId, status) => {
  const { data, error } = await supabase
    .from("missions")
    .update({ status: status })
    .eq("id", missionId)
    .select();
  if (error) throw error;
  return data[0];
};

export const updateMissionProgress = async (missionId, progress) => {
  const { data, error } = await supabase
    .from("missions")
    .update({ progress: progress })
    .eq("id", missionId)
    .select();
  if (error) throw error;
  return data[0];
};

// Real-time Subscriptions
export const subscribeToOrders = (callback) => {
  return supabase
    .from("orders")
    .on("*", (payload) => {
      callback(payload);
    })
    .subscribe();
};

export const subscribeToMissions = (callback) => {
  return supabase
    .from("missions")
    .on("*", (payload) => {
      callback(payload);
    })
    .subscribe();
};
// ============================================
// Authentication Functions
// ============================================

// Login for Admin Users
export const loginAdmin = async (username, password, adminKey) => {
  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .eq("admin_key", adminKey)
    .single();

  if (error || !data) {
    throw new Error("Invalid credentials or Admin Key");
  }

  // Update last login
  await supabase
    .from("admin_users")
    .update({ last_login: new Date().toISOString() })
    .eq("id", data.id);

  return { ...data, role: "admin" };
};

// Login for Customer Users
export const loginCustomer = async (username, password) => {
  const { data, error } = await supabase
    .from("customer_users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (error || !data) {
    throw new Error("Invalid username or password");
  }

  return { ...data, role: "customer" };
};

// Register Customer User
export const registerCustomerUser = async (customerData) => {
  const { data, error } = await supabase
    .from("customer_users")
    .insert([customerData])
    .select();

  if (error) {
    if (error.code === '23505') throw new Error("Username or Email already exists");
    throw error;
  }
  return { ...data[0], role: "customer" };
};

// Login for Driver Users
export const loginDriver = async (username, password) => {
  const { data, error } = await supabase
    .from("driver_users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (error || !data) {
    throw new Error("Invalid username or password");
  }

  // Update last login
  await supabase
    .from("driver_users")
    .update({ last_login: new Date().toISOString() })
    .eq("id", data.id);

  return data;
};

// Universal Login - Returns user object with role
export const loginUser = async (username, password, adminKey) => {
  // Try admin login
  try {
    const adminUser = await loginAdmin(username, password, adminKey);
    return { ...adminUser, role: "admin" };
  } catch (e) {
    // Try customer login
    try {
      const customerUser = await loginCustomer(username, password);
      return { ...customerUser, role: "customer" };
    } catch (e) {
      // Try driver login
      try {
        const driverUser = await loginDriver(username, password);
        return { ...driverUser, role: "driver" };
      } catch (e) {
        throw new Error("Invalid username or password");
      }
    }
  }
};

// Get Admin User by ID
export const getAdminUser = async (id) => {
  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

// Get Customer User by ID
export const getCustomerUser = async (id) => {
  const { data, error } = await supabase
    .from("customer_users")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

// Get Driver User by ID
export const getDriverUser = async (id) => {
  const { data, error } = await supabase
    .from("driver_users")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

// Create Admin User
export const createAdminUser = async (adminData) => {
  const { data, error } = await supabase
    .from("admin_users")
    .insert([adminData])
    .select();
  if (error) throw error;
  return data[0];
};

// Create Customer User
export const createCustomerUser = async (customerData) => {
  const { data, error } = await supabase
    .from("customer_users")
    .insert([customerData])
    .select();
  if (error) throw error;
  return data[0];
};

// Create Driver User
export const createDriverUser = async (driverData) => {
  const { data, error } = await supabase
    .from("driver_users")
    .insert([driverData])
    .select();
  if (error) throw error;
  return data[0];
};

// Update Driver Status
export const updateDriverStatus = async (driverId, isActive) => {
  const { data, error } = await supabase
    .from("driver_users")
    .update({ is_active: isActive })
    .eq("id", driverId)
    .select();
  if (error) throw error;
  return data[0];
};

// Fetch All Admin Users
export const fetchAllAdminUsers = async () => {
  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

// Fetch All Customer Users
export const fetchAllCustomerUsers = async () => {
  const { data, error } = await supabase
    .from("customer_users")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

// Fetch All Driver Users
export const fetchAllDriverUsers = async () => {
  const { data, error } = await supabase
    .from("driver_users")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};
