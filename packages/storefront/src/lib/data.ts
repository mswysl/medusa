/**
 * Server-side data fetching — runs only on the server (no publishable key needed).
 * These functions call the Medusa store API directly using the internal backend URL.
 * Never import this file from a "use client" component.
 */

import { cache } from "react"
import { ProductCardData } from "@/components/catalog/ProductCard"

const BACKEND = process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000"
const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ""

const PRODUCT_FIELDS =
  "id,title,handle,description,thumbnail,status,metadata," +
  "variants.id,variants.title,variants.prices.amount,variants.prices.currency_code," +
  "variants.calculated_price.calculated_amount," +
  "options.id,options.title,options.values.value," +
  "categories.id,categories.handle,categories.name," +
  "images.url"

async function storeGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BACKEND}/store${path}`)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v)
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      "x-publishable-api-key": PUB_KEY,
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 }, // ISR: revalidate product data every 60s
  })

  if (!res.ok) {
    throw new Error(`Medusa store API error ${res.status}: ${path}`)
  }

  return res.json()
}

// ─── Mapper ──────────────────────────────────────────────────

function mapProduct(p: any): ProductCardData {
  const variant = p.variants?.[0]
  const styleOpt = p.options?.find((o: any) =>
    o.title?.toLowerCase() === "style"
  )
  const sizeOpt = p.options?.find((o: any) =>
    o.title?.toLowerCase() === "size"
  )

  return {
    id: p.id,
    variantId: variant?.id ?? p.id,
    lin: (p.metadata?.lin as string) ?? p.handle?.toUpperCase() ?? p.id,
    band: (p.metadata?.band as string) ?? "UNKNOWN",
    name: p.title,
    price:
      variant?.calculated_price?.calculated_amount ??
      variant?.prices?.[0]?.amount ??
      0,
    image: p.thumbnail ?? p.images?.[0]?.url ?? null,
    featured: Boolean(p.metadata?.featured),
    styles: styleOpt?.values?.map((v: any) => v.value) ?? ["SS-1"],
    sizes: sizeOpt?.values?.map((v: any) => v.value) ?? [
      "S","M","L","XL","XXL",
    ],
    description: p.description ?? "",
    category: p.categories?.[0]?.handle ?? "ss1",
    handle: p.handle,
    variants: p.variants ?? [],
  }
}

// ─── Public API ───────────────────────────────────────────────

export type { ProductCardData }

/** All products, optionally filtered by category handle or search query. */
export const getProducts = cache(
  async (options?: { category?: string; q?: string; limit?: number }) => {
    const params: Record<string, string> = {
      fields: PRODUCT_FIELDS,
      limit: String(options?.limit ?? 100),
    }

    if (options?.category && options.category !== "all") {
      params["category_handle[]"] = options.category
    }
    if (options?.q) {
      params["q"] = options.q
    }

    try {
      const data = await storeGet<{ products: any[] }>("/products", params)
      return (data.products ?? []).map(mapProduct)
    } catch {
      return []
    }
  }
)

/** Single product by handle. */
export const getProduct = cache(async (handle: string) => {
  try {
    const data = await storeGet<{ products: any[] }>("/products", {
      fields: PRODUCT_FIELDS,
      handle,
      limit: "1",
    })
    const p = data.products?.[0]
    return p ? mapProduct(p) : null
  } catch {
    return null
  }
})

/** All product categories. */
export const getCategories = cache(async () => {
  try {
    const data = await storeGet<{ product_categories: any[] }>(
      "/product-categories",
      { fields: "id,handle,name,description", limit: "50" }
    )
    return data.product_categories ?? []
  } catch {
    return []
  }
})
