// Database Types - Generated from Supabase Schema
// Use these types throughout your Next.js application

export type ProductCategory = 'Packaged Food' | 'Beverages' | 'Home Cleaning' | 'Personal Care'
export type RDCType = 'North (Jaffna)' | 'South (Galle)' | 'East (Trincomalee)' | 'West (Colombo)' | 'Central (Kandy)'
export type OrderStatusType = 'Pending' | 'In Transit' | 'Delivered' | 'Cancelled'
export type TransactionStatusType = 'PAID' | 'PENDING' | 'FAILED'
export type PaymentMethodType = 'Credit Card' | 'Bank Transfer' | 'Online Banking' | 'Cash on Delivery'
export type StaffStatusType = 'Active' | 'Away' | 'On Route' | 'Offline'
export type MissionStatusType = 'In Transit' | 'Maintenance' | 'Idle'
export type PartnerStatusType = 'Active' | 'Review' | 'Inactive'

// ============================================
// Product Related Types
// ============================================

export interface Product {
  id: string
  sku: string
  name: string
  category: ProductCategory
  price: number
  original_price?: number
  image: string | null
  description: string | null
  stock?: number
  tag?: string
  tag_color?: string
  in_cart?: boolean
  created_at: string
  updated_at: string
}

export interface ProductStock {
  id: number
  product_id: string
  rdc: RDCType
  quantity: number
  created_at: string
  updated_at: string
}

// ============================================
// Customer Related Types
// ============================================

export interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  created_at: string
  updated_at: string
}

// ============================================
// Order Related Types
// ============================================

export interface Order {
  id: string
  customer_id: string
  total: number
  status: OrderStatusType
  rdc: RDCType
  date: string
  eta: string | null
  created_at: string
  updated_at: string
  // Compatibility fields
  items?: number | string
}

export interface OrderItem {
  id: number
  order_id: string
  product_id: string
  quantity: number
  price: number
  created_at: string
}

export interface OrderWithDetails extends Order {
  customers: Customer | null
  order_items: OrderItem[]
}

// ============================================
// Transaction Related Types
// ============================================

export interface Transaction {
  id: string
  order_id: string | null
  customer: string
  amount: number
  date: string
  status: TransactionStatusType
  method: PaymentMethodType
  created_at: string
  updated_at: string
}

// ============================================
// Staff Related Types
// ============================================

export interface StaffMember {
  id: string
  name: string
  role: string
  status: StaffStatusType
  email: string | null
  phone: string | null
  join_date: string
  department: string
  location: string
  bio: string | null
  created_at: string
  updated_at: string
}

export interface StaffActivity {
  id: number
  staff_id: string
  action: string
  activity_date: string
  activity_time: string
  created_at: string
}

export interface StaffPerformance {
  id: number
  staff_id: string
  deliveries_completed: number
  on_time_rate: string
  hours_worked: number
  rating: number
  created_at: string
  updated_at: string
}

export interface StaffWithDetails extends StaffMember {
  staff_performance: StaffPerformance | null
  staff_activity: StaffActivity[]
}

// ============================================
// Partner Related Types
// ============================================

export interface RDCPartner {
  id: string
  name: string
  type: string
  hub: RDCType
  contact: string
  email: string | null
  phone: string | null
  status: PartnerStatusType
  rating: number
  contract_start: string
  contract_end: string
  agreement_type: string
  compliance_score: number
  bio: string | null
  created_at: string
  updated_at: string
  // Compatibility fields
  agreementType?: string
  contractStart?: string
  contractEnd?: string
  complianceScore?: number
  recentAudits?: PartnerAudit[]
}

export interface PartnerAudit {
  id: number
  partner_id: string
  audit_date: string
  result: string
  inspector: string
  created_at: string
}

export interface PartnerWithAudits extends RDCPartner {
  partner_audits: PartnerAudit[]
}

// ============================================
// Mission Related Types
// ============================================

export interface Mission {
  id: string
  driver_id: string
  driver_name: string
  vehicle: string
  current_location: string
  km_traversed: string
  status: MissionStatusType
  progress: number
  fuel_level: string
  temperature: string
  load_weight: string
  created_at: string
  updated_at: string
  // Compatibility fields
  currentLocation?: string
  telemetry?: {
    fuel: string
    temp: string
    load: string
  }
}

export interface MissionTask {
  id: number
  mission_id: string
  task_time: string
  task_label: string
  location: string
  completed: boolean
  created_at: string
  // Compatibility fields
  time?: string
  label?: string
  done?: boolean
}

export interface MissionWithTasks extends Mission {
  mission_tasks: MissionTask[]
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  data: T | null
  error: ApiError | null
}

export interface ApiError {
  message: string
  status?: number
  code?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ============================================
// Dashboard Statistics Types
// ============================================

export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  deliveredOrders: number
  pendingOrders: number
  activeStaff: number
  activePartners: number
  inTransitMissions: number
}

export interface OrderStats {
  total: number
  pending: number
  inTransit: number
  delivered: number
  cancelled: number
}

export interface RevenueStats {
  total: number
  paid: number
  pending: number
  failed: number
}

// ============================================
// Filter & Query Types
// ============================================

export interface OrderFilter {
  status?: OrderStatusType
  rdc?: RDCType
  dateFrom?: string
  dateTo?: string
  customerId?: string
}

export interface StaffFilter {
  department?: string
  status?: StaffStatusType
  location?: string
}

export interface PartnerFilter {
  status?: PartnerStatusType
  hub?: RDCType
  minRating?: number
}

export interface MissionFilter {
  status?: MissionStatusType
  driverId?: string
}

// ============================================
// Form Input Types
// ============================================

export interface CreateOrderInput {
  customer_id: string
  items: { product_id: string; quantity: number }[]
  rdc: RDCType
  eta?: string
}

export interface UpdateOrderStatusInput {
  orderId: string
  status: OrderStatusType
}

export interface CreateTransactionInput {
  order_id?: string
  customer: string
  amount: number
  method: PaymentMethodType
}

export interface CreateStaffInput {
  id: string
  name: string
  role: string
  email: string
  phone: string
  join_date: string
  department: string
  location: string
  bio?: string
}

export interface UpdateStaffStatusInput {
  staffId: string
  status: StaffStatusType
}

export interface CreateMissionInput {
  id: string
  driver_id: string
  driver_name: string
  vehicle: string
  current_location: string
  rdc: RDCType
}

// ============================================
// Real-time Event Types
// ============================================

export interface RealtimePayload<T> {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  old: T | null
  new: T | null
}

export type OrderRealtimeEvent = RealtimePayload<Order>
export type MissionRealtimeEvent = RealtimePayload<Mission>
export type TransactionRealtimeEvent = RealtimePayload<Transaction>
