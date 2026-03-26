// dispute_messages: Threaded communication within a dispute between customer, vendor, and admin.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { disputes } from "./disputes";
import { users } from "../../auth-rbac/drizzle/users";

export const disputeSenderRole = pgEnum("dispute_sender_role", [
  "customer",
  "vendor",
  "admin",
]);

export const disputeMessages = pgTable(
  "dispute_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    disputeId: uuid("dispute_id")
      .notNull()
      .references(() => disputes.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    senderRole: disputeSenderRole("sender_role").notNull(),
    body: text("body").notNull(),
    attachments: jsonb("attachments"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_dispute_messages_dispute_id_created_at").on(
      table.disputeId,
      table.createdAt
    ),
  ]
);
