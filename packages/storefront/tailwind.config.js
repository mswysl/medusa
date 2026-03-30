/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // mswysl brand palette
        pink: {
          DEFAULT: "#ff2dff",
          dark: "#c400c4",
          glow: "rgba(255,45,255,0.6)",
          border: "rgba(255,45,255,0.2)",
          overlay: "rgba(255,45,255,0.08)",
        },
        orange: {
          DEFAULT: "#ff6a00",
          accent: "#ffd200",
        },
        bg: {
          DEFAULT: "#080808",
          card: "#0f0010",
          deep: "#04000a",
          header: "rgba(6,0,10,0.92)",
          tile: "#0c0012",
        },
        border: {
          DEFAULT: "rgba(255,45,255,0.2)",
          dim: "rgba(255,45,255,0.06)",
        },
        fg: {
          DEFAULT: "#ffffff",
          muted: "#777777",
          dim: "#3a3a3a",
          sub: "#cccccc",
          faint: "#bbbbbb",
        },
      },
      fontFamily: {
        display: ["var(--font-bebas)", "sans-serif"],
        mono: ["var(--font-share-tech)", "Courier New", "monospace"],
        serif: ["var(--font-cinzel)", "Times New Roman", "serif"],
      },
      backgroundImage: {
        "pink-gradient": "linear-gradient(90deg, var(--dpink), #6600cc, var(--dpink))",
        "card-gradient": "linear-gradient(135deg, #140018, #1e0026, #140014)",
        "hero-gradient": "linear-gradient(135deg, #100018, #1e0030, #100018)",
        "scanline": "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
      },
      boxShadow: {
        "pink-glow": "0 0 18px rgba(255,45,255,0.4)",
        "pink-glow-lg": "0 0 28px rgba(255,45,255,0.6)",
        "pink-glow-xl": "0 0 50px rgba(255,45,255,0.8)",
      },
      animation: {
        "ticker": "ticker 28s linear infinite",
        "promo-shift": "promoShift 6s linear infinite",
        "logo-glow": "logoGlow 3s ease-in-out infinite alternate",
        "glitch-shift": "glitchShift 8s infinite",
        "scan-bar": "scanBar 3s linear infinite",
        "rise": "rise 3s ease-out forwards",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        promoShift: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "200% 0%" },
        },
        logoGlow: {
          from: { filter: "drop-shadow(0 0 10px rgba(255,45,255,0.4))" },
          to: { filter: "drop-shadow(0 0 26px rgba(255,45,255,0.9)) drop-shadow(0 0 50px rgba(255,106,0,0.35))" },
        },
        glitchShift: {
          "0%, 89%, 100%": { transform: "none" },
          "90%": { transform: "skewX(-0.8deg)" },
          "91%": { transform: "skewX(0.8deg)" },
          "93%": { transform: "skewX(-1.5deg) scaleY(1.01)" },
          "94%": { transform: "none" },
        },
        scanBar: {
          "0%": { transform: "scaleX(0)", transformOrigin: "left" },
          "49%": { transform: "scaleX(1)", transformOrigin: "left" },
          "50%": { transform: "scaleX(1)", transformOrigin: "right" },
          "100%": { transform: "scaleX(0)", transformOrigin: "right" },
        },
        rise: {
          "0%": { opacity: "0.85", transform: "translateY(0) scale(1)" },
          "50%": { opacity: "0.5", transform: "translateY(-200px) scale(0.7) translateX(15px)" },
          "100%": { opacity: "0", transform: "translateY(-420px) scale(0.1) translateX(-8px)" },
        },
      },
    },
  },
  plugins: [],
}
