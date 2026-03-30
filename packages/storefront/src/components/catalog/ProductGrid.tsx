import Link from "next/link"
import { ProductCardData } from "./ProductCard"
import { ProductCard, EmptyCard } from "./ProductCard"

type Props = {
  products: ProductCardData[]
  maxRows?: number
}

const COLS = 4

function Spine({ className = "" }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        alignSelf: "stretch",
        minHeight: 140,
        background:
          "linear-gradient(180deg, transparent 8%, rgba(255,45,255,0.4) 50%, transparent 92%)",
        borderLeft: "1px solid rgba(255,45,255,0.25)",
        borderRight: "1px solid rgba(255,45,255,0.25)",
        width: 5,
        flexShrink: 0,
      }}
    />
  )
}

export function ProductGrid({ products, maxRows }: Props) {
  const items = maxRows ? products.slice(0, maxRows * COLS) : products

  if (!items.length) {
    return (
      <p
        className="text-center py-10 text-[10px] tracking-[3px]"
        style={{ color: "var(--muted)" }}
      >
        NO ITEMS
      </p>
    )
  }

  const rows: ProductCardData[][] = []
  for (let i = 0; i < items.length; i += COLS) {
    rows.push(items.slice(i, i + COLS))
  }

  return (
    <div className="flex flex-col gap-6">
      {rows.map((row, ri) => (
        <div
          key={ri}
          className="grid items-stretch"
          style={{
            gridTemplateColumns: "36px 1fr 5px 1fr 5px 1fr 5px 1fr 36px",
          }}
        >
          {/* Arrow decorations */}
          <div className="flex items-center justify-center">
            <span className="text-[20px] opacity-60" style={{ color: "var(--pink)" }}>←</span>
          </div>

          {Array.from({ length: COLS }).map((_, ci) => (
            <>
              {ci > 0 && (
                <Spine
                  key={`spine-${ri}-${ci}`}
                  className={
                    ci === 3 ? "hidden xl:block" : ci === 2 ? "hidden lg:block" : ""
                  }
                />
              )}
              {row[ci] ? (
                <Link
                  key={row[ci].id}
                  href={`/product/${row[ci].handle ?? row[ci].id}`}
                  className={`no-underline ${ci === 3 ? "hidden xl:block" : ci === 2 ? "hidden lg:block" : ""}`}
                >
                  <ProductCard product={row[ci]} />
                </Link>
              ) : (
                <EmptyCard
                  key={`empty-${ri}-${ci}`}
                  className={
                    ci === 3 ? "hidden xl:block" : ci === 2 ? "hidden lg:block" : ""
                  }
                />
              )}
            </>
          ))}

          <div className="flex items-center justify-center">
            <span className="text-[20px] opacity-60" style={{ color: "var(--pink)" }}>→</span>
          </div>
        </div>
      ))}
    </div>
  )
}
