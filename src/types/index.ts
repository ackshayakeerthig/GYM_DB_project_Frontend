export type UserRole = 'Member' | 'Employee' | 'Manager';

export interface User {
  id: number;
  name: string;
  email?:string;
  role: UserRole;
  status?: string; // Added to match your backend return
}

export interface Supplier {
  supplier_id: number;
  company_name: string; // Changed from supplier_name
  contact_person: string;
  phone_number: string; // Changed from phone
  address: string;
  category: string;
  // email is missing from your API, so we make it optional
  email?: string; 
}

export interface Member {
  member_id: number;
  full_name: string;
  email: string;
  phone: string;
  address?: string;
  join_date: string;
  current_plan?: string;
}

export interface Employee {
  employee_id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: string;
  salary?: number;
  reports_to?: number;
  manager_name?: string;
}



export interface SubscriptionPlan {
  plan_id: number;
  plan_name: string;
  duration_months: number;
  base_price: number;
  description?: string;
}

export interface MembershipEnrollment {
  enrollment_id: number;
  member_id: number;
  plan_id: number;
  start_date: string;
  end_date: string;
  final_price_paid: number;
  payment_status: string;
  plan_name?: string;
}

export interface Class {
  schedule_id: number;
  class_name: string;
  trainer_id: number;
  trainer_name?: string;
  start_time: string;
  capacity: number;
  booked_count?: number;
}

export interface ClassBooking {
  booking_id: number;
  member_id: number;
  schedule_id: number;
  booking_date: string;
  attended: boolean;
  class_name?: string;
  start_time?: string;
  trainer_name?: string;
}

export interface EquipmentAsset {
  asset_id: number;
  asset_name: string;
  purchase_date: string;
  status: string;
}

export interface InventoryItem {
  item_id: number;
  item_name: string;
  description: string;
  current_stock: number;
  unit_selling_price: number; // Ensure this exists
  low_stock: boolean;
}

// export interface Supplier {
//   supplier_id: number;
//   company_name: string;
//   contact_person?: string;
//   category: string;
//   phone_number: string;
//   address?: string;
// }

export interface MaintenanceLog {
  log_id: number;
  asset_id: number;
  performed_by: number;
  maintenance_date: string;
  repair_cost: number;
  notes?: string;
  asset_name?: string;
  technician_name?: string;
}

export interface PointOfSale {
  transaction_id: number;
  member_id: number;
  item_id: number;
  quantity: number;
  sale_timestamp: string;
  total_amount: number;
  item_name?: string;
}

export interface MemberActivityDoc {
  doc_id: number;
  member_id: number;
  activity_type: string;
  recorded_at: string;
  details: {
    duration?: number;
    exercise?: string;
    feeling?: string;
    [key: string]: any;
  };
}

export interface WholesaleOrder {
  order_id: number;
  supplier_id: number;
  order_date: string;
  total_bulk_cost: number;
  delivery_status: 'Delivered' | 'Shipped' | 'Pending' | 'Cancelled';
  company_name?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}