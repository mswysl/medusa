"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ProductCardData } from "@/components/catalog/ProductCard"
import { useCart } from "@/lib/store"
import { fmt, STYLE_LABELS, spawnFire } from "@/lib/utils"

type Props = {
  product: ProductCardData | null
  onClose: () => void
}

export function ProductModal({ product, onClose }: Props) {
  const [selStyle, setSelStyle] = useState<string | null>(null)
  const [selSize, setSelSize] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const isOpen = !!product

  // Reset state when product changes
  useEffect(() => {
    setSelStyle(null)
    setSelSize(null)
    setError("")
    setAdded(false)
  }, [product])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  function handleAdd() {
    if (!product) return
    if (!selStyle) { setError("Select a style."); return }
    if (!selSize) { setError("Select a size."); return }

    addItem({
      productId: product.id,
      variantId: product.variantId,
      band: product.band,
      name: product.name,
      lin: product.lin,
      style: selStyle,
      size: selSize,
      price: product.price,
      image: product.image,
    })

    setAdded(true)
    spawnFire(8)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 transition-opacity duration-200"
      style={{
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {product && (
        <div
          className="relative w-full max-w-[680px] max-h-[92vh] overflow-y-auto border transition-transform duration-200"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
            transform: isOpen ? "translateY(0)" : "translateY(20px)",
          }}
        >
          {/* Scan bar */}
          <div className="scan-bar" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-[10px] right-3 z-10 bg-none border-none cursor-pointer text-[18px] transition-colors duration-200"
            style={{ color: "var(--muted)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--pink)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--muted)")}
          >
            ✕
          </button>

          {/* Content */}
          <div className="grid md:grid-cols-2 min-h-[340px]">
            {/* Image */}
            <div
              className="relative flex items-center justify-center overflow-hidden min-h-[280px] border-r md:border-b-0 border-b"
              style={{
                background: "linear-gradient(135deg, #140018, #1e0026)",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{ backgroundImage: "url('/flamechain.png')", backgroundSize: "60px 60px", opacity: 0.1 }}
              />
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover relative z-[1]"
                  sizes="340px"
                />
              ) : (
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="relative z-[1] w-24 h-24 opacity-20">
                  <rect x="0.5" y="0.5" width="99" height="99" stroke="#ff2dff" strokeWidth="1" fill="none" />
                  <line x1="0.5" y1="0.5" x2="99.5" y2="99.5" stroke="#ff2dff" strokeWidth="1" />
                  <line x1="99.5" y1="0.5" x2="0.5" y2="99.5" stroke="#ff2dff" strokeWidth="1" />
                </svg>
              )}
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col gap-3">
              <div>
                <p className="text-[8px] tracking-[3px] uppercase" style={{ color: "var(--muted)" }}>{product.band}</p>
                <p className="text-[9px] tracking-[3px]" style={{ color: "var(--pink)" }}>{product.lin}</p>
                <h2
                  className="font-display text-[22px] tracking-[2px] leading-[1.1] text-white mt-1"
                  style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                >
                  {product.name}
                </h2>
              </div>

              <p
                className="font-display text-[28px] tracking-[1px]"
                style={{ color: "var(--orange)", fontFamily: "var(--font-bebas), sans-serif" }}
              >
                {fmt(product.price)}
              </p>

              <p className="text-[10px] leading-[1.8]" style={{ color: "var(--muted)" }}>
                {product.description}
              </p>

              <hr style={{ borderColor: "var(--border)" }} />

              {/* Style */}
              <div>
                <p className="text-[8px] tracking-[2px] uppercase mb-[6px]" style={{ color: "rgba(255,45,255,0.6)" }}>
                  STYLE
                </p>
                <div className="flex gap-[6px] flex-wrap">
                  {product.styles.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSelStyle(s); setError("") }}
                      className="border cursor-pointer text-[9px] tracking-[1px] py-1 px-[10px] transition-all duration-150 bg-none"
                      style={{
                        borderColor: selStyle === s ? "var(--pink)" : "var(--border)",
                        color: selStyle === s ? "var(--pink)" : "var(--muted)",
                        background: selStyle === s ? "rgba(255,45,255,0.1)" : "transparent",
                        fontFamily: "var(--font-share-tech), monospace",
                      }}
                    >
                      {STYLE_LABELS[s] ?? s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <p className="text-[8px] tracking-[2px] uppercase mb-[6px]" style={{ color: "rgba(255,45,255,0.6)" }}>
                  SIZE
                </p>
                <div className="flex gap-[6px] flex-wrap">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => { setSelSize(sz); setError("") }}
                      className="border cursor-pointer text-[9px] tracking-[1px] py-1 px-[10px] transition-all duration-150 bg-none"
                      style={{
                        borderColor: selSize === sz ? "var(--pink)" : "var(--border)",
                        color: selSize === sz ? "var(--pink)" : "var(--muted)",
                        background: selSize === sz ? "rgba(255,45,255,0.1)" : "transparent",
                        fontFamily: "var(--font-share-tech), monospace",
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-[9px] tracking-[1px] min-h-[14px]" style={{ color: "#ff6060" }}>
                  {error}
                </p>
              )}

              {/* Add to cart */}
              <button
                onClick={handleAdd}
                className="relative w-full py-[13px] font-display text-base tracking-[4px] uppercase border-none cursor-pointer overflow-hidden transition-all duration-200"
                style={{
                  background: added ? "#fff" : "var(--pink)",
                  color: "#000",
                  fontFamily: "var(--font-bebas), sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (added) return
                  const el = e.currentTarget as HTMLElement
                  el.style.background = "#fff"
                  el.style.boxShadow = "0 0 28px rgba(255,45,255,0.6)"
                }}
                onMouseLeave={(e) => {
                  if (added) return
                  const el = e.currentTarget as HTMLElement
                  el.style.background = "var(--pink)"
                  el.style.boxShadow = "none"
                }}
              >
                {added ? "ADDED!" : "ADD TO CART"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
