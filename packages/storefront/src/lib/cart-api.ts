/**
 * Medusa Store Cart API — thin wrapper around fetch.
 * Called from client components via server actions or direct fetch.
 * All functions are async and safe to call from "use client" components.
 */

const BACKEND =
  typeof window === "undefined"
    ? (process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000")
    : (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000")

const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ""

async function storeRequest<T>(
  method: "GET" | "POST" | "DELETE",
  path: string,
  body?: Record<string, unknown>,
  cartId?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "x-publishable-api-key": PUB_KEY,
    "Content-Type": "application/json",
  }
  // Attach cart-id header so Medusa keeps session across requests
  if (cartId) {
    headers["x-medusa-cart-id"] = cartId
  }

  const res = await fetch(`${BACKEND}/store${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Cart API ${method} ${path} → ${res.status}: ${text}`)
  }

  return res.json()
}

// ─── Cart lifecycle ───────────────────────────────────────────

export async function createCart(regionId?: string) {
  const data = await storeRequest<{ cart: any }>("POST", "/carts", {
    ...(regionId ? { region_id: regionId } : {}),
  })
  return data.cart
}

export async function getCart(cartId: string) {
  const data = await storeRequest<{ cart: any }>(
    "GET",
    `/carts/${cartId}`,
    undefined,
    cartId
  )
  return data.cart
}

// ─── Line items ───────────────────────────────────────────────

export async function addLineItem(
  cartId: string,
  variantId: string,
  quantity = 1
) {
  const data = await storeRequest<{ cart: any }>(
    "POST",
    `/carts/${cartId}/line-items`,
    { variant_id: variantId, quantity },
    cartId
  )
  return data.cart
}

export async function updateLineItem(
  cartId: string,
  lineItemId: string,
  quantity: number
) {
  const data = await storeRequest<{ cart: any }>(
    "POST",
    `/carts/${cartId}/line-items/${lineItemId}`,
    { quantity },
    cartId
  )
  return data.cart
}

export async function removeLineItem(cartId: string, lineItemId: string) {
  const data = await storeRequest<{ cart: any }>(
    "DELETE",
    `/carts/${cartId}/line-items/${lineItemId}`,
    undefined,
    cartId
  )
  return data.cart
}

// ─── Checkout ─────────────────────────────────────────────────

export async function updateCart(
  cartId: string,
  payload: {
    email?: string
    shipping_address?: {
      first_name: string
      last_name: string
      address_1: string
      address_2?: string
      city: string
      province?: string
      postal_code: string
      country_code: string
    }
  }
) {
  const data = await storeRequest<{ cart: any }>(
    "POST",
    `/carts/${cartId}`,
    payload,
    cartId
  )
  return data.cart
}

export async function listShippingOptions(cartId: string) {
  const data = await storeRequest<{ shipping_options: any[] }>(
    "GET",
    `/shipping-options?cart_id=${cartId}`,
    undefined,
    cartId
  )
  return data.shipping_options ?? []
}

export async function addShippingMethod(
  cartId: string,
  shippingOptionId: string
) {
  const data = await storeRequest<{ cart: any }>(
    "POST",
    `/carts/${cartId}/shipping-methods`,
    { option_id: shippingOptionId },
    cartId
  )
  return data.cart
}

export async function initPaymentSession(cartId: string, providerId: string) {
  const data = await storeRequest<{ cart: any }>(
    "POST",
    `/carts/${cartId}/payment-sessions`,
    { provider_id: providerId },
    cartId
  )
  return data.cart
}

export async function completeCart(cartId: string) {
  const data = await storeRequest<{ type: string; data: any }>(
    "POST",
    `/carts/${cartId}/complete`,
    undefined,
    cartId
  )
  return data
}

// ─── Default region ───────────────────────────────────────────

export async function getDefaultRegion() {
  try {
    const res = await fetch(
      `${BACKEND}/store/regions?limit=1`,
      {
        headers: { "x-publishable-api-key": PUB_KEY },
        cache: "force-cache",
        next: { revalidate: 3600 },
      }
    )
    const data = await res.json()
    return data.regions?.[0] ?? null
  } catch {
    return null
  }
}
