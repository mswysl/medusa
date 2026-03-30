"use client"

import { useState } from "react"
import { ProductCardData } from "@/components/catalog/ProductCard"
import { useCart } from "@/lib/store"
import { STYLE_LABELS, spawnFire } from "@/lib/utils"

type Props = {
  product: ProductCardData
}

export function AddToCartForm({ product }: Props) {
  const [selStyle, setSelStyle] = useState<string | null>(
    product.styles.length === 1 ? product.styles[0] : null
  )
  const [selSize, setSelSize] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [added, setAdded] = useState(false)

  const { addItem, openCart, syncing } = useCart()

  async function handleAdd() {
    if (!selStyle) { setError("Select a style."); return }
    if (!selSize)  { setError("Select a size.");  return }
    setError("")

    await addItem({
      productId: product.id,
      variantId: resolveVariantId(product, selStyle, selSize),
      band: product.band,
      name: product.name,
      lin: product.lin,
      style: selStyle,
      size: selSize,
      price: product.price,
      image: product.image,
    })

    setAdded(true)
    spawnFire(8)
    setTimeout(() => setAdded(false), 1800)
    openCart()
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Style */}
      {product.styles.length > 1 && (
        <div>
          <p
            className="text-[8px] tracking-[2px] uppercase mb-2"
            style={{ color: "rgba(255,45,255,0.6)" }}
          >
            STYLE
          </p>
          <div className="flex gap-[6px] flex-wrap">
            {product.styles.map((s) => (
              <OptionBtn
                key={s}
                label={STYLE_LABELS[s] ?? s}
                selected={selStyle === s}
                onClick={() => { setSelStyle(s); setError("") }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size */}
      <div>
        <p
          className="text-[8px] tracking-[2px] uppercase mb-2"
          style={{ color: "rgba(255,45,255,0.6)" }}
        >
          SIZE
        </p>
        <div className="flex gap-[6px] flex-wrap">
          {product.sizes.map((sz) => (
            <OptionBtn
              key={sz}
              label={sz}
              selected={selSize === sz}
              onClick={() => { setSelSize(sz); setError("") }}
            />
          ))}
        </div>
      </div>

      {error && (
        <p className="text-[9px] tracking-[1px]" style={{ color: "#ff6060" }}>
          {error}
        </p>
      )}

      {/* Add button */}
      <button
        onClick={handleAdd}
        disabled={syncing}
        className="w-full py-[14px] text-base tracking-[4px] uppercase border-none cursor-pointer transition-all duration-200 disabled:opacity-60"
        style={{
          background: added ? "#fff" : "var(--pink)",
          color: "#000",
          fontFamily: "var(--font-bebas), sans-serif",
        }}
        onMouseEnter={(e) => {
          if (added || syncing) return
          const el = e.currentTarget as HTMLElement
          el.style.background = "#fff"
          el.style.boxShadow = "0 0 28px rgba(255,45,255,0.6)"
        }}
        onMouseLeave={(e) => {
          if (added) return
          const el = e.currentTarget as HTMLElement
          el.style.background = "var(--pink)"
          el.style.boxShadow = "none"
        }}
      >
        {syncing ? "ADDING..." : added ? "ADDED!" : "ADD TO CART"}
      </button>
    </div>
  )
}

function OptionBtn({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="border cursor-pointer text-[9px] tracking-[1px] py-1 px-[10px] transition-all duration-150 bg-transparent"
      style={{
        borderColor: selected ? "var(--pink)" : "var(--border)",
        color: selected ? "var(--pink)" : "var(--muted)",
        background: selected ? "rgba(255,45,255,0.1)" : "transparent",
        fontFamily: "var(--font-share-tech), monospace",
      }}
    >
      {label}
    </button>
  )
}

/** Find the variant ID matching the selected style + size options */
function resolveVariantId(
  product: ProductCardData,
  style: string,
  size: string
): string {
  if (!product.variants?.length) return product.variantId

  const match = product.variants.find((v: any) => {
    const opts = v.options ?? []
    const hasStyle = opts.some(
      (o: any) =>
        o.option?.title?.toLowerCase() === "style" && o.value === style
    )
    const hasSize = opts.some(
      (o: any) =>
        o.option?.title?.toLowerCase() === "size" && o.value === size
    )
    return hasStyle && hasSize
  })

  return match?.id ?? product.variantId
}
