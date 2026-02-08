import {
  Member,
  Employee,
  SubscriptionPlan,
  Class,
  ClassBooking,
  EquipmentAsset,
  InventoryItem,
  Supplier,
  MaintenanceLog,
  PointOfSale,
  MemberActivityDoc,
  WholesaleOrder,
  MembershipEnrollment,
} from '../types';

export const mockMembers: Member[] = [
  {
    member_id: 1,
    full_name: 'John Doe',
    email: 'john@gym.com',
    phone: '9876543210',
    address: '123 Fitness Street, Gym City',
    join_date: '2023-06-15',
    current_plan: 'Premium Plus',
  },
  {
    member_id: 2,
    full_name: 'Jane Smith',
    email: 'jane@gym.com',
    phone: '9876543211',
    address: '456 Trainer Lane, Gym City',
    join_date: '2023-08-20',
    current_plan: 'Standard',
  },
  {
    member_id: 3,
    full_name: 'Mike Wilson',
    email: 'mike@gym.com',
    phone: '9876543212',
    address: '789 Muscle Ave, Gym City',
    join_date: '2024-01-10',
    current_plan: 'Premium Plus',
  },
];

export const mockEmployees: Employee[] = [
  {
    employee_id: 101,
    name: 'Sarah Smith',
    email: 'sarah@gym.com',
    phone: '9876543211',
    address: '456 Trainer Lane, Gym City',
    role: 'Senior Trainer',
    salary: 45000,
    reports_to: 201,
    manager_name: 'Mike Johnson',
  },
  {
    employee_id: 102,
    name: 'Alex Johnson',
    email: 'alex@gym.com',
    phone: '9876543213',
    address: '321 Gym Plaza, Gym City',
    role: 'Junior Trainer',
    salary: 30000,
    reports_to: 101,
    manager_name: 'Sarah Smith',
  },
  {
    employee_id: 103,
    name: 'Lisa Brown',
    email: 'lisa@gym.com',
    phone: '9876543214',
    address: '654 Wellness Blvd, Gym City',
    role: 'Inventory Coordinator',
    salary: 28000,
    reports_to: 201,
    manager_name: 'Mike Johnson',
  },
  {
    employee_id: 201,
    name: 'Mike Johnson',
    email: 'mike@gym.com',
    phone: '9876543212',
    address: '789 Manager Plaza, Gym City',
    role: 'Manager',
    salary: 60000,
    reports_to: undefined,
    manager_name: undefined,
  },
];

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    plan_id: 1,
    plan_name: 'Basic',
    duration_months: 1,
    base_price: 999,
    description: 'Access to gym facilities during business hours',
  },
  {
    plan_id: 2,
    plan_name: 'Standard',
    duration_months: 3,
    base_price: 2499,
    description: 'Unlimited gym access + 4 group classes per month',
  },
  {
    plan_id: 3,
    plan_name: 'Premium Plus',
    duration_months: 12,
    base_price: 8999,
    description: 'Unlimited access + all classes + personal training sessions',
  },
];

export const mockClasses: Class[] = [
  {
    schedule_id: 1,
    class_name: 'Morning Yoga',
    trainer_id: 101,
    trainer_name: 'Sarah Smith',
    start_time: '2024-12-31T06:00:00',
    capacity: 20,
    booked_count: 15,
  },
  {
    schedule_id: 2,
    class_name: 'HIIT Training',
    trainer_id: 102,
    trainer_name: 'Alex Johnson',
    start_time: '2024-12-31T18:00:00',
    capacity: 15,
    booked_count: 12,
  },
  {
    schedule_id: 3,
    class_name: 'Strength & Conditioning',
    trainer_id: 101,
    trainer_name: 'Sarah Smith',
    start_time: '2025-01-01T07:00:00',
    capacity: 20,
    booked_count: 18,
  },
  {
    schedule_id: 4,
    class_name: 'Spinning Class',
    trainer_id: 102,
    trainer_name: 'Alex Johnson',
    start_time: '2025-01-01T17:30:00',
    capacity: 25,
    booked_count: 20,
  },
];

export const mockClassBookings: ClassBooking[] = [
  {
    booking_id: 1,
    member_id: 1,
    schedule_id: 1,
    booking_date: '2024-12-25',
    attended: false,
    class_name: 'Morning Yoga',
    start_time: '2024-12-31T06:00:00',
    trainer_name: 'Sarah Smith',
  },
  {
    booking_id: 2,
    member_id: 1,
    schedule_id: 3,
    booking_date: '2024-12-26',
    attended: false,
    class_name: 'Strength & Conditioning',
    start_time: '2025-01-01T07:00:00',
    trainer_name: 'Sarah Smith',
  },
];

export const mockEquipment: EquipmentAsset[] = [
  {
    asset_id: 1,
    asset_name: 'Treadmill 01',
    purchase_date: '2020-03-15',
    status: 'Functional',
  },
  {
    asset_id: 2,
    asset_name: 'Dumbbells Set',
    purchase_date: '2019-05-20',
    status: 'Functional',
  },
  {
    asset_id: 3,
    asset_name: 'Leg Press Machine',
    purchase_date: '2021-01-10',
    status: 'Broken',
  },
  {
    asset_id: 4,
    asset_name: 'Bench Press',
    purchase_date: '2020-08-05',
    status: 'Functional',
  },
  {
    asset_id: 5,
    asset_name: 'Rowing Machine',
    purchase_date: '2022-06-12',
    status: 'Maintenance',
  },
  {
    asset_id: 6,
    asset_name: 'Pull-up Bar',
    purchase_date: '2019-11-22',
    status: 'Functional',
  },
  {
    asset_id: 7,
    asset_name: 'Cable Machine',
    purchase_date: '2021-07-30',
    status: 'Broken',
  },
];

export const mockInventory: InventoryItem[] = [
  {
    item_id: 1,
    item_name: 'Protein Powder',
    description: 'Whey protein concentrate',
    current_stock: 45,
    unit_selling_price: 799,
    low_stock: false,
  },
  {
    item_id: 2,
    item_name: 'Energy Drink',
    description: 'Electrolyte replacement',
    current_stock: 8,
    unit_selling_price: 149,
    low_stock: true,
  },
  {
    item_id: 3,
    item_name: 'Gym Towel',
    description: 'Premium microfiber towel',
    current_stock: 23,
    unit_selling_price: 299,
    low_stock: false,
  },
  {
    item_id: 4,
    item_name: 'Water Bottle',
    description: 'Insulated sports bottle',
    current_stock: 5,
    unit_selling_price: 599,
    low_stock: true,
  },
  {
    item_id: 5,
    item_name: 'BCAAs Supplement',
    description: 'Branch chain amino acids',
    current_stock: 12,
    unit_selling_price: 1299,
    low_stock: false,
  },
];

export const mockSuppliers: Supplier[] = [
  {
    supplier_id: 1,
    company_name: 'FitTech Equipment',
    contact_person: 'Rajesh Kumar',
    category: 'Machinery',
    phone_number: '9999888888',
    address: '123 Industrial Park, Mumbai',
  },
  {
    supplier_id: 2,
    company_name: 'NutriPro Supplements',
    contact_person: 'Priya Sharma',
    category: 'Consumables',
    phone_number: '9999777777',
    address: '456 Trade Centre, Delhi',
  },
];

export const mockMembershipEnrollments: MembershipEnrollment[] = [
  {
    enrollment_id: 1,
    member_id: 1,
    plan_id: 3,
    start_date: '2024-06-15',
    end_date: '2025-06-15',
    final_price_paid: 8999,
    payment_status: 'Paid',
    plan_name: 'Premium Plus',
  },
  {
    enrollment_id: 2,
    member_id: 2,
    plan_id: 2,
    start_date: '2024-09-20',
    end_date: '2024-12-20',
    final_price_paid: 2499,
    payment_status: 'Paid',
    plan_name: 'Standard',
  },
];

export const mockMaintenanceLogs: MaintenanceLog[] = [
  {
    log_id: 1,
    asset_id: 3,
    performed_by: 103,
    maintenance_date: '2024-12-20',
    repair_cost: 5000,
    notes: 'Replaced hydraulic cylinders',
    asset_name: 'Leg Press Machine',
    technician_name: 'Lisa Brown',
  },
  {
    log_id: 2,
    asset_id: 5,
    performed_by: 103,
    maintenance_date: '2024-12-25',
    repair_cost: 3500,
    notes: 'Belt alignment and lubrication',
    asset_name: 'Rowing Machine',
    technician_name: 'Lisa Brown',
  },
];

export const mockPointOfSale: PointOfSale[] = [
  {
    transaction_id: 1,
    member_id: 1,
    item_id: 1,
    quantity: 2,
    sale_timestamp: '2024-12-28T14:30:00',
    total_amount: 1598,
    item_name: 'Protein Powder',
  },
  {
    transaction_id: 2,
    member_id: 1,
    item_id: 3,
    quantity: 1,
    sale_timestamp: '2024-12-29T10:15:00',
    total_amount: 299,
    item_name: 'Gym Towel',
  },
];

export const mockMemberActivity: MemberActivityDoc[] = [
  {
    doc_id: 1,
    member_id: 1,
    activity_type: 'Workout',
    recorded_at: '2024-12-29T06:30:00',
    details: {
      duration: 60,
      exercise: 'Strength Training',
      feeling: 'Great',
      exercises: ['Bench Press', 'Squats', 'Deadlifts'],
      notes: 'Good session, felt strong',
    },
  },
  {
    doc_id: 2,
    member_id: 1,
    activity_type: 'Workout',
    recorded_at: '2024-12-28T18:00:00',
    details: {
      duration: 45,
      exercise: 'Cardio',
      feeling: 'Good',
      cardio_type: 'Treadmill',
      distance: '5.5km',
    },
  },
  {
    doc_id: 3,
    member_id: 1,
    activity_type: 'Workout',
    recorded_at: '2024-12-27T06:15:00',
    details: {
      duration: 50,
      exercise: 'Mixed',
      feeling: 'Good',
      notes: 'Yoga and stretching',
    },
  },
];

export const mockWholesaleOrders: WholesaleOrder[] = [
  {
    order_id: 1,
    supplier_id: 1,
    order_date: '2024-12-01',
    total_bulk_cost: 150000,
    delivery_status: 'Delivered',
    company_name: 'FitTech Equipment',
  },
  {
    order_id: 2,
    supplier_id: 2,
    order_date: '2024-12-15',
    total_bulk_cost: 45000,
    delivery_status: 'Shipped',
    company_name: 'NutriPro Supplements',
  },
];
