# Menu Loading Fix

## Problem
The app was failing to load menu items when Supabase environment variables were not configured, causing the development server to crash.

## Solution
Implemented graceful fallback to local menu data when Supabase is not available:

### Changes Made:

1. **Updated `useMenuItems` hook** (`src/hooks/useMenuItems.ts`):
   - Added fallback to local menu data from `src/data/menuData.ts`
   - Checks if Supabase environment variables are configured
   - Uses fallback data when Supabase is not available or fails to load
   - Clears error state when using fallback data

2. **Updated Supabase configuration** (`src/lib/supabase.ts`):
   - Made configuration more graceful
   - Creates dummy client when not configured
   - Prevents app crashes due to missing environment variables

### How it works:

1. **Development without Supabase**: App uses local menu data automatically
2. **Development with Supabase**: App tries to fetch from Supabase, falls back to local data on failure
3. **Production**: Uses Supabase if configured, otherwise uses local data

### Menu Data Structure:
- **Categories**: Starters, Main Course, Rice & Biryani, Breads, Desserts
- **Items**: 15+ pre-configured menu items with images, descriptions, and prices
- **Images**: Uses Unsplash placeholder images

### To configure Supabase:
Create `.env.local` file with:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

The app will automatically switch to Supabase data when properly configured.
