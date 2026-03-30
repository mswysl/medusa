"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  createCart,
  addLineItem,
  updateLineItem,
  removeLineItem,
  getCart,
  getDefaultRegion,
} from "./cart-api"

// ─── Types ────────────────────────────────────────────────────

export type CartItem = {
  /** Medusa line-item ID (set after backend sync) */
  lineItemId: string | null
  variantId: string
  productId: string
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
  /** Medusa cart ID — persisted */
  cartId: string | null
  /** Region ID resolved on first cart creation */
  regionId: string | null
  /** Local items mirror (optimistic UI) */
  items: CartItem[]
  /** Drawer open state */
  isOpen: boolean
  /** Loading/syncing flag */
  syncing: boolean

  // ── Actions ─────────────────────────────────────────────────
  initCart: () => Promise<string>
  addItem: (item: Omit<CartItem, "lineItemId" | "qty">) => Promise<void>
  removeItem: (variantId: string, style: string, size: string) => Promise<void>
  updateQty: (variantId: string, style: string, size: string, delta: number) => Promise<void>
  syncFromBackend: () => Promise<void>
  clearCart: () => void
  openCart: () => void
  closeCart: () => void

  // ── Computed ─────────────────────────────────────────────────
  total: () => number
  count: () => number
}

// ─── Helpers ──────────────────────────────────────────────────

function itemKey(variantId: string, style: string, size: string) {
  return `${variantId}-${style}-${size}`
}

function mapBackendItems(cart: any): CartItem[] {
  return (cart?.items ?? []).map((li: any) => ({
    lineItemId: li.id,
    variantId: li.variant_id ?? li.variant?.id ?? "",
    productId: li.product_id ?? li.variant?.product_id ?? "",
    band: li.variant?.product?.metadata?.band ?? "",
    name: li.variant?.product?.title ?? li.title ?? "",
    lin: li.variant?.product?.metadata?.lin ?? "",
    style: li.variant?.options?.find((o: any) =>
      o.option?.title?.toLowerCase() === "style"
    )?.value ?? "",
    size: li.variant?.options?.find((o: any) =>
      o.option?.title?.toLowerCase() === "size"
    )?.value ?? li.variant?.title ?? "",
    price: li.unit_price ?? 0,
    image: li.thumbnail ?? li.variant?.product?.thumbnail ?? null,
    qty: li.quantity,
  }))
}

// ─── Store ────────────────────────────────────────────────────

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      regionId: null,
      items: [],
      isOpen: false,
      syncing: false,

      /** Get existing cart ID or create a new one. */
      initCart: async () => {
        const existing = get().cartId

        // Verify the existing cart is still valid
        if (existing) {
          try {
            const cart = await getCart(existing)
            if (cart?.id && cart.status !== "canceled") {
              const items = mapBackendItems(cart)
              set({ items, regionId: cart.region_id })
              return existing
            }
          } catch {
            // Cart expired or not found — create a new one
          }
        }

        // Resolve region
        let regionId = get().regionId
        if (!regionId) {
          const region = await getDefaultRegion()
          regionId = region?.id ?? null
        }

        const cart = await createCart(regionId ?? undefined)
        set({ cartId: cart.id, regionId: cart.region_id, items: [] })
        return cart.id
      },

      addItem: async (item) => {
        set({ syncing: true })

        // Optimistic update
        const key = itemKey(item.variantId, item.style, item.size)
        const current = get().items
        const existing = current.find(
          (i) => itemKey(i.variantId, i.style, i.size) === key
        )
        if (existing) {
          set({
            items: current.map((i) =>
              itemKey(i.variantId, i.style, i.size) === key
                ? { ...i, qty: i.qty + 1 }
                : i
            ),
          })
        } else {
          set({
            items: [...current, { ...item, lineItemId: null, qty: 1 }],
          })
        }

        try {
          const cartId = await get().initCart()
          const cart = await addLineItem(cartId, item.variantId, 1)
          // Reconcile with backend truth
          set({ items: mapBackendItems(cart) })
        } catch (err) {
          // Roll back optimistic update on failure
          set({ items: current })
          console.error("addItem failed:", err)
        } finally {
          set({ syncing: false })
        }
      },

      removeItem: async (variantId, style, size) => {
        const key = itemKey(variantId, style, size)
        const current = get().items
        const target = current.find(
          (i) => itemKey(i.variantId, i.style, i.size) === key
        )
        if (!target?.lineItemId) {
          // Local-only item (never synced), just remove locally
          set({ items: current.filter((i) => itemKey(i.variantId, i.style, i.size) !== key) })
          return
        }

        set({ syncing: true, items: current.filter((i) => itemKey(i.variantId, i.style, i.size) !== key) })

        try {
          const cartId = get().cartId!
          const cart = await removeLineItem(cartId, target.lineItemId)
          set({ items: mapBackendItems(cart) })
        } catch (err) {
          set({ items: current })
          console.error("removeItem failed:", err)
        } finally {
          set({ syncing: false })
        }
      },

      updateQty: async (variantId, style, size, delta) => {
        const key = itemKey(variantId, style, size)
        const current = get().items
        const target = current.find(
          (i) => itemKey(i.variantId, i.style, i.size) === key
        )
        if (!target) return

        const nextQty = target.qty + delta
        if (nextQty < 1) {
          return get().removeItem(variantId, style, size)
        }

        // Optimistic
        set({
          syncing: true,
          items: current.map((i) =>
            itemKey(i.variantId, i.style, i.size) === key
              ? { ...i, qty: nextQty }
              : i
          ),
        })

        try {
          const cartId = get().cartId
          if (cartId && target.lineItemId) {
            const cart = await updateLineItem(cartId, target.lineItemId, nextQty)
            set({ items: mapBackendItems(cart) })
          }
        } catch (err) {
          set({ items: current })
          console.error("updateQty failed:", err)
        } finally {
          set({ syncing: false })
        }
      },

      syncFromBackend: async () => {
        const cartId = get().cartId
        if (!cartId) return
        try {
          const cart = await getCart(cartId)
          set({ items: mapBackendItems(cart), regionId: cart.region_id })
        } catch {
          // Cart gone — reset
          set({ cartId: null, items: [] })
        }
      },

      clearCart: () => set({ cartId: null, items: [], regionId: null }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      total: () =>
        get().items.reduce((s, i) => s + i.price * i.qty, 0),

      count: () =>
        get().items.reduce((s, i) => s + i.qty, 0),
    }),
    {
      name: "mswysl-cart",
      partialize: (s) => ({
        cartId: s.cartId,
        regionId: s.regionId,
        items: s.items,
      }),
    }
  )
)
