// src/lib/seedData.ts
import { MenuItem, Category, Offer, SiteSettings, Testimonial } from "@/types";

export const FOOD_IMAGES: Record<string, string> = {
  "egg-curry": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80",
  "chicken-curry": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80",
  "paneer-bhurji": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80",
  "dal-tadka": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80",
  "mix-veg": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  "chole": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
  "chole-poori": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80",
  "dal-rice": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  "chicken-meal": "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80",
  "paneer-meal": "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400&q=80",
  "jeera-rice": "https://images.unsplash.com/photo-1536304993881-ff86e0c9b55b?w=400&q=80",
  "plain-rice": "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&q=80",
  "roti": "https://images.unsplash.com/photo-1604908177453-7462950a6a3b?w=400&q=80",
  "butter-roti": "https://images.unsplash.com/photo-1635321593217-40050ad13c74?w=400&q=80",
  "poori": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80",
  "lassi": "https://images.unsplash.com/photo-1571006682272-b4ba31a6a13b?w=400&q=80",
  "chaas": "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80",
  "cold-drink": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
  "gulab-jamun": "https://images.unsplash.com/photo-1666427760753-f3ee5a6c0d37?w=400&q=80",
  "kheer": "https://images.unsplash.com/photo-1571114832699-69bfcb434b1a?w=400&q=80",
};

export const seedMenuItems: Omit<MenuItem, "id">[] = [
  // Main Course
  { name: "Egg Curry", description: "Slow-cooked eggs in rich masala gravy with aromatic spices", price: 149, category: "main-course", imageUrl: FOOD_IMAGES["egg-curry"], type: "egg", isBestseller: true, isSpicy: true, inStock: true },
  { name: "Chicken Curry", description: "Tender chicken pieces in our signature house-made curry base", price: 249, category: "main-course", imageUrl: FOOD_IMAGES["chicken-curry"], type: "non-veg", isBestseller: true, isSpicy: true, inStock: true },
  { name: "Paneer Bhurji", description: "Crumbled cottage cheese with onions, tomatoes and spices", price: 179, category: "main-course", imageUrl: FOOD_IMAGES["paneer-bhurji"], type: "veg", isBestseller: true, isSpicy: false, inStock: true },
  { name: "Dal Tadka", description: "Yellow lentils tempered with ghee, cumin and dry red chillies", price: 129, category: "main-course", imageUrl: FOOD_IMAGES["dal-tadka"], type: "veg", isBestseller: false, isSpicy: false, inStock: true },
  { name: "Mix Veg", description: "Seasonal vegetables cooked in a mildly spiced gravy", price: 149, category: "main-course", imageUrl: FOOD_IMAGES["mix-veg"], type: "veg", isBestseller: false, isSpicy: false, inStock: true },
  { name: "Chole", description: "Punjabi-style chickpeas cooked with whole spices and tangy tomatoes", price: 119, category: "main-course", imageUrl: FOOD_IMAGES["chole"], type: "veg", isBestseller: false, isSpicy: true, inStock: true },
  // Combos
  { name: "Chole Poori Combo", description: "Fluffy deep-fried pooris with spicy Punjabi chole — a match made in heaven", price: 149, category: "combos", imageUrl: FOOD_IMAGES["chole-poori"], type: "veg", isBestseller: true, isSpicy: true, inStock: true },
  { name: "Dal Tadka Rice Combo", description: "Comforting dal tadka paired with aromatic jeera rice and a papad", price: 169, category: "combos", imageUrl: FOOD_IMAGES["dal-rice"], type: "veg", isBestseller: false, isSpicy: false, inStock: true },
  { name: "Chicken Curry Meal", description: "Chicken curry with 3 rotis, rice and a refreshing raita", price: 299, category: "combos", imageUrl: FOOD_IMAGES["chicken-meal"], type: "non-veg", isBestseller: true, isSpicy: true, inStock: true },
  { name: "Paneer Bhurji Meal", description: "Paneer bhurji with 3 rotis, rice and pickle — a complete desi meal", price: 249, category: "combos", imageUrl: FOOD_IMAGES["paneer-meal"], type: "veg", isBestseller: false, isSpicy: false, inStock: true },
  // Rice
  { name: "Jeera Rice", description: "Fragrant basmati rice tempered with cumin seeds and ghee", price: 99, category: "rice", imageUrl: FOOD_IMAGES["jeera-rice"], type: "veg", isBestseller: false, isSpicy: false, inStock: true },
  { name: "Plain Rice", description: "Steamed long-grain basmati rice, light and fluffy", price: 79, category: "rice", imageUrl: FOOD_IMAGES["plain-rice"], type: "veg", isBestseller: false, isSpicy: false, inStock: true },
  // Bread
  { name: "Plain Roti", description: "Soft whole-wheat roti made fresh on tawa", price: 20, category: "bread", imageUrl: FOOD_IMAGES["roti"], type: "veg", isBestseller: false, isSpicy: false, inStock: true },
  { name: "Butter Roti", description: "Fresh tawa roti generously slathered with homemade white butter", price: 30, category: "bread", imageUrl: FOOD_IMAGES["butter-roti"], type: "veg", isBestseller: false, isSpicy: false, inStock: true },
  { name: "Poori", description: "Golden puffed deep-fried bread, crispy outside and soft inside", price: 20, category: "bread", imageUrl: FOOD_IMAGES["poori"], type: "veg", isBestseller: false, isSpicy: false, inStock: true },
  // Beverages
  { name: "Sweet Lassi", description: "Thick chilled yogurt drink, sweet and refreshing with a hint of cardamom", price: 80, category: "beverages", imageUrl: FOOD_IMAGES["lassi"], type: "veg", isBestseller: true, isSpicy: false, inStock: true },
  { name: "Masala Chaas", description: "Spiced thin buttermilk with cumin, mint and coriander — a digestive delight", price: 50, category: "beverages", imageUrl: FOOD_IMAGES["chaas"], type: "veg", isBestseller: false, isSpicy: false, inStock: true },
  { name: "Cold Drink", description: "Chilled aerated soft drink — Coke, Pepsi or Sprite as available", price: 40, category: "beverages", imageUrl: FOOD_IMAGES["cold-drink"], type: "veg", isBestseller: false, isSpicy: false, inStock: true },
  // Desserts
  { name: "Gulab Jamun", description: "Soft milk-solid dumplings soaked in rose-scented sugar syrup", price: 60, category: "desserts", imageUrl: FOOD_IMAGES["gulab-jamun"], type: "veg", isBestseller: false, isSpicy: false, inStock: true },
  { name: "Kheer", description: "Creamy slow-cooked rice pudding with saffron, cardamom and nuts", price: 70, category: "desserts", imageUrl: FOOD_IMAGES["kheer"], type: "veg", isBestseller: false, isSpicy: false, inStock: true },
];

export const seedCategories: Omit<Category, "id">[] = [
  { name: "Main Course", icon: "🍛", order: 1 },
  { name: "Combos", icon: "🥘", order: 2 },
  { name: "Rice", icon: "🍚", order: 3 },
  { name: "Roti / Bread", icon: "🫓", order: 4 },
  { name: "Beverages", icon: "🥛", order: 5 },
  { name: "Desserts", icon: "🍮", order: 6 },
];

export const seedOffers: Omit<Offer, "id">[] = [
  { text: "🎉 Free Sweet Lassi on orders above ₹399", isActive: true, order: 1 },
  { text: "🔥 Buy 2 Meals Get 1 Drink Free", isActive: true, order: 2 },
  { text: "🍗 Weekend Chicken Combo Special — Order Now!", isActive: true, order: 3 },
  { text: "⚡ Free Delivery on your first order!", isActive: true, order: 4 },
];

export const seedSettings: SiteSettings = {
  whatsappNumber: "919876543210",
  instagramUrl: "https://instagram.com/desikitchen",
  address: "123, Food Street, Flavour Nagar, Mumbai - 400001",
  kitchenTiming: "10:00 AM – 10:00 PM",
  deliveryTiming: "11:00 AM – 9:30 PM",
};

export const seedTestimonials: Omit<Testimonial, "id">[] = [
  { name: "Priya Sharma", rating: 5, review: "The Chicken Curry is absolutely divine! Tastes exactly like my mom used to make. I order at least twice a week now. The packaging is so neat and food arrives piping hot!" },
  { name: "Rahul Verma", rating: 5, review: "Tried the Dal Tadka Rice Combo — value for money is unbeatable. The rotis are so soft, feels like homemade. Desi Kitchen is now my go-to for lunch every day." },
  { name: "Ananya Patel", rating: 5, review: "The Sweet Lassi is the best I've had outside of Punjab! Thick, creamy, and just the right sweetness. The Chole Poori Combo is also a must-try. Highly recommended!" },
  { name: "Mohammed Khan", rating: 5, review: "Paneer Bhurji here is incredibly flavourful. The spice levels are perfect. Great quality food at very reasonable prices. Delivery was super fast too!" },
];

export const CATEGORIES_MAP: Record<string, string> = {
  "main-course": "Main Course",
  "combos": "Combos",
  "rice": "Rice",
  "bread": "Roti / Bread",
  "beverages": "Beverages",
  "desserts": "Desserts",
};

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";
