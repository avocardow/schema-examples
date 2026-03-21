// api_keys: Long-lived keys for programmatic access (scripts, CI/CD, integrations).
// The full key is shown once at creation — only the hash is stored.
// See README.md for full design rationale and field documentation.

import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { organizations } from "./organizations";

export const apiKeys = pgTable(
  "api_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "cascade",
    }), // Null for org-level keys (not tied to a specific user).
    organizationId: uuid("organization_id").references(
      () => organizations.id,
      { onDelete: "cascade" }
    ), // Null for personal keys.
    name: text("name").notNull(), // User-assigned label (e.g., "CI/CD Pipeline", "Zapier Integration").
    keyPrefix: text("key_prefix").notNull(), // First 8 chars for identification (e.g., "sk_live_Ab"). Shown in the UI so users can tell keys apart.
    keyHash: text("key_hash").unique().notNull(), // SHA-256 hash of the full key. Used for lookup on every API request.

    // Scopes as a simple string array, not a junction table.
    // API key permissions are typically simpler than full RBAC.
    // Example: ["read:users", "write:posts"].
    // Decide your default: null = full access (convenient but risky) or null = no access (safer).
    // Document your choice clearly — this is a common source of security bugs.
    scopes: text("scopes").array(),

    lastUsedAt: timestamp("last_used_at", { withTimezone: true }), // Track usage for "stale key" detection.
    lastUsedIp: text("last_used_ip"),
    expiresAt: timestamp("expires_at", { withTimezone: true }), // Null = never expires. Set an expiry for security-sensitive environments.
    revokedAt: timestamp("revoked_at", { withTimezone: true }), // Null = active. Set to revoke without deleting (preserves audit trail).
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // unique(key_hash) is already created by the field constraint above.
    index("idx_api_keys_user_id")
      .on(table.userId)
      .where(table.userId.isNotNull()), // "List my API keys."
    index("idx_api_keys_organization_id")
      .on(table.organizationId)
      .where(table.organizationId.isNotNull()), // "List all API keys for this org."
  ]
);
