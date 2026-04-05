export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  image: string;
};

export const categories = ["Starters", "Main Course", "Rice & Biryani", "Breads", "Desserts"];

export const menuItems: MenuItem[] = [
  // Starters
  { id: "s1", name: "Paneer Tikka", description: "Smoky cottage cheese cubes marinated in spiced yogurt, grilled to perfection", price: 249, category: "Starters", isVeg: true, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop" },
  { id: "s2", name: "Chicken 65", description: "Crispy deep-fried chicken with curry leaves and fiery red chili glaze", price: 279, category: "Starters", isVeg: false, image: "https://images.unsplash.com/photo-1610057099443-fde6c99db9e1?w=400&h=300&fit=crop" },
  { id: "s3", name: "Vegetable Samosa", description: "Golden crispy pastry filled with spiced potatoes and green peas", price: 129, category: "Starters", isVeg: true, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop" },
  { id: "s4", name: "Tandoori Prawns", description: "Jumbo prawns marinated in tandoori spices, chargrilled with lemon", price: 399, category: "Starters", isVeg: false, image: "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=400&h=300&fit=crop" },

  // Main Course
  { id: "m1", name: "Butter Chicken", description: "Tender chicken in a rich, creamy tomato-butter sauce with kasuri methi", price: 349, category: "Main Course", isVeg: false, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop" },
  { id: "m2", name: "Palak Paneer", description: "Cottage cheese cubes in a velvety spinach gravy with subtle spices", price: 279, category: "Main Course", isVeg: true, image: "https://images.unsplash.com/photo-1618449840665-9ed506d73a34?w=400&h=300&fit=crop" },
  { id: "m3", name: "Lamb Rogan Josh", description: "Slow-cooked lamb in an aromatic Kashmiri chili and yogurt gravy", price: 429, category: "Main Course", isVeg: false, image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=400&h=300&fit=crop" },
  { id: "m4", name: "Dal Makhani", description: "Black lentils simmered overnight with butter and cream, rich and smoky", price: 229, category: "Main Course", isVeg: true, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop" },

  // Rice & Biryani
  { id: "r1", name: "Hyderabadi Chicken Biryani", description: "Fragrant basmati rice layered with spiced chicken, saffron and fried onions", price: 329, category: "Rice & Biryani", isVeg: false, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop" },
  { id: "r2", name: "Vegetable Biryani", description: "Aromatic basmati rice with garden fresh vegetables and whole spices", price: 249, category: "Rice & Biryani", isVeg: true, image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400&h=300&fit=crop" },
  { id: "r3", name: "Jeera Rice", description: "Fluffy basmati rice tempered with cumin seeds and ghee", price: 149, category: "Rice & Biryani", isVeg: true, image: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&h=300&fit=crop" },

  // Breads
  { id: "b1", name: "Garlic Naan", description: "Soft leavened bread topped with garlic butter and fresh coriander", price: 69, category: "Breads", isVeg: true, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop" },
  { id: "b2", name: "Butter Roti", description: "Whole wheat flatbread brushed with pure desi ghee", price: 39, category: "Breads", isVeg: true, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop" },
  { id: "b3", name: "Cheese Kulcha", description: "Stuffed naan filled with melted cheese and herbs, baked in tandoor", price: 89, category: "Breads", isVeg: true, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop" },

  // Desserts
  { id: "d1", name: "Gulab Jamun", description: "Soft milk dumplings soaked in rose-flavored sugar syrup, served warm", price: 99, category: "Desserts", isVeg: true, image: "https://images.unsplash.com/photo-1666190077619-601a5e567fe1?w=400&h=300&fit=crop" },
  { id: "d2", name: "Rasmalai", description: "Delicate cottage cheese patties in saffron-cardamom flavored cream", price: 129, category: "Desserts", isVeg: true, image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400&h=300&fit=crop" },
  { id: "d3", name: "Kulfi Falooda", description: "Traditional Indian ice cream with vermicelli, rose syrup and nuts", price: 149, category: "Desserts", isVeg: true, image: "https://images.unsplash.com/photo-1571006917203-0d8e2a530b1d?w=400&h=300&fit=crop" },
];
