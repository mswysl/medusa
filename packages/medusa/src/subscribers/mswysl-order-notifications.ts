/**
 * MSWYSL Order Notification Subscriber
 *
 * Sends branded email notifications on key order events:
 *   - order.placed      → confirmation to customer
 *   - order.shipped     → tracking notification
 *   - order.canceled    → cancellation notice
 *   - payment.captured  → receipt
 */

import {
  type SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { INotificationModuleService } from "@medusajs/framework/types"

// ─── Order placed ────────────────────────────────────────────

export default async function mswyslOrderPlaced({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationModule = container.resolve<INotificationModuleService>(
    Modules.NOTIFICATION
  )

  const query = container.resolve("query" as any)

  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "email",
      "currency_code",
      "total",
      "shipping_address.*",
      "items.*",
      "items.variant.*",
      "items.variant.product.*",
    ],
    filters: { id: data.id },
  })

  const order = orders[0]
  if (!order?.email) return

  await notificationModule.createNotifications({
    to: order.email,
    channel: "email",
    template: "order-placed",
    data: {
      subject: `☠ Order #${order.display_id} received — HAILS`,
      order_id: order.id,
      display_id: order.display_id,
      email: order.email,
      total: order.total,
      currency: order.currency_code.toUpperCase(),
      items: order.items?.map((item: any) => ({
        name: item.variant?.product?.title ?? item.title,
        lin: item.variant?.product?.metadata?.lin ?? "",
        band: item.variant?.product?.metadata?.band ?? "",
        variant_title: item.variant?.title ?? "",
        quantity: item.quantity,
        unit_price: item.unit_price,
      })) ?? [],
      shipping_address: order.shipping_address,
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
