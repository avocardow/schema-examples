// oauth_authorization_codes: Short-lived codes for the OAuth authorization code flow.
// Single-use. Exchanged for tokens within seconds to minutes.
// See README.md for full design rationale and field documentation.

import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { oauthClients } from "./oauth_clients";
import { users } from "./users";

export const oauthAuthorizationCodes = pgTable(
  "oauth_authorization_codes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => oauthClients.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    codeHash: text("code_hash").unique().notNull(), // Hashed authorization code. Single-use.
    redirectUri: text("redirect_uri").notNull(), // Must exactly match the original authorization request.
    scope: text("scope"), // Scopes granted by the user.

    // PKCE: required for public clients (SPAs, mobile apps).
    codeChallenge: text("code_challenge"), // The challenge value from the client.
    codeChallengeMethod: text("code_challenge_method"), // "S256" (recommended) or "plain".

    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(), // Very short-lived: 30 seconds to 10 minutes.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // unique(code_hash) is already created by the field constraint above.
    index("idx_oauth_authorization_codes_expires_at").on(table.expiresAt), // Cleanup job.
  ]
);
