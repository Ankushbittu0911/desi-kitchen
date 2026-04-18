"use client";
// src/app/admin/dashboard/page.tsx — full Supabase edition
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { signOut } from "@/lib/supabase/db";
import {
  getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem,
  getAllOffers, addOffer, updateOffer, deleteOffer,
  getOrders, updateOrderStatus, deleteOrder,
  getSettings, updateSettings,
  uploadFoodImage, deleteFoodImage,
} from "@/lib/supabase/db";
import { MenuItem, Offer, Order, SiteSettings } from "@/types";
import { seedMenuItems, seedSettings, seedOffers, CATEGORIES_MAP } from "@/lib/seedData";
import {
  LayoutDashboard, UtensilsCrossed, Tag, Settings,
  ShoppingBag, Plus, Pencil, Trash2, X, Check, LogOut,
  Package, MessageCircle, Phone, ImagePlus, Loader2,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

type Tab = "dashboard" | "menu" | "offers" | "orders" | "settings";

const EMPTY_ITEM: Omit<MenuItem, "id"> = {
  name: "", description: "", price: 0, category: "main-course",
  imageUrl: "", type: "veg", isBestseller: false, isSpicy: false, inStock: true,
};

export default function AdminDashboard() {
  const { user, loading } = useAdminAuth();
  const router            = useRouter();
  const [tab, setTab]     = useState<Tab>("dashboard");

  // ── Data state ──────────────────────────────────────────────────────────
  const [menuItems,    setMenuItems]    = useState<MenuItem[]>([]);
  const [offers,       setOffers]       = useState<Offer[]>([]);
  const [orders,       setOrders]       = useState<Order[]>([]);
  const [settings,     setSettingsState] = useState<SiteSettings>(seedSettings);
  const [loadingData,  setLoadingData]  = useState(true);

  // ── Menu modal state ────────────────────────────────────────────────────
  const [menuModal,    setMenuModal]    = useState(false);
  const [editingItem,  setEditingItem]  = useState<MenuItem | null>(null);
  const [itemForm,     setItemForm]     = useState<Omit<MenuItem, "id">>(EMPTY_ITEM);
  const [imageFile,    setImageFile]    = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [saving,       setSaving]       = useState(false);
  const fileInputRef   = useRef<HTMLInputElement>(null);

  // ── Offer modal state ───────────────────────────────────────────────────
  const [offerModal,   setOfferModal]   = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [offerForm,    setOfferForm]    = useState({ text: "", isActive: true, order: 0 });

  // ── Load all data once user is confirmed admin ───────────────────────────
  useEffect(() => {
    if (!user) return;
    Promise.all([
      getMenuItems().catch(() => seedMenuItems.map((m, i) => ({ ...m, id: `s-${i}` }))),
      getAllOffers().catch(()  => seedOffers.map((o, i) => ({ ...o, id: `o-${i}` }))),
      getOrders().catch(()    => [] as Order[]),
      getSettings().catch(()  => seedSettings),
    ]).then(([items, offs, ords, sett]) => {
      setMenuItems(items);
      setOffers(offs);
      setOrders(ords);
      setSettingsState(sett);
      setLoadingData(false);
    });
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
  };

  // ── Menu helpers ─────────────────────────────────────────────────────────
  const openAddItem = () => {
    setEditingItem(null);
    setItemForm(EMPTY_ITEM);
    setImageFile(null);
    setImagePreview("");
    setMenuModal(true);
  };

  const openEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemForm({ ...item });
    setImageFile(null);
    setImagePreview(item.imageUrl ?? "");
    setMenuModal(true);
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const saveItem = async () => {
    if (!itemForm.name || !itemForm.price) {
      toast.error("Name and price are required");
      return;
    }
    setSaving(true);
    try {
      let finalImageUrl = itemForm.imageUrl ?? "";

      // Upload new image if one was selected
      if (imageFile) {
        // Remove old image from storage if editing
        if (editingItem?.imageUrl && editingItem.imageUrl.includes("food-images")) {
          await deleteFoodImage(editingItem.imageUrl).catch(() => {});
        }
        finalImageUrl = await uploadFoodImage(imageFile);
      }

      const payload = { ...itemForm, imageUrl: finalImageUrl };

      if (editingItem) {
        await updateMenuItem(editingItem.id, payload);
        setMenuItems(prev =>
          prev.map(m => m.id === editingItem.id ? { ...payload, id: editingItem.id } : m)
        );
        toast.success("Item updated!");
      } else {
        const newId = await addMenuItem(payload);
        setMenuItems(prev => [...prev, { ...payload, id: newId }]);
        toast.success("Item added!");
      }
      setMenuModal(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id: string, imageUrl?: string) => {
    if (!confirm("Delete this menu item?")) return;
    try {
      await deleteMenuItem(id);
      if (imageUrl && imageUrl.includes("food-images")) {
        await deleteFoodImage(imageUrl).catch(() => {});
      }
      setMenuItems(prev => prev.filter(m => m.id !== id));
      toast.success("Item deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const toggleStock = async (item: MenuItem) => {
    try {
      await updateMenuItem(item.id, { inStock: !item.inStock });
      setMenuItems(prev =>
        prev.map(m => m.id === item.id ? { ...m, inStock: !m.inStock } : m)
      );
    } catch {
      toast.error("Failed to update stock");
    }
  };

  // ── Offer helpers ────────────────────────────────────────────────────────
  const openAddOffer = () => {
    setEditingOffer(null);
    setOfferForm({ text: "", isActive: true, order: offers.length + 1 });
    setOfferModal(true);
  };

  const openEditOffer = (o: Offer) => {
    setEditingOffer(o);
    setOfferForm({ text: o.text, isActive: o.isActive, order: o.order });
    setOfferModal(true);
  };

  const saveOffer = async () => {
    if (!offerForm.text) { toast.error("Offer text required"); return; }
    setSaving(true);
    try {
      if (editingOffer) {
        await updateOffer(editingOffer.id, offerForm);
        setOffers(prev =>
          prev.map(o => o.id === editingOffer.id ? { ...offerForm, id: editingOffer.id } : o)
        );
        toast.success("Offer updated!");
      } else {
        const newId = await addOffer(offerForm);
        setOffers(prev => [...prev, { ...offerForm, id: newId }]);
        toast.success("Offer added!");
      }
      setOfferModal(false);
    } catch {
      toast.error("Failed to save offer");
    } finally {
      setSaving(false);
    }
  };

  const deleteOfferItem = async (id: string) => {
    if (!confirm("Delete this offer?")) return;
    try {
      await deleteOffer(id);
      setOffers(prev => prev.filter(o => o.id !== id));
      toast.success("Offer deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const deleteOrderItem = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    try {
      await deleteOrder(id);
      setOrders(prev => prev.filter(o => o.id !== id));
      toast.success("Order deleted");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to delete order");
      console.error("Delete order failed:", err);
    }
  };

  // ── Settings ─────────────────────────────────────────────────────────────
  const saveSettings = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  // ── Loading guard ─────────────────────────────────────────────────────────
  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <motion.div
          className="w-10 h-10 border-2 border-saffron-500/30 border-t-saffron-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  // ── Sidebar nav items ─────────────────────────────────────────────────────
  const NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "menu",      label: "Menu",      icon: UtensilsCrossed },
    { id: "offers",    label: "Offers",    icon: Tag },
    { id: "orders",    label: "Orders",    icon: ShoppingBag },
    { id: "settings",  label: "Settings",  icon: Settings },
  ] as const;

  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-charcoal flex">

      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden md:flex w-60 flex-col bg-[#0d0d0d] border-r border-white/5 fixed h-full z-20">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🍛</span>
            <div>
              <p className="gradient-text text-base font-bold" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                Desi Kitchen
              </p>
              <p className="text-white/25 text-[10px] uppercase tracking-widest">Admin · Supabase</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id as Tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  tab === item.id
                    ? "bg-saffron-600/15 text-saffron-400 border border-saffron-500/20"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <p className="text-white/25 text-xs mb-3 truncate">{user?.email}</p>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 text-white/40 hover:text-red-400 transition-colors text-sm px-3 py-2 rounded-xl hover:bg-red-500/5"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ───────────────────────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-[#0d0d0d] border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🍛</span>
          <span className="gradient-text text-base font-bold" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Admin
          </span>
        </div>
        <button onClick={handleSignOut} className="text-white/40 hover:text-red-400 transition-colors">
          <LogOut size={16} />
        </button>
      </div>

      {/* ── Mobile bottom nav ────────────────────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-[#0d0d0d] border-t border-white/5 flex">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id as Tab)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] transition-colors ${
                tab === item.id ? "text-saffron-400" : "text-white/30"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="flex-1 md:ml-60 p-4 md:p-8 pt-16 md:pt-8 pb-24 md:pb-8 min-h-screen">

        {/* ━━━ DASHBOARD HOME ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {tab === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-white text-2xl font-bold mb-1" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              {new Date().getHours() < 12 ? "Good Morning" : new Date().getHours() < 17 ? "Good Afternoon" : "Good Evening"} 👋
            </h1>
            <p className="text-white/30 text-sm mb-8">Here's your kitchen overview</p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Menu Items",    val: menuItems.length,                          icon: "🍛", color: "saffron" },
                { label: "Active Offers", val: offers.filter(o => o.isActive).length,     icon: "🏷️", color: "gold"    },
                { label: "Total Orders",  val: orders.length,                             icon: "📦", color: "green"   },
                { label: "Out of Stock",  val: menuItems.filter(m => !m.inStock).length,  icon: "⚠️", color: "red"     },
              ].map(s => (
                <motion.div
                  key={s.label}
                  className="glass rounded-2xl p-5 border border-white/5 hover:border-saffron-500/20 transition-all"
                  whileHover={{ y: -2 }}
                >
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="text-white text-3xl font-bold mb-1" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                    {s.val}
                  </div>
                  <div className="text-white/40 text-xs">{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Recent orders */}
            <div className="glass rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-white font-semibold text-sm">Recent Orders</h3>
                <button onClick={() => setTab("orders")} className="text-saffron-400 text-xs hover:text-saffron-300 transition-colors">
                  View all →
                </button>
              </div>
              {orders.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-white/30 text-sm">No orders yet</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="p-4 flex items-center justify-between hover:bg-white/2 transition-colors">
                      <div>
                        <p className="text-white text-sm font-medium">
                          {Array.isArray(order.items) ? order.items.length : 0} item(s)
                        </p>
                        <p className="text-white/30 text-xs mt-0.5">
                          {order.timestamp ? new Date(order.timestamp as string).toLocaleString("en-IN") : "—"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-saffron-400 font-semibold">₹{order.total}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          order.status === "delivered"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : order.status === "confirmed"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Supabase badge */}
            <div className="mt-6 flex items-center gap-2 text-white/20 text-xs">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Connected to Supabase
            </div>
          </motion.div>
        )}

        {/* ━━━ MENU MANAGEMENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {tab === "menu" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-white text-2xl font-bold" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  Menu Items
                </h1>
                <p className="text-white/30 text-sm">{menuItems.length} items across {Object.keys(CATEGORIES_MAP).length} categories</p>
              </div>
              <button
                onClick={openAddItem}
                className="btn-saffron text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2"
              >
                <Plus size={15} /> Add Item
              </button>
            </div>

            <div className="space-y-3">
              {menuItems.map(item => (
                <motion.div
                  key={item.id}
                  className="glass rounded-2xl p-4 border border-white/5 hover:border-white/10 flex items-center gap-4 transition-all"
                  layout
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden relative flex-shrink-0 bg-white/5">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🍛</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white text-sm font-medium truncate">{item.name}</p>
                      {item.isBestseller && (
                        <span className="text-[10px] bg-saffron-600/20 text-saffron-400 border border-saffron-500/20 rounded-full px-2 py-0.5">
                          ⭐ Bestseller
                        </span>
                      )}
                      {!item.inStock && (
                        <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-2 py-0.5">
                          Out of Stock
                        </span>
                      )}
                    </div>
                    <p className="text-saffron-400 text-sm font-semibold mt-0.5">₹{item.price}</p>
                    <p className="text-white/30 text-xs">{CATEGORIES_MAP[item.category] ?? item.category}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleStock(item)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        item.inStock
                          ? "border-green-500/30 text-green-400 hover:bg-green-500/10"
                          : "border-red-500/30  text-red-400   hover:bg-red-500/10"
                      }`}
                    >
                      {item.inStock ? "In Stock" : "Out of Stock"}
                    </button>
                    <button
                      onClick={() => openEditItem(item)}
                      className="text-white/30 hover:text-saffron-400 transition-colors p-1.5 rounded-lg hover:bg-white/5"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => deleteItem(item.id, item.imageUrl)}
                      className="text-white/30 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/5"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ━━━ OFFERS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {tab === "offers" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-white text-2xl font-bold" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  Offers
                </h1>
                <p className="text-white/30 text-sm">{offers.filter(o => o.isActive).length} active in ticker</p>
              </div>
              <button
                onClick={openAddOffer}
                className="btn-saffron text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2"
              >
                <Plus size={15} /> Add Offer
              </button>
            </div>

            <div className="space-y-3">
              {offers.length === 0 && (
                <div className="glass rounded-2xl p-12 border border-white/5 text-center">
                  <div className="text-4xl mb-3">🏷️</div>
                  <p className="text-white/30 text-sm">No offers yet. Add your first one!</p>
                </div>
              )}
              {offers.map(offer => (
                <motion.div
                  key={offer.id}
                  className="glass rounded-2xl p-4 border border-white/5 flex items-center gap-4"
                  layout
                >
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${offer.isActive ? "bg-green-400" : "bg-white/20"}`} />
                  <p className="flex-1 text-white/70 text-sm">{offer.text}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full border ${
                      offer.isActive
                        ? "border-green-500/30 text-green-400"
                        : "border-white/10 text-white/30"
                    }`}>
                      {offer.isActive ? "Active" : "Inactive"}
                    </span>
                    <button onClick={() => openEditOffer(offer)} className="text-white/30 hover:text-saffron-400 transition-colors p-1.5">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => deleteOfferItem(offer.id)} className="text-white/30 hover:text-red-400 transition-colors p-1.5">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ━━━ ORDERS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {tab === "orders" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-white text-2xl font-bold mb-1" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Orders
            </h1>
            <p className="text-white/30 text-sm mb-6">{orders.length} total orders saved from WhatsApp</p>

            {orders.length === 0 ? (
              <div className="glass rounded-2xl p-16 border border-white/5 text-center">
                <div className="text-5xl mb-4">📦</div>
                <p className="text-white/40 text-sm">No orders yet. They'll appear here once customers order via WhatsApp.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <motion.div
                    key={order.id}
                    className="glass rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-all"
                    layout
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-white/40 text-xs font-mono">
                          #{(order.id ?? "").slice(-8).toUpperCase()}
                        </p>
                        <p className="text-white/30 text-xs mt-0.5">
                          {order.timestamp ? new Date(order.timestamp as string).toLocaleString("en-IN") : "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Status selector */}
                        <select
                          value={order.status}
                          onChange={async e => {
                            const newStatus = e.target.value as Order["status"];
                            try {
                              await updateOrderStatus(order.id!, newStatus);
                              setOrders(prev =>
                                prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o)
                              );
                              toast.success("Status updated");
                            } catch { toast.error("Failed"); }
                          }}
                          className={`text-xs px-2 py-1 rounded-full border bg-transparent cursor-pointer focus:outline-none ${
                            order.status === "delivered"
                              ? "border-green-500/30 text-green-400"
                              : order.status === "confirmed"
                              ? "border-blue-500/30 text-blue-400"
                              : "border-yellow-500/30 text-yellow-400"
                          }`}
                        >
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                          <option value="delivered">delivered</option>
                        </select>
                        <button
                          onClick={() => deleteOrderItem(order.id!)}
                          className="text-white/30 hover:text-red-400 transition-colors p-1.5 rounded-lg"
                          aria-label="Delete order"
                        >
                          <Trash2 size={16} />
                        </button>
                        <p className="text-saffron-400 font-bold">₹{order.total}</p>
                      </div>
                    </div>

                    <div className="space-y-1 border-t border-white/5 pt-3">
                      {(Array.isArray(order.items) ? order.items : []).map((ci: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="text-white/50">{ci.quantity}× {ci.item?.name ?? "Item"}</span>
                          <span className="text-white/30">₹{(ci.item?.price ?? 0) * (ci.quantity ?? 1)}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ━━━ SETTINGS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {tab === "settings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-white text-2xl font-bold mb-1" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Settings
            </h1>
            <p className="text-white/30 text-sm mb-6">Stored in Supabase · synced across all sessions</p>

            <div className="glass rounded-2xl p-6 border border-white/5 max-w-lg space-y-5">
              {[
                { key: "whatsappNumber", label: "WhatsApp Number",  icon: Phone,          placeholder: "919876543210" },
                { key: "instagramUrl",   label: "Instagram URL",    icon: MessageCircle,  placeholder: "https://instagram.com/..." },
                { key: "address",        label: "Kitchen Address",  icon: Package,        placeholder: "Your address" },
                { key: "kitchenTiming",  label: "Kitchen Timing",   icon: Settings,       placeholder: "10:00 AM – 10:00 PM" },
                { key: "deliveryTiming", label: "Delivery Timing",  icon: Settings,       placeholder: "11:00 AM – 9:30 PM" },
              ].map(field => {
                const Icon = field.icon;
                return (
                  <div key={field.key}>
                    <label className="text-white/50 text-xs uppercase tracking-widest mb-2 block">
                      {field.label}
                    </label>
                    <div className="relative">
                      <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                      <input
                        type="text"
                        value={(settings as any)[field.key] ?? ""}
                        onChange={e =>
                          setSettingsState(prev => ({ ...prev, [field.key]: e.target.value }))
                        }
                        placeholder={field.placeholder}
                        className="w-full bg-white/5 border border-white/10 focus:border-saffron-500/50 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                );
              })}

              <button
                onClick={saveSettings}
                disabled={saving}
                className="btn-saffron text-white font-semibold px-8 py-3 rounded-xl text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? "Saving…" : "Save Settings"}
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* ═══════════════════════════════════════════════════════════════════
          MENU ITEM MODAL
      ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {menuModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !saving && setMenuModal(false)}
            />
            <motion.div
              className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg bg-[#111] border border-white/10 rounded-3xl p-6 max-h-[calc(100vh-3rem)] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-semibold text-lg" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  {editingItem ? "Edit Item" : "Add New Item"}
                </h3>
                {!saving && (
                  <button onClick={() => setMenuModal(false)} className="text-white/30 hover:text-white">
                    <X size={18} />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Image upload */}
                <div>
                  <label className="text-white/40 text-xs mb-2 block">Food Image</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-full h-36 rounded-2xl overflow-hidden border border-dashed border-white/15 hover:border-saffron-500/40 cursor-pointer transition-colors flex items-center justify-center bg-white/3 group"
                  >
                    {imagePreview ? (
                      <>
                        <Image src={imagePreview} alt="preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ImagePlus size={22} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-white/30 group-hover:text-white/50 transition-colors">
                        <ImagePlus size={24} className="mx-auto mb-2" />
                        <p className="text-xs">Click to upload image</p>
                        <p className="text-[10px] mt-0.5">or paste a URL below</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImagePick}
                  />
                </div>

                {/* Fields */}
                {[
                  { key: "name",        label: "Item Name",     type: "text",   placeholder: "e.g. Chicken Curry" },
                  { key: "imageUrl",    label: "Image URL (optional if uploaded above)", type: "text", placeholder: "https://..." },
                  { key: "price",       label: "Price (₹)",     type: "number", placeholder: "249" },
                  { key: "description", label: "Description",   type: "text",   placeholder: "Short description…" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-white/40 text-xs mb-1.5 block">{f.label}</label>
                    <input
                      type={f.type}
                      value={(itemForm as any)[f.key] ?? ""}
                      onChange={e => {
                        const val = f.type === "number" ? Number(e.target.value) : e.target.value;
                        setItemForm(prev => ({ ...prev, [f.key]: val }));
                        // If they type a URL, clear the file preview
                        if (f.key === "imageUrl" && e.target.value) {
                          setImageFile(null);
                          setImagePreview(e.target.value);
                        }
                      }}
                      placeholder={f.placeholder}
                      className="w-full bg-white/5 border border-white/10 focus:border-saffron-500/50 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none transition-colors"
                    />
                  </div>
                ))}

                {/* Category */}
                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">Category</label>
                  <select
                    value={itemForm.category}
                    onChange={e => setItemForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-[#1a1a1a] border border-white/10 focus:border-saffron-500/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none"
                  >
                    {Object.entries(CATEGORIES_MAP).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">Food Type</label>
                  <div className="flex gap-2">
                    {(["veg", "non-veg", "egg"] as const).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setItemForm(prev => ({ ...prev, type: t }))}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                          itemForm.type === t
                            ? "bg-saffron-600/20 border-saffron-500/40 text-saffron-400"
                            : "border-white/10 text-white/40 hover:border-white/20"
                        }`}
                      >
                        {t === "veg" ? "🟢 Veg" : t === "non-veg" ? "🔴 Non-Veg" : "🟡 Egg"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex gap-2">
                  {[
                    { key: "isBestseller", label: "⭐ Bestseller" },
                    { key: "isSpicy",      label: "🌶️ Spicy"      },
                    { key: "inStock",      label: "✅ In Stock"    },
                  ].map(toggle => (
                    <button
                      key={toggle.key}
                      type="button"
                      onClick={() =>
                        setItemForm(prev => ({ ...prev, [toggle.key]: !(prev as any)[toggle.key] }))
                      }
                      className={`flex-1 py-2.5 rounded-xl text-xs border transition-all ${
                        (itemForm as any)[toggle.key]
                          ? "bg-saffron-600/20 border-saffron-500/30 text-saffron-300"
                          : "border-white/10 text-white/30 hover:border-white/20"
                      }`}
                    >
                      {toggle.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setMenuModal(false)}
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 text-sm hover:bg-white/5 transition-all disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  onClick={saveItem}
                  disabled={saving}
                  className="flex-1 btn-saffron text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? "Saving…" : editingItem ? "Update Item" : "Add Item"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════
          OFFER MODAL
      ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {offerModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !saving && setOfferModal(false)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-6"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-semibold text-lg" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  {editingOffer ? "Edit Offer" : "Add Offer"}
                </h3>
                {!saving && (
                  <button onClick={() => setOfferModal(false)} className="text-white/30 hover:text-white">
                    <X size={18} />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-white/40 text-xs mb-1.5 block">Offer Text</label>
                  <input
                    type="text"
                    value={offerForm.text}
                    onChange={e => setOfferForm(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="🎉 Free drink on orders above ₹399"
                    className="w-full bg-white/5 border border-white/10 focus:border-saffron-500/50 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setOfferForm(prev => ({ ...prev, isActive: !prev.isActive }))}
                  className={`flex items-center gap-3 w-full py-3 px-4 rounded-xl border transition-all ${
                    offerForm.isActive
                      ? "border-green-500/30 bg-green-500/10 text-green-400"
                      : "border-white/10 text-white/30 hover:border-white/20"
                  }`}
                >
                  <span className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 ${
                    offerForm.isActive ? "bg-green-500 border-green-500" : "border-white/20"
                  }`}>
                    {offerForm.isActive && <Check size={11} className="text-white" />}
                  </span>
                  <span className="text-sm">Active — show in ticker banner</span>
                </button>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setOfferModal(false)}
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 text-sm disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  onClick={saveOffer}
                  disabled={saving}
                  className="flex-1 btn-saffron text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? "Saving…" : editingOffer ? "Update Offer" : "Add Offer"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
