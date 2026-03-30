import Image from "next/image"
import { fmt } from "@/lib/utils"

export type ProductCardData = {
  id: string
  variantId: string
  lin: string
  band: string
  name: string
  price: number
  image: string | null
  featured?: boolean
  styles: string[]
  sizes: string[]
  description: string
  category: string
  handle?: string
  /** Raw Medusa variant array for checkout */
  variants?: any[]
}

type Props = {
  product: ProductCardData
  /** Optional extra wrapper class */
  className?: string
}

/** Pure display card — no click handler (parent Link handles navigation) */
export function ProductCard({ product, className = "" }: Props) {
  return (
    <div className={`px-[6px] flex flex-col group cursor-pointer ${className}`}>
      {/* Band */}
      <div
        className="text-[8px] tracking-[2px] uppercase mb-[3px] overflow-hidden text-ellipsis whitespace-nowrap"
        style={{ color: "var(--muted)" }}
      >
        {product.band}
      </div>

      {/* Frame */}
      <div
        className="relative w-full aspect-square border overflow-hidden flex items-center justify-center transition-all duration-200 group-hover:border-[--pink] group-hover:shadow-pink-glow"
        style={{
          background: "linear-gradient(135deg, #140018, #1e0026, #140014)",
          borderColor: "var(--border)",
        }}
      >
        {/* Flame tile */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/flamechain.png')",
            backgroundSize: "50px 50px",
            backgroundRepeat: "repeat",
            opacity: 0.08,
          }}
        />

        {/* X placeholder */}
        {!product.image && (
          <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full z-[1]"
          >
            <rect x="0.5" y="0.5" width="99" height="99" stroke="#ff2dff" strokeWidth="0.8" fill="none" opacity="0.15" />
            <line x1="0.5" y1="0.5" x2="99.5" y2="99.5" stroke="#ff2dff" strokeWidth="0.8" opacity="0.15" />
            <line x1="99.5" y1="0.5" x2="0.5" y2="99.5" stroke="#ff2dff" strokeWidth="0.8" opacity="0.15" />
          </svg>
        )}

        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover z-[2]"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}

        {product.featured && (
          <div
            className="absolute top-[6px] left-0 z-[3] text-black font-bold text-[7px] tracking-[2px] py-[2px] px-2 uppercase"
            style={{
              background: "var(--pink)",
              clipPath: "polygon(0 0, 100% 0, calc(100% - 4px) 100%, 0 100%)",
            }}
          >
            NEW
          </div>
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 z-[4] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: "rgba(255,45,255,0.06)" }}
        >
          <span
            className="text-[12px] tracking-[4px]"
            style={{
              color: "var(--pink)",
              textShadow: "0 0 10px var(--pink)",
              fontFamily: "var(--font-bebas), sans-serif",
            }}
          >
            VIEW
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-baseline justify-between mt-1 gap-1">
        <span
          className="text-[7px] text-[#bbb] overflow-hidden text-ellipsis whitespace-nowrap flex-1 italic transition-colors duration-200 group-hover:text-[--pink]"
          style={{ fontFamily: "var(--font-cinzel), serif" }}
        >
          {product.name}
        </span>
        <span className="text-[7px] tracking-[1px] flex-shrink-0" style={{ color: "var(--pink)" }}>
          {product.lin}
        </span>
      </div>

      <div
        className="text-[9px] mt-[2px] tracking-[1px]"
        style={{ color: "var(--orange)", fontFamily: "var(--font-bebas), sans-serif" }}
      >
        {fmt(product.price)}
      </div>
    </div>
  )
}

export function EmptyCard({ className = "" }: { className?: string }) {
  return (
    <div className={`px-[6px] ${className}`}>
      <div
        className="w-full aspect-square border"
        style={{
          borderStyle: "dashed",
          borderColor: "rgba(255,45,255,0.06)",
          background: "linear-gradient(135deg, #140018, #1e0026, #140014)",
        }}
      >
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect x="0.5" y="0.5" width="99" height="99" stroke="#ff2dff" strokeWidth="0.8" fill="none" opacity="0.06" />
          <line x1="0.5" y1="0.5" x2="99.5" y2="99.5" stroke="#ff2dff" strokeWidth="0.8" opacity="0.06" />
          <line x1="99.5" y1="0.5" x2="0.5" y2="99.5" stroke="#ff2dff" strokeWidth="0.8" opacity="0.06" />
        </svg>
      </div>
    </div>
  )
}
