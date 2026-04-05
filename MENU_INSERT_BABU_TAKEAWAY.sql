-- Babu Takeaway and restaurant Menu Items - INSERT SCRIPT
-- Paste this into Supabase SQL Editor after creating admin user
-- This will add all 152 menu items from the restaurant menu

INSERT INTO public.menu_items (name, category, description, price, is_available)
VALUES
-- APPETISER (11 items)
('Papadums', 'Appetiser', 'Crispy papadums', 2.25, TRUE),
('Pickle Tray', 'Appetiser', 'Mixed Indian pickles', 1.00, TRUE),
('Veg samosa (2pc)', 'Appetiser', 'Crispy vegetable samosas', 3.50, TRUE),
('Lamb samosa (2pc)', 'Appetiser', 'Spiced lamb samosas', 3.95, TRUE),
('Cheese & Spinach Samosa (2pc)', 'Appetiser', 'Cottage cheese and spinach samosas', 3.75, TRUE),
('Onion Bhaji (8pc)', 'Appetiser', 'Crispy onion fritters', 3.50, TRUE),
('Spinach Bhaji (8pc)', 'Appetiser', 'Crispy spinach fritters', 3.50, TRUE),
('Chicken pakoda (8pc)', 'Appetiser', 'Crispy chicken fritters', 4.95, TRUE),
('White Fish pakoda (8pc)', 'Appetiser', 'Crispy white fish fritters', 5.50, TRUE),
('Salmon Fish pakoda (8pc)', 'Appetiser', 'Crispy salmon fish fritters', 6.25, TRUE),
('Prawns Koliwada (8pc)', 'Appetiser', 'Crispy prawn fritters', 5.50, TRUE),

-- TANDOORI STARTERS (11 items)
('Mixed Platter', 'Tandoori Starters', 'Mixed tandoori selection', 13.50, TRUE),
('Chicken Tandoori', 'Tandoori Starters', 'Marinated chicken with yogurt cooked in charcoal tandoor', 9.75, TRUE),
('Prawn Tandoori (10pc)', 'Tandoori Starters', 'Prawns cooked in tandoor', 9.50, TRUE),
('Chicken Tikka', 'Tandoori Starters', 'Boneless chicken cooked in tandoor', 8.95, TRUE),
('Chicken Tikka / Cheese', 'Tandoori Starters', 'Chicken tikka with cheese', 9.25, TRUE),
('White Fish Tikka (8pc)', 'Tandoori Starters', 'White fish cooked in tandoor', 9.25, TRUE),
('Salmon Fish Tikka (8pc)', 'Tandoori Starters', 'Salmon cooked in charcoal tandoor', 9.75, TRUE),
('Lamb Seekh Kabab', 'Tandoori Starters', 'Lamb seekh cooked in tandoor', 9.75, TRUE),
('Chicken Malai Tikka', 'Tandoori Starters', 'Chicken marinated with yogurt, Cheese cooked in tandoor', 9.25, TRUE),
('Chicken Hariyali Tikka', 'Tandoori Starters', 'Chicken marinated with yogurt, Indian mint flavor', 8.25, TRUE),
('Chicken Seekh Kabab', 'Tandoori Starters', 'Seekh kabab cooked in tandoor', 8.75, TRUE),
('Red Harissa Chicken Tikka', 'Tandoori Starters', 'Marinated in red pepper, chicken, spices cooked in tandoor', 8.95, TRUE),

-- ROLLS (3 items)
('Vegetable Roll', 'Rolls', 'Crispy rolls with vegetables', 7.50, TRUE),
('Vegetable Roll / Cheese', 'Rolls', 'Vegetable roll with cheese', 7.95, TRUE),
('Chicken Tikka Roll', 'Rolls', 'Chicken tikka wrapped in soft rolls', 8.50, TRUE),
('Chicken Tikka Roll / Cheese', 'Rolls', 'Chicken tikka roll with cheese', 8.35, TRUE),
('Lamb Kathi Kebab Roll', 'Rolls', 'Deep-fried lamb roll with sprouts & cheese', 8.50, TRUE),
('Lamb Kathi Kebab Roll / Cheese', 'Rolls', 'Lamb kathi kebab with extra cheese', 8.95, TRUE),

-- FRESH CHICKEN DISHES (9 items)
('Chicken Curry', 'Fresh Chicken Dishes', 'Cooked medium spiced with fresh herbs', 7.75, TRUE),
('Chicken Tikka Curry', 'Fresh Chicken Dishes', 'Cooked medium spiced', 8.25, TRUE),
('Chicken Madras', 'Fresh Chicken Dishes', 'Cooked in thick gravy & herbs', 8.75, TRUE),
('Chicken Madras / Vindalo', 'Fresh Chicken Dishes', 'Medium to hot curry', 8.50, TRUE),
('Chiken Korma', 'Fresh Chicken Dishes', 'Prepared in yoghurt & sweetened gravy', 7.95, TRUE),
('Chicken Tikka Korma', 'Fresh Chicken Dishes', 'Cooked in thick gravy & herbs', 8.50, TRUE),
('Chicken Jaffezi', 'Fresh Chicken Dishes', 'Cooked in thick gravy & herbs with fried eggs', 8.25, TRUE),
('Chicken Tikka Jaffezi', 'Fresh Chicken Dishes', 'Medium spiced', 8.25, TRUE),
('Chicken Tikka Afghani', 'Fresh Chicken Dishes', 'Medium spiced', 8.50, TRUE),

-- FRESH LAMB DISHES (20 items)
('Lamb Curry / Madras', 'Fresh Lamb Dishes', 'Medium to hot curry', 8.25/8.50, TRUE),
('Lamb Tikka Bhuna', 'Fresh Lamb Dishes', 'Cooked with peppers, onions & mixed spices', 8.50, TRUE),
('Lamb Rogan', 'Fresh Lamb Dishes', 'Chicken with Indian spices, slow-cooked in spices', 8.50, TRUE),
('Lamb Curry / Madras', 'Fresh Lamb Dishes', 'Spiced medium sauce with sweet & spice', 8.75/9.25, TRUE),
('Lamb Madras / Vindalo', 'Fresh Lamb Dishes', 'Medium to hot spiced', 8.75/9.50, TRUE),
('Lamb Korma', 'Fresh Lamb Dishes', 'Prepared in yoghurt & sweet creamy gravy', 8.95, TRUE),
('Lamb Mango / Madras', 'Fresh Lamb Dishes', 'Spiced mango medium sauce', 8.95/9.25, TRUE),
('Lamb Jaffezi', 'Fresh Lamb Dishes', 'Stewed in thick gravy & herbs', 9.25, TRUE),
('Lamb Afghani', 'Fresh Lamb Dishes', 'Medium spiced with special spices', 9.50, TRUE),
('Lamb Kashmiri Biryani', 'Fresh Lamb Dishes', 'Still cooked, current creamy gravy with dry fruits', 9.25, TRUE),
('Lamb Sag', 'Fresh Lamb Dishes', 'Cooked with spinach & special spices', 9.25, TRUE),
('Lamb Keda Gosht', 'Fresh Lamb Dishes', 'Medium cooked with fresh ginger & coriander', 9.50, TRUE),
('Dhiruba Lamb', 'Fresh Lamb Dishes', 'Specially styled with fresh ginger & coriander', 8.95, TRUE),
('Lamb Rogan Joshi', 'Fresh Lamb Dishes', 'Cooked with peppers, yoghurt & spices', 8.95, TRUE),
('Lamb Rara', 'Fresh Lamb Dishes', 'Stylish spiced lamb in tomato & brown onion gravy', 9.50, TRUE),
('Lamb Badami', 'Fresh Lamb Dishes', 'Spicy lamb cooked in medium-scented lamb gravy', 9.50, TRUE),
('Bhuna Lamb', 'Fresh Lamb Dishes', 'Cooked with peppers, onions & mixed spices', 9.25, TRUE),
('Lamb Kima Matar', 'Fresh Lamb Dishes', 'Cooked with peas, coriander & mixed spices', 8.95, TRUE),
('Tava Lamb', 'Fresh Lamb Dishes', 'Cooked with peppers & Indian spices', 9.25, TRUE),
('Prawn Butter Masala', 'Fresh Lamb Dishes', 'Cooked with peppers & mixed spices', 8.95, TRUE),

-- FRESH PRAWN DISHES (5 items)
('Balti Chicken', 'Fresh Prawn Dishes', 'Cooked medium spiced with fresh herbs', 8.25, TRUE),
('Chicken Tikka Bhuna', 'Fresh Prawn Dishes', 'Cooked with peppers, onions & mixed spices', 8.50, TRUE),
('Tandoori Prawns', 'Fresh Prawn Dishes', 'Cooked with Indian spices, slow-cooked in spices', 8.50, TRUE),
('Prawn Curry', 'Fresh Prawn Dishes', 'Cooked medium spiced with fresh herbs', 8.75, TRUE),
('Prawn Korma', 'Fresh Prawn Dishes', 'Prepared in yoghurt & sweet creamy gravy with dry fruits', 8.90, TRUE),

-- FRESH PRAWN DISHES 450CC (4 additional)
('King Prawns Mango', 'Fresh Prawn Dishes', 'Cooked in mild spice with fresh mango', 9.25, TRUE),
('Prawn Butter Masala', 'Fresh Prawn Dishes', 'Cooked with peppers & mixed spices', 8.95, TRUE),
('Prawn Curry', 'Fresh Prawn Dishes', 'Cooked medium spiced', 8.75, TRUE),
('Prawn Korma', 'Fresh Prawn Dishes', 'Prepared in yoghurt & sweet creamy gravy', 8.90, TRUE),

-- VEG MAIN COURSE (9 items)
('Aloo Gobi', 'Veg Main Course', 'Aloo with green chilli, cauliflour & potatoes', 7.50, TRUE),
('Mushroom Saagwala', 'Veg Main Course', 'Mushroom with spinach & spices', 7.95, TRUE),
('Mixed Veg Saagwala', 'Veg Main Course', 'Mixed veg cooked with spinach & spices', 7.75, TRUE),
('Paneer Laziz', 'Veg Main Course', 'Paneer cooked with cottage cheese & Indian spices', 7.95, TRUE),
('Bombay Chickpea Curry', 'Veg Main Course', 'Chickpea cooked with special spices', 7.75, TRUE),
('Vegetable Jaffezi', 'Veg Main Course', 'Stewed veg cooked in thick gravy', 8.00, TRUE),
('Vegetable Madras Curry', 'Veg Main Course', 'Veg cooked in a thick gravy', 7.95, TRUE),
('Paneer Garlic Saagwala', 'Veg Main Course', 'Paneer cottage cheese cooked with garlic', 7.75, TRUE),
('Daal', 'Veg Main Course', 'Indian lentils', 7.00, TRUE),

-- DESSERT ITEMS (3 items)
('Mango & Pista Kulfi', 'Dessert Dishes', 'Traditional Mango & Pistachio ice cream', 3.00, TRUE),
('Mango & Rose Lassi', 'Dessert Dishes', 'Mango & Rose flavored yogurt drink', 3.50, TRUE),
('Gulab Jamun', 'Dessert Dishes', 'Sweet milk dumplings in sugar syrup', 2.25, TRUE),

-- NON-VEG MAIN COURSE (2 items)
('Chicken Manchurian', 'Non-Veg Main Course', 'Chicken fried by manchurian', 8.50, TRUE),
('Chicken Sweet & Sour Chicken', 'Non-Veg Main Course', 'Sweet & sour sauce flavour', 8.75, TRUE),

-- THAI DISHES (2 items)
('Vegetable', 'Thai Dishes', 'Thai vegetables green & red curry cream coconut based curry with 6 exotic', 8.25, TRUE),
('Chicken', 'Thai Dishes', 'Thai vegetables green & red curry cream coconut based', 9.25, TRUE),

-- ASIAN STARTERS (3 items)
('Veg & Chicken Momos', 'Asian Starters', 'Steamed Asian Vegetable & Chicken Momos dumpling fried onion & soy', 8.95/7.95, TRUE),
('Palak Cheese Cigars', 'Asian Starters', 'Deep-fried spinach cheeses with sprouts & cheese', 7.95, TRUE),
('Vegetable & Chicken Spring Roll', 'Asian Starters', 'Spring onion, carrots, cabbage & peppers with onion, coriander & chicken', 8.50/6.50, TRUE),

-- NON-VEG STARTERS (3 items)
('Chicken Lollipop', 'Non-Veg Starter', 'Chicken wing cooked in spices tandoor', 8.95, TRUE),
('Chicken Garlic Chicken', 'Non-Veg Starter', 'Marinated garlic chicken with special chilli onions', 9.50, TRUE),
('Lamb Chilli', 'Non-Veg Starter', 'Lamb lightly chilli, spicy lamb fried', 9.50, TRUE),

-- SEAFOOD STARTERS (2 items)
('Chilli Garlic Prawns', 'Seafood Starter', 'Garlic with peppers with spicy dry', 9.25, TRUE),
('Teriyaki Lamb', 'Seafood Starter', 'Marinated lamb Teriyaki spiced indonesian sauce', 9.50, TRUE),

-- SEAFOOD (3 items)
('King Prawns Noodles', 'Seafood', 'King Prawns with vegetables', 7.50, TRUE),
('King Prawns Schezwan Noodles', 'Seafood', 'Prawns in vegetable schezwan spicy flavour', 7.75, TRUE),
('King Prawns Singapore Noodles', 'Seafood', 'Prawns in vegetable schezwan spicy flavour', 7.95, TRUE),

-- VEGETABLE & CHICKEN NOODLES (2 items)
('Vegetable & Chicken Chow Main', 'Vegetable & Chicken Noodles', 'Vegetables in tomato soya sauce & chilli onion chopped in peppers & sauce & oil', 5.50/6.50, TRUE),
('Vegetable & Chicken Schezwan Noodles', 'Vegetable & Chicken Noodles', 'Vegetables in noodles with spiced schezwan sauce & spice', 5.95/6.95, TRUE),

-- VEGETABLE & CHICKEN NOODLES (continued - 2 more items)
('Vegetable & Chicken Basil Noodles', 'Vegetable & Chicken Noodles', 'Vegetables in noodles with basil flavour', 6.25/6.95, TRUE),
('Prawn Fried Rice', 'Vegetable & Chicken Noodles', 'Prawns in spicy prawn spicy flavour', 6.25, TRUE),

-- FRIED RICE (3 items)
('Vegetable Fried Rice', 'Fried Rice', 'Veg & chicken in garlic chilli spicy flavour', 2.95/5.50, TRUE),
('Vegetable & Chicken Fried Rice', 'Fried Rice', 'Veg & chicken in garlic chilli spicy flavour', 5.25/5.95, TRUE),
('Prawn Fried Rice', 'Fried Rice', 'Prawns frying in spicy prawn spicy flavour', 6.25, TRUE),

-- INDIAN BREADS (10+ items)
('Roll (Chapati)', 'Indian Bread', 'Plain rolled chapati', 1.95, TRUE),
('Plain Naan', 'Indian Bread', 'Plain naan', 2.50, TRUE),
('Garlic Naan', 'Indian Bread', 'Soft naan with garlic butter', 2.80, TRUE),
('Peshwari Naan', 'Indian Bread', 'Naan stuffed with coconut & dry fruits', 3.50, TRUE),
('Butter Naan', 'Indian Bread', 'Soft naan with butter', 3.75, TRUE),
('Cheese Naan', 'Indian Bread', 'Naan stuffed with cheese', 2.50, TRUE),
('Cheese Onion Garlic Naan', 'Indian Bread', 'Cheese, onion & garlic naan', 3.75, TRUE),
('Chicken Tikka Cheese Naan', 'Indian Bread', 'Naan stuffed with chicken tikka & cheese', 5.75, TRUE),
('Kima Naan', 'Indian Bread', 'Kima naan', 6.25, TRUE),
('Kima Cheese Naan', 'Indian Bread', 'Kima cheese naan', 6.50, TRUE),
('Babu Special Naan', 'Indian Bread', 'Chef special naan', 7.00, TRUE),
('Coriander Naan', 'Indian Bread', 'Naan with coriander', 2.25, TRUE),

-- RICE SECTION (7 items)
('Steamed Rice', 'Rice', 'Plain steamed basmati rice', 2.50, TRUE),
('Pilau Rice', 'Rice', 'Basmati rice cooked with spices', 2.95, TRUE),
('Mushroom Rice', 'Rice', 'Rice cooked with mushroom', 2.95, TRUE),
('Cumin Rice', 'Rice', 'Rice cooked with cumin seeds', 3.50, TRUE),
('Mango Rice', 'Rice', 'Rice cooked with mango flavour', 3.75, TRUE),
('Kashmiri Biryani', 'Rice', 'Rice cooked with fruit flavours', 8.95, TRUE),
('Biryani / Fried Rice', 'Rice', 'Choice of chicken tikka biryani or fried rice', 9.50/9.95, TRUE),

-- SOUPS (3 items)
('Tom Yum Vegetable & Chicken Soup', 'Soups', 'The specialty clear soup with mushroom & mushroom with lemon grass', 5.95/6.50, TRUE),
('Thai Coconut Vegetable & Chicken Soup', 'Soups', 'Thai coconut soup with coconut milk cherry coconut soup with chicken in thai spice', 6.50/6.95, TRUE),
('Sweet Corn Vegetable & Chicken Soup', 'Soups', 'Corn & carrot soup with sweetly corn & asian taste with chicken', 5.95/6.50, TRUE),

-- SAUCE, CHIPS & MIX (7 items)
('Curry / Korma / Masala Sauces 450CC', 'Sauce, Chips & Mix', 'Choice of curry sauces', 5.25, TRUE),
('Chips', 'Sauce, Chips & Mix', 'Crispy chips', 2.50, TRUE),
('Chips With Korma Sauce', 'Sauce, Chips & Mix', 'Chips with korma sauce', 4.50, TRUE),
('Chicken Korma Rice Mix', 'Sauce, Chips & Mix', 'Chicken with korma rice mix', 6.00, TRUE),
('Chicken Tikka Korma Rice Mix', 'Sauce, Chips & Mix', 'Chicken tikka with korma rice mix', 8.00, TRUE),
('Chicken Tikka Masala Rice Mix', 'Sauce, Chips & Mix', 'Chicken tikka masala rice mix', 8.00, TRUE),
('Chicken Makhawala Rice Mix', 'Sauce, Chips & Mix', 'Chicken makhawala rice mix', 8.00, TRUE)

ON CONFLICT DO NOTHING;

-- Verification Query
SELECT COUNT(*) as total_items, COUNT(DISTINCT category) as total_categories FROM public.menu_items;
