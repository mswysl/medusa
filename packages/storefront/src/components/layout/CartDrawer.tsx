"use client"

import { useCart } from "@/lib/store"
import { fmt } from "@/lib/utils"
import { useRouter } from "next/navigation"

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, clearCart, total } = useCart()
  const router = useRouter()
  const cartTotal = total()

  function goCheckout() {
    closeCart()
    router.push("/checkout")
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 z-[400] transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(4px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      />

      {/* Drawer */}
      <aside
        className="fixed top-0 right-0 bottom-0 z-[410] flex flex-col border-l w-full max-w-[380px] transition-transform duration-300"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          paddingBottom: "var(--safe-bot)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-[18px] py-4 border-b relative"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="scan-bar" />
          <span
            className="font-display text-[18px] tracking-[4px]"
            style={{ color: "var(--pink)", textShadow: "0 0 12px var(--pink)", fontFamily: "var(--font-bebas), sans-serif" }}
          >
            CART
          </span>
          <button
            onClick={closeCart}
            className="bg-none border-none cursor-pointer text-[10px] tracking-[2px] uppercase transition-colors duration-200"
            style={{ color: "var(--muted)", fontFamily: "var(--font-share-tech), monospace" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--pink)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--muted)")}
          >
            CLOSE ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-[14px] flex flex-col gap-[10px]">
          {items.length === 0 ? (
            <div className="text-center py-[50px] px-5">
              <p
                className="font-display text-[18px] tracking-[3px]"
                style={{ color: "var(--muted)", fontFamily: "var(--font-bebas), sans-serif" }}
              >
                EMPTY CART
              </p>
              <small className="text-[9px] block mt-[5px]" style={{ color: "var(--dim)" }}>
                The void hungers
              </small>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.key}
                className="p-[11px] border"
                style={{ background: "rgba(255,45,255,0.04)", borderColor: "var(--border)" }}
              >
                <div className="text-[8px] tracking-[2px] mb-[2px]" style={{ color: "var(--pink)" }}>
                  {item.lin}
                </div>
                <div
                  className="font-display text-[13px] tracking-[1px] mb-[3px] text-[#ddd]"
                  style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                >
                  {item.name}
                </div>
                <div className="text-[9px] tracking-[1px] mb-[7px]" style={{ color: "var(--muted)" }}>
                  {item.style} / {item.size}
                </div>
                <div className="flex items-center justify-between">
                  {/* Qty control */}
                  <div className="flex items-center border" style={{ borderColor: "var(--border)" }}>
                    <button
                      onClick={() => updateQty(item.key, -1)}
                      className="w-7 h-7 text-base flex items-center justify-center transition-colors duration-150 cursor-pointer bg-none border-none"
                      style={{ color: "var(--pink)" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,45,255,0.15)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                    >
                      −
                    </button>
                    <span className="text-xs text-white w-7 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.key, 1)}
                      className="w-7 h-7 text-base flex items-center justify-center transition-colors duration-150 cursor-pointer bg-none border-none"
                      style={{ color: "var(--pink)" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,45,255,0.15)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                    >
                      +
                    </button>
                  </div>
                  <span
                    className="font-display text-base"
                    style={{ color: "var(--orange)", fontFamily: "var(--font-bebas), sans-serif" }}
                  >
                    {fmt(item.price * item.qty)}
                  </span>
                </div>
                <button
                  onClick={() => removeItem(item.key)}
                  className="mt-[6px] block text-[8px] tracking-[2px] uppercase transition-colors duration-150 bg-none border-none cursor-pointer"
                  style={{ color: "var(--dim)", fontFamily: "var(--font-share-tech), monospace" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#ff5555")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--dim)")}
                >
                  REMOVE
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="px-[18px] py-[14px] border-t flex flex-col gap-[10px]"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] tracking-[3px] uppercase" style={{ color: "var(--muted)" }}>
                TOTAL
              </span>
              <strong
                className="font-display text-[26px]"
                style={{ color: "var(--orange)", fontFamily: "var(--font-bebas), sans-serif" }}
              >
                {fmt(cartTotal)}
              </strong>
            </div>
            <button
              onClick={goCheckout}
              className="w-full py-[14px] font-display text-base tracking-[4px] uppercase border-none cursor-pointer transition-all duration-200"
              style={{ background: "var(--pink)", color: "#000", fontFamily: "var(--font-bebas), sans-serif" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = "#fff"
                el.style.boxShadow = "0 0 28px rgba(255,45,255,0.6)"
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = "var(--pink)"
                el.style.boxShadow = "none"
              }}
            >
              CHECKOUT ▶
            </button>
            <button
              onClick={clearCart}
              className="bg-none border-none cursor-pointer text-[8px] tracking-[3px] uppercase text-center transition-colors duration-150"
              style={{ color: "var(--dim)", fontFamily: "var(--font-share-tech), monospace" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--muted)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--dim)")}
            >
              CLEAR CART
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
