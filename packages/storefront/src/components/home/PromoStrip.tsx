import Link from "next/link"

export function PromoStrip() {
  return (
    <Link
      href="/catalog"
      className="block py-[10px] px-4 text-center z-10 relative no-underline"
      style={{
        background: "linear-gradient(90deg, var(--dpink), #6600cc, var(--dpink))",
        backgroundSize: "200% 100%",
        animation: "promoShift 6s linear infinite",
      }}
    >
      <p
        className="font-display text-[14px] tracking-[4px] text-white"
        style={{ fontFamily: "var(--font-bebas), sans-serif" }}
      >
        NEW ARRIVALS —{" "}
        <span style={{ color: "#ffd200" }}>
          SCATTERED REMNANTS · EMPEROR · MORBID ANGEL
        </span>{" "}
        — SHOP NOW ▶
      </p>
    </Link>
  )
}
