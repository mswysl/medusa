/**
 * MSWYSL Store Seed Script
 *
 * Run with:
 *   yarn workspace @medusajs/medusa exec ts-node src/scripts/seed-mswysl.ts
 *
 * Or via Medusa CLI:
 *   npx medusa exec src/scripts/seed-mswysl.ts
 *
 * Creates:
 *   - Sales region (US)
 *   - Product categories: single-sided, double-sided, long-sleeves, hoodies
 *   - 12 sample merch products with variants (style × size)
 *   - Publishable API key for the storefront
 */

import Medusa from "@medusajs/js-sdk"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000"
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@mswysl.org"
const ADMIN_PASS  = process.env.SEED_ADMIN_PASSWORD ?? "supersecret"

const client = new Medusa({ baseUrl: BACKEND_URL, debug: true })

// ─── Data ────────────────────────────────────────────────────

const CATEGORIES = [
  { name: "Single Sided Tee", handle: "ss1", description: "Single-sided screen print tees" },
  { name: "Double Sided Tee", handle: "ss2", description: "Double-sided screen print tees" },
  { name: "Long Sleeves",     handle: "ls",  description: "Long sleeve shirts" },
  { name: "Hoodies",          handle: "hd",  description: "Pullover and zip hoodies" },
]

const PRODUCTS: Array<{
  title: string
  description: string
  handle: string
  category: string
  styles: string[]
  price: number
  featured?: boolean
  metadata: Record<string, string>
}> = [
  {
    title: "GATEWAYS TO ANNIHILATION",
    description: "Single-sided front print. Heavyweight 6oz black cotton. Official bootleg-style print.",
    handle: "lin-001-morbid-angel-gateways",
    category: "ss1",
    styles: ["SS-1"],
    price: 3899,
    featured: true,
    metadata: { lin: "LIN-001", band: "MORBID ANGEL", featured: "true" },
  },
  {
    title: "EMPERIAL ANTHEMS TOUR LS",
    description: "Long sleeve with full tour dates back print. Front logo left chest. Heavy 7oz ring-spun.",
    handle: "lin-002-emperor-emperial-anthems",
    category: "ls",
    styles: ["LS"],
    price: 6500,
    featured: true,
    metadata: { lin: "LIN-002", band: "EMPEROR", featured: "true" },
  },
  {
    title: "INHERENT PERVERSION LS",
    description: "Double-sided design. Front obscure artwork, full back print. Heavyweight cotton.",
    handle: "lin-003-scattered-remnants-inherent",
    category: "ls",
    styles: ["LS"],
    price: 6500,
    featured: false,
    metadata: { lin: "LIN-003", band: "SCATTERED REMNANTS" },
  },
  {
    title: "SOULSIDE JOURNEY HOODIE",
    description: "Pullover hoodie. Front chest sigil. Full back print. 14oz fleece. Double-lined hood.",
    handle: "lin-004-darkthrone-soulside",
    category: "hd",
    styles: ["HD"],
    price: 6199,
    featured: true,
    metadata: { lin: "LIN-004", band: "DARKTHRONE", featured: "true" },
  },
  {
    title: "VAGINAL VOMIT LS",
    description: "All-over back print. Distressed wash. 7oz heavyweight cotton. Long sleeve cut.",
    handle: "lin-005-scattered-remnants-vaginal",
    category: "ls",
    styles: ["LS"],
    price: 6500,
    featured: false,
    metadata: { lin: "LIN-005", band: "SCATTERED REMNANTS" },
  },
  {
    title: "DOAM TS",
    description: "Double-sided tee. Front album art, back track list. 6oz black cotton. Screen printed.",
    handle: "lin-006-coffins-doam",
    category: "ss2",
    styles: ["SS-2"],
    price: 3889,
    featured: false,
    metadata: { lin: "LIN-006", band: "COFFINS" },
  },
  {
    title: "MATANDO GUEROS TS",
    description: "Single-sided front print. Classic death metal artwork. Heavyweight black cotton.",
    handle: "lin-007-brujeria-matando",
    category: "ss1",
    styles: ["SS-1"],
    price: 3899,
    featured: false,
    metadata: { lin: "LIN-007", band: "BRUJERIA" },
  },
  {
    title: "THE ENDING QUEST TS",
    description: "Single-sided. Vintage hand-drawn artwork. Old school death metal. 5.5oz cotton.",
    handle: "lin-008-gorement-ending",
    category: "ss1",
    styles: ["SS-1"],
    price: 2399,
    featured: true,
    metadata: { lin: "LIN-008", band: "GOREMENT", featured: "true" },
  },
  {
    title: "MORTAL THRONE LS",
    description: "Long sleeve. Front and sleeve print. Tour-style graphic. 7oz ring-spun black cotton.",
    handle: "lin-009-incantation-mortal",
    category: "ls",
    styles: ["LS"],
    price: 5800,
    featured: false,
    metadata: { lin: "LIN-009", band: "INCANTATION" },
  },
  {
    title: "ACTS OF THE UNSPEAKABLE",
    description: "Double-sided. Classic goregrind artwork front and back. Garment dyed black cotton.",
    handle: "lin-010-autopsy-acts",
    category: "ss2",
    styles: ["SS-2"],
    price: 3499,
    featured: false,
    metadata: { lin: "LIN-010", band: "AUTOPSY" },
  },
  {
    title: "CAUSE OF DEATH TS",
    description: "Single-sided front print. Iconic death metal artwork. 100% black ring-spun cotton.",
    handle: "lin-011-obituary-cause",
    category: "ss1",
    styles: ["SS-1"],
    price: 3299,
    featured: false,
    metadata: { lin: "LIN-011", band: "OBITUARY" },
  },
  {
    title: "REALM OF CHAOS HOODIE",
    description: "Heavyweight pullover. Full front illustration. Kangaroo pocket. 14oz double fleece.",
    handle: "lin-012-bolt-thrower-realm",
    category: "hd",
    styles: ["HD"],
    price: 7200,
    featured: true,
    metadata: { lin: "LIN-012", band: "BOLT THROWER", featured: "true" },
  },
]

const SIZES_BY_STYLE: Record<string, string[]> = {
  "SS-1": ["S", "M", "L", "XL", "XXL", "3XL"],
  "SS-2": ["S", "M", "L", "XL", "XXL"],
  "LS":   ["S", "M", "L", "XL", "XXL", "3XL"],
  "HD":   ["S", "M", "L", "XL", "XXL"],
}

// ─── Seed ────────────────────────────────────────────────────

async function seed() {
  console.log("🩸 Starting MSWYSL seed...\n")

  // 1. Auth
  console.log("→ Authenticating admin...")
  await client.auth.login("user", "emailpass", {
    email: ADMIN_EMAIL,
    password: ADMIN_PASS,
  })
  console.log("  ✓ Authenticated\n")

  // 2. Create region
  console.log("→ Creating US region...")
  const { region } = await client.admin.region.create({
    name: "United States",
    currency_code: "usd",
    countries: ["us", "ca", "gb", "au", "de", "fr"],
  })
  console.log(`  ✓ Region: ${region.id}\n`)

  // 3. Stock location
  console.log("→ Creating stock location...")
  const { stock_location } = await client.admin.stockLocation.create({
    name: "MSWYSL Warehouse",
    address: { country_code: "US" },
  })
  console.log(`  ✓ Location: ${stock_location.id}\n`)

  // 4. Sales channel
  console.log("→ Creating sales channel...")
  const { sales_channel } = await client.admin.salesChannel.create({
    name: "MSWYSL Web Store",
    description: "mswysl.org main storefront",
  })
  console.log(`  ✓ Sales channel: ${sales_channel.id}\n`)

  // 5. Publishable key
  console.log("→ Creating publishable API key...")
  const { api_key } = await client.admin.apiKey.create({
    title: "MSWYSL Storefront",
    type: "publishable",
  })
  await client.admin.apiKey.addSalesChannels(api_key.id, {
    sales_channel_ids: [{ id: sales_channel.id }],
  })
  console.log(`  ✓ Publishable key: ${api_key.token}`)
  console.log("  → Set NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=" + api_key.token + "\n")

  // 6. Categories
  console.log("→ Creating product categories...")
  const categoryMap: Record<string, string> = {}
  for (const cat of CATEGORIES) {
    const { product_category } = await client.admin.productCategory.create({
      name: cat.name,
      handle: cat.handle,
      description: cat.description,
      is_active: true,
    })
    categoryMap[cat.handle] = product_category.id
    console.log(`  ✓ ${cat.name} (${product_category.id})`)
  }
  console.log()

  // 7. Products
  console.log("→ Creating products...")
  for (const p of PRODUCTS) {
    const categoryId = categoryMap[p.category]

    // Build variants: for each style × size combination
    const variants: Array<{
      title: string
      options: Record<string, string>
      prices: Array<{ currency_code: string; amount: number }>
      inventory_quantity: number
    }> = []

    for (const style of p.styles) {
      const sizes = SIZES_BY_STYLE[style] ?? ["S", "M", "L", "XL", "XXL"]
      for (const size of sizes) {
        variants.push({
          title: `${style} / ${size}`,
          options: { Style: style, Size: size },
          prices: [{ currency_code: "usd", amount: p.price }],
          inventory_quantity: 50,
        })
      }
    }

    const { product } = await client.admin.product.create({
      title: p.title,
      handle: p.handle,
      description: p.description,
      status: "published",
      metadata: p.metadata,
      categories: categoryId ? [{ id: categoryId }] : [],
      sales_channels: [{ id: sales_channel.id }],
      options: [
        { title: "Style", values: p.styles },
        { title: "Size",  values: [...new Set(variants.map((v) => v.options.Size))] },
      ],
      variants,
    })

    console.log(`  ✓ ${p.metadata.band} — ${p.title} (${product.id})`)
  }

  console.log("\n🩸 MSWYSL seed complete.")
  console.log("\nNext steps:")
  console.log("  1. Copy the publishable key above into your storefront .env.local")
  console.log("  2. Configure Stripe: see packages/medusa/medusa.config.ts")
  console.log("  3. Configure S3: see packages/medusa/medusa.config.ts")
  console.log("  4. Start the storefront: yarn workspace @mswysl/storefront dev\n")
}

seed().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
