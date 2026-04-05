import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { menuItems as fallbackItems, categories as fallbackCategories } from '@/data/menuData';

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_available: boolean | null;
  is_veg: boolean | null;
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
      console.log('🍽️ Fetching menu items from Supabase...');

      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const isDummy = !supabaseUrl || !supabaseKey || supabaseUrl === 'https://xxxxx.supabase.co';
      
      if (isDummy) {
        console.log('🍽️ Supabase not configured, using fallback menu data');
        useFallback();
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (fetchError || !data || data.length === 0) {
        if (fetchError) {
          console.error('❌ Supabase Fetch Error:', fetchError);
        } else {
          console.log('🍽️ Supabase returned no items, using fallback data');
        }
        useFallback();
        return;
      }

      const items = (data || []).map(item => ({
        ...item,
        is_veg: item.is_veg ?? item.isVeg ?? true, // Support both DB column names
      }));
      setMenuItems(items);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(items.map((item) => item.category))
      );
      setCategories(uniqueCategories);
      console.log('🍽️ Menu loaded from Supabase:', items.length, 'items');
    } catch (err) {
      console.error('🍽️ Unexpected error fetching menu, using fallback data:', err);
      useFallback();
    } finally {
      setLoading(false);
    }
  };

  const useFallback = () => {
    setMenuItems(fallbackItems.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image_url: item.image,
      is_available: true,
      is_veg: item.isVeg, // Support both formats
      created_at: null,
      updated_at: null,
    })));
    setCategories(fallbackCategories);
    setLoading(false);
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

  const addMenuItem = async (item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('menu_items')
        .insert(item)
        .select()
        .single();

      if (insertError) throw insertError;
      setMenuItems(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('❌ Error adding menu item:', err);
      throw err;
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      setMenuItems(prev => prev.map(item => item.id === id ? data : item));
      return data;
    } catch (err) {
      console.error('❌ Error updating menu item:', err);
      throw err;
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setMenuItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('❌ Error deleting menu item:', err);
      throw err;
    }
  };

  return {
    menuItems,
    categories,
    loading,
    error,
    getItemsByCategory,
    getItemById,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    refetch: fetchMenuItems,
  };
};
