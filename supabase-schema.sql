-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  category_id UUID REFERENCES categories(id),
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  barcode VARCHAR(50),
  cost_price INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employees table
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  pin_code VARCHAR(6) NOT NULL UNIQUE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name VARCHAR(255),
  total_amount INTEGER NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  cashier_id UUID REFERENCES employees(id),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transaction_items table
CREATE TABLE transaction_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stored procedure to decrease product stock
CREATE OR REPLACE FUNCTION decrease_product_stock(p_id UUID, quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock = stock - quantity
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;

-- Create stored procedure to increase product stock
CREATE OR REPLACE FUNCTION increase_product_stock(p_id UUID, quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock = stock + quantity
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_products_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_employees_timestamp
BEFORE UPDATE ON employees
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Insert sample categories
INSERT INTO categories (name, description) VALUES 
('Groceries', 'Bahan makanan dan kebutuhan dapur'),
('Beverages', 'Minuman kemasan dan minuman segar'),
('Snacks', 'Makanan ringan dan cemilan'),
('Personal Care', 'Produk perawatan pribadi'),
('Household', 'Perlengkapan rumah tangga');

-- Insert sample employees
INSERT INTO employees (name, role, pin_code) VALUES 
('Admin', 'Manager', '123456'),
('Budi', 'Cashier', '111222'),
('Ani', 'Cashier', '222333'),
('Dedi', 'Stockist', '333444');

-- Create RLS policies
-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to read employees" 
ON employees FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to read products" 
ON products FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to read categories" 
ON categories FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to read transactions" 
ON transactions FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to read transaction items" 
ON transaction_items FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to create transactions" 
ON transactions FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to create transaction items" 
ON transaction_items FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update products" 
ON products FOR UPDATE 
TO authenticated 
USING (true);

-- Create an index for faster product searches
CREATE INDEX idx_products_name ON products USING gin(name gin_trgm_ops);
CREATE INDEX idx_products_barcode ON products(barcode);
