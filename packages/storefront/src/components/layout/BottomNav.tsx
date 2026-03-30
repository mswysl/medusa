"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
  {
    href: "/",
    label: "HOME",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
      </svg>
    ),
  },
  {
    href: "/catalog",
    label: "CATALOG",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: "/checkout",
    label: "ORDER",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    href: "/info",
    label: "INFO",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[300] flex justify-around items-center border-t"
      style={{
        background: "rgba(6,0,10,0.96)",
        backdropFilter: "blur(12px)",
        borderColor: "var(--border)",
        height: "calc(56px + var(--safe-bot))",
        paddingBottom: "var(--safe-bot)",
      }}
    >
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-[3px] flex-1 py-[6px] px-4 text-[8px] tracking-[2px] uppercase no-underline transition-colors duration-200"
            style={{
              color: isActive ? "var(--pink)" : "var(--muted)",
              fontFamily: "var(--font-share-tech), monospace",
              filter: isActive ? "drop-shadow(0 0 4px var(--pink))" : "none",
            }}
          >
            {icon}
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
