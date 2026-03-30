"use client"

import { useState } from "react"
import Image from "next/image"
import { ProductCardData } from "@/components/catalog/ProductCard"

type Props = {
  product: ProductCardData
}

export function ProductImageGallery({ product }: Props) {
  const images: string[] = [
    ...(product.image ? [product.image] : []),
    ...(product.variants
      ?.flatMap((v: any) => v.images ?? [])
      .map((img: any) => (typeof img === "string" ? img : img.url))
      .filter(Boolean) ?? []),
  ]

  const [active, setActive] = useState(0)

  return (
    <div
      className="relative flex flex-col border-r md:border-b-0 border-b overflow-hidden min-h-[340px]"
      style={{
        background: "linear-gradient(135deg, #140018, #1e0026)",
        borderColor: "var(--border)",
      }}
    >
      {/* Flame tile */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/flamechain.png')",
          backgroundSize: "60px 60px",
          opacity: 0.1,
        }}
      />

      {/* Main image */}
      <div className="relative flex-1 flex items-center justify-center min-h-[300px]">
        {images.length > 0 ? (
          <Image
            src={images[active]}
            alt={product.name}
            fill
            className="object-contain relative z-[1]"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-[1] w-32 h-32 opacity-20"
          >
            <rect x="0.5" y="0.5" width="99" height="99" stroke="#ff2dff" strokeWidth="1" fill="none" />
            <line x1="0.5" y1="0.5" x2="99.5" y2="99.5" stroke="#ff2dff" strokeWidth="1" />
            <line x1="99.5" y1="0.5" x2="0.5" y2="99.5" stroke="#ff2dff" strokeWidth="1" />
          </svg>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="relative z-[2] flex gap-2 p-3 overflow-x-auto scrollbar-none">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="flex-none w-14 h-14 border overflow-hidden transition-all duration-200"
              style={{
                borderColor: i === active ? "var(--pink)" : "var(--border)",
                boxShadow: i === active ? "0 0 8px rgba(255,45,255,0.4)" : "none",
                background: "#140018",
              }}
            >
              <Image src={src} alt="" width={56} height={56} className="object-cover w-full h-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
