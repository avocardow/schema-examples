// webhook_endpoint_event_types: Maps webhook endpoints to the event types they subscribe to.
// See README.md for full schema documentation.

import { pgTable, uuid, timestamp, unique, index } from "drizzle-orm/pg-core";
import { webhookEndpoints } from "./webhook_endpoints";
import { webhookEventTypes } from "./webhook_event_types";

export const webhookEndpointEventTypes = pgTable(
  "webhook_endpoint_event_types",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    endpointId: uuid("endpoint_id")
      .notNull()
      .references(() => webhookEndpoints.id, { onDelete: "cascade" }),
    eventTypeId: uuid("event_type_id")
      .notNull()
      .references(() => webhookEventTypes.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique("uq_webhook_endpoint_event_types_endpoint_id_event_type_id").on(table.endpointId, table.eventTypeId),
    index("idx_webhook_endpoint_event_types_event_type_id").on(table.eventTypeId),
  ]
);
