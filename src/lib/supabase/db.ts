// src/lib/supabase/db.ts
// All database operations via Supabase — drop-in replacement for firestore.ts
import { getClient } from "./client";
import { MenuItem, Category, Offer, Order, SiteSettings, Testimonial } from "@/types";
import { seedMenuItems, seedCategories, seedOffers, seedSettings, seedTestimonials } from "@/lib/seedData";

const sb = () => getClient();

// ─────────────────────────────────────────────────────────────────────────────
// Type mappers: snake_case DB rows ↔ camelCase app types
// ─────────────────────────────────────────────────────────────────────────────
function rowToMenuItem(row: any): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    price: Number(row.price),
    category: row.category,
    imageUrl: row.image_url ?? "",
    type: row.type as "veg" | "non-veg" | "egg",
    isBestseller: row.is_bestseller ?? false,
    isSpicy: row.is_spicy ?? false,
    inStock: row.in_stock ?? true,
  };
}

function menuItemToRow(item: Partial<Omit<MenuItem, "id">>) {
  const row: Record<string, unknown> = {};
  if (item.name         !== undefined) row.name          = item.name;
  if (item.description  !== undefined) row.description   = item.description;
  if (item.price        !== undefined) row.price         = item.price;
  if (item.category     !== undefined) row.category      = item.category;
  if (item.imageUrl     !== undefined) row.image_url     = item.imageUrl;
  if (item.type         !== undefined) row.type          = item.type;
  if (item.isBestseller !== undefined) row.is_bestseller = item.isBestseller;
  if (item.isSpicy      !== undefined) row.is_spicy      = item.isSpicy;
  if (item.inStock      !== undefined) row.in_stock      = item.inStock;
  return row;
}

function rowToOffer(row: any): Offer {
  return {
    id: row.id,
    text: row.text,
    isActive: row.is_active,
    order: row.sort_order,
  };
}

function rowToSettings(row: any): SiteSettings {
  return {
    whatsappNumber: row.whatsapp_number,
    instagramUrl: row.instagram_url,
    address: row.address,
    kitchenTiming: row.kitchen_timing,
    deliveryTiming: row.delivery_timing,
  };
}

function rowToTestimonial(row: any): Testimonial {
  return {
    id: row.id,
    name: row.name,
    rating: row.rating,
    review: row.review,
    foodPhoto: row.food_photo ?? undefined,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Menu Items
// ─────────────────────────────────────────────────────────────────────────────
export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const { data, error } = await sb()
      .from("menu_items")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return seedMenuItems.map((m, i) => ({ ...m, id: `seed-${i}` }));
    return data.map(rowToMenuItem);
  } catch {
    return seedMenuItems.map((m, i) => ({ ...m, id: `seed-${i}` }));
  }
}

export async function addMenuItem(item: Omit<MenuItem, "id">): Promise<string> {
  const { data, error } = await sb()
    .from("menu_items")
    .insert(menuItemToRow(item))
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function updateMenuItem(id: string, item: Partial<Omit<MenuItem, "id">>): Promise<void> {
  const { error } = await sb()
    .from("menu_items")
    .update(menuItemToRow(item))
    .eq("id", id);
  if (error) throw error;
}

export async function deleteMenuItem(id: string): Promise<void> {
  const { error } = await sb().from("menu_items").delete().eq("id", id);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────────────────────────────────────
export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await sb()
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((r: any) => ({
      id: r.id,
      name: r.name,
      icon: r.icon,
      order: r.sort_order,
    }));
  } catch {
    return seedCategories.map((c, i) => ({ ...c, id: `cat-${i}` }));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Offers
// ─────────────────────────────────────────────────────────────────────────────
export async function getOffers(): Promise<Offer[]> {
  try {
    const { data, error } = await sb()
      .from("offers")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(rowToOffer);
  } catch {
    return seedOffers.map((o, i) => ({ ...o, id: `offer-${i}` }));
  }
}

export async function getAllOffers(): Promise<Offer[]> {
  try {
    const { data, error } = await sb()
      .from("offers")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(rowToOffer);
  } catch {
    return seedOffers.map((o, i) => ({ ...o, id: `offer-${i}` }));
  }
}

export async function addOffer(offer: Omit<Offer, "id">): Promise<string> {
  const { data, error } = await sb()
    .from("offers")
    .insert({ text: offer.text, is_active: offer.isActive, sort_order: offer.order })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function updateOffer(id: string, offer: Partial<Omit<Offer, "id">>): Promise<void> {
  const row: Record<string, unknown> = {};
  if (offer.text     !== undefined) row.text       = offer.text;
  if (offer.isActive !== undefined) row.is_active  = offer.isActive;
  if (offer.order    !== undefined) row.sort_order = offer.order;
  const { error } = await sb().from("offers").update(row).eq("id", id);
  if (error) throw error;
}

export async function deleteOffer(id: string): Promise<void> {
  const { error } = await sb().from("offers").delete().eq("id", id);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────────────────────
// Orders
// ─────────────────────────────────────────────────────────────────────────────
export async function saveOrder(order: Omit<Order, "id">): Promise<string> {
  try {
    const { data, error } = await sb()
      .from("orders")
      .insert({
        items: order.items as any,
        total: order.total,
        customer_name: order.customerName ?? null,
        customer_address: order.customerAddress ?? null,
        payment_mode: order.paymentMode ?? null,
        status: order.status ?? "pending",
      })
      .select("id")
      .single();
    if (error) throw error;
    return data.id;
  } catch {
    return "local-" + Date.now();
  }
}

export async function getOrders(): Promise<Order[]> {
  try {
    const { data, error } = await sb()
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r: any) => ({
      id: r.id,
      items: r.items ?? [],
      total: Number(r.total),
      customerName: r.customer_name ?? undefined,
      customerAddress: r.customer_address ?? undefined,
      paymentMode: r.payment_mode ?? undefined,
      status: r.status,
      timestamp: r.created_at,
    }));
  } catch {
    return [];
  }
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<void> {
  const { error } = await sb().from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteOrder(id: string): Promise<void> {
  const { error } = await sb().from("orders").delete().eq("id", id);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────────────────────
// Settings
// ─────────────────────────────────────────────────────────────────────────────
const SETTINGS_ID = "c0ffee00-0000-0000-0000-000000000001";

export async function getSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await sb()
      .from("settings")
      .select("*")
      .eq("id", SETTINGS_ID)
      .single();
    if (error || !data) return seedSettings;
    return rowToSettings(data);
  } catch {
    return seedSettings;
  }
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<void> {
  const row: Record<string, unknown> = {};
  if (updates.whatsappNumber !== undefined) row.whatsapp_number = updates.whatsappNumber;
  if (updates.instagramUrl   !== undefined) row.instagram_url   = updates.instagramUrl;
  if (updates.address        !== undefined) row.address         = updates.address;
  if (updates.kitchenTiming  !== undefined) row.kitchen_timing  = updates.kitchenTiming;
  if (updates.deliveryTiming !== undefined) row.delivery_timing = updates.deliveryTiming;

  const { error } = await sb()
    .from("settings")
    .upsert({ id: SETTINGS_ID, ...row });
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────────────────────────────────────
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { data, error } = await sb()
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return seedTestimonials.map((t, i) => ({ ...t, id: `t-${i}` }));
    return data.map(rowToTestimonial);
  } catch {
    return seedTestimonials.map((t, i) => ({ ...t, id: `t-${i}` }));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Image Storage
// ─────────────────────────────────────────────────────────────────────────────
export async function uploadFoodImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `menu/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await sb().storage
    .from("food-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (uploadError) throw uploadError;

  const { data } = sb().storage.from("food-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteFoodImage(publicUrl: string): Promise<void> {
  // Extract path from URL: .../storage/v1/object/public/food-images/<path>
  const marker = "/food-images/";
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;
  const path = publicUrl.slice(idx + marker.length);
  await sb().storage.from("food-images").remove([path]);
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth helpers
// ─────────────────────────────────────────────────────────────────────────────
export async function signIn(email: string, password: string) {
  const { data, error } = await sb().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await sb().auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data } = await sb().auth.getSession();
  return data.session;
}

export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;
  const { data } = await sb()
    .from("admin_users")
    .select("id")
    .eq("user_id", session.user.id)
    .single();
  return !!data;
}
