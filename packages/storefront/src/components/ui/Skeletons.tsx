/** Skeleton shimmer components for Suspense fallbacks */

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{ background: "rgba(255,45,255,0.08)" }}
    />
  )
}

export function GridSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: rows }).map((_, ri) => (
        <div
          key={ri}
          className="grid gap-0 items-stretch"
          style={{ gridTemplateColumns: "36px 1fr 5px 1fr 5px 1fr 5px 1fr 36px" }}
        >
          <div />
          {Array.from({ length: 4 }).map((_, ci) => (
            <>
              {ci > 0 && <div key={`sp-${ci}`} style={{ width: 5 }} />}
              <div key={`c-${ci}`} className="px-[6px] flex flex-col gap-2">
                <Shimmer className="h-3 w-16 mb-1" />
                <Shimmer className="w-full aspect-square" />
                <Shimmer className="h-3 w-full" />
                <Shimmer className="h-3 w-10" />
              </div>
            </>
          ))}
          <div />
        </div>
      ))}
    </div>
  )
}

export function CarouselSkeleton() {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-5">
        <Shimmer className="h-7 w-48" />
      </div>
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-none flex flex-col items-center gap-2" style={{ width: 130 }}>
            <Shimmer className="rounded-full" style={{ width: 110, height: 110 } as React.CSSProperties} />
            <Shimmer className="h-3 w-24" />
            <Shimmer className="h-3 w-12" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProductPageSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 min-h-[500px]">
        <Shimmer className="w-full aspect-square" />
        <div className="flex flex-col gap-4">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-8 w-3/4" />
          <Shimmer className="h-10 w-28" />
          <Shimmer className="h-16 w-full" />
          <div className="flex gap-2">
            {[1, 2].map((i) => <Shimmer key={i} className="h-8 w-20" />)}
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => <Shimmer key={i} className="h-8 w-12" />)}
          </div>
          <Shimmer className="h-12 w-full mt-2" />
        </div>
      </div>
    </div>
  )
}
