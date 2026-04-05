# Babu Takeaway - Full Implementation Guide

## Quick Setup (5 Minutes)

### 1. Clone & Install
```bash
git clone <repo-url>
cd hungry-dash-order-main
npm install
```

### 2. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details
4. Copy your `Supabase URL` and `Anon Key`

### 3. Set Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Setup Database
1. Open Supabase Dashboard → SQL Editor
2. Copy entire contents of `DATABASE_SCHEMA.sql`
3. Paste into SQL Editor and run
4. Database tables, policies, and seed data are now ready!

### 5. Start Development
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Architecture Walkthrough

### Customer Flow
```
Homepage (/) 
  ↓
Select items → Add to Cart
  ↓
Toggle Delivery/Takeaway
  ↓
Click "Proceed to Checkout"
  ↓
Fill customer form (Name, Phone, Address)
  ↓
Click "Place Order"
  ↓
Order created in Supabase (status: 'New')
  ↓
Success animation + Order ID shown
  ↓
Admin Dashboard instantly sees new card (realtime)
```

### Admin Flow
```
Sign In (/login)
  ↓
Enter admin email/password
  ↓
Redirect to /admin/orders
  ↓
See live order feed in card grid
  ↓
Click card to expand → See full details
  ↓
Click "Accept" button
  ↓
Order status changes to 'Accepted' (realtime)
  ↓
Card updates instantly (all admin browsers see it)
```

---

## Key Components

### Client-Side
| Component | Path | Purpose |
|-----------|------|---------|
| Header | `src/components/Header.tsx` | Navigation, Delivery/Takeaway toggle, Admin link |
| MenuSection | `src/components/MenuSection.tsx` | Display food items in grid |
| CartSidebar | `src/components/CartSidebar.tsx` | Shopping cart (desktop/mobile) |
| CheckoutSection | `src/components/CheckoutSection.tsx` | Order form (name, phone, address) |

### Admin-Side
| Component | Path | Purpose |
|-----------|------|---------|
| AdminLayout | `src/components/AdminLayout.tsx` | Sidebar + top nav layout |
| Orders | `src/pages/Orders.tsx` | Live order feed (card grid) |
| Dashboard | `src/pages/Dashboard.tsx` | Analytics & KPIs |

### Authentication
| File | Path | Purpose |
|------|------|---------|
| AuthContext | `src/context/AuthContext.tsx` | User session management |
| SignIn | `src/pages/SignIn.tsx` | Login page |
| supabase.ts | `src/lib/supabase.ts` | Supabase client init |

### Real-Time
| Hook | Path | Purpose |
|------|------|---------|
| useOrdersRealtime | `src/hooks/useOrdersRealtime.ts` | Listen for order changes |

---

## Testing Checklist

### ✅ Customer Order Placement
- [ ] Visit homepage
- [ ] Add items to cart
- [ ] Select Delivery or Takeaway
- [ ] Fill checkout form
- [ ] Click "Place Order"
- [ ] See success message with Order ID

### ✅ Admin Real-Time Updates
- [ ] Two browser windows open: one on homepage, one in /admin
- [ ] Place order from customer window
- [ ] New order card appears in admin window within 1-2 seconds
- [ ] New card has pulsing border (animate-pulse)

### ✅ Order Status Workflow
- [ ] Admin clicks order card to expand
- [ ] Sees "Accept" button
- [ ] Clicks "Accept Order"
- [ ] Card status badge changes Red → Yellow
- [ ] Toast notification appears: "Order accepted!"

### ✅ Filters & Search
- [ ] Click "New Orders" filter
- [ ] See only orders with status='New'
- [ ] Type customer name in search
- [ ] Grid filters in real-time
- [ ] Click X to clear search

### ✅ Responsive Design
- [ ] Test on mobile (DevTools)
- [ ] Cart appears as bottom-sheet drawer
- [ ] Orders grid shows 1 column on mobile
- [ ] All buttons clickable and responsive

---

## Folder Structure

```
hungry-dash-order-main/
├── src/
│   ├── pages/
│   │   ├── Index.tsx (Customer homepage)
│   │   ├── SignIn.tsx (Login page)
│   │   ├── Dashboard.tsx (Admin dashboard)
│   │   ├── Orders.tsx (Order grid)
│   │   ├── Customers.tsx
│   │   ├── MenuManagement.tsx
│   │   ├── Settings.tsx
│   │   └── NotFound.tsx
│   │
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── MenuCard.tsx
│   │   ├── MenuSection.tsx
│   │   ├── CartSidebar.tsx
│   │   ├── CheckoutSection.tsx
│   │   ├── AdminLayout.tsx
│   │   ├── AdminLayout.tsx
│   │   ├── RecentOrdersTable.tsx
│   │   ├── PerformanceGauge.tsx
│   │   ├── TopSellingItems.tsx
│   │   ├── NavLink.tsx
│   │   └── ui/ (Shadcn components)
│   │
│   ├── context/
│   │   ├── AuthContext.tsx (NEW - Authentication state)
│   │   ├── AdminContext.tsx (Orders, customers, revenue)
│   │   └── CartContext.tsx (Shopping cart state)
│   │
│   ├── hooks/
│   │   ├── useOrdersRealtime.ts (NEW - Real-time sync)
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── lib/
│   │   ├── supabase.ts (NEW - Supabase client)
│   │   └── utils.ts
│   │
│   ├── data/
│   │   └── menuData.ts
│   │
│   ├── test/
│   ├── assets/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── App.css
│
├── public/
├── MASTER_PROMPT.md (NEW - Complete specification)
├── DATABASE_SCHEMA.sql (NEW - SQL setup script)
├── IMPLEMENTATION_GUIDE.md (NEW - This file)
├── .env.example (NEW - Env template)
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.ts
```

---

## Environment Variables Reference

Create `.env.local` based on `.env.example`:

```env
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional
VITE_APP_NAME=Babu Takeaway
VITE_APP_URL=http://localhost:5173
```

**Where to find these:**
1. Supabase Dashboard → Settings → API
2. Copy "Project URL" → `VITE_SUPABASE_URL`
3. Copy "anon public" key → `VITE_SUPABASE_ANON_KEY`

---

## Supabase Setup Step-by-Step

### Step 1: Create Project
1. Visit [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Choose organization
4. Project Name: `babu-takeaway`
5. Database Password: Create strong password (save it!)
6. Region: Choose closest to your location
7. Click "Create new project" (wait 2-3 minutes)

### Step 2: Get API Keys
1. Project Dashboard → Settings → API
2. Copy "Project URL"
3. Copy "anon public" key
4. Save to `.env.local`

### Step 3: Create Database Tables
1. SQL Editor → New Query
2. Copy entire `DATABASE_SCHEMA.sql`
3. Paste into editor
4. Click "Run"
5. Wait for completion

### Step 4: Create Auth Users
1. Auth → Users
2. Click "Invite user" or "Add user"
3. Admin account:
   - Email: `admin@babu.com`
   - Password: `SecurePassword123!`
   - Role: (set via SQL after)
4. Test customer account:
   - Email: `customer@test.com`
   - Password: `TestPassword123!`

### Step 5: Update Admin User Role (SQL)
```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@babu.com';
```

---

## Common Issues & Solutions

### "Missing Supabase environment variables"
**Solution**: Check `.env.local` file exists and has correct URLs/keys

### "Auth users not syncing to users table"
**Solution**: Manual SQL entry needed:
```sql
INSERT INTO public.users (id, email, full_name, role)
VALUES (
  'user-id-from-auth',
  'email@example.com',
  'Full Name',
  'admin'
);
```

### "Orders not appearing in admin dashboard"
**Solution**: 
- Check Supabase Realtime is enabled (Settings → Realtime)
- Verify RLS policies are correctly applied
- Check browser console for errors

### "Login redirects to homepage instead of admin"
**Solution**: Check user role is set to 'admin' in `users` table:
```sql
SELECT * FROM public.users WHERE email = 'admin@babu.com';
```

---

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

### Environment Variables on Vercel
1. Project Settings → Environment Variables
2. Add `VITE_SUPABASE_URL`
3. Add `VITE_SUPABASE_ANON_KEY`
4. Redeploy

### Production Domain
After deployment, update Supabase Auth:
1. Auth → Redirect URLs
2. Add your Vercel domain
3. Save

---

## API Reference

### Create Order (Customer)
```ts
const { data, error } = await supabase
  .from('orders')
  .insert([{
    customer_id: user.id,
    customer_name: 'John Doe',
    customer_phone: '9876543210',
    order_type: 'Delivery',
    items: [{name: 'Pizza', quantity: 1, price: 12.99}],
    total: 12.99,
    status: 'New'
  }]);
```

### Update Order Status (Admin)
```ts
const { data, error } = await supabase
  .from('orders')
  .update({ status: 'Accepted' })
  .eq('id', orderId);
```

### Subscribe to Real-Time Orders
```ts
const subscription = supabase
  .channel('orders-realtime')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'orders' },
    (payload) => console.log(payload)
  )
  .subscribe();
```

---

## Monitoring & Analytics

**Get Daily Revenue** (SQL):
```sql
SELECT * FROM get_daily_revenue();
```

**Get Orders by Status** (SQL):
```sql
SELECT * FROM get_orders_by_status();
```

**Get Top Selling Items** (SQL):
```sql
SELECT * FROM get_top_selling_items(5);
```

---

## Next Steps: Advanced Features

1. **Push Notifications**
   - Firebase Cloud Messaging for order status updates
   - Browser notifications (Permissions API)

2. **Payment Processing**
   - Stripe integration for payments
   - Store payment methods securely

3. **Order Tracking**
   - Real-time GPS tracking for deliveries
   - Google Maps integration
   - ETA calculations

4. **Analytics Dashboard**
   - Charts with Recharts (already integrated!)
   - Business metrics and reports
   - Customer insights

5. **Multi-Location**
   - Support multiple restaurant branches
   - Location-based menu variations
   - Area-based delivery zones

6. **Inventory Management**
   - Track ingredient stock
   - Auto-disable items when out of stock
   - Supplier integration

---

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **React Router**: https://reactrouter.com
- **Tailwind CSS**: https://tailwindcss.com
- **Shadcn UI**: https://ui.shadcn.com
- **TypeScript**: https://www.typescriptlang.org

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | April 5, 2026 | Initial release with authentication and real-time orders |

---

**Happy building! 🍕🎉**
