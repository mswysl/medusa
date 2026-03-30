/** Format cents to USD display string */
export function fmt(cents: number): string {
  return "$" + (cents / 100).toFixed(2)
}

/** X placeholder SVG for products without images */
export const XSVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;position:absolute;inset:0;">
  <rect x="0.5" y="0.5" width="99" height="99" stroke="#ff2dff" stroke-width="0.8" fill="none" opacity="0.15"/>
  <line x1="0.5" y1="0.5" x2="99.5" y2="99.5" stroke="#ff2dff" stroke-width="0.8" opacity="0.15"/>
  <line x1="99.5" y1="0.5" x2="0.5" y2="99.5" stroke="#ff2dff" stroke-width="0.8" opacity="0.15"/>
</svg>`

/** Spawn fire particles on the DOM */
export function spawnFire(count = 8): void {
  if (typeof document === "undefined") return
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const p = document.createElement("div")
      p.className = "fire-particle"
      p.style.left = Math.random() * 100 + "vw"
      const size = 3 + Math.random() * 5 + "px"
      p.style.width = size
      p.style.height = size
      p.style.background = Math.random() > 0.5 ? "#ff2dff" : "#ff6a00"
      p.style.animationDuration = 2 + Math.random() * 2 + "s"
      document.body.appendChild(p)
      setTimeout(() => p.parentNode?.removeChild(p), 4500)
    }, i * 80)
  }
}

/** Style label map */
export const STYLE_LABELS: Record<string, string> = {
  "SS-1": "SINGLE SIDED",
  "SS-2": "DOUBLE SIDED",
  LS: "LONG SLEEVE",
  HD: "HOODIE",
}

export const CATEGORIES = [
  { key: "all",  label: "ALL",          icon: "☠" },
  { key: "ss1",  label: "SINGLE SIDED", icon: "⊤" },
  { key: "ss2",  label: "DOUBLE SIDED", icon: "⊥" },
  { key: "ls",   label: "LONG SLEEVES", icon: "⏟" },
  { key: "hd",   label: "HOODIES",      icon: "🏚" },
]
