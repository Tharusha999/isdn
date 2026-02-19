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
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);
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
    .select(
      `
      *,
      customers:customer_id ( name, email, phone )
    `,
    )
    .order("date", { ascending: false });
  if (error) throw error;
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
    .from("customers")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data;
};

export const createCustomer = async (customerData) => {
  const { data, error } = await supabase
    .from("customers")
    .insert([customerData])
    .select();
  if (error) throw error;
  return data[0];
};

export const updateCustomer = async (id, customerData) => {
  const { data, error } = await supabase
    .from("customers")
    .update(customerData)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteCustomer = async (id) => {
  const { error } = await supabase
    .from("customers")
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
