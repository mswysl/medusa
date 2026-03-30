"use client"

import { useEffect, useState } from "react"
import { medusa } from "@/lib/medusa"
import { ProductCardData } from "@/components/catalog/ProductCard"
import { STYLE_LABELS } from "@/lib/utils"

/** Map a Medusa product + first variant to our UI shape */
function mapProduct(p: any): ProductCardData {
  const variant = p.variants?.[0]
  const option = p.options?.[0]
  const styleOpt = p.options?.find((o: any) => o.title?.toLowerCase() === "style")
  const sizeOpt = p.options?.find((o: any) => o.title?.toLowerCase() === "size")

  return {
    id: p.id,
    variantId: variant?.id ?? p.id,
    lin: p.metadata?.lin ?? p.handle?.toUpperCase().replace(/-/g, "-") ?? p.id,
    band: p.metadata?.band ?? p.collection?.title ?? "UNKNOWN",
    name: p.title,
    price: variant?.calculated_price?.calculated_amount ?? variant?.prices?.[0]?.amount ?? 0,
    image: p.thumbnail ?? p.images?.[0]?.url ?? null,
    featured: !!p.metadata?.featured,
    styles: styleOpt?.values?.map((v: any) => v.value) ?? ["SS-1"],
    sizes: sizeOpt?.values?.map((v: any) => v.value) ?? ["S", "M", "L", "XL", "XXL"],
    description: p.description ?? "",
    category: p.categories?.[0]?.handle ?? "ss1",
  }
}

export function useProducts(category?: string, query?: string) {
  const [products, setProducts] = useState<ProductCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetch() {
      setLoading(true)
      setError(null)
      try {
        const params: Record<string, any> = {
          limit: 100,
          fields: "+metadata,+collection.*,+categories.*,+variants.*,+options.*,+images.*",
        }
        if (category && category !== "all") {
          params["category_handle[]"] = category
        }
        if (query) {
          params["q"] = query
        }
        const res = await medusa.store.product.list(params)
        if (!cancelled) {
          setProducts((res.products ?? []).map(mapProduct))
        }
      } catch (err: any) {
        if (!cancelled) {
          // Fall back to static data in dev if backend unreachable
          setError(err?.message ?? "Failed to load products")
          setProducts(STATIC_PRODUCTS)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetch()
    return () => { cancelled = true }
  }, [category, query])

  return { products, loading, error }
}

// ─── Static fallback data (mirrors HTML prototype) ─────────
export const STATIC_PRODUCTS: ProductCardData[] = [
  { id: "LIN-001", variantId: "v1", lin: "LIN-001", band: "MORBID ANGEL",      name: "GATEWAYS TO ANNIHILATION", price: 3899, description: "Single-sided front print. Heavyweight 6oz black cotton. Official bootleg-style print.", styles: ["SS-1"], sizes: ["S","M","L","XL","XXL","3XL"], category: "ss1", featured: true,  image: null },
  { id: "LIN-002", variantId: "v2", lin: "LIN-002", band: "EMPEROR",            name: "EMPERIAL ANTHEMS TOUR LS",  price: 6500, description: "Long sleeve with full tour dates back print. Front logo left chest. Heavy 7oz ring-spun.", styles: ["LS"],   sizes: ["S","M","L","XL","XXL"],       category: "ls",  featured: true,  image: null },
  { id: "LIN-003", variantId: "v3", lin: "LIN-003", band: "SCATTERED REMNANTS", name: "INHERENT PERVERSION LS",   price: 6500, description: "Double-sided design. Front obscure artwork, full back print. Heavyweight cotton.",   styles: ["LS"],   sizes: ["S","M","L","XL","XXL","3XL"], category: "ls",  featured: false, image: null },
  { id: "LIN-004", variantId: "v4", lin: "LIN-004", band: "DARKTHRONE",         name: "SOULSIDE JOURNEY HOODIE",  price: 6199, description: "Pullover hoodie. Front chest sigil. Full back print. 14oz fleece. Double-lined hood.", styles: ["HD"],   sizes: ["S","M","L","XL","XXL"],       category: "hd",  featured: true,  image: null },
  { id: "LIN-005", variantId: "v5", lin: "LIN-005", band: "SCATTERED REMNANTS", name: "VAGINAL VOMIT LS",         price: 6500, description: "All-over back print. Distressed wash. 7oz heavyweight cotton. Long sleeve cut.",      styles: ["LS"],   sizes: ["S","M","L","XL","XXL","3XL"], category: "ls",  featured: false, image: null },
  { id: "LIN-006", variantId: "v6", lin: "LIN-006", band: "COFFINS",            name: "DOAM TS",                  price: 3889, description: "Double-sided tee. Front album art, back track list. 6oz black cotton. Screen printed.", styles: ["SS-2"], sizes: ["S","M","L","XL","XXL"],       category: "ss2", featured: false, image: null },
  { id: "LIN-007", variantId: "v7", lin: "LIN-007", band: "BRUJERIA",           name: "MATANDO GUEROS TS",        price: 3899, description: "Single-sided front print. Classic death metal artwork. Heavyweight black cotton.",    styles: ["SS-1"], sizes: ["S","M","L","XL","XXL","3XL"], category: "ss1", featured: false, image: null },
  { id: "LIN-008", variantId: "v8", lin: "LIN-008", band: "GOREMENT",           name: "THE ENDING QUEST TS",      price: 2399, description: "Single-sided. Vintage hand-drawn artwork. Old school death metal. 5.5oz cotton.",    styles: ["SS-1"], sizes: ["S","M","L","XL","XXL"],       category: "ss1", featured: true,  image: null },
  { id: "LIN-009", variantId: "v9", lin: "LIN-009", band: "INCANTATION",        name: "MORTAL THRONE LS",         price: 5800, description: "Long sleeve. Front and sleeve print. Tour-style graphic. 7oz ring-spun black cotton.", styles: ["LS"],  sizes: ["S","M","L","XL","XXL","3XL"], category: "ls",  featured: false, image: null },
  { id: "LIN-010", variantId: "v10",lin: "LIN-010", band: "AUTOPSY",            name: "ACTS OF THE UNSPEAKABLE",  price: 3499, description: "Double-sided. Classic goregrind artwork front and back. Garment dyed black cotton.",  styles: ["SS-2"], sizes: ["S","M","L","XL","XXL"],       category: "ss2", featured: false, image: null },
  { id: "LIN-011", variantId: "v11",lin: "LIN-011", band: "OBITUARY",           name: "CAUSE OF DEATH TS",        price: 3299, description: "Single-sided front print. Iconic death metal artwork. 100% black ring-spun cotton.",  styles: ["SS-1"], sizes: ["S","M","L","XL","XXL","3XL"], category: "ss1", featured: false, image: null },
  { id: "LIN-012", variantId: "v12",lin: "LIN-012", band: "BOLT THROWER",       name: "REALM OF CHAOS HOODIE",    price: 7200, description: "Heavyweight pullover. Full front illustration. Kangaroo pocket. 14oz double fleece.", styles: ["HD"],   sizes: ["S","M","L","XL","XXL"],       category: "hd",  featured: true,  image: null },
]
