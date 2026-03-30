export function Ticker() {
  const messages = [
    "FREE SHIPPING ON ORDERS OVER $80",
    "NEW ARRIVALS EVERY WEEK",
    "TRUE UNDERGROUND MERCH",
    "SHIPS WORLDWIDE",
  ]
  // duplicate for seamless loop
  const all = [...messages, ...messages]

  return (
    <div
      className="overflow-hidden h-8 flex items-center relative z-10 border-b"
      style={{ background: "#0c0012", borderColor: "var(--border)" }}
    >
      <div
        className="flex gap-0 whitespace-nowrap"
        style={{ animation: "tickerScroll 28s linear infinite" }}
      >
        {all.map((msg, i) => (
          <span
            key={i}
            className="text-[9px] tracking-[3px] uppercase px-10 flex items-center gap-[10px]"
            style={{ color: "var(--pink)" }}
          >
            {msg}
            <span style={{ color: "var(--orange)", fontSize: "8px" }}>⬥</span>
          </span>
        ))}
      </div>
    </div>
  )
}
