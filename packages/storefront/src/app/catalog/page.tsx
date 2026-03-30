import { Suspense } from "react"
import { CategoryScroll } from "@/components/home/CategoryScroll"
import { ProductGrid } from "@/components/catalog/ProductGrid"
import { getProducts } from "@/lib/data"
import { GridSkeleton } from "@/components/ui/Skeletons"

export const revalidate = 60

type Props = {
  searchParams: Promise<{ cat?: string; q?: string }>
}

export default async function CatalogPage({ searchParams }: Props) {
  const { cat: catParam = "all", q: qParam } = await searchParams

  const products = await getProducts({
    category: catParam !== "all" ? catParam : undefined,
    q: qParam,
  })

  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-10">
      {/* Header */}
      <div className="flex items-baseline justify-between mt-5 mb-4">
        <h2
          className="font-display text-[26px] tracking-[3px] text-white"
          style={{ fontFamily: "var(--font-bebas), sans-serif" }}
        >
          {qParam
            ? `SEARCH: ${qParam.toUpperCase()}`
            : catParam !== "all"
            ? catParam.toUpperCase()
            : "CATALOG"}
        </h2>
        <span
          className="text-[9px] tracking-[2px]"
          style={{ color: "var(--muted)" }}
        >
          {products.length} ITEMS
        </span>
      </div>

      {/* Category filter — only shown when not in search mode */}
      {!qParam && (
        <div className="mb-5">
          <CategoryScroll activeKey={catParam} />
        </div>
      )}

      {/* Grid */}
      <Suspense fallback={<GridSkeleton rows={3} />}>
        <ProductGrid products={products} />
      </Suspense>
    </div>
  )
}

/** Pre-render each category at build time */
export async function generateStaticParams() {
  return [
    { },
    { cat: "ss1" },
    { cat: "ss2" },
    { cat: "ls" },
    { cat: "hd" },
  ]
}
