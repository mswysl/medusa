"use client"

import { useRouter } from "next/navigation"
import { CATEGORIES } from "@/lib/utils"

type Props = {
  activeKey?: string
}

export function CategoryScroll({ activeKey = "all" }: Props) {
  const router = useRouter()

  return (
    <div className="flex gap-[10px] overflow-x-auto scrollbar-none py-[2px] pb-2">
      {CATEGORIES.map((cat) => {
        const isActive = cat.key === activeKey
        return (
          <div
            key={cat.key}
            onClick={() => router.push(`/catalog?cat=${cat.key}`)}
            className="flex-none flex flex-col items-center justify-center gap-[10px] py-[18px] px-3 cursor-pointer relative overflow-hidden border transition-all duration-200 hover:-translate-y-[2px]"
            style={{
              width: 140,
              background: isActive ? "rgba(255,45,255,0.08)" : "var(--card)",
              borderColor: isActive ? "var(--pink)" : "var(--border)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = "var(--pink)"
              el.style.boxShadow = "0 0 18px rgba(255,45,255,0.25)"
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = isActive ? "var(--pink)" : "var(--border)"
              el.style.boxShadow = "none"
            }}
          >
            {/* Flame tile */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url('/flamechain.png')",
                backgroundSize: "55px 55px",
                opacity: 0.07,
              }}
            />
            <div
              className="relative z-[1] w-16 h-16 rounded-full flex items-center justify-center text-[22px] border"
              style={{
                background: "linear-gradient(135deg, #1a0020, #2a0034)",
                borderColor: "var(--border)",
              }}
            >
              {cat.icon}
            </div>
            <div
              className="relative z-[1] text-[10px] tracking-[2px] uppercase text-center transition-colors duration-200"
              style={{ color: isActive ? "var(--pink)" : "#ccc" }}
            >
              {cat.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
