import { Suspense } from "react"
import { Hero } from "@/components/home/Hero"
import { PromoStrip } from "@/components/home/PromoStrip"
import { NewArrivalsCarousel } from "@/components/home/NewArrivalsCarousel"
import { CategoryScroll } from "@/components/home/CategoryScroll"
import { ProductGrid } from "@/components/catalog/ProductGrid"
import { getProducts } from "@/lib/data"
import Link from "next/link"
import { GridSkeleton, CarouselSkeleton } from "@/components/ui/Skeletons"

// Revalidate this page every 60 seconds (ISR)
export const revalidate = 60

export default async function HomePage() {
  const products = await getProducts({ limit: 12 })

  const featured = products.filter((p) => p.featured)
  const preview  = products.slice(0, 8)

  return (
    <>
      <Hero />
      <PromoStrip />

      {/* New Arrivals */}
      <section className="relative z-10 max-w-[1400px] mx-auto px-4 py-8">
        <Suspense fallback={<CarouselSkeleton />}>
          <NewArrivalsCarousel products={featured} />
        </Suspense>
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

      {/* Featured Grid — server-rendered, no JS needed to display */}
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
        <Suspense fallback={<GridSkeleton rows={2} />}>
          <ProductGrid products={preview} maxRows={2} />
        </Suspense>
      </section>
    </>
  )
}
