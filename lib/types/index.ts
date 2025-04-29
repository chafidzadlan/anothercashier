export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url?: string;
  stock: number;
  barcode?: string;
  created_at: string;
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
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  pin_code: string;
  active: boolean;
}