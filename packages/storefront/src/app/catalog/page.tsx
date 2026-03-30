"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { CategoryScroll } from "@/components/home/CategoryScroll"
import { ProductGrid } from "@/components/catalog/ProductGrid"
import { ProductModal } from "@/components/product/ProductModal"
import { useProducts, STATIC_PRODUCTS } from "@/hooks/useProducts"
import { ProductCardData } from "@/components/catalog/ProductCard"

export default function CatalogPage() {
  const searchParams = useSearchParams()
  const catParam = searchParams.get("cat") ?? "all"
  const qParam = searchParams.get("q") ?? undefined

  const { products, loading } = useProducts(catParam !== "all" ? catParam : undefined, qParam)
  const [selected, setSelected] = useState<ProductCardData | null>(null)

  const displayProducts = loading ? STATIC_PRODUCTS : products
  const filtered = catParam === "all"
    ? displayProducts
    : displayProducts.filter((p) => p.category === catParam)

  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-10">
      {/* Header */}
      <div className="flex items-baseline justify-between mt-5 mb-4">
        <h2
          className="font-display text-[26px] tracking-[3px] text-white"
          style={{ fontFamily: "var(--font-bebas), sans-serif" }}
        >
          {qParam ? `SEARCH: ${qParam.toUpperCase()}` : "CATALOG"}
        </h2>
        <span className="text-[9px] tracking-[2px]" style={{ color: "var(--muted)" }}>
          {filtered.length} ITEMS
        </span>
      </div>

      {/* Category filter */}
      {!qParam && (
        <div className="mb-5">
          <CategoryScroll activeKey={catParam} />
        </div>
      )}

      {/* Grid */}
      <ProductGrid products={filtered} onProductClick={setSelected} />

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
