// Last Updated: 2026-02-20T01:05:00Z
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
  // Use upsert so it creates the row if it doesn't exist yet (e.g. new RDC target during transfer)
  const { data, error } = await supabase
    .from("product_stock")
    .upsert(
      { product_id: productId, rdc, quantity },
      { onConflict: "product_id,rdc" }
    )
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
  try {
    // 1. Decrement from RDC node
    const { data: currentStock, error: fetchError } = await supabase
      .from("product_stock")
      .select("quantity")
      .eq("product_id", productId)
      .eq("rdc", rdc);

    if (fetchError) throw fetchError;

    if (currentStock && currentStock.length > 0) {
      const newRdcQuantity = (currentStock[0].quantity || 0) - quantity;
      const { error: rdcError } = await supabase
        .from("product_stock")
        .update({ quantity: Math.max(0, newRdcQuantity) })
        .eq("product_id", productId)
        .eq("rdc", rdc);
      if (rdcError) throw rdcError;
    }

    // 2. Decrement from master product table
    const { data: product, error: pFetchError } = await supabase
      .from("products")
      .select("stock")
      .eq("id", productId);

    if (pFetchError) throw pFetchError;

    if (product && product.length > 0) {
      const newTotalStock = (product[0].stock || 0) - quantity;
      const { error: pError } = await supabase
        .from("products")
        .update({ stock: Math.max(0, newTotalStock) })
        .eq("id", productId);
      if (pError) throw pError;
    }
  } catch (err) {
    console.error(`Stock update failed for product ${productId}:`, err);
    // Continue even if per-RDC stock fails, but log it
  }
};

// Helper to fetch user profiles from all possible tables to ensure identity resolution
export const fetchUserMapping = async (ids) => {
  if (!ids || ids.length === 0) return {};

  try {
    // Fetch from all user tables concurrently
    // We select more fields and check legacy table 'customers' just in case
    const [customersUsers, admins, drivers, legacyCustomers] = await Promise.all([
      supabase.from("customer_users").select("id, full_name, username, company_name").in("id", ids),
      supabase.from("admin_users").select("id, full_name, username").in("id", ids),
      supabase.from("driver_users").select("id, full_name, username").in("id", ids),
      supabase.from("customers").select("id, name").in("id", ids), // Fallback for old schema
    ]);

    const mapping = {};
    const merge = (result, type) => {
      if (result.error) {
        // Only log error for current tables, not legacy ones
        if (type !== "legacy") console.error(`Identity lookup error in ${type}:`, result.error);
        return;
      }
      if (result.data) {
        result.data.forEach(user => {
          // Robust name resolution - prioritized by database fields
          const resolvedName = user.full_name ||
            user.name ||
            user.company_name ||
            user.username ||
            user.id; // Final fallback to ID if no name exists

          mapping[user.id] = {
            ...user,
            name: resolvedName,
            full_name: resolvedName
          };
        });
      }
    };

    merge(customersUsers, "customers_users");
    merge(admins, "admins");
    merge(drivers, "drivers");
    merge(legacyCustomers, "legacy");

    return mapping;
  } catch (err) {
    console.error("fetchUserMapping critical failure:", err);
    return {};
  }
};

// Orders - Modified to support role-based filtering and robust name resolution
/**
 * @param {string} userId 
 * @param {string} role 
 */
export const fetchOrders = async (userId = null, role = null) => {
  try {
    let query = supabase.from("orders").select(`
      *,
      order_items (*)
    `);

    if (role === 'customer' && userId) {
      query = query.eq("customer_id", userId);
    }

    const { data: orders, error: ordersError } = await query.order("date", { ascending: false });

    if (ordersError) throw ordersError;
    if (!orders || orders.length === 0) return [];

    // Fetch identity sources (Customer and Admin)
    const [cRes, aRes] = await Promise.all([
      supabase.from('customer_users').select('id, full_name'),
      supabase.from('admin_users').select('id, full_name')
    ]);

    const nameMap = {};
    const merge = (data) => {
      if (data) data.forEach(u => {
        if (u.id) nameMap[u.id.toLowerCase()] = u.full_name;
      });
    };
    merge(cRes.data);
    merge(aRes.data);

    // Merge names - using case-insensitive lookup
    // IMPORTANT: We return null for 'customers' if not found, to allow UI fallbacks
    return orders.map(order => {
      const cid = order.customer_id?.toLowerCase() || "";
      const name = nameMap[cid];

      return {
        ...order,
        customers: name ? { name, full_name: name } : null
      };
    });
  } catch (err) {
    console.error("fetchOrders execution failure:", err);
    throw err;
  }
};

export const fetchOrdersByStatus = async (status, userId = null, role = null) => {
  try {
    let query = supabase.from("orders").select("*").eq("status", status);

    if (role === 'customer' && userId) {
      query = query.eq("customer_id", userId);
    }

    const { data: orders, error: ordersError } = await query.order("date", { ascending: false });

    if (ordersError) throw ordersError;
    if (!orders || orders.length === 0) return [];

    const [cRes, aRes] = await Promise.all([
      supabase.from('customer_users').select('id, full_name'),
      supabase.from('admin_users').select('id, full_name')
    ]);

    const nameMap = {};
    const merge = (data) => {
      if (data) data.forEach(u => {
        if (u.id) nameMap[u.id.toLowerCase()] = u.full_name;
      });
    };
    merge(cRes.data);
    merge(aRes.data);

    return orders.map(order => {
      const name = nameMap[order.customer_id?.toLowerCase()];
      return {
        ...order,
        customers: name ? { name, full_name: name } : null
      };
    });
  } catch (err) {
    console.error("fetchOrdersByStatus execution failure:", err);
    throw err;
  }
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
  return data.map(c => {
    const resolvedName = c.full_name || c.username || c.id;
    return {
      ...c,
      name: resolvedName,
      full_name: resolvedName
    };
  });
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

// Admins
export const fetchAdmins = async () => {
  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .order("full_name", { ascending: true });
  if (error) throw error;
  return data;
};

export const createAdmin = async (adminData) => {
  const payload = { ...adminData };
  if (payload.username && !payload.username.toLowerCase().includes("@admin.isdn")) {
    payload.username = `${payload.username}@admin.ISDN`;
  }

  const { data, error } = await supabase
    .from("admin_users")
    .insert([payload])
    .select();
  if (error) throw error;
  return data[0];
};

export const updateAdmin = async (id, adminData) => {
  const payload = { ...adminData };
  if (payload.username && !payload.username.toLowerCase().includes("@admin.isdn")) {
    payload.username = `${payload.username}@admin.ISDN`;
  }

  const { data, error } = await supabase
    .from("admin_users")
    .update(payload)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteAdmin = async (id) => {
  const { error } = await supabase
    .from("admin_users")
    .delete()
    .eq("id", id);
  if (error) throw error;
};

// Transactions - Modified to support role-based filtering and robust name resolution
/**
 * @param {string} userId 
 * @param {string} role 
 */
export const fetchTransactions = async (userId = null, role = null) => {
  try {
    let query = supabase.from("transactions").select("*");

    if (role === 'customer' && userId) {
      query = query.eq("customer", userId);
    }

    const { data: transactions, error } = await query.order("date", { ascending: false });

    if (error) throw error;
    if (!transactions || transactions.length === 0) return [];

    // Fetch identity sources (Customer and Admin)
    const [cRes, aRes] = await Promise.all([
      supabase.from('customer_users').select('id, full_name'),
      supabase.from('admin_users').select('id, full_name')
    ]);

    const nameMap = {};
    if (cRes.data) cRes.data.forEach(u => nameMap[u.id.toLowerCase()] = u.full_name);
    if (aRes.data) aRes.data.forEach(u => nameMap[u.id.toLowerCase()] = u.full_name);

    return transactions.map(t => {
      const cid = t.customer?.toLowerCase() || "";
      const resolvedName = nameMap[cid] || t.customer || "System";

      return {
        ...t,
        resolved_customer: resolvedName
      };
    });
  } catch (err) {
    console.error("fetchTransactions execution failure:", err);
    throw err;
  }
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

export const fetchAllStaffActivity = async () => {
  const { data, error } = await supabase
    .from("staff_activity")
    .select(`
      *,
      staff (name)
    `)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
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

export const createPartner = async (partnerData) => {
  const { data, error } = await supabase
    .from("rdc_partners")
    .insert([partnerData])
    .select();
  if (error) throw error;
  return data[0];
};

export const updatePartner = async (id, partnerData) => {
  const { data, error } = await supabase
    .from("rdc_partners")
    .update(partnerData)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

export const deletePartner = async (id) => {
  const { error } = await supabase.from("rdc_partners").delete().eq("id", id);
  if (error) throw error;
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

export const updateMission = async (id, missionData) => {
  const { data, error } = await supabase
    .from("missions")
    .update(missionData)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

export const updateMissionStatus = async (missionId, status) => {
  const { data, error } = await supabase
    .from("missions")
    .update({ status })
    .eq("id", missionId)
    .select();
  if (error) throw error;
  return data[0];
};

export const updateMissionTask = async (taskId, taskData) => {
  let payload = {};
  if (typeof taskData === 'boolean') {
    payload = { completed: taskData };
  } else {
    // Map 'done' to 'completed' for compatibility with various components
    payload = { ...taskData };
    if (payload.done !== undefined && payload.completed === undefined) {
      payload.completed = payload.done;
      delete payload.done;
    }
  }

  const { data, error } = await supabase
    .from("mission_tasks")
    .update(payload)
    .eq("id", taskId)
    .select();
  if (error) throw error;
  return data[0];
};

export const updateMissionProgress = async (missionId, progress) => {
  const { data, error } = await supabase
    .from("missions")
    .update({ progress })
    .eq("id", missionId)
    .select();
  if (error) throw error;
  return data[0];
};

export const createMission = async (missionData) => {
  const payload = {
    driver_id: missionData.driver_id || null,
    driver_name: missionData.driver_name || "Unassigned",
    vehicle: missionData.vehicle || "N/A",
    current_location: missionData.destination || missionData.current_location || "N/A",
    status: missionData.status || "Idle",
    progress: missionData.progress || 0,
    km_traversed: missionData.km_traversed || "0km",
    fuel_level: missionData.telemetry?.fuel || missionData.fuel_level || "100%",
    temperature: missionData.telemetry?.temp || missionData.temperature || "24°C",
    load_weight: missionData.telemetry?.load || missionData.load_weight || "0kg"
  };

  // Only include id if it's explicitly provided
  if (missionData.id) {
    payload.id = missionData.id;
  }


  const { data, error } = await supabase
    .from("missions")
    .insert([payload])
    .select();

  if (error) {
    console.error("Supabase Mission Insert Error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw error;
  }
  return data[0];
};

export const fetchDriverUsers = async () => {
  const { data, error } = await supabase
    .from("driver_users")
    .select("*")
    .order("full_name", { ascending: true });

  if (error) throw error;

  // Map back to application format
  return (data || []).map(d => ({
    id: d.id,
    full_name: d.full_name,
    username: d.username,
    email: d.Email,
    phone: d["Phone Number"],
    license_number: d.Type,
    rdc_hub: d.Organization,
    is_active: d.Status === "Active"
  }));
};

export const createMissionTask = async (missionId, taskData) => {
  const payload = {
    mission_id: missionId,
    task_time: taskData.time,
    task_label: taskData.label,
    location: taskData.location || "N/A",
    completed: taskData.done || false
  };

  const { data, error } = await supabase
    .from("mission_tasks")
    .insert([payload])
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
export const loginAdmin = async (username, password) => {
  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
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
  // Use ilike for case-insensitive username match
  const { data, error } = await supabase
    .from("driver_users")
    .select("*")
    .ilike("username", username)
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

  // Map to application format
  return {
    id: data.id,
    full_name: data.full_name,
    username: data.username,
    email: data.Email,
    phone: data["Phone Number"],
    license_number: data.Type,
    rdc_hub: data.Organization,
    role: "driver",
    is_active: data.Status === "Active"
  };
};

// Universal Login - Returns user object with role
export const loginUser = async (username, password) => {
  const lowerUsername = username.toLowerCase();

  // Pattern Check for Admin
  if (lowerUsername.includes("@admin.isdn")) {
    try {
      const adminUser = await loginAdmin(username, password);
      return { ...adminUser, role: "admin" };
    } catch (e) {
      throw new Error("Invalid admin credentials");
    }
  }

  // Pattern Check for Driver (NEW)
  if (lowerUsername.includes("@driver.isdn")) {
    try {
      const driverUser = await loginDriver(username, password);
      return { ...driverUser, role: "driver" };
    } catch (e) {
      throw new Error("Invalid driver credentials");
    }
  }

  // Otherwise, default to customer login
  try {
    const customerUser = await loginCustomer(username, password);
    return { ...customerUser, role: "customer" };
  } catch (e) {
    // Final fallback: try driver login if customer fails (Legacy support)
    try {
      const driverUser = await loginDriver(username, password);
      return { ...driverUser, role: "driver" };
    } catch (e2) {
      throw new Error("Invalid username or password");
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
  let { username } = driverData;
  if (username && !username.toLowerCase().includes("@driver.isdn")) {
    username = `${username}@driver.ISDN`;
  }

  const payload = {
    full_name: driverData.full_name,
    username: username,
    password: driverData.password,
    Email: driverData.email,
    "Phone Number": driverData.phone,
    Type: driverData.license_number,
    Organization: driverData.rdc_hub,
    Status: driverData.is_active ? "Active" : "Inactive"
  };

  const { data, error } = await supabase
    .from("driver_users")
    .insert([payload])
    .select();

  if (error) throw error;
  const created = data[0];
  return {
    id: created.id,
    full_name: created.full_name,
    username: created.username,
    email: created.Email,
    phone: created["Phone Number"],
    license_number: created.Type,
    rdc_hub: created.Organization,
    is_active: created.Status === "Active"
  };
};

// Update Driver Status
export const updateDriverStatus = async (driverId, isActive) => {
  const { data, error } = await supabase
    .from("driver_users")
    .update({ Status: isActive ? "Active" : "Inactive" })
    .eq("id", driverId)
    .select();

  if (error) throw error;
  const d = data[0];
  return {
    id: d.id,
    full_name: d.full_name,
    username: d.username,
    email: d.Email,
    phone: d["Phone Number"],
    license_number: d.Type,
    rdc_hub: d.Organization,
    is_active: d.Status === "Active"
  };
};

// Update Driver User
export const updateDriverUser = async (id, driverData) => {
  let { username } = driverData;
  if (username && !username.toLowerCase().includes("@driver.isdn")) {
    username = `${username}@driver.ISDN`;
  }

  const payload = {};
  if (driverData.full_name) payload.full_name = driverData.full_name;
  if (username) payload.username = username;
  if (driverData.password) payload.password = driverData.password;
  if (driverData.email !== undefined) payload.Email = driverData.email;
  if (driverData.phone !== undefined) payload["Phone Number"] = driverData.phone;
  if (driverData.license_number !== undefined) payload.Type = driverData.license_number;
  if (driverData.rdc_hub !== undefined) payload.Organization = driverData.rdc_hub;
  if (driverData.is_active !== undefined) payload.Status = driverData.is_active ? "Active" : "Inactive";

  const { data, error } = await supabase
    .from("driver_users")
    .update(payload)
    .eq("id", id)
    .select();

  if (error) throw error;
  const updated = data[0];
  return {
    id: updated.id,
    full_name: updated.full_name,
    username: updated.username,
    email: updated.Email,
    phone: updated["Phone Number"],
    license_number: updated.Type,
    rdc_hub: updated.Organization,
    is_active: updated.Status === "Active"
  };
};

// Delete Driver User
export const deleteDriverUser = async (id) => {
  const { error } = await supabase
    .from("driver_users")
    .delete()
    .eq("id", id);
  if (error) throw error;
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

// Fetch All Driver Users (Alias)
export const fetchAllDriverUsers = fetchDriverUsers;

// End of file
