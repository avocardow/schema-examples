// refresh_tokens: Long-lived tokens for obtaining new access tokens without re-authentication.
// Uses parent_id self-reference for rotation chain and token reuse detection.
// See README.md for full design rationale and field documentation.

import {
  pgTable,
  bigserial,
  bigint,
  uuid,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { sessions } from "./sessions";
import { sql } from "drizzle-orm";

export const refreshTokens = pgTable(
  "refresh_tokens",
  {
    id: bigserial("id", { mode: "bigint" }).primaryKey(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").unique().notNull(), // Hashed token. Raw token sent to client.

    // Rotation chain: each new token points to the one it replaced.
    // NULL parent = first token in chain (issued at login).
    parentId: bigint("parent_id", { mode: "bigint" }).references(
      (): any => refreshTokens.id,
      { onDelete: "set null" }
    ),

    revoked: boolean("revoked").notNull().default(false),
    revokedAt: timestamp("revoked_at", { withTimezone: true }), // When this token was revoked (either by rotation or explicit logout).
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(), // Typically 7-30 days.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_refresh_tokens_session_id").on(table.sessionId),
    index("idx_refresh_tokens_parent_id")
      .on(table.parentId)
      .where(sql`${table.parentId} IS NOT NULL`),
  ]
);
