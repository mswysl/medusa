"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/store"

export function Header() {
  const { count, openCart } = useCart()
  const cartCount = count()
  const [query, setQuery] = useState("")
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/catalog?q=${encodeURIComponent(query.trim())}`)
    setQuery("")
    inputRef.current?.blur()
  }

  return (
    <header
      className="sticky top-0 z-[200] border-b"
      style={{
        background: "rgba(6,0,10,0.92)",
        backdropFilter: "blur(12px)",
        borderColor: "var(--border)",
        paddingTop: "var(--safe-top)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 h-[52px] flex items-center justify-between relative">
        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 flex-1 max-w-[240px] px-3 py-[6px]"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50 flex-shrink-0">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="SEARCH..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-white font-mono-brand text-[10px] tracking-[2px] w-full placeholder:text-[--muted]"
            style={{ fontFamily: "var(--font-share-tech), monospace" }}
          />
        </form>

        {/* Wordmark */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-display text-[22px] tracking-[4px] whitespace-nowrap no-underline"
          style={{ color: "var(--pink)", textShadow: "0 0 16px var(--pink)", fontFamily: "var(--font-bebas), sans-serif" }}
        >
          MSWYSL
        </Link>

        {/* Cart */}
        <div className="flex items-center gap-4 justify-end flex-1">
          <button
            onClick={openCart}
            className="relative flex items-center gap-[5px] bg-none border-none cursor-pointer text-[10px] tracking-[2px] uppercase transition-colors duration-200 p-[6px]"
            style={{ color: "var(--muted)", fontFamily: "var(--font-share-tech), monospace" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--pink)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--muted)")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <span
                className="absolute top-0 right-0 text-black font-bold text-[8px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-[3px]"
                style={{ background: "var(--pink)" }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
