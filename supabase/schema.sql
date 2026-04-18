-- =============================================================================
-- Desi Kitchen — Supabase Schema
-- Run this entire file in Supabase SQL Editor (Project → SQL Editor → New query)
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 0. Extensions
-- ─────────────────────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Enums
-- ─────────────────────────────────────────────────────────────────────────────
do $$ begin
  create type food_type as enum ('veg', 'non-veg', 'egg');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('pending', 'confirmed', 'delivered');
exception when duplicate_object then null; end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Tables
-- ─────────────────────────────────────────────────────────────────────────────

-- admin_users  (links auth.users → admin role)
create table if not exists admin_users (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  email       text not null,
  created_at  timestamptz not null default now(),
  unique(user_id)
);

-- categories
create table if not exists categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  icon        text not null default '🍽️',
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- menu_items
create table if not exists menu_items (
  id            uuid primary key default uuid_generate_v4(),
  name          text        not null,
  description   text        not null default '',
  price         numeric     not null check (price >= 0),
  category      text        not null,
  image_url     text,
  type          food_type   not null default 'veg',
  is_bestseller boolean     not null default false,
  is_spicy      boolean     not null default false,
  in_stock      boolean     not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- offers  (ticker banner items)
create table if not exists offers (
  id          uuid primary key default uuid_generate_v4(),
  text        text    not null,
  is_active   boolean not null default true,
  sort_order  int     not null default 0,
  created_at  timestamptz not null default now()
);

-- orders
create table if not exists orders (
  id               uuid         primary key default uuid_generate_v4(),
  items            jsonb        not null default '[]',
  total            numeric      not null check (total >= 0),
  customer_name    text,
  customer_address text,
  payment_mode     text,
  status           order_status not null default 'pending',
  created_at       timestamptz  not null default now()
);

-- settings  (single-row site config — enforce via RLS + trigger)
create table if not exists settings (
  id               uuid primary key default uuid_generate_v4(),
  whatsapp_number  text not null default '919876543210',
  instagram_url    text not null default 'https://instagram.com/desikitchen',
  address          text not null default '123, Food Street, Flavour Nagar, Mumbai - 400001',
  kitchen_timing   text not null default '10:00 AM – 10:00 PM',
  delivery_timing  text not null default '11:00 AM – 9:30 PM',
  updated_at       timestamptz not null default now()
);

-- testimonials
create table if not exists testimonials (
  id          uuid primary key default uuid_generate_v4(),
  name        text    not null,
  rating      int     not null check (rating between 1 and 5),
  review      text    not null,
  food_photo  text,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Trigger: auto-update menu_items.updated_at
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_menu_items_updated_at on menu_items;
create trigger set_menu_items_updated_at
  before update on menu_items
  for each row execute function update_updated_at();

drop trigger if exists set_settings_updated_at on settings;
create trigger set_settings_updated_at
  before update on settings
  for each row execute function update_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Helper function: is_admin()
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from admin_users
    where user_id = auth.uid()
  );
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────
alter table admin_users   enable row level security;
alter table categories    enable row level security;
alter table menu_items    enable row level security;
alter table offers        enable row level security;
alter table orders        enable row level security;
alter table settings      enable row level security;
alter table testimonials  enable row level security;

-- Drop existing policies first (idempotent re-runs)
do $$ declare r record; begin
  for r in select policyname, tablename from pg_policies
    where schemaname = 'public'
  loop
    execute format('drop policy if exists %I on %I', r.policyname, r.tablename);
  end loop;
end $$;

-- admin_users: only admin can read/write
create policy "admin_users: admin full access"
  on admin_users for all using (is_admin()) with check (is_admin());

-- categories: public read, admin write
create policy "categories: public read"
  on categories for select using (true);
create policy "categories: admin write"
  on categories for all using (is_admin()) with check (is_admin());

-- menu_items: public read, admin write
create policy "menu_items: public read"
  on menu_items for select using (true);
create policy "menu_items: admin write"
  on menu_items for all using (is_admin()) with check (is_admin());

-- offers: public read, admin write
create policy "offers: public read"
  on offers for select using (true);
create policy "offers: admin write"
  on offers for all using (is_admin()) with check (is_admin());

-- orders: anyone can INSERT (WhatsApp cart checkout), admin can read/update
create policy "orders: public insert"
  on orders for insert with check (true);
create policy "orders: admin read update"
  on orders for select using (is_admin());
create policy "orders: admin update"
  on orders for update using (is_admin()) with check (is_admin());
create policy "orders: admin delete"
  on orders for delete using (is_admin());

-- settings: public read, admin write
create policy "settings: public read"
  on settings for select using (true);
create policy "settings: admin write"
  on settings for all using (is_admin()) with check (is_admin());

-- testimonials: public read, admin write
create policy "testimonials: public read"
  on testimonials for select using (true);
create policy "testimonials: admin write"
  on testimonials for all using (is_admin()) with check (is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Storage bucket for food images
-- ─────────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'food-images',
  'food-images',
  true,          -- public bucket so image URLs work without auth
  5242880,       -- 5 MB max per file
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do nothing;

-- Public read on the bucket
create policy "food-images: public read"
  on storage.objects for select
  using (bucket_id = 'food-images');

-- Admin can upload/update/delete
create policy "food-images: admin upload"
  on storage.objects for insert
  with check (bucket_id = 'food-images' and is_admin());

create policy "food-images: admin update"
  on storage.objects for update
  using (bucket_id = 'food-images' and is_admin());

create policy "food-images: admin delete"
  on storage.objects for delete
  using (bucket_id = 'food-images' and is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Seed data
-- ─────────────────────────────────────────────────────────────────────────────

-- Categories
insert into categories (name, icon, sort_order) values
  ('Main Course',   '🍛', 1),
  ('Combos',        '🥘', 2),
  ('Rice',          '🍚', 3),
  ('Roti / Bread',  '🫓', 4),
  ('Beverages',     '🥛', 5),
  ('Desserts',      '🍮', 6)
on conflict do nothing;

-- Offers
insert into offers (text, is_active, sort_order) values
  ('🎉 Free Sweet Lassi on orders above ₹399',      true, 1),
  ('🔥 Buy 2 Meals Get 1 Drink Free',               true, 2),
  ('🍗 Weekend Chicken Combo Special — Order Now!', true, 3),
  ('⚡ Free Delivery on your first order!',          true, 4)
on conflict do nothing;

-- Settings (single row)
insert into settings (id, whatsapp_number, instagram_url, address, kitchen_timing, delivery_timing)
values (
  'c0ffee00-0000-0000-0000-000000000001',
  '919876543210',
  'https://instagram.com/desikitchen',
  '123, Food Street, Flavour Nagar, Mumbai - 400001',
  '10:00 AM – 10:00 PM',
  '11:00 AM – 9:30 PM'
)
on conflict (id) do nothing;

-- Testimonials
insert into testimonials (name, rating, review) values
  ('Priya Sharma',   5, 'The Chicken Curry is absolutely divine! Tastes exactly like my mom used to make. I order at least twice a week now. The packaging is so neat and food arrives piping hot!'),
  ('Rahul Verma',    5, 'Tried the Dal Tadka Rice Combo — value for money is unbeatable. The rotis are so soft, feels like homemade. Desi Kitchen is now my go-to for lunch every day.'),
  ('Ananya Patel',   5, 'The Sweet Lassi is the best I''ve had outside of Punjab! Thick, creamy, and just the right sweetness. The Chole Poori Combo is also a must-try. Highly recommended!'),
  ('Mohammed Khan',  5, 'Paneer Bhurji here is incredibly flavourful. The spice levels are perfect. Great quality food at very reasonable prices. Delivery was super fast too!')
on conflict do nothing;

-- Menu items
insert into menu_items (name, description, price, category, image_url, type, is_bestseller, is_spicy, in_stock) values
  -- Main Course
  ('Egg Curry',         'Slow-cooked eggs in rich masala gravy with aromatic spices',                   149, 'main-course', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80', 'egg',     true,  true,  true),
  ('Chicken Curry',     'Tender chicken pieces in our signature house-made curry base',                  249, 'main-course', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80', 'non-veg', true,  true,  true),
  ('Paneer Bhurji',     'Crumbled cottage cheese with onions, tomatoes and spices',                     179, 'main-course', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80', 'veg',     true,  false, true),
  ('Dal Tadka',         'Yellow lentils tempered with ghee, cumin and dry red chillies',                129, 'main-course', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80', 'veg',     false, false, true),
  ('Mix Veg',           'Seasonal vegetables cooked in a mildly spiced gravy',                          149, 'main-course', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', 'veg',     false, false, true),
  ('Chole',             'Punjabi-style chickpeas cooked with whole spices and tangy tomatoes',           119, 'main-course', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', 'veg',     false, true,  true),
  -- Combos
  ('Chole Poori Combo', 'Fluffy deep-fried pooris with spicy Punjabi chole — a match made in heaven',   149, 'combos',      'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80', 'veg',     true,  true,  true),
  ('Dal Tadka Rice Combo','Comforting dal tadka paired with aromatic jeera rice and a papad',           169, 'combos',      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80', 'veg',     false, false, true),
  ('Chicken Curry Meal','Chicken curry with 3 rotis, rice and a refreshing raita',                      299, 'combos',      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', 'non-veg', true,  true,  true),
  ('Paneer Bhurji Meal','Paneer bhurji with 3 rotis, rice and pickle — a complete desi meal',           249, 'combos',      'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400&q=80', 'veg',     false, false, true),
  -- Rice
  ('Jeera Rice',        'Fragrant basmati rice tempered with cumin seeds and ghee',                      99, 'rice',        'https://images.unsplash.com/photo-1536304993881-ff86e0c9b55b?w=400&q=80', 'veg',     false, false, true),
  ('Plain Rice',        'Steamed long-grain basmati rice, light and fluffy',                             79, 'rice',        'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&q=80', 'veg',     false, false, true),
  -- Bread
  ('Plain Roti',        'Soft whole-wheat roti made fresh on tawa',                                      20, 'bread',       'https://images.unsplash.com/photo-1604908177453-7462950a6a3b?w=400&q=80', 'veg',     false, false, true),
  ('Butter Roti',       'Fresh tawa roti generously slathered with homemade white butter',               30, 'bread',       'https://images.unsplash.com/photo-1635321593217-40050ad13c74?w=400&q=80', 'veg',     false, false, true),
  ('Poori',             'Golden puffed deep-fried bread, crispy outside and soft inside',                20, 'bread',       'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80', 'veg',     false, false, true),
  -- Beverages
  ('Sweet Lassi',       'Thick chilled yogurt drink, sweet and refreshing with a hint of cardamom',      80, 'beverages',   'https://images.unsplash.com/photo-1571006682272-b4ba31a6a13b?w=400&q=80', 'veg',     true,  false, true),
  ('Masala Chaas',      'Spiced thin buttermilk with cumin, mint and coriander — a digestive delight',   50, 'beverages',   'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80', 'veg',     false, false, true),
  ('Cold Drink',        'Chilled aerated soft drink — Coke, Pepsi or Sprite as available',               40, 'beverages',   'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80', 'veg',     false, false, true),
  -- Desserts
  ('Gulab Jamun',       'Soft milk-solid dumplings soaked in rose-scented sugar syrup',                  60, 'desserts',    'https://images.unsplash.com/photo-1666427760753-f3ee5a6c0d37?w=400&q=80', 'veg',     false, false, true),
  ('Kheer',             'Creamy slow-cooked rice pudding with saffron, cardamom and nuts',               70, 'desserts',    'https://images.unsplash.com/photo-1571114832699-69bfcb434b1a?w=400&q=80', 'veg',     false, false, true)
on conflict do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. How to add your first admin user
-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Sign up via Supabase Auth dashboard:
--      Authentication → Users → Add user
--      Email: admin@desikitchen.com  Password: <your secure password>
--
-- 2. Copy the new user's UUID from the Users list, then run:
--
--    insert into admin_users (user_id, email)
--    values ('<paste-uuid-here>', 'admin@desikitchen.com');
--
-- That's it — the is_admin() function will grant this user full write access.
