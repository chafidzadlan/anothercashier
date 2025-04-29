export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category_id?: string;
  category?: Category;
  image_url?: string;
  stock: number;
  barcode?: string;
  cost_price?: number;
  created_at: string;
  updated_at?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  pin_code: string;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Transaction {
  id: string;
  customer_name?: string;
  total_amount: number;
  payment_method: string;
  cashier_id: string;
  note?: string;
  created_at: string;
  items: TransactionItem[];
}

export interface TransactionItem {
  id: string;
  transaction_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
  created_at?: string;
}

export type PaymentMethod = "cash" | "card" | "ewallet";

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message?: string;
  error?: unknown;
}

export type Tables = {
  products: Product;
  categories: Category;
  employees: Employee;
  transactions: Transaction;
  transaction_items: TransactionItem;
};