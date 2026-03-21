// mfa_recovery_codes: Backup codes for when a user loses access to their MFA device.
// Each code is a separate row for individual consumption tracking.
// See README.md for full design rationale and field documentation.

import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { users } from "./users";

export const mfaRecoveryCodes = pgTable(
  "mfa_recovery_codes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Hashed recovery code. The plaintext is shown once at generation, never again.
    codeHash: text("code_hash").notNull(),
    // NULL = available. Set when consumed. A used code cannot be reused.
    usedAt: timestamp("used_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // "Get all recovery codes for this user" (to check how many are left).
    index("idx_mfa_recovery_codes_user_id").on(table.userId),
  ],
);
