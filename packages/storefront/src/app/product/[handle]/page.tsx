import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getProduct, getProducts } from "@/lib/data"
import { AddToCartForm } from "@/components/product/AddToCartForm"
import { ProductImageGallery } from "@/components/product/ProductImageGallery"
import { ProductPageSkeleton } from "@/components/ui/Skeletons"
import { fmt } from "@/lib/utils"
import type { Metadata } from "next"

export const revalidate = 60

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) return { title: "MSWYSL" }
  return {
    title: `${product.band} — ${product.name} | MSWYSL`,
    description: product.description,
    openGraph: {
      images: product.image ? [product.image] : [],
    },
  }
}

/** Pre-render known product handles at build time */
export async function generateStaticParams() {
  const products = await getProducts({ limit: 100 })
  return products
    .filter((p) => p.handle)
    .map((p) => ({ handle: p.handle! }))
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) notFound()

  return (
    <Suspense fallback={<ProductPageSkeleton />}>
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div
          className="relative overflow-hidden border"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="scan-bar" />

          <div className="grid md:grid-cols-2 min-h-[500px]">
            {/* Image */}
            <ProductImageGallery product={product} />

            {/* Info */}
            <div className="p-6 md:p-8 flex flex-col gap-4">
              <div>
                <p
                  className="text-[8px] tracking-[3px] uppercase mb-1"
                  style={{ color: "var(--muted)" }}
                >
                  {product.band}
                </p>
                <p
                  className="text-[9px] tracking-[3px] mb-2"
                  style={{ color: "var(--pink)" }}
                >
                  {product.lin}
                </p>
                <h1
                  className="text-[28px] md:text-[36px] leading-[1.05] tracking-[2px] text-white"
                  style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                >
                  {product.name}
                </h1>
              </div>

              <p
                className="text-[32px] tracking-[1px]"
                style={{
                  color: "var(--orange)",
                  fontFamily: "var(--font-bebas), sans-serif",
                }}
              >
                {fmt(product.price)}
              </p>

              <p
                className="text-[11px] leading-[1.9]"
                style={{ color: "var(--muted)", fontFamily: "var(--font-share-tech), monospace" }}
              >
                {product.description}
              </p>

              <hr style={{ borderColor: "var(--border)" }} />

              {/* Add-to-cart form — client component */}
              <AddToCartForm product={product} />
            </div>
          </div>
        </div>

        {/* Breadcrumb back */}
        <div className="mt-6">
          <a
            href="/catalog"
            className="text-[9px] tracking-[2px] uppercase no-underline transition-opacity hover:opacity-70"
            style={{ color: "var(--muted)", fontFamily: "var(--font-share-tech), monospace" }}
          >
            ← BACK TO CATALOG
          </a>
        </div>
      </div>
    </Suspense>
  )
}
