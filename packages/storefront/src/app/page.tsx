"use client"

import { useState } from "react"
import { Hero } from "@/components/home/Hero"
import { PromoStrip } from "@/components/home/PromoStrip"
import { NewArrivalsCarousel } from "@/components/home/NewArrivalsCarousel"
import { CategoryScroll } from "@/components/home/CategoryScroll"
import { ProductGrid } from "@/components/catalog/ProductGrid"
import { ProductModal } from "@/components/product/ProductModal"
import { useProducts, STATIC_PRODUCTS } from "@/hooks/useProducts"
import { ProductCardData } from "@/components/catalog/ProductCard"
import Link from "next/link"

export default function HomePage() {
  const { products, loading } = useProducts()
  const [selected, setSelected] = useState<ProductCardData | null>(null)

  const displayProducts = loading ? STATIC_PRODUCTS : products
  const featured = displayProducts.filter((p) => p.featured)
  const preview = displayProducts.slice(0, 8)

  return (
    <>
      <Hero />
      <PromoStrip />

      {/* New Arrivals */}
      <section className="relative z-10 max-w-[1400px] mx-auto px-4 py-8">
        <NewArrivalsCarousel products={featured} onProductClick={setSelected} />
      </section>
      <hr style={{ borderColor: "var(--border)", margin: 0 }} />

      {/* Shop by Category */}
      <section className="relative z-10 max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex items-baseline justify-between mb-5">
          <h2
            className="font-display text-[26px] tracking-[3px] text-white"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            SHOP BY CATEGORY
          </h2>
          <Link
            href="/catalog"
            className="text-[9px] tracking-[2px] uppercase no-underline hover:opacity-70 transition-opacity"
            style={{ color: "var(--pink)" }}
          >
            SEE ALL
          </Link>
        </div>
        <CategoryScroll />
      </section>
      <hr style={{ borderColor: "var(--border)", margin: 0 }} />

      {/* Featured Grid */}
      <section className="relative z-10 max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex items-baseline justify-between mb-5">
          <h2
            className="font-display text-[26px] tracking-[3px] text-white"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            FEATURED
          </h2>
          <Link
            href="/catalog"
            className="text-[9px] tracking-[2px] uppercase no-underline hover:opacity-70 transition-opacity"
            style={{ color: "var(--pink)" }}
          >
            VIEW ALL
          </Link>
        </div>
        <ProductGrid products={preview} onProductClick={setSelected} maxRows={2} />
      </section>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  )
}
