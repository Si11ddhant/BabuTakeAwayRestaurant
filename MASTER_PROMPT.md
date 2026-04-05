# MASTER PROMPT: Babu Takeaway Synchronized Food Ordering System

## Project Overview

**Project Name**: Babu Takeaway Food Ordering System  
**Type**: Full-Stack Web Application (Client Storefront + Protected Admin Dashboard)  
**Stack**: React 18+, TypeScript, Tailwind CSS, Shadcn UI, Supabase, Vite  
**Real-Time**: WebSocket sync via Supabase Realtime  
**Objective**: Create a seamless, real-time order management system where customers place orders and admins instantly see and manage them.

---

## Architecture Overview

```
├── Client Storefront (Public)
│   ├── Menu Grid (Food Items)
│   ├── Cart Sidebar
│   ├── Checkout Flow
│   ├── Admin Portal Link (Shield Icon)
│   └── Order Confirmation
│
├── Authentication Layer
│   ├── SignIn Page (Email/Password + Google OAuth)
│   ├── Role-Based Access Control (RBAC)
│   └── Protected Routes (/admin/*)
│
└── Admin Dashboard (Protected)
    ├── Live Order Feed (Card Grid)
    ├── Order Management Workflow
    ├── Analytics Dashboard
    ├── Customer Management
    └── Menu Management
```

---

## 1. AUTHENTICATION & SECURITY

### 1.1 Login Page Component

**File**: `src/pages/SignIn.tsx`

**Features**:
- Email/Password input fields with validation
- "Keep me signed in" checkbox
- "Reset password" link
- "Continue with Google" OAuth button
- Glassmorphism design: `backdrop-blur-md`, `bg-white/10`, `border border-white/20`
- Hero image on right side (food/restaurant imagery)
- Dark theme with accent colors (Primary: Indigo #6366F1)

**Flow**:
```
User enters email/password
    ↓
Validate input (email format, password length ≥ 8)
    ↓
Call Supabase Auth API (auth.signInWithPassword)
    ↓
If Success: Set user session + role from JWT
    ↓
If Admin role: Redirect to /admin
    ↓
If Customer role: Redirect to /
```

### 1.2 Role-Based Access Control (RBAC)

**Supabase Setup** (Database):
```sql
-- users table (extends supabase.auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('customer', 'admin')) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

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
```

**Protected Routes** (React Router):
```tsx
// ProtectedRoute.tsx
const ProtectedRoute = ({ component: Component, requiredRole }) => {
  const { user, role } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" />;
  
  return <Component />;
};

// App.tsx
<Routes>
  <Route path="/login" element={<SignIn />} />
  <Route path="/" element={<Index />} />
  
  <Route 
    path="/admin/*" 
    element={<ProtectedRoute component={AdminLayout} requiredRole="admin" />} 
  />
</Routes>
```

---

## 2. CLIENT STOREFRONT (Customer Experience)

### 2.1 Menu Grid

**Component**: `src/components/MenuSection.tsx`

**Data Structure**:
```ts
interface MenuItem {
  id: string;
  name: string;
  category: string; // "Biryani", "Rolls", "Naan", etc.
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
}
```

**Features**:
- Responsive grid: 1 col (mobile) → 2 (tablet) → 3 (desktop)
- Food item cards with image, name, price, description
- "Add to Cart" button with quantity selector
- Search/filter by category
- Real-time availability indicator

### 2.2 Delivery/Takeaway Toggle

**Component**: `src/components/Header.tsx`

**Feature**:
- Toggle button at top center
- State: `useCart()` stores selected mode
- Updates delivery address visibility in checkout
- Changes order type in created order record

### 2.3 Cart Sidebar

**Component**: `src/components/CartSidebar.tsx`

**Features**:
- Desktop: Fixed sidebar (right)
- Mobile: Bottom-sheet drawer (Swiggy-style)
- Item list with quantity controls
- Subtotal, Tax, Delivery Fee calculation
- "Proceed to Checkout" button

### 2.4 Checkout Flow

**Component**: `src/pages/CheckoutSection.tsx`

**Form Fields**:
1. **Customer Name** (text input, required)
2. **Phone Number** (tel input, required, pattern: `^\d{10}$`)
3. **Delivery Address** (textarea, conditional on delivery mode)
4. **Special Instructions** (textarea, optional)
5. **Delivery/Takeaway Selection** (radio, required)

**Submission Flow**:
```
User fills checkout form
    ↓
Validate all fields
    ↓
Create order in Supabase: INSERT INTO orders (...)
    ↓
Order structure:
{
  id: UUID (auto-generated),
  customer_name: string,
  customer_phone: string,
  delivery_address: string | null,
  order_type: "Delivery" | "Takeaway",
  items: { name, quantity, price }[],
  total: number,
  status: 'New',
  created_at: timestamp,
  created_by: user_id (customer)
}
    ↓
Admin Dashboard: Realtime listener triggers → New card appears
    ↓
Show "Order Placed!" success animation to customer
    ↓
Display order ID + ETA (e.g., "30-40 min")
```

### 2.5 Admin Portal Navigation Link

**Component**: `src/components/Header.tsx` (already implemented)

**Feature**:
- Shield icon button in top-right (before cart)
- Links to `/admin`
- Visible only if user is authenticated and has admin role
- Hover: Icon color changes to primary (Indigo)

---

## 3. ADMIN DASHBOARD (Protected)

### 3.1 Authentication Check

**Pattern**:
```tsx
const AdminLayout = () => {
  const { user, role } = useAuth();
  
  if (role !== 'admin') {
    return <Navigate to="/login" />;
  }
  
  return <AdminLayoutComponent />;
};
```

### 3.2 Layout Structure

**Component**: `src/components/AdminLayout.tsx` (already implemented)

**Structure**:
```
┌─────────────────────────────────────┐
│ 72px Sidebar  │     Top Nav (Search, Notifications, Profile)
│               │     ┌───────────────────────────────────────┐
│ [Logo]        │     │ Content Outlet (Dashboard/Orders/etc)  │
│               │     │                                       │
│ [Dashboard]   │     │                                       │
│ [Orders]      │     │                                       │
│ [Menu]        │     │                                       │
│ [Customers]   │     │                                       │
│ [Analytics]   │     │                                       │
│ [Settings]    │     │                                       │
│               │     └───────────────────────────────────────┘
│ [Theme ✓]     │
└─────────────────────────────────────┘
```

**Sidebar Features** (already implemented):
- Slim 72px width with logo gradient
- Active link indicator: Vertical gradient bar with glow shadow
- Theme toggle (Light/Dark mode)
- Navigation icons with hover effects

### 3.3 Live Order Feed (Order Grid)

**Component**: `src/pages/Orders.tsx` (already implemented)

**Grid Layout**:
```
Responsive: 1 col (mobile) → 2 (tablet) → 3 (desktop) → 4 (xl)
Gap: 24px
Card height: Auto (content-based)
```

**Card Structure**:
```
┌─────────────────────────────────────┐
│ David Moore                  [NEW ORDER]  (Orange badge)
│ +1 987-654-3210                      
├─────────────────────────────────────┤
│ 11:00 AM, 08 Feb, 2024     │ Table 1
├─────────────────────────────────────┤
│ 3 Items                    │ $22.50
├─────────────────────────────────────┤
│ [Click to expand]          →
└─────────────────────────────────────┘
  
EXPANDED VIEW (After Click):
├─────────────────────────────────────┤
│ ORDER ITEMS                          │
│ • 1x Spaghetti Bolognese   $12.00   │
│ • 1x Naan                  $3.50    │
│ • 1 Garlic Bread           $3.50    │
│                                      │
│ [Accepted] [Accept Order]          │
└─────────────────────────────────────┘
```

**Card Data Mapping**:
```ts
interface OrderCard {
  // Top Left
  customerName: string;
  customerPhone: string;
  
  // Top Right
  orderType: "Delivery" | "Takeaway";
  status: "New" | "Accepted" | "Preparing" | "Dispatched" | "Ready for Pickup";
  
  // Metadata
  timestamp: Date;
  orderId: string;
  
  // Summary
  itemCount: number;
  totalPrice: number;
  
  // Expandable
  items: CartItem[];
  specialInstructions: string;
}
```

**Filter Buttons** (Top):
- **All**: Show all orders
- **New Orders**: status === 'New'
- **On Cook**: status === 'Accepted' || 'Preparing'
- **Completed**: status === 'Dispatched' || 'Ready for Pickup'

**Search Functionality**:
- Search by: Customer Name, Phone Number, Order ID
- Real-time filtering as user types
- X button to clear search

### 3.4 Order Management Workflow

**Status Transitions**:
```
New (Red) 
  ↓ [Accept Button]
Accepted (Yellow)
  ↓ [Start Cooking Button]
Preparing (Blue)
  ↓ [Mark Dispatched/Ready Button]
Dispatched/Ready for Pickup (Green) ✓
```

**Status Config** (already implemented):
```ts
const statusConfig = {
  'New': { color: 'red', icon: Clock, next: 'Accepted' },
  'Accepted': { color: 'yellow', icon: CheckCircle, next: 'Preparing' },
  'Preparing': { color: 'blue', icon: ChefHat, next: 'Dispatched' },
  'Dispatched': { color: 'green', icon: Truck, next: null },
  'Ready for Pickup': { color: 'green', icon: Package, next: null },
};
```

**Button Actions** (Click on card to expand):
```tsx
onClick={() => handleStatusUpdate(orderId, currentStatus, orderType)}
  ↓
Update in Supabase: UPDATE orders SET status = $1 WHERE id = $2
  ↓
Realtime trigger: All connected clients receive update
  ↓
Card UI updates: Status badge color changes
  ↓
Toast notification: "Order status updated to: Preparing"
```

### 3.5 Real-Time Synchronization (Supabase)

**Supabase Realtime Setup**:

```ts
// AdminContext.tsx (or custom hook)
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useOrdersRealtime = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Initial fetch
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error) setOrders(data);
    };

    fetchOrders();

    // Subscribe to realtime updates
    const subscription = supabase
      .channel('orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // New order placed by customer
            setOrders(prev => [payload.new, ...prev]);
            showToast('New order received!', 'success');
          } else if (payload.eventType === 'UPDATE') {
            // Admin updated order status
            setOrders(prev =>
              prev.map(o => o.id === payload.new.id ? payload.new : o)
            );
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(o => o.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return { orders, setOrders };
};
```

**Customer Flow (Realtime)**:
```
Customer clicks "Place Order"
    ↓
INSERT into orders table (status: 'New')
    ↓
Supabase Realtime broadcasts INSERT event
    ↓
Admin Dashboard channel receives event
    ↓
New order card appears in grid (animated slide-in)
    ↓
Order has subtle pulsing border (animate-pulse)
```

**Admin Updates Flow (Realtime)**:
```
Admin clicks "Accept Order" button
    ↓
UPDATE orders SET status = 'Accepted' WHERE id = $1
    ↓
Supabase Realtime broadcasts UPDATE event
    ↓
All Admin Dashboard instances receive update
    ↓
Card updates: Status badge changes to yellow
    ↓
Toast notification: "Order accepted!"
    ↓
(Optional) Customer app listens to same channel → Shows status update
```

---

## 4. DATABASE SCHEMA (Supabase PostgreSQL)

### 4.1 Core Tables

```sql
-- orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT,
  order_type TEXT CHECK (order_type IN ('Delivery', 'Takeaway')) NOT NULL,
  items JSONB NOT NULL, -- [{ name, quantity, price }]
  total NUMERIC(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('New', 'Accepted', 'Preparing', 'Dispatched', 'Ready for Pickup')) DEFAULT 'New',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- menu_items table
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- customers table (optional, for CRM)
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  total_orders INT DEFAULT 0,
  total_spent NUMERIC(10, 2) DEFAULT 0,
  last_ordered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4.2 Row Level Security (RLS) Policies

```sql
-- orders: Customers see own orders, admins see all
CREATE POLICY "Customers view own orders"
  ON public.orders
  FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "Admins view all orders"
  ON public.orders
  FOR SELECT
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Customers insert own orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Admins can update orders"
  ON public.orders
  FOR UPDATE
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );
```

---

## 5. COMPONENT HIERARCHY & CODE MAP

```
App.tsx
├── BrowserRouter
│   └── Routes
│       ├── / (Index - Customer Storefront)
│       │   ├── Header (with Delivery/Takeaway toggle, Admin link)
│       │   ├── HeroBanner
│       │   ├── MenuSection (Rendered for each category)
│       │   │   └── MenuCard (Individual items)
│       │   └── CartSidebar (Desktop/Mobile adaptive)
│       │
│       ├── /login (SignIn Page)
│       │   └── SignInPage (Glassmorphism design)
│       │
│       └── /admin/* (Protected)
│           └── AdminLayout (Sidebar layout)
│               ├── Dashboard
│               │   ├── KPI Cards
│               │   ├── Hero Revenue Box (Gradient chart)
│               │   ├── RecentOrdersTable
│               │   ├── PerformanceGauge
│               │   └── TopSellingItems
│               ├── Orders (Live Feed Grid)
│               │   └── OrderCard (Expandable)
│               ├── Customers (CRM)
│               │   └── CustomerTable
│               ├── MenuManagement
│               │   └── MenuItemGrid
│               ├── Analytics
│               └── Settings
│
Context Providers
├── AdminProvider (Real-time orders, customers, revenue)
├── AuthProvider (User session, role)
└── CartProvider (Cart state, mode)
```

---

## 6. UI/UX SPECIFICATIONS

### 6.1 Color Palette

```
Primary: #6366F1 (Indigo)
Secondary: #F97316 (Orange)
Success: #22C55E (Green)
Warning: #EAB308 (Yellow)
Danger: #EF4444 (Red)
Info: #3B82F6 (Blue)

Background Light: #F8F9FA
Background Dark: #1F2937
Surface: #FFFFFF (light) / #111827 (dark)
Text Primary: #111827 (light) / #F3F4F6 (dark)
Text Secondary: #6B7280 (light) / #D1D5DB (dark)
```

### 6.2 Typography

```
Font: Inter, Helvetica, Arial
Heading 1: 32px, 700 weight
Heading 2: 24px, 700 weight
Heading 3: 20px, 600 weight
Body: 14px, 400 weight
Caption: 12px, 400 weight
```

### 6.3 Interactions & Animations

**Pulsing Border** (New Orders):
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.pulsing-card {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

**Card Expansion** (Smooth heights):
```tsx
{isExpanded && (
  <motion.div
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: 'auto', opacity: 1 }}
    exit={{ height: 0, opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {/* Expanded content */}
  </motion.div>
)}
```

**Toast Notifications**:
```tsx
showToast('Order status updated to: Preparing', 'success', { duration: 3000 });
showToast('New order received!', 'info', { duration: 5000 });
```

**Glassmorphism** (Search bars, overlays):
```css
.glassmorphism {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

---

## 7. API ENDPOINTS & DATA FLOW

### 7.1 Key Supabase RPC Functions (Optional)

```sql
-- Function: Get orders with customer revenue
CREATE OR REPLACE FUNCTION get_order_analytics()
RETURNS TABLE (
  daily_revenue NUMERIC,
  daily_orders INT,
  order_date DATE
) AS $$
SELECT
  SUM(total) as daily_revenue,
  COUNT(*) as daily_orders,
  DATE(created_at) as order_date
FROM orders
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY order_date DESC;
$$ LANGUAGE SQL;
```

### 7.2 Real-Time Channels

**Channel Name**: `orders`

**Events**:
- INSERT: New order placed
- UPDATE: Order status changed
- DELETE: Order cancelled (future feature)

---

## 8. DEPLOYMENT CHECKLIST

- [ ] Supabase project created and configured
- [ ] PostgreSQL tables and RLS policies implemented
- [ ] Auth users created (admin + test customer)
- [ ] Environment variables set (.env.local):
  ```
  VITE_SUPABASE_URL=https://xxxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=xxxxx
  ```
- [ ] SignIn page functional with Supabase Auth
- [ ] Customer can place order → Appears in admin dashboard (realtime)
- [ ] Admin can update order status → Status updates in realtime
- [ ] Both storefront and admin deployed (Vercel recommended)

---

## 9. FUTURE ENHANCEMENTS

1. **Push Notifications**: Notify customers of order status updates via Supabase notifications or Firebase Cloud Messaging
2. **Order Tracking Map**: Real-time GPS tracking for delivery orders (integrate Google Maps API)
3. **Payment Integration**: Stripe/Razorpay for payment processing
4. **Review System**: Customers rate orders and food items
5. **Multi-Restaurant**: Extend to multiple restaurant locations
6. **Analytics Dashboard**: Detailed reports, charts, and business insights
7. **Inventory Management**: Track ingredients, warn when low stock
8. **Email/SMS Notifications**: Order confirmation, status updates

---

## 10. FILE STRUCTURE REFERENCE

```
src/
├── pages/
│   ├── Index.tsx (Customer homepage)
│   ├── SignIn.tsx (Authentication page)
│   ├── Dashboard.tsx (Admin dashboard)
│   ├── Orders.tsx (Orders grid)
│   └── ...
├── components/
│   ├── Header.tsx (Storefront + Admin nav)
│   ├── CartSidebar.tsx
│   ├── MenuCard.tsx
│   ├── AdminLayout.tsx
│   ├── OrderCard.tsx
│   └── ...
├── context/
│   ├── AdminContext.tsx (Orders, customers, revenue)
│   ├── AuthContext.tsx (User session, role)
│   ├── CartContext.tsx (Cart state)
│   └── ...
├── hooks/
│   ├── useAuth.ts (Authentication hook)
│   ├── useOrdersRealtime.ts (Real-time orders)
│   └── ...
├── lib/
│   ├── supabase.ts (Supabase client)
│   ├── utils.ts (Utilities)
│   └── ...
└── App.tsx
```

---

## 11. TESTING SCENARIOS

**Scenario 1: New Order Placement**
1. Customer fills checkout form
2. Clicks "Place Order"
3. Order appears in admin dashboard immediately (within 1-2 seconds)
4. Admin sees pulsing border on new order card

**Scenario 2: Order Status Update**
1. Admin expands order card
2. Clicks "Accept Order" button
3. Card status badge changes from red to yellow
4. Toast notification appears: "Order accepted!"
5. (Optional) Customer app shows status update in real-time

**Scenario 3: Filter & Search**
1. Admin clicks "New Orders" filter
2. Grid shows only orders with status = 'New'
3. Admin types customer name in search
4. Grid filters to matching orders
5. Admin clicks X to clear search

---

## QUICK START COMMANDS

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with Supabase credentials

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel deploy
```

---

**Version**: 1.0  
**Last Updated**: April 5, 2026  
**Status**: Production-Ready Specification
