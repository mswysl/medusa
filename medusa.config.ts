import { loadEnv, defineConfig, Modules } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV ?? "development", process.cwd())

/**
 * MSWYSL Medusa Backend Configuration
 *
 * Architecture:
 *   Next.js PWA  →  Medusa API (9000)  →  PostgreSQL + Redis
 *                                      →  Stripe (payments + subscriptions)
 *                                      →  S3 (digital files / product images)
 *                                      →  Resend / SendGrid (email)
 */
export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS ?? "http://localhost:3001",
      adminCors: process.env.ADMIN_CORS ?? "http://localhost:9000",
      authCors: process.env.AUTH_CORS ?? "http://localhost:3001,http://localhost:9000",
      jwtSecret: process.env.JWT_SECRET ?? "supersecret",
      cookieSecret: process.env.COOKIE_SECRET ?? "supersecret",
    },
  },

  admin: {
    // Admin runs at /app — override to match your deploy
    backendUrl: process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000",
  },

  modules: [
    // ── Payment: Stripe ─────────────────────────────────────
    {
      resolve: "@medusajs/payment-stripe",
      options: {
        apiKey: process.env.STRIPE_API_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        /**
         * For subscriptions (e.g. merch club / monthly drops):
         * Stripe Billing is handled at the application layer via
         * Stripe's createSubscription API. Wire up a subscriber
         * in packages/medusa/src/subscribers/ to handle
         * `invoice.payment_succeeded` webhooks.
         */
      },
    },

    // ── File Storage: S3 ─────────────────────────────────────
    {
      resolve: "@medusajs/file-s3",
      key: Modules.FILE,
      options: {
        fileUrl: process.env.S3_FILE_URL,
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        region: process.env.S3_REGION ?? "us-east-1",
        bucket: process.env.S3_BUCKET ?? "mswysl-media",
        /**
         * For digital downloads (e.g. hi-res artwork, patches PDF):
         * Set S3_DOWNLOAD_BUCKET to a private bucket.
         * Use signed URLs via the file module's presign endpoint.
         */
        downloadFileDuration: 3600, // 1-hour signed URL for digital files
      },
    },

    // ── Email: Resend ────────────────────────────────────────
    // Swap for @medusajs/notification-sendgrid if preferred.
    {
      resolve: "@medusajs/notification-resend",
      key: Modules.NOTIFICATION,
      options: {
        channels: ["email"],
        apiKey: process.env.RESEND_API_KEY,
        from: process.env.EMAIL_FROM ?? "orders@mswysl.org",
      },
    },

    // ── Cache: Redis ─────────────────────────────────────────
    {
      resolve: "@medusajs/cache-redis",
      key: Modules.CACHE,
      options: {
        redisUrl: process.env.REDIS_URL,
        ttl: 30,
      },
    },

    // ── Event Bus: Redis ─────────────────────────────────────
    {
      resolve: "@medusajs/event-bus-redis",
      key: Modules.EVENT_BUS,
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },

    // ── Workflow Engine: Redis ────────────────────────────────
    {
      resolve: "@medusajs/workflow-engine-redis",
      key: Modules.WORKFLOW_ENGINE,
      options: {
        redis: {
          url: process.env.REDIS_URL,
        },
      },
    },
  ],
})
