# 🍛 Desi Kitchen — Premium Cloud Kitchen Website

Full-stack Next.js cloud kitchen website with a luxurious dark premium theme, Framer Motion animations, and **Supabase** for database, auth, and storage.

---

## ✨ Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Database | Supabase Postgres |
| Auth | Supabase Auth (email/password) |
| Storage | Supabase Storage (`food-images` bucket) |
| Deployment | Vercel |

---

## 🚀 Quick Start

### 1 — Create a Supabase project
1. Go to [supabase.com](https://supabase.com) → New project
2. Choose a name (e.g. `desi-kitchen`) and a strong DB password

### 2 — Run the schema
1. Open **SQL Editor** in your Supabase dashboard
2. Paste the entire contents of `supabase/schema.sql`
3. Click **Run** — this creates all tables, RLS policies, the storage bucket, and seeds all starter data

### 3 — Create your admin user
In **Authentication → Users → Add user (Confirm email)**:
- Email: `admin@desikitchen.com`
- Password: *(your choice)*

Then in **SQL Editor** run:
```sql
insert into admin_users (user_id, email)
values ('<paste the UUID from the Users list>', 'admin@desikitchen.com');
```

### 4 — Configure environment
```bash
cp .env.local.example .env.local
```
Fill in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
```
Both values are in **Project Settings → API**.

### 5 — Run locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy to Vercel

```bash
npx vercel
```
Add the three environment variables when prompted, or set them in the Vercel dashboard under **Settings → Environment Variables**.

---

## 📁 Project Structure

```
desi-kitchen/
├── supabase/
│   └── schema.sql              # Full DB schema + RLS + seed data
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Customer homepage
│   │   ├── globals.css
│   │   └── admin/
│   │       ├── page.tsx        # Redirects → /admin/login
│   │       ├── login/page.tsx  # Supabase Auth login
│   │       └── dashboard/page.tsx  # Full admin panel
│   ├── components/
│   │   ├── ui/
│   │   │   ├── LoadingScreen.tsx
│   │   │   └── SpiceParticles.tsx
│   │   └── customer/
│   │       ├── Navbar.tsx
│   │       ├── OfferTicker.tsx
│   │       ├── HeroSection.tsx
│   │       ├── BestsellerSection.tsx
│   │       ├── MenuSection.tsx
│   │       ├── FoodCard.tsx
│   │       ├── CartDrawer.tsx
│   │       ├── FloatingButtons.tsx
│   │       ├── TestimonialsSection.tsx
│   │       └── Footer.tsx
│   ├── hooks/
│   │   └── useAdminAuth.ts     # Supabase session + admin_users guard
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       # Browser Supabase client
│   │   │   ├── server.ts       # Server Supabase client (SSR)
│   │   │   ├── db.ts           # All CRUD + image upload + auth helpers
│   │   │   ├── database.types.ts  # TypeScript types from schema
│   │   │   └── index.ts        # Barrel export
│   │   ├── cartContext.tsx      # Cart state + localStorage
│   │   └── seedData.ts         # Fallback data + constants
│   └── types/
│       └── index.ts
```

---

## 🗃️ Supabase Tables

| Table | Purpose | Public Read | Admin Write |
|-------|---------|-------------|-------------|
| `menu_items` | Food items | ✅ | ✅ |
| `categories` | Menu categories | ✅ | ✅ |
| `offers` | Ticker banner offers | ✅ | ✅ |
| `orders` | WhatsApp cart orders | Insert only | ✅ |
| `settings` | Site-wide config | ✅ | ✅ |
| `testimonials` | Customer reviews | ✅ | ✅ |
| `admin_users` | Admin role mapping | ❌ | ✅ |

---

## 🔐 Auth & Security

- **Login** — `supabase.auth.signInWithPassword()` (email + password)
- **Admin guard** — `useAdminAuth` hook checks session AND verifies the user exists in `admin_users`
- **RLS** — All write operations are protected by Postgres Row Level Security via the `is_admin()` function
- **Storage** — `food-images` bucket is publicly readable but only writable by admins

### `is_admin()` function (defined in schema)
```sql
create function is_admin() returns boolean as $$
  select exists (select 1 from admin_users where user_id = auth.uid());
$$ language sql security definer;
```
Every `INSERT / UPDATE / DELETE` policy calls this function, so a compromised anon key can never mutate data.

---

## 📸 Image Upload Flow

1. Admin clicks **Add Item** → picks a file from disk  
2. File is uploaded to Supabase Storage bucket `food-images` via `uploadFoodImage(file)`  
3. The public URL is stored in `menu_items.image_url`  
4. When an item is deleted, `deleteFoodImage(url)` cleans up the storage object  
5. Admins can also paste an external URL directly (e.g. Unsplash) — both flows work

---

## 💬 WhatsApp Order Flow

1. Customer adds items → opens cart drawer  
2. Clicks **Order via WhatsApp**  
3. App saves the order to `orders` table in Supabase  
4. WhatsApp deeplink opens with a pre-filled message:

```
Hello Desi Kitchen, I want to place an order:

2 × Chicken Curry — ₹498
1 × Sweet Lassi — ₹80

Total: ₹578

Name: 
Address: 
Payment Mode: 
```

5. Admin can view + update order status (pending → confirmed → delivered) in the dashboard

---

## 🔄 Regenerate Types (optional)

When you modify the schema, regenerate TypeScript types with:
```bash
npx supabase gen types typescript --project-id <your-project-ref> \
  > src/lib/supabase/database.types.ts
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#0a0a0a` (charcoal) |
| Primary | `#ff7210` (saffron orange) |
| Secondary | `#d4a017` (gold) |
| Display Font | Cormorant Garamond |
| Body Font | DM Sans |
| Cards | Glassmorphism — `backdrop-blur` + `rgba(255,255,255,0.04)` |
| Animations | Framer Motion — parallax, smoke, stagger reveals, spring drawers |

---

Made with ❤️ for authentic desi food lovers
