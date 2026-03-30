"use client"

import { useState, useRef } from "react"
import { useCart } from "@/lib/store"
import { fmt, spawnFire } from "@/lib/utils"
import { medusa } from "@/lib/medusa"

const STYLES = ["", "SS-1", "SS-2", "LS", "HD"]
const SIZES  = ["", "S", "M", "L", "XL", "XXL", "3XL"]
const ROWS   = 9

export default function CheckoutPage() {
  const { items, cartId, total, clearCart } = useCart()
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const firstNameRef = useRef<HTMLInputElement>(null)

  const cartTotal = total()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fn = firstNameRef.current
    if (!fn?.value.trim()) {
      fn?.classList.add("border-red-500")
      fn?.focus()
      setTimeout(() => fn?.classList.remove("border-red-500"), 2000)
      return
    }

    setSubmitting(true)
    try {
      // In production this would call the Medusa checkout workflow via API.
      // For now we simulate success and fire particles.
      await new Promise((r) => setTimeout(r, 800))
      setSuccess(true)
      clearCart()
      for (let i = 0; i < 36; i++) setTimeout(spawnFire, i * 50)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-[900px] mx-auto px-4 py-8">
      <div
        className="relative overflow-hidden border p-7"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="scan-bar" />

        {success ? (
          <div className="text-center py-7">
            <p
              className="font-display text-[22px] tracking-[5px]"
              style={{ color: "var(--pink)", textShadow: "0 0 20px var(--pink)", fontFamily: "var(--font-bebas), sans-serif" }}
            >
              ☠ ORDER RECEIVED — HAILS ☠
            </p>
            <p className="text-[11px] tracking-[2px] mt-2" style={{ color: "var(--muted)", fontFamily: "var(--font-share-tech), monospace" }}>
              YOUR ORDER HAS ENTERED THE VOID
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Cart summary */}
            <p
              className="font-display text-[18px] tracking-[4px] mb-4"
              style={{ color: "var(--pink)", textShadow: "0 0 8px rgba(255,45,255,0.4)", fontFamily: "var(--font-bebas), sans-serif" }}
            >
              T-SHIRT ORDER FORM
            </p>

            <table className="w-full border-collapse mb-7">
              <thead>
                <tr>
                  {["#", "LIN", "STYLE", "SIZE", "QTY"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[8px] tracking-[3px] uppercase py-[9px] px-3 border"
                      style={{
                        background: "rgba(255,45,255,0.1)",
                        borderColor: "rgba(255,45,255,0.25)",
                        color: "var(--pink)",
                        fontFamily: "var(--font-share-tech), monospace",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: ROWS }).map((_, i) => {
                  const cartItem = items[i]
                  return (
                    <tr key={i}>
                      <td
                        className="text-center text-[8px] w-9 py-0 border"
                        style={{
                          background: "rgba(255,45,255,0.04)",
                          borderColor: "rgba(255,45,255,0.1)",
                          color: "rgba(255,45,255,0.35)",
                          fontFamily: "var(--font-share-tech), monospace",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </td>
                      <td className="border p-0" style={{ borderColor: "rgba(255,45,255,0.1)" }}>
                        <input
                          type="text"
                          defaultValue={cartItem?.lin ?? ""}
                          placeholder="LIN-XXX"
                          className="w-full bg-transparent border-none outline-none text-[#ddd] py-[10px] px-3 text-[11px] focus:bg-[rgba(255,45,255,0.07)]"
                          style={{ fontFamily: "var(--font-share-tech), monospace" }}
                        />
                      </td>
                      <td className="border p-0" style={{ borderColor: "rgba(255,45,255,0.1)" }}>
                        <select
                          defaultValue={cartItem?.style ?? ""}
                          className="w-full bg-transparent border-none outline-none text-[#ddd] py-[10px] px-3 text-[11px]"
                          style={{ fontFamily: "var(--font-share-tech), monospace", background: "#0f0010" }}
                        >
                          {STYLES.map((s) => (
                            <option key={s} value={s} style={{ background: "#1a001a", color: "#ddd" }}>
                              {s || "-- SELECT --"}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border p-0" style={{ borderColor: "rgba(255,45,255,0.1)" }}>
                        <select
                          defaultValue={cartItem?.size ?? ""}
                          className="w-full bg-transparent border-none outline-none text-[#ddd] py-[10px] px-3 text-[11px]"
                          style={{ fontFamily: "var(--font-share-tech), monospace", background: "#0f0010" }}
                        >
                          {SIZES.map((s) => (
                            <option key={s} value={s} style={{ background: "#1a001a", color: "#ddd" }}>
                              {s || "-- SELECT --"}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border p-0" style={{ borderColor: "rgba(255,45,255,0.1)" }}>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          defaultValue={cartItem?.qty ?? ""}
                          placeholder="1"
                          className="w-[58px] bg-transparent border-none outline-none text-[#ddd] py-[10px] px-3 text-[11px]"
                          style={{ fontFamily: "var(--font-share-tech), monospace" }}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {cartTotal > 0 && (
              <div className="flex justify-end mb-6">
                <span
                  className="font-display text-[22px] tracking-[1px]"
                  style={{ color: "var(--orange)", fontFamily: "var(--font-bebas), sans-serif" }}
                >
                  TOTAL: {fmt(cartTotal)}
                </span>
              </div>
            )}

            <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "24px 0" }} />

            {/* Shipping */}
            <p
              className="font-display text-[18px] tracking-[4px] mb-4"
              style={{ color: "var(--pink)", fontFamily: "var(--font-bebas), sans-serif" }}
            >
              SHIPPING
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {[
                { label: "First Name", id: "fn", placeholder: "FIRST NAME", ref: firstNameRef },
                { label: "Last Name", placeholder: "LAST NAME" },
              ].map((f, i) => (
                <FieldGroup key={i} label={f.label} placeholder={f.placeholder} inputRef={f.ref} />
              ))}
              <FieldGroup label="Street Address" placeholder="STREET ADDRESS" className="md:col-span-2" />
              <FieldGroup label="Address Line 2" placeholder="APT / SUITE" className="md:col-span-2" />
              <FieldGroup label="City" placeholder="CITY" />
              <FieldGroup label="State / Province" placeholder="STATE" />
              <FieldGroup label="Postal / Zip" placeholder="ZIP" />
              <FieldGroup label="Country" placeholder="COUNTRY" />
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "24px 0" }} />

            {/* Payment — Stripe Elements would mount here */}
            <p
              className="font-display text-[18px] tracking-[4px] mb-4"
              style={{ color: "var(--pink)", fontFamily: "var(--font-bebas), sans-serif" }}
            >
              PAYMENT
            </p>
            <div
              className="border p-4 mb-6 text-center"
              style={{ borderColor: "var(--border)", background: "rgba(255,45,255,0.03)" }}
            >
              <p className="text-[10px] tracking-[2px]" style={{ color: "var(--muted)", fontFamily: "var(--font-share-tech), monospace" }}>
                STRIPE ELEMENTS MOUNT HERE
              </p>
              <p className="text-[9px] mt-1" style={{ color: "var(--dim)", fontFamily: "var(--font-share-tech), monospace" }}>
                Connect NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to enable card input
              </p>
            </div>

            <div className="text-center pt-3">
              <button
                type="submit"
                disabled={submitting}
                className="font-display text-[18px] tracking-[5px] py-[14px] px-[52px] border-none cursor-pointer transition-all duration-300 disabled:opacity-60"
                style={{
                  background: "var(--pink)",
                  color: "#000",
                  fontFamily: "var(--font-bebas), sans-serif",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = "#fff"
                  el.style.boxShadow = "0 0 28px rgba(255,45,255,0.6)"
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = "var(--pink)"
                  el.style.boxShadow = "none"
                }}
              >
                {submitting ? "PROCESSING..." : "PURCHASE"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function FieldGroup({
  label,
  placeholder,
  className = "",
  inputRef,
}: {
  label: string
  placeholder: string
  className?: string
  inputRef?: React.RefObject<HTMLInputElement>
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        className="text-[8px] tracking-[2px] uppercase"
        style={{ color: "rgba(255,45,255,0.55)" }}
      >
        {label}
      </label>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="py-[9px] px-3 text-[12px] outline-none transition-all duration-200 text-[#ddd] placeholder:text-[--dim]"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,45,255,0.15)",
          fontFamily: "var(--font-share-tech), monospace",
        }}
        onFocus={(e) => {
          const el = e.currentTarget
          el.style.borderColor = "var(--pink)"
          el.style.background = "rgba(255,45,255,0.05)"
          el.style.boxShadow = "0 0 10px rgba(255,45,255,0.2)"
        }}
        onBlur={(e) => {
          const el = e.currentTarget
          el.style.borderColor = "rgba(255,45,255,0.15)"
          el.style.background = "rgba(255,255,255,0.03)"
          el.style.boxShadow = "none"
        }}
      />
    </div>
  )
}
