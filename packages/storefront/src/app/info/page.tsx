export default function InfoPage() {
  return (
    <div className="max-w-[900px] mx-auto px-4 py-8">
      <div
        className="relative overflow-hidden border p-7"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="scan-bar" />

        <p
          className="font-display text-[18px] tracking-[4px] mb-6"
          style={{ color: "var(--pink)", textShadow: "0 0 8px rgba(255,45,255,0.4)", fontFamily: "var(--font-bebas), sans-serif" }}
        >
          SIZE GUIDE
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* Left */}
          <div>
            <div className="text-[11px] leading-[2.2] tracking-[0.5px] mb-5" style={{ color: "var(--muted)", fontFamily: "var(--font-share-tech), monospace" }}>
              <span style={{ color: "var(--pink)" }}>SS</span> — Short Sleeve T-Shirt<br />
              <span style={{ color: "var(--pink)" }}>LS</span> — Long Sleeve<br />
              <span style={{ color: "var(--pink)" }}>HD</span> — Hoodie<br />
              <span style={{ color: "var(--pink)" }}>SS-1</span> — Single Sided Tee<br />
              <span style={{ color: "var(--pink)" }}>SS-2</span> — Double Sided Tee<br />
              <br />
              <span style={{ color: "var(--pink)" }}>SIZES:</span> S / M / L / XL / XXL / 3XL<br />
              <br />
              <span style={{ color: "var(--dim)", fontSize: "9px" }}>
                Heavyweight black cotton. Pre-shrunk. Machine wash cold inside-out.
                Do not bleach. Tumble dry low.
              </span>
            </div>

            <p
              className="font-display text-[14px] tracking-[4px] mb-3"
              style={{ color: "var(--pink)", fontFamily: "var(--font-bebas), sans-serif" }}
            >
              HOW TO ORDER
            </p>
            <div className="text-[11px] leading-[1.8] tracking-[0.5px]" style={{ color: "var(--muted)", fontFamily: "var(--font-share-tech), monospace" }}>
              Find a LIN number on any product card.<br />
              Enter it in the Order tab with style and size.<br />
              <br />
              Example: <span style={{ color: "var(--pink)" }}>LIN-001 / SS / XL</span>
            </div>
          </div>

          {/* Right */}
          <div>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["SIZE", "CHEST (IN)", "LENGTH"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[8px] tracking-[2px] uppercase py-[7px] px-[10px] border"
                      style={{
                        borderColor: "rgba(255,45,255,0.18)",
                        color: "var(--pink)",
                        background: "rgba(255,45,255,0.07)",
                        fontFamily: "var(--font-share-tech), monospace",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["S",   "34–36", `27"`],
                  ["M",   "38–40", `28"`],
                  ["L",   "42–44", `29"`],
                  ["XL",  "46–48", `30"`],
                  ["XXL", "50–52", `31"`],
                  ["3XL", "54–56", `32"`],
                ].map(([size, chest, len]) => (
                  <tr
                    key={size}
                    className="hover:bg-[rgba(255,45,255,0.04)]"
                  >
                    {[size, chest, len].map((v, i) => (
                      <td
                        key={i}
                        className="text-[10px] tracking-[1px] py-[7px] px-[10px] border"
                        style={{
                          borderColor: "rgba(255,45,255,0.08)",
                          color: "var(--muted)",
                          fontFamily: "var(--font-share-tech), monospace",
                        }}
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Shipping note */}
            <div
              className="mt-4 p-[14px] border"
              style={{ background: "rgba(255,45,255,0.05)", borderColor: "var(--border)" }}
            >
              <p
                className="text-[9px] tracking-[2px] mb-[6px]"
                style={{ color: "var(--pink)", fontFamily: "var(--font-share-tech), monospace" }}
              >
                SHIPPING
              </p>
              <p
                className="text-[10px] leading-[1.8]"
                style={{ color: "var(--muted)", fontFamily: "var(--font-share-tech), monospace" }}
              >
                Ships within 3–5 business days.
                Free shipping on orders over $80.
                Worldwide shipping available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
