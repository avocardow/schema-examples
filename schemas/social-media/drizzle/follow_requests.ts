// follow_requests: Pending follow requests for private accounts.
// See README.md for full design rationale.
import { pgTable, pgEnum, uuid, timestamp, index, unique } from "drizzle-orm/pg-core";
import { users } from "./users";

export const followRequestStatusEnum = pgEnum("follow_request_status", ["pending", "approved", "rejected"]);

export const followRequests = pgTable(
  "follow_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    requesterId: uuid("requester_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    targetId: uuid("target_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: followRequestStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_follow_requests_requester_target").on(table.requesterId, table.targetId),
    index("idx_follow_requests_target_id_status").on(table.targetId, table.status),
  ]
);
