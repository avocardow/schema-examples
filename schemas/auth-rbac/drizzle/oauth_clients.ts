// oauth_clients: For when your app acts as an OAuth *server* (issuing tokens to third-party apps).
// Only needed for platforms with external developer integrations. If you're only consuming OAuth
// (Google, GitHub), use oauth_providers instead.

import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const oauthClients = pgTable(
  "oauth_clients",
  {
    id: uuid("id").primaryKey().defaultRandom(), // Also serves as the client_id in OAuth flows.
    name: text("name").notNull(), // Display name shown in the consent screen.
    secretHash: text("secret_hash").notNull(), // Hashed client secret — never store plaintext.
    redirectUris: text("redirect_uris").array().notNull(), // Strictly validated during authorization.
    grantTypes: text("grant_types").array().notNull().default(sql`'{}'`), // e.g., ["authorization_code", "client_credentials"].
    scopes: text("scopes").array().notNull().default(sql`'{}'`), // Allowed scopes this client can request.

    // App type affects security requirements.
    // "web" = server-side (can keep secrets). "spa" = public client (must use PKCE).
    // "native" = mobile/desktop. "m2m" = machine-to-machine (no user involved).
    appType: text("app_type"), // "web", "spa", "native", or "m2m".

    organizationId: uuid("organization_id").references(() => organizations.id, {
      onDelete: "cascade",
    }), // Which org owns this client. Null = platform-level.
    isFirstParty: boolean("is_first_party").notNull().default(false), // First-party clients skip the consent screen.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_oauth_clients_organization_id")
      .on(table.organizationId)
      .where(sql`${table.organizationId} IS NOT NULL`),
  ]
);
