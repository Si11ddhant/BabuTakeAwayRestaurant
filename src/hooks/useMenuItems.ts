import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_available: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🍽️ Fetching menu items from Supabase with new schema...');

      const { data, error: fetchError } = await supabase
        .from('menu_items')
        .select('id, name, category, description, price, image_url, is_available, created_at, updated_at')
        .eq('is_available', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (fetchError) {
        console.error('❌ Supabase Fetch Error Detail:', {
          message: fetchError.message,
          code: fetchError.code,
          details: fetchError.details,
          hint: fetchError.hint
        });
        throw new Error(`Database error: ${fetchError.message}`);
      }

      const items = data || [];
      setMenuItems(items);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(items.map((item) => item.category))
      );
      setCategories(uniqueCategories);
      console.log('🍽️ Menu loaded:', items.length, 'items');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const getItemsByCategory = (category: string): MenuItem[] => {
    return menuItems.filter((item) => item.category === category);
  };

  const getItemById = (id: string): MenuItem | undefined => {
    return menuItems.find((item) => item.id === id);
  };

  return {
    menuItems,
    categories,
    loading,
    error,
    getItemsByCategory,
    getItemById,
    refetch: fetchMenuItems,
  };
};
