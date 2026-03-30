import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
  key: string
  productId: string
  variantId: string
  band: string
  name: string
  lin: string
  style: string
  size: string
  price: number
  image: string | null
  qty: number
}

type CartState = {
  cartId: string | null
  items: CartItem[]
  isOpen: boolean

  setCartId: (id: string) => void
  addItem: (item: Omit<CartItem, "key" | "qty">) => void
  removeItem: (key: string) => void
  updateQty: (key: string, delta: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void

  total: () => number
  count: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      items: [],
      isOpen: false,

      setCartId: (id) => set({ cartId: id }),

      addItem: (item) => {
        const key = `${item.variantId}-${item.style}-${item.size}`
        const existing = get().items.find((i) => i.key === key)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.key === key ? { ...i, qty: i.qty + 1 } : i
            ),
          })
        } else {
          set({ items: [...get().items, { ...item, key, qty: 1 }] })
        }
      },

      removeItem: (key) =>
        set({ items: get().items.filter((i) => i.key !== key) }),

      updateQty: (key, delta) => {
        const item = get().items.find((i) => i.key === key)
        if (!item) return
        const next = item.qty + delta
        if (next < 1) {
          get().removeItem(key)
          return
        }
        set({
          items: get().items.map((i) =>
            i.key === key ? { ...i, qty: next } : i
          ),
        })
      },

      clearCart: () => set({ items: [], cartId: null }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.qty, 0),

      count: () =>
        get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: "mswysl-cart", partialize: (s) => ({ items: s.items, cartId: s.cartId }) }
  )
)

// ─── UI state (not persisted) ────────────────────────────────
type UIState = {
  activeCategory: string
  searchQuery: string
  setActiveCategory: (cat: string) => void
  setSearchQuery: (q: string) => void
}

export const useUI = create<UIState>()((set) => ({
  activeCategory: "all",
  searchQuery: "",
  setActiveCategory: (cat) => set({ activeCategory: cat }),
  setSearchQuery: (q) => set({ searchQuery: q }),
}))
