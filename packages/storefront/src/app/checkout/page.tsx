"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/lib/store"
import {
  updateCart,
  listShippingOptions,
  addShippingMethod,
  initPaymentSession,
  completeCart,
} from "@/lib/cart-api"
import { fmt, spawnFire } from "@/lib/utils"
import Link from "next/link"

type Step = "review" | "shipping" | "payment" | "done"

type ShippingAddress = {
  first_name: string
  last_name: string
  address_1: string
  address_2: string
  city: string
  province: string
  postal_code: string
  country_code: string
}

export default function CheckoutPage() {
  const { items, cartId, total, clearCart, initCart, count } = useCart()
  const [step, setStep] = useState<Step>("review")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState<ShippingAddress>({
    first_name: "", last_name: "", address_1: "", address_2: "",
    city: "", province: "", postal_code: "", country_code: "us",
  })
  const [shippingOptions, setShippingOptions] = useState<any[]>([])
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const cartTotal = total()
  const itemCount = count()

  // Ensure cart exists on mount
  useEffect(() => {
    if (itemCount > 0) initCart().catch(console.error)
  }, [])

  async function submitShipping() {
    if (!email) { setError("Email is required."); return }
    if (!address.first_name || !address.address_1 || !address.city || !address.postal_code) {
      setError("Please fill in all required fields.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const id = cartId ?? await initCart()
      await updateCart(id, { email, shipping_address: address })

      const options = await listShippingOptions(id)
      setShippingOptions(options)
      if (options.length > 0) setSelectedShipping(options[0].id)

      setStep("payment")
    } catch (err: any) {
      setError(err.message ?? "Failed to save shipping info.")
    } finally {
      setLoading(false)
    }
  }

  async function submitPayment() {
    if (!selectedShipping) { setError("Select a shipping method."); return }

    setLoading(true)
    setError("")

    try {
      const id = cartId!
      await addShippingMethod(id, selectedShipping)
      await initPaymentSession(id, "pp_stripe_stripe")
      setStep("payment")
      // At this point Stripe Elements would mount and collect card details.
      // For now we complete directly to demonstrate the flow.
      const result = await completeCart(id)
      if (result.type === "order") {
        clearCart()
        for (let i = 0; i < 36; i++) setTimeout(() => spawnFire(4), i * 50)
        setStep("done")
      } else {
        setError("Payment failed. Please try again.")
      }
    } catch (err: any) {
      setError(err.message ?? "Payment failed.")
    } finally {
      setLoading(false)
    }
  }

  if (itemCount === 0 && step !== "done") {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-16 text-center">
        <p
          className="text-[22px] tracking-[5px] mb-4"
          style={{ color: "var(--muted)", fontFamily: "var(--font-bebas), sans-serif" }}
        >
          YOUR CART IS EMPTY
        </p>
        <Link
          href="/catalog"
          className="inline-block py-3 px-8 text-[14px] tracking-[3px] no-underline border-none"
          style={{
            background: "var(--pink)",
            color: "#000",
            fontFamily: "var(--font-bebas), sans-serif",
          }}
        >
          BROWSE CATALOG
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[900px] mx-auto px-4 py-8">
      {step === "done" ? (
        <SuccessScreen />
      ) : (
        <div className="grid md:grid-cols-[1fr_320px] gap-6">
          {/* ── Left: Form steps ── */}
          <div
            className="relative overflow-hidden border p-7"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="scan-bar" />

            {/* Step indicator */}
            <StepIndicator step={step} />

            {step === "review" && (
              <ReviewStep onContinue={() => setStep("shipping")} />
            )}

            {step === "shipping" && (
              <ShippingStep
                email={email}
                setEmail={setEmail}
                address={address}
                setAddress={setAddress}
                onSubmit={submitShipping}
                loading={loading}
                error={error}
              />
            )}

            {step === "payment" && (
              <PaymentStep
                shippingOptions={shippingOptions}
                selectedShipping={selectedShipping}
                setSelectedShipping={setSelectedShipping}
                onSubmit={submitPayment}
                loading={loading}
                error={error}
              />
            )}
          </div>

          {/* ── Right: Order summary ── */}
          <OrderSummary items={items} total={cartTotal} />
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────

function SuccessScreen() {
  return (
    <div
      className="relative overflow-hidden border p-12 text-center"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="scan-bar" />
      <p
        className="text-[28px] tracking-[5px] mb-3"
        style={{
          color: "var(--pink)",
          textShadow: "0 0 20px var(--pink)",
          fontFamily: "var(--font-bebas), sans-serif",
        }}
      >
        ☠ ORDER RECEIVED — HAILS ☠
      </p>
      <p
        className="text-[11px] tracking-[2px] mb-8"
        style={{ color: "var(--muted)", fontFamily: "var(--font-share-tech), monospace" }}
      >
        YOUR ORDER HAS ENTERED THE VOID
      </p>
      <Link
        href="/catalog"
        className="inline-block py-3 px-8 text-[14px] tracking-[3px] no-underline border-none"
        style={{ background: "var(--pink)", color: "#000", fontFamily: "var(--font-bebas), sans-serif" }}
      >
        CONTINUE SHOPPING
      </Link>
    </div>
  )
}

function StepIndicator({ step }: { step: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "review",   label: "REVIEW" },
    { key: "shipping", label: "SHIPPING" },
    { key: "payment",  label: "PAYMENT" },
  ]
  const order = ["review", "shipping", "payment"]
  const current = order.indexOf(step)

  return (
    <div className="flex items-center gap-0 mb-6">
      {steps.map(({ key, label }, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border"
                style={{
                  background: active || done ? "var(--pink)" : "transparent",
                  borderColor: active || done ? "var(--pink)" : "var(--border)",
                  color: active || done ? "#000" : "var(--muted)",
                }}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className="text-[7px] tracking-[1px] mt-1 uppercase"
                style={{ color: active ? "var(--pink)" : "var(--muted)", fontFamily: "var(--font-share-tech), monospace" }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="w-12 h-px mx-2 mb-4"
                style={{ background: i < current ? "var(--pink)" : "var(--border)" }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function ReviewStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div>
      <SectionTitle>REVIEW YOUR ORDER</SectionTitle>
      <p
        className="text-[11px] leading-[1.8] mb-6"
        style={{ color: "var(--muted)", fontFamily: "var(--font-share-tech), monospace" }}
      >
        Check the items in your cart, then continue to shipping.
      </p>
      <PinkButton onClick={onContinue}>CONTINUE TO SHIPPING →</PinkButton>
    </div>
  )
}

function ShippingStep({
  email, setEmail, address, setAddress, onSubmit, loading, error,
}: {
  email: string
  setEmail: (v: string) => void
  address: ShippingAddress
  setAddress: (a: ShippingAddress) => void
  onSubmit: () => void
  loading: boolean
  error: string
}) {
  function field(key: keyof ShippingAddress) {
    return {
      value: address[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setAddress({ ...address, [key]: e.target.value }),
    }
  }

  return (
    <div>
      <SectionTitle>SHIPPING</SectionTitle>
      <div className="flex flex-col gap-3 mb-4">
        <Field label="Email *" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="First Name *" placeholder="FIRST NAME" {...field("first_name")} />
          <Field label="Last Name *" placeholder="LAST NAME" {...field("last_name")} />
        </div>
        <Field label="Address *" placeholder="STREET ADDRESS" {...field("address_1")} />
        <Field label="Address Line 2" placeholder="APT / SUITE" {...field("address_2")} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="City *" placeholder="CITY" {...field("city")} />
          <Field label="State" placeholder="STATE" {...field("province")} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Postal Code *" placeholder="ZIP" {...field("postal_code")} />
          <div className="flex flex-col gap-1">
            <label className="text-[8px] tracking-[2px] uppercase" style={{ color: "rgba(255,45,255,0.55)" }}>
              Country
            </label>
            <select
              {...field("country_code")}
              className="py-[9px] px-3 text-[12px] outline-none text-[#ddd]"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,45,255,0.15)",
                fontFamily: "var(--font-share-tech), monospace",
              }}
            >
              <option value="us">United States</option>
              <option value="ca">Canada</option>
              <option value="gb">United Kingdom</option>
              <option value="au">Australia</option>
              <option value="de">Germany</option>
              <option value="fr">France</option>
            </select>
          </div>
        </div>
      </div>
      {error && <p className="text-[9px] tracking-[1px] mb-3" style={{ color: "#ff6060" }}>{error}</p>}
      <PinkButton onClick={onSubmit} disabled={loading}>
        {loading ? "SAVING..." : "CONTINUE TO PAYMENT →"}
      </PinkButton>
    </div>
  )
}

function PaymentStep({
  shippingOptions, selectedShipping, setSelectedShipping, onSubmit, loading, error,
}: {
  shippingOptions: any[]
  selectedShipping: string | null
  setSelectedShipping: (id: string) => void
  onSubmit: () => void
  loading: boolean
  error: string
}) {
  return (
    <div>
      <SectionTitle>PAYMENT</SectionTitle>

      {/* Shipping method selection */}
      {shippingOptions.length > 0 && (
        <div className="mb-5">
          <p className="text-[8px] tracking-[2px] uppercase mb-2" style={{ color: "rgba(255,45,255,0.6)" }}>
            SHIPPING METHOD
          </p>
          <div className="flex flex-col gap-2">
            {shippingOptions.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center gap-3 p-3 border cursor-pointer transition-all duration-150"
                style={{
                  borderColor: selectedShipping === opt.id ? "var(--pink)" : "var(--border)",
                  background: selectedShipping === opt.id ? "rgba(255,45,255,0.05)" : "transparent",
                }}
              >
                <input
                  type="radio"
                  name="shipping"
                  value={opt.id}
                  checked={selectedShipping === opt.id}
                  onChange={() => setSelectedShipping(opt.id)}
                  className="accent-[--pink]"
                />
                <span className="flex-1 text-[11px]" style={{ color: "#ddd", fontFamily: "var(--font-share-tech), monospace" }}>
                  {opt.name}
                </span>
                <span className="text-[11px]" style={{ color: "var(--orange)", fontFamily: "var(--font-bebas), sans-serif" }}>
                  {opt.amount ? fmt(opt.amount) : "FREE"}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Stripe Elements mount point */}
      <div
        className="border p-4 mb-5 text-center"
        style={{ borderColor: "var(--border)", background: "rgba(255,45,255,0.03)" }}
        id="stripe-payment-element"
      >
        <p className="text-[10px] tracking-[2px]" style={{ color: "var(--muted)", fontFamily: "var(--font-share-tech), monospace" }}>
          CARD DETAILS
        </p>
        <p className="text-[9px] mt-1" style={{ color: "var(--dim)", fontFamily: "var(--font-share-tech), monospace" }}>
          Add <code>@stripe/react-stripe-js</code> and mount <code>&lt;PaymentElement /&gt;</code> here
          with the Stripe payment session client_secret from the Medusa cart.
        </p>
      </div>

      {error && <p className="text-[9px] tracking-[1px] mb-3" style={{ color: "#ff6060" }}>{error}</p>}
      <PinkButton onClick={onSubmit} disabled={loading}>
        {loading ? "PROCESSING..." : "PLACE ORDER ☠"}
      </PinkButton>
    </div>
  )
}

function OrderSummary({ items, total }: { items: any[]; total: number }) {
  return (
    <div
      className="border p-5 h-fit sticky top-[60px]"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <p
        className="text-[14px] tracking-[3px] mb-4"
        style={{ color: "var(--pink)", fontFamily: "var(--font-bebas), sans-serif" }}
      >
        ORDER SUMMARY
      </p>
      <div className="flex flex-col gap-3 mb-4">
        {items.map((item) => (
          <div key={item.variantId + item.style + item.size} className="flex justify-between items-start gap-2">
            <div>
              <p className="text-[9px] tracking-[1px] leading-[1.4]" style={{ color: "#ddd", fontFamily: "var(--font-share-tech), monospace" }}>
                {item.name}
              </p>
              <p className="text-[8px]" style={{ color: "var(--muted)" }}>
                {item.style} / {item.size} × {item.qty}
              </p>
            </div>
            <span
              className="text-[11px] flex-shrink-0"
              style={{ color: "var(--orange)", fontFamily: "var(--font-bebas), sans-serif" }}
            >
              {fmt(item.price * item.qty)}
            </span>
          </div>
        ))}
      </div>
      <hr style={{ borderColor: "var(--border)", margin: "12px 0" }} />
      <div className="flex justify-between">
        <span className="text-[10px] tracking-[2px]" style={{ color: "var(--muted)" }}>TOTAL</span>
        <span
          className="text-[20px] tracking-[1px]"
          style={{ color: "var(--orange)", fontFamily: "var(--font-bebas), sans-serif" }}
        >
          {fmt(total)}
        </span>
      </div>
    </div>
  )
}

// ─── Tiny helpers ─────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[18px] tracking-[4px] mb-4"
      style={{ color: "var(--pink)", textShadow: "0 0 8px rgba(255,45,255,0.4)", fontFamily: "var(--font-bebas), sans-serif" }}
    >
      {children}
    </p>
  )
}

function PinkButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-[13px] text-base tracking-[4px] uppercase border-none cursor-pointer transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ background: "var(--pink)", color: "#000", fontFamily: "var(--font-bebas), sans-serif" }}
      onMouseEnter={(e) => {
        if (disabled) return
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
      {children}
    </button>
  )
}

function Field({
  label, placeholder, value, onChange, type = "text",
}: {
  label: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[8px] tracking-[2px] uppercase" style={{ color: "rgba(255,45,255,0.55)" }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="py-[9px] px-3 text-[12px] outline-none text-[#ddd] placeholder:text-[#3a3a3a]"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,45,255,0.15)",
          fontFamily: "var(--font-share-tech), monospace",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--pink)"
          e.currentTarget.style.background = "rgba(255,45,255,0.05)"
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,45,255,0.15)"
          e.currentTarget.style.background = "rgba(255,255,255,0.03)"
        }}
      />
    </div>
  )
}
