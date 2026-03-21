// accounts: Unified authentication methods. One row per way a user can sign in.
// Combines OAuth, email+password, magic link, and passkey logins in one table.
// See README.md for full design rationale.

import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const accountTypeEnum = pgEnum("account_type", [
  "oauth",
  "oidc",
  "email",
  "credential",
  "webauthn",
]);

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(), // e.g., "google", "github", "credential"
    providerAccountId: text("provider_account_id").notNull(), // User's ID at the provider; for "credential", use their email

    // "credential" = email+password. "email" = passwordless (magic link/OTP).
    // "webauthn" = passkey as primary login (not MFA — see mfa_factors for that).
    type: accountTypeEnum("type").notNull(),

    // Only populated for credential-type accounts. Never store plaintext passwords.
    passwordHash: text("password_hash"),

    // OAuth tokens for calling provider APIs on behalf of the user.
    // Encrypt at rest — these grant access to the user's external accounts.
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"), // Provider's refresh token (not your refresh_tokens table)
    idToken: text("id_token"), // OIDC ID token
    tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true }),
    tokenType: text("token_type"), // Usually "bearer"
    scope: text("scope"), // OAuth scopes granted (e.g., "openid profile email")

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    unique().on(t.provider, t.providerAccountId), // One link per external identity
    index("idx_accounts_user_id").on(t.userId),   // Look up all linked accounts for a user
  ],
);
