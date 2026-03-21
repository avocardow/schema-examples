// oauth_providers: External OAuth/SSO provider configuration (Google, GitHub, corporate SAML, etc.).
// This is the "consuming" side — your app is the relying party.
// For when your app *acts as* an OAuth server, see oauth_clients instead.
// See README.md for full design rationale and field documentation.

import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { organizations } from "./organizations";

export const oauthProviders = pgTable(
  "oauth_providers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),           // Display name (e.g., "Google", "Acme Corp SSO").
    slug: text("slug").unique().notNull(),  // URL-safe identifier. Used in callback URLs (e.g., /auth/callback/google).
    strategy: text("strategy").notNull(),  // "oauth2", "oidc", or "saml".
    clientId: text("client_id").notNull(),
    clientSecret: text("client_secret"),   // Encrypt at rest. Nullable for public clients (mobile/SPA using PKCE).

    // Override for custom/self-hosted providers. Null = use well-known defaults.
    authorizationUrl: text("authorization_url"),
    tokenUrl: text("token_url"),
    userinfoUrl: text("userinfo_url"),

    scopes: text("scopes")
      .array()
      .notNull()
      .default(sql`'{}'`), // Default scopes to request (e.g., '{"openid","profile","email"}').

    enabled: boolean("enabled").notNull().default(true), // Toggle a provider on/off without deleting its config.

    // Organization-scoped SSO: if set, this provider is only available to members of this org.
    // NULL = available to all users (e.g., "Sign in with Google").
    organizationId: uuid("organization_id").references(
      () => organizations.id,
      { onDelete: "cascade" },
    ),

    metadata: jsonb("metadata"), // Provider-specific config that doesn't fit in standard fields.

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    // "Which SSO providers does this org have?"
    index("idx_oauth_providers_organization_id")
      .on(t.organizationId)
      .where(sql`${t.organizationId} IS NOT NULL`),
    // "List all active providers for the login page."
    index("idx_oauth_providers_enabled")
      .on(t.enabled)
      .where(sql`${t.enabled} = TRUE`),
  ],
);
