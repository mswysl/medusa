"use client"

import { useRef } from "react"
import Image from "next/image"
import { ProductCardData } from "@/components/catalog/ProductCard"
import { fmt } from "@/lib/utils"

type Props = {
  products: ProductCardData[]
  onProductClick: (p: ProductCardData) => void
}

export function NewArrivalsCarousel({ products, onProductClick }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)

  function scroll(dir: number) {
    scrollRef.current?.scrollBy({ left: dir * 150, behavior: "smooth" })
    setTimeout(updateFill, 350)
  }

  function updateFill() {
    const el = scrollRef.current
    const fill = fillRef.current
    if (!el || !fill) return
    const pct = (el.scrollLeft / (el.scrollWidth - el.clientWidth)) * 100 || 0
    fill.style.width = Math.max(20, Math.min(100, pct + 20)) + "%"
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-5">
        <h2
          className="font-display text-[26px] tracking-[3px] text-white"
          style={{ fontFamily: "var(--font-bebas), sans-serif" }}
        >
          NEW ARRIVALS
        </h2>
        <div className="flex gap-3 items-center">
          <CNavBtn onClick={() => scroll(-1)}>‹</CNavBtn>
          <CNavBtn onClick={() => scroll(1)}>›</CNavBtn>
          <a
            href="/catalog"
            className="text-[9px] tracking-[2px] uppercase no-underline transition-opacity duration-200 hover:opacity-70"
            style={{ color: "var(--pink)" }}
          >
            VIEW ALL
          </a>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={updateFill}
        className="flex gap-3 overflow-x-auto scrollbar-none pb-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            onClick={() => onProductClick(p)}
            className="flex-none flex flex-col items-center gap-2 cursor-pointer"
            style={{ width: 130, scrollSnapAlign: "start" }}
          >
            {/* Circle */}
            <div
              className="relative rounded-full border-2 overflow-hidden flex items-center justify-center transition-all duration-200 hover:-translate-y-[3px]"
              style={{
                width: 110,
                height: 110,
                background: "linear-gradient(135deg, #1a0024, #2a0038)",
                borderColor: "var(--border)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = "var(--pink)"
                el.style.boxShadow = "0 0 18px rgba(255,45,255,0.4)"
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = "var(--border)"
                el.style.boxShadow = "none"
              }}
            >
              {p.image ? (
                <Image src={p.image} alt={p.name} fill className="object-cover" sizes="110px" />
              ) : (
                <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className="w-[50px] h-[50px] opacity-20">
                  <rect x="1" y="1" width="58" height="58" stroke="#ff2dff" strokeWidth="1" fill="none" />
                  <line x1="1" y1="1" x2="59" y2="59" stroke="#ff2dff" strokeWidth="1" />
                  <line x1="59" y1="1" x2="1" y2="59" stroke="#ff2dff" strokeWidth="1" />
                </svg>
              )}
            </div>
            <div className="text-[9px] tracking-[1px] text-[#ccc] text-center leading-[1.3] max-w-[110px]">
              {p.name}
            </div>
            <div className="text-[10px] tracking-[1px]" style={{ color: "var(--orange)" }}>
              {fmt(p.price)}
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-[3px] mt-[10px] rounded-full overflow-hidden" style={{ background: "var(--dim)" }}>
        <div
          ref={fillRef}
          className="h-full rounded-full transition-all duration-300"
          style={{ background: "var(--pink)", width: "40%" }}
        />
      </div>
    </div>
  )
}

function CNavBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-[34px] h-[34px] text-[16px] cursor-pointer transition-all duration-200 border"
      style={{
        background: "rgba(8,0,12,0.85)",
        borderColor: "var(--border)",
        color: "var(--pink)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.background = "rgba(255,45,255,0.2)"
        el.style.borderColor = "var(--pink)"
        el.style.boxShadow = "0 0 12px rgba(255,45,255,0.4)"
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.background = "rgba(8,0,12,0.85)"
        el.style.borderColor = "var(--border)"
        el.style.boxShadow = "none"
      }}
    >
      {children}
    </button>
  )
}
