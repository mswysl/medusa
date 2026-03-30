import Link from "next/link"
import Image from "next/image"

export function Hero() {
  return (
    <div
      className="relative z-10 grid md:grid-cols-2 border-b"
      style={{ minHeight: 340, borderColor: "var(--border)" }}
    >
      {/* Logo panel */}
      <div
        className="relative overflow-hidden flex items-center justify-center min-h-[280px]"
        style={{ background: "linear-gradient(135deg, #100018, #1e0030, #100018)" }}
      >
        {/* Flame tile */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/flamechain.png')",
            backgroundSize: "70px 70px",
            backgroundRepeat: "repeat",
            opacity: 0.18,
          }}
        />
        <div className="relative z-[2] w-full px-6 py-6">
          <div style={{ animation: "glitchShift 8s infinite", display: "inline-block", width: "100%" }}>
            <Image
              src="/3dweblogo.png"
              alt="MSWYSL"
              width={380}
              height={200}
              className="w-full max-w-[380px] mx-auto block"
              style={{ animation: "logoGlow 3s ease-in-out infinite alternate" }}
              priority
            />
          </div>
        </div>
      </div>

      {/* Copy panel */}
      <div className="flex flex-col justify-center px-8 py-8 gap-4">
        <p className="text-[9px] tracking-[5px] uppercase" style={{ color: "var(--orange)" }}>
          ☠ Est. Underground
        </p>
        <h1
          className="font-display leading-[0.95] tracking-[2px]"
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: "clamp(36px, 5vw, 64px)",
          }}
        >
          TRUE
          <br />
          <em
            className="not-italic"
            style={{ color: "var(--pink)", textShadow: "0 0 20px var(--pink)" }}
          >
            Underground
          </em>
          <br />
          Tees
        </h1>
        <p className="text-[10px] tracking-[1px] leading-[1.7] max-w-[280px]" style={{ color: "var(--muted)" }}>
          Death metal. Black metal. Grind. Doom.
          <br />
          No reissues. No mainstream. Just the real thing.
        </p>
        <div className="flex gap-[10px] flex-wrap">
          <Link
            href="/catalog"
            className="font-display text-[14px] tracking-[3px] py-3 px-7 border-none cursor-pointer no-underline transition-all duration-200 inline-block text-center"
            style={{
              background: "var(--pink)",
              color: "#000",
              fontFamily: "var(--font-bebas), sans-serif",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = "#fff"
              el.style.boxShadow = "0 0 24px rgba(255,45,255,0.6)"
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = "var(--pink)"
              el.style.boxShadow = "none"
            }}
          >
            SHOP NOW
          </Link>
          <Link
            href="/info"
            className="font-display text-[14px] tracking-[3px] py-3 px-7 cursor-pointer no-underline transition-all duration-200 inline-block text-center"
            style={{
              background: "none",
              color: "var(--pink)",
              border: "1px solid var(--pink)",
              fontFamily: "var(--font-bebas), sans-serif",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = "rgba(255,45,255,0.12)"
              el.style.boxShadow = "0 0 16px rgba(255,45,255,0.3)"
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = "none"
              el.style.boxShadow = "none"
            }}
          >
            SIZE GUIDE
          </Link>
        </div>
      </div>
    </div>
  )
}
