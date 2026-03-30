import { GridSkeleton } from "@/components/ui/Skeletons"

export default function CatalogLoading() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-10">
      <div className="flex items-baseline justify-between mt-5 mb-4">
        <div className="h-7 w-32 rounded animate-pulse" style={{ background: "var(--border)" }} />
        <div className="h-4 w-16 rounded animate-pulse" style={{ background: "var(--border)" }} />
      </div>
      <GridSkeleton rows={3} />
    </div>
  )
}
