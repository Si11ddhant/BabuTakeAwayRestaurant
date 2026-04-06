-- Babu Takeaway and restaurant Database Schema for Supabase
-- Run this script in Supabase SQL Editor to set up the complete database

-- ============================================================================
-- 1. USERS TABLE (Extends Supabase Auth)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('admin', 'customer')) DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own record"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON public.users
  FOR SELECT
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Users can update own record"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- 2. MENU ITEMS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  is_veg BOOLEAN DEFAULT TRUE,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS for menu_items
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for menu_items (public read)
CREATE POLICY "Anyone can view menu items"
  ON public.menu_items
  FOR SELECT
  USING (TRUE);

CREATE POLICY "Only admins can insert menu items"
  ON public.menu_items
  FOR INSERT
  WITH CHECK (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Only admins can update menu items"
  ON public.menu_items
  FOR UPDATE
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Only admins can delete menu items"
  ON public.menu_items
  FOR DELETE
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- 3. ORDERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  special_instructions TEXT,
  order_type TEXT CHECK (order_type IN ('delivery', 'takeaway')) NOT NULL DEFAULT 'delivery',
  items JSONB NOT NULL DEFAULT '[]',
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('new', 'accepted', 'preparing', 'ready', 'dispatched')) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_payload JSONB
);

-- Enable RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
CREATE POLICY "Customers can view own orders"
  ON public.orders
  FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "Admins can view all orders"
  ON public.orders
  FOR SELECT
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Anyone can view guest orders"
  ON public.orders
  FOR SELECT
  USING (customer_id IS NULL);

CREATE POLICY "Customers can insert own orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Anyone can place guest orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (customer_id IS NULL);

CREATE POLICY "Admins can update orders"
  ON public.orders
  FOR UPDATE
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- 4. CUSTOMERS TABLE (Optional CRM)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  total_orders INT DEFAULT 0,
  total_spent NUMERIC(10, 2) DEFAULT 0,
  last_ordered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS for customers
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customers
CREATE POLICY "Anyone can view customers"
  ON public.customers
  FOR SELECT
  USING (TRUE);

CREATE POLICY "Only admins can update customers"
  ON public.customers
  FOR UPDATE
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- 5. INDEXES for Performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_payload JSONB;
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);

-- ============================================================================
-- 6. TRIGGERS for Automatic Updates
-- ============================================================================

-- Trigger to update user's updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 7. SEED DATA (Optional - for testing)
-- ============================================================================

-- NOTE: Admin user will be created through Supabase Auth
-- You must create users in: https://app.supabase.com > Authentication > Users > Add User

-- Insert sample menu items
INSERT INTO public.menu_items (name, category, description, price, is_veg, is_available)
VALUES
  ('Butter Chicken Rolls', 'Rolls', 'Tender butter chicken wrapped in soft rolls', 15.99, FALSE, TRUE),
  ('Paneer Handi', 'Curries', 'Cottage cheese in creamy tomato sauce', 12.99, TRUE, TRUE),
  ('Veg Manchurian', 'Starters', 'Crispy vegetable balls in tangy sauce', 11.99, TRUE, TRUE),
  ('Paneer Tikka Rolls', 'Rolls', 'Marinated paneer in soft rolls', 13.99, TRUE, TRUE),
  ('Garlic Naan', 'Breads', 'Soft naan with garlic butter', 3.99, TRUE, TRUE),
  ('Chicken Biryani', 'Biryani', 'Fragrant basmati rice with chicken', 14.99, FALSE, TRUE),
  ('Veg Biryani', 'Biryani', 'Fragrant basmati rice with vegetables', 10.99, TRUE, TRUE),
  ('Tandoori Chicken', 'Tandoori', 'Grilled chicken with traditional spices', 16.99, FALSE, TRUE),
  ('Chilli Garlic Naan', 'Breads', 'Soft naan with chilli and garlic', 4.99, TRUE, TRUE)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 8. ANALYTICS FUNCTIONS (Optional)
-- ============================================================================

-- Get daily revenue
CREATE OR REPLACE FUNCTION get_daily_revenue()
RETURNS TABLE (
  order_date DATE,
  daily_revenue NUMERIC,
  num_orders INT
) AS $$
SELECT
  DATE(created_at) as order_date,
  SUM(total) as daily_revenue,
  COUNT(*) as num_orders
FROM public.orders
WHERE status IN ('Dispatched', 'Ready for Pickup')
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY order_date DESC;
$$ LANGUAGE SQL;

-- Get order count by status
CREATE OR REPLACE FUNCTION get_orders_by_status()
RETURNS TABLE (
  status TEXT,
  order_count INT
) AS $$
SELECT 
  status,
  COUNT(*) as order_count
FROM public.orders
GROUP BY status;
$$ LANGUAGE SQL;

-- Get top selling items
CREATE OR REPLACE FUNCTION get_top_selling_items(num_items INT DEFAULT 5)
RETURNS TABLE (
  item_name TEXT,
  quantity INT,
  revenue NUMERIC
) AS $$
WITH item_sales AS (
  SELECT
    jsonb_array_elements(items)->>'name' as item_name,
    (jsonb_array_elements(items)->'quantity')::INT as qty,
    ((jsonb_array_elements(items)->'price')::NUMERIC * (jsonb_array_elements(items)->'quantity')::INT) as item_revenue
  FROM public.orders
  WHERE status IN ('Dispatched', 'Ready for Pickup')
)
SELECT
  item_name,
  SUM(qty)::INT as quantity,
  SUM(item_revenue) as revenue
FROM item_sales
GROUP BY item_name
ORDER BY revenue DESC
LIMIT num_items;
$$ LANGUAGE SQL;

-- ============================================================================
-- DATABASE SETUP COMPLETE
-- ============================================================================
-- 
-- Next Steps:
-- 1. Create auth users in Supabase Auth: https://app.supabase.com/auth/users
-- 2. Update the admin user ID in the seed data above
-- 3. Enable Edge Functions if needed for custom business logic
-- 4. Set up Email templates in Auth > Email Templates
-- 5. Configure Storage buckets for menu item images
--
