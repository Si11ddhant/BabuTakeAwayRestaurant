-- Babu Takeaway and restaurant - Menu Items Migration Script
-- Run this SQL in Supabase SQL Editor to populate menu_items table

-- Insert Menu Items
INSERT INTO public.menu_items (name, category, description, price, image_url, is_available)
VALUES
  -- STARTERS
  ('Paneer Tikka', 'Starters', 'Smoky cottage cheese cubes marinated in spiced yogurt, grilled to perfection', 249, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop', TRUE),
  ('Chicken 65', 'Starters', 'Crispy deep-fried chicken with curry leaves and fiery red chili glaze', 279, 'https://images.unsplash.com/photo-1610057099443-fde6c99db9e1?w=400&h=300&fit=crop', TRUE),
  ('Vegetable Samosa', 'Starters', 'Golden crispy pastry filled with spiced potatoes and green peas', 129, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop', TRUE),
  ('Tandoori Prawns', 'Starters', 'Jumbo prawns marinated in tandoori spices, chargrilled with lemon', 399, 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=400&h=300&fit=crop', TRUE),

  -- MAIN COURSE
  ('Butter Chicken', 'Main Course', 'Tender chicken in a rich, creamy tomato-butter sauce with kasuri methi', 349, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop', TRUE),
  ('Palak Paneer', 'Main Course', 'Cottage cheese cubes in a velvety spinach gravy with subtle spices', 279, 'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?w=400&h=300&fit=crop', TRUE),
  ('Lamb Rogan Josh', 'Main Course', 'Slow-cooked lamb in an aromatic Kashmiri chili and yogurt gravy', 429, 'https://images.unsplash.com/photo-1545247181-516773cae754?w=400&h=300&fit=crop', TRUE),
  ('Dal Makhani', 'Main Course', 'Black lentils simmered overnight with butter and cream, rich and smoky', 229, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', TRUE),

  -- RICE & BIRYANI
  ('Hyderabadi Chicken Biryani', 'Rice & Biryani', 'Fragrant basmati rice layered with spiced chicken, saffron and fried onions', 329, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop', TRUE),
  ('Vegetable Biryani', 'Rice & Biryani', 'Aromatic basmati rice with garden fresh vegetables and whole spices', 249, 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400&h=300&fit=crop', TRUE),
  ('Jeera Rice', 'Rice & Biryani', 'Fluffy basmati rice tempered with cumin seeds and ghee', 149, 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&h=300&fit=crop', TRUE),

  -- BREADS
  ('Garlic Naan', 'Breads', 'Soft leavened bread topped with garlic butter and fresh coriander', 69, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop', TRUE),
  ('Butter Roti', 'Breads', 'Whole wheat flatbread brushed with pure desi ghee', 39, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop', TRUE),
  ('Cheese Kulcha', 'Breads', 'Stuffed naan filled with melted cheese and herbs, baked in tandoor', 89, 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop', TRUE),

  -- DESSERTS
  ('Gulab Jamun', 'Desserts', 'Soft milk dumplings soaked in rose-flavored sugar syrup, served warm', 99, 'https://images.unsplash.com/photo-1666190077619-601a5e567fe1?w=400&h=300&fit=crop', TRUE),
  ('Rasmalai', 'Desserts', 'Delicate cottage cheese patties in saffron-cardamom flavored cream', 129, 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400&h=300&fit=crop', TRUE),
  ('Kulfi Falooda', 'Desserts', 'Traditional Indian ice cream with vermicelli, rose syrup and nuts', 149, 'https://images.unsplash.com/photo-1571006917203-0d8e2a530b1d?w=400&h=300&fit=crop', TRUE)
ON CONFLICT DO NOTHING;

-- Verify data was inserted
SELECT COUNT(*) as total_items, COUNT(DISTINCT category) as total_categories 
FROM public.menu_items 
WHERE is_available = TRUE;
