// blocked_ips: IP-level access blocking.
// See README.md for full design rationale.

import { pgEnum, pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const blockedIpSeverityEnum = pgEnum("blocked_ip_severity", [
  "sign_up_block",
  "login_block",
  "full_block",
]);

export const blockedIps = pgTable(
  "blocked_ips",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ipAddress: text("ip_address").unique().notNull(), // IP address or CIDR range (e.g., "192.168.1.100", "10.0.0.0/8").

    // sign_up_block = prevent new account creation from this IP.
    // login_block = prevent login from this IP.
    // full_block = block all access from this IP.
    severity: blockedIpSeverityEnum("severity").notNull().default("full_block"),

    reason: text("reason"), // Why this IP was blocked.
    expiresAt: timestamp("expires_at", { withTimezone: true }), // When this block expires. Null = permanent.
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_blocked_ips_severity").on(table.severity),
    index("idx_blocked_ips_expires_at").on(table.expiresAt),
    index("idx_blocked_ips_created_by").on(table.createdBy),
  ]
);
