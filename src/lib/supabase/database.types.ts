// src/lib/supabase/database.types.ts
// Hand-written types that mirror the Supabase schema exactly.
// Re-generate with: npx supabase gen types typescript --project-id <id> > src/lib/supabase/database.types.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      menu_items: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category: string;
          image_url: string | null;
          type: "veg" | "non-veg" | "egg";
          is_bestseller: boolean;
          is_spicy: boolean;
          in_stock: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["menu_items"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["menu_items"]["Insert"]>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          icon: string;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["categories"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
      };
      offers: {
        Row: {
          id: string;
          text: string;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["offers"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["offers"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          items: Json;
          total: number;
          customer_name: string | null;
          customer_address: string | null;
          payment_mode: string | null;
          status: "pending" | "confirmed" | "delivered";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      settings: {
        Row: {
          id: string;
          whatsapp_number: string;
          instagram_url: string;
          address: string;
          kitchen_timing: string;
          delivery_timing: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["settings"]["Row"], "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["settings"]["Insert"]>;
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          rating: number;
          review: string;
          food_photo: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["testimonials"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
      };
      admin_users: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["admin_users"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["admin_users"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      food_type: "veg" | "non-veg" | "egg";
      order_status: "pending" | "confirmed" | "delivered";
    };
  };
}
