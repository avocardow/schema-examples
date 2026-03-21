# Auth / RBAC

## Overview

Authentication, session management, role-based access control, multi-factor authentication, OAuth/SSO, and multi-tenant organization support. This is the foundational domain — most other domains reference it for user identity and authorization.

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (26 tables)</summary>

- [`users`](#users)
- [`sessions`](#sessions)
- [`accounts`](#accounts)
- [`verification_tokens`](#verification_tokens)
- [`password_history`](#password_history)
- [`mfa_factors`](#mfa_factors)
- [`mfa_challenges`](#mfa_challenges)
- [`mfa_recovery_codes`](#mfa_recovery_codes)
- [`oauth_providers`](#oauth_providers)
- [`saml_providers`](#saml_providers)
- [`sso_domains`](#sso_domains)
- [`oauth_clients`](#oauth_clients)
- [`oauth_authorization_codes`](#oauth_authorization_codes)
- [`refresh_tokens`](#refresh_tokens)
- [`roles`](#roles)
- [`permissions`](#permissions)
- [`role_permissions`](#role_permissions)
- [`user_roles`](#user_roles)
- [`organizations`](#organizations)
- [`organization_members`](#organization_members)
- [`organization_invitations`](#organization_invitations)
- [`organization_domains`](#organization_domains)
- [`teams`](#teams)
- [`team_members`](#team_members)
- [`audit_logs`](#audit_logs)
- [`api_keys`](#api_keys)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

This is a standalone domain with no external dependencies.

## Tables

### Core Auth

- `users`
- `sessions`
- `accounts`

### Credentials & Verification

- `verification_tokens`
- `password_history`

### MFA

- `mfa_factors`
- `mfa_challenges`
- `mfa_recovery_codes`

### OAuth & SSO

- `oauth_providers`
- `saml_providers`
- `sso_domains`
- `oauth_clients`
- `oauth_authorization_codes`
- `refresh_tokens`

### RBAC

- `roles`
- `permissions`
- `role_permissions`
- `user_roles`

### Organizations & Multi-tenancy

- `organizations`
- `organization_members`
- `organization_invitations`
- `organization_domains`
- `teams`
- `team_members`

### Audit & API Access

- `audit_logs`
- `api_keys`

## Schema

### `users`

The central identity record. One row per human (or anonymous) user.

```pseudo
table users {
  id            uuid primary_key default auto_generate
  email         string unique nullable       -- Nullable for anonymous or phone-only users. Always store lowercase.
  email_verified_at  timestamp nullable      -- Timestamp (not boolean) so you know *when* verification happened.
  phone         string unique nullable       -- E.164 format (e.g., "+15551234567"). Nullable if your app doesn't use phone auth.
  phone_verified_at  timestamp nullable
  name          string nullable              -- Display name (freeform). Not used for auth — just for UI.
  first_name    string nullable              -- Some apps need split names (legal forms, shipping labels).
  last_name     string nullable              -- If you only need a display name, ignore first/last and just use `name`.
  username      string unique nullable       -- Optional. Only add a unique constraint if your app uses usernames.
  image_url     string nullable              -- Avatar / profile picture URL.

  -- Anonymous users: Supabase pattern for progressive profiling.
  -- Create a "guest" user immediately, then upgrade to a full account when they sign up.
  -- If your app doesn't need anonymous access, you can remove this.
  is_anonymous  boolean default false

  -- Ban vs Lock: two different concepts.
  -- Banned = admin decision ("this user violated ToS"). Can be permanent or temporary.
  -- Locked  = automated response ("too many failed login attempts"). Always temporary.
  banned        boolean default false
  banned_reason string nullable              -- Why the user was banned (visible to admins, not the user).
  banned_until  timestamp nullable           -- Null = permanent ban. Set a date for temporary bans.
  locked        boolean default false
  locked_until  timestamp nullable           -- Auto-unlock after this time. Your app should check this on login.

  -- Two-tier metadata: prevents privilege escalation through client-side manipulation.
  -- public_metadata:  Safe to expose to the client (e.g., preferences, theme, onboarding state).
  --                   Can be read by frontend code. Written by server only.
  -- private_metadata: Server-only (e.g., internal notes, Stripe customer ID, feature flags).
  --                   Never sent to the client. Never let users write to this.
  public_metadata   json nullable default {}
  private_metadata  json nullable default {}

  external_id    string unique nullable      -- Link to an external system (e.g., legacy DB, CRM). Useful during migrations.
  last_sign_in_at   timestamp nullable       -- Updated on each login. Useful for "inactive user" reports.
  last_sign_in_ip   string nullable          -- Last known IP. Consider privacy regulations before storing.
  sign_in_count     integer default 0        -- Running count. Useful for analytics and engagement metrics.

  created_at    timestamp default now
  updated_at    timestamp default now on_update

  -- ⚠️  Soft delete trade-off:
  -- `deleted_at` keeps the row for audit trails, undo, and data recovery.
  -- But for GDPR/CCPA, you may be *required* to hard-delete user data on request.
  -- If privacy compliance is critical, consider hard delete + a separate `deleted_users_audit`
  -- table that stores only the anonymized fact that a deletion occurred (no PII).
  deleted_at    timestamp nullable
}

indexes {
  unique(email)                              -- Fast lookup by email (login flow).
  unique(username)                           -- Only if your app uses usernames.
  index(external_id)                         -- Fast lookup when syncing with external systems.
  index(created_at)                          -- For admin dashboards, "newest users" queries.
}
```

### `sessions`

An active login session. Each time a user signs in (or a token is refreshed), a session row exists.
Sessions are the place to track *how* the user authenticated — not just *that* they did.

```pseudo
table sessions {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade
  token_hash      string unique not_null     -- SHA-256 hash of the session token. The raw token lives only in the client's cookie.
                                             -- Never store raw session tokens in your database.

  -- Authentication Assurance Level (AAL) — from Supabase.
  -- This is the single most important field most auth systems lack.
  -- aal1 = password/OAuth only. aal2 = MFA verified. aal3 = hardware key verified.
  -- Use this to gate sensitive actions: "changing your password requires aal2."
  aal             enum(aal1, aal2, aal3) default aal1

  mfa_factor_id   uuid nullable references mfa_factors(id) -- Which MFA factor elevated this session to aal2+.
  ip_address      string nullable            -- Captured at session creation. Useful for security alerts ("new login from unknown IP").
  user_agent      string nullable            -- Browser/device info. Useful for "manage your sessions" UI.
  country_code    string(2) nullable         -- ISO 3166-1 alpha-2, derived from IP. Nullable if you don't do geo-lookup.

  -- Organization context: tracks which org the user is "currently in."
  -- Avoids extra lookups on every request in multi-tenant apps.
  -- Null for users not in any org, or apps without multi-tenancy.
  organization_id uuid nullable references organizations(id)

  -- Admin impersonation: when a support agent "logs in as" a user.
  -- If this is set, the session belongs to the target user but was initiated by the impersonator.
  -- Your app should show a banner: "You are viewing as [user]. Exit impersonation."
  impersonator_id uuid nullable references users(id)

  tag             string nullable            -- Custom label (e.g., "mobile", "api", "admin-panel"). Free-form, for your own categorization.
  last_active_at  timestamp nullable         -- Updated periodically (not on every request — that's too expensive). Useful for "active sessions" UI.
  expires_at      timestamp not_null         -- Hard expiry. Your app must check this. Don't rely solely on cookie expiry.
  created_at      timestamp default now
}

indexes {
  index(user_id)                             -- "Show me all sessions for this user" (session management UI).
  index(token_hash)                          -- Fast lookup on every authenticated request.
  index(expires_at)                          -- Cleanup job: DELETE FROM sessions WHERE expires_at < now().
}
```

### `accounts`

A linked authentication method. Each row is one way a user can sign in — Google OAuth, GitHub,
email+password, etc. This is the "unified accounts" pattern from Better-auth: instead of separate
tables for OAuth connections and passwords, everything lives here differentiated by `provider`.

```pseudo
table accounts {
  id                  uuid primary_key default auto_generate
  user_id             uuid not_null references users(id) on_delete cascade
  provider            string not_null         -- e.g., "google", "github", "credential". For email+password, use "credential".
  provider_account_id string not_null         -- The user's ID at the provider. For "credential", use the user's email.

  -- Account type helps your code branch without parsing the provider string.
  -- "credential" = email+password. "oauth"/"oidc" = external provider. "webauthn" = passkey login.
  type            enum(oauth, oidc, email, credential, webauthn)

  -- Password hash: only populated for credential-type accounts.
  -- Use bcrypt, scrypt, or argon2id. Never store plaintext passwords.
  -- For OAuth accounts, this is always null.
  password_hash   string nullable

  -- OAuth tokens: stored so your app can make API calls on behalf of the user
  -- (e.g., posting to their GitHub, reading their Google Calendar).
  -- If you don't need to call provider APIs after login, you can skip these.
  access_token    text nullable
  refresh_token   text nullable              -- Provider's refresh token (not to be confused with *your* refresh_tokens table).
  id_token        text nullable              -- OIDC ID token. Contains claims about the user. Useful for debugging.
  token_expires_at timestamp nullable
  token_type      string nullable            -- Usually "bearer".
  scope           string nullable            -- OAuth scopes granted (e.g., "openid profile email").

  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  unique(provider, provider_account_id)      -- One link per external identity. Prevents duplicate OAuth connections.
  index(user_id)                             -- "Show me all linked accounts for this user."
}
```

### `verification_tokens`

A single unified table for all one-time tokens: email verification, password reset, magic links,
phone verification, and invitation tokens. Instead of separate tables for each token type (which
most tutorials teach), one table with a `type` enum handles them all — following Supabase's
`one_time_tokens` pattern.

```pseudo
table verification_tokens {
  id              uuid primary_key default auto_generate

  -- Nullable because some tokens exist *before* a user record.
  -- Example: a magic link signup — the token is created, then the user is created after clicking it.
  -- NextAuth deliberately has no FK on their VerificationToken for this reason.
  user_id         uuid nullable references users(id) on_delete cascade

  token_hash      string unique not_null     -- SHA-256 hash. The raw token is sent via email/SMS. Never store it raw.

  -- The type determines what happens when the token is consumed.
  -- Your app checks type + identifier to know what action to perform.
  type            enum(email_verification, phone_verification, password_reset, magic_link, invitation)

  identifier      string not_null            -- The email or phone number this token targets. Useful for lookup without user_id.
  expires_at      timestamp not_null         -- Short-lived. Email verification: 24h. Password reset: 1h. Magic link: 15min.
  used_at         timestamp nullable         -- Null = unused. Set this when consumed. Prevents replay attacks.
  created_at      timestamp default now
}

indexes {
  unique(token_hash)                         -- Fast lookup when user clicks the link.
  index(identifier, type)                    -- "Find the latest password reset token for this email."
  index(expires_at)                          -- Cleanup job: delete expired tokens periodically.
}
```

### `password_history`

Optional table for enterprise password policies (e.g., "cannot reuse your last 5 passwords").
Most apps don't need this — only Auth0 offers it as a managed feature. Include it if your app
serves regulated industries (finance, healthcare, government).

```pseudo
table password_history {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade
  password_hash   string not_null            -- The *previous* password hash. Compared against new passwords to prevent reuse.
  created_at      timestamp default now      -- When this password was set (not when it was retired).
}

indexes {
  index(user_id, created_at)                 -- "Get last N passwords for this user" — ordered by recency.
}
```

### `mfa_factors`

An enrolled MFA method. Each row is one factor a user has set up — a TOTP app, a hardware key,
a phone number for SMS, etc. A user can have multiple factors (e.g., TOTP as primary + WebAuthn
as backup). This three-table MFA model (factors → challenges → recovery codes) comes from
Supabase — the only provider that fully models the MFA lifecycle in the database.

```pseudo
table mfa_factors {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade
  factor_type     enum(totp, webauthn, phone, email) -- What kind of second factor this is.
  friendly_name   string nullable            -- User-assigned label, e.g., "My YubiKey" or "Work phone". Shown in the "manage MFA" UI.

  -- Lifecycle: unverified → verified → disabled.
  -- A factor is "unverified" during setup (user scanned the QR code but hasn't entered the first code yet).
  -- Only "verified" factors should be accepted for authentication.
  status          enum(unverified, verified, disabled) default unverified

  -- Secrets: only one of these is populated, depending on factor_type.
  -- ⚠️  The TOTP secret MUST be encrypted at rest (not just hashed — you need the original value to verify codes).
  secret          string nullable            -- Encrypted TOTP secret. Only for factor_type=totp.
  phone           string nullable            -- E.164 phone number. Only for factor_type=phone.
  webauthn_credential jsonb nullable         -- WebAuthn public key credential data. Only for factor_type=webauthn.
  webauthn_aaguid string nullable            -- Authenticator Attestation GUID — identifies the authenticator make/model.

  last_used_at    timestamp nullable         -- Useful for detecting stale/unused factors.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(user_id)                             -- "Show me all MFA factors for this user."
  index(user_id, status)                     -- "Does this user have any verified factors?" (determines if MFA is enabled).
}
```

### `mfa_challenges`

An in-progress MFA verification attempt. When a user is prompted for their second factor, a
challenge row is created. It tracks whether they passed, failed, or timed out. This enables
rate limiting ("max 5 attempts per challenge") and replay prevention ("this code was already used").

```pseudo
table mfa_challenges {
  id              uuid primary_key default auto_generate
  factor_id       uuid not_null references mfa_factors(id) on_delete cascade

  -- For SMS/email factors, the server generates and stores a hashed OTP here.
  -- For TOTP, this is null (the code is time-based, not server-generated).
  -- For WebAuthn, the session data needed to verify the response is stored here.
  otp_code        string nullable            -- Hashed server-generated code (SMS/email factors only).
  webauthn_session_data jsonb nullable       -- WebAuthn challenge session data.

  verified_at     timestamp nullable         -- Null = pending. Set when the user successfully verifies.
  expires_at      timestamp not_null         -- Short-lived: 5–10 minutes. Expired challenges should be rejected.
  ip_address      string nullable            -- Where the challenge was initiated. Useful for fraud detection.
  created_at      timestamp default now
}

indexes {
  index(factor_id)                           -- "Get active challenges for this factor."
  index(expires_at)                          -- Cleanup job: delete expired challenges.
}
```

### `mfa_recovery_codes`

Backup codes for when a user loses access to their MFA device. Typically generated as a batch
(e.g., 10 codes) when MFA is first enabled. Each code is a separate row so you can track
individual consumption — much better than a single JSON array on the user.

```pseudo
table mfa_recovery_codes {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade
  code_hash       string not_null            -- Hashed recovery code. The plaintext is shown once at generation, never again.
  used_at         timestamp nullable         -- Null = available. Set when consumed. A used code cannot be reused.
  created_at      timestamp default now
}

indexes {
  index(user_id)                             -- "Get all recovery codes for this user" (to check how many are left).
}
```

### `oauth_providers`

Configuration for external OAuth/SSO providers your app can authenticate against (Google, GitHub,
corporate SAML, etc.). This is the "consuming" side — your app is the relying party. Not to be
confused with `oauth_clients`, which is for when your app *acts as* an OAuth server.

```pseudo
table oauth_providers {
  id              uuid primary_key default auto_generate
  name            string not_null            -- Display name shown in your UI (e.g., "Google", "Acme Corp SSO").
  slug            string unique not_null     -- URL-safe identifier (e.g., "google", "github", "acme-sso"). Used in code and callback URLs.
  strategy        string not_null            -- "oauth2", "oidc", or "saml". Determines which flow to use.
  client_id       string not_null            -- OAuth client ID from the provider's developer console.
  client_secret   string not_null            -- ⚠️  Must be encrypted at rest. This is the most sensitive field in this table.
  authorization_url string nullable          -- Override for custom/self-hosted providers. Null = use well-known defaults.
  token_url       string nullable            -- Override for custom providers.
  userinfo_url    string nullable            -- Override for custom providers.
  scopes          string[] default []        -- Default scopes to request (e.g., ["openid", "profile", "email"]).
  enabled         boolean default true       -- Toggle a provider on/off without deleting its configuration.

  -- Organization-scoped SSO: if set, this provider is only available to members of this org.
  -- Null = available to all users (e.g., "Sign in with Google").
  organization_id uuid nullable references organizations(id)

  metadata        json nullable              -- Provider-specific config that doesn't fit in standard fields.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  unique(slug)                               -- Lookup by slug in callback URLs (e.g., /auth/callback/google).
  index(organization_id)                     -- "Which SSO providers does this org have?"
  index(enabled)                             -- "List all active providers for the login page."
}
```

### `saml_providers`

Enterprise SSO extension for SAML-based identity providers. This extends `oauth_providers` —
a SAML provider is just another SSO strategy, not a completely separate concept. The parent
`oauth_providers` row holds the shared config (name, slug, org), and this table holds SAML-specific
details (metadata XML, certificates, attribute mapping).

```pseudo
table saml_providers {
  id              uuid primary_key default auto_generate
  oauth_provider_id uuid not_null references oauth_providers(id) on_delete cascade -- Parent provider config.
  entity_id       string not_null            -- SAML EntityID from the IdP (e.g., "https://idp.acme.com/saml").
  metadata_xml    text nullable              -- Full IdP metadata XML. Either this or metadata_url is required.
  metadata_url    string nullable            -- URL to fetch IdP metadata (auto-refreshing). Preferred over static XML.
  certificate     text nullable              -- IdP's X.509 signing certificate. Used to verify SAML assertions.
  name_id_format  string nullable            -- Expected NameID format (e.g., "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress").

  -- Attribute mapping: maps IdP-specific attribute names to your user fields.
  -- Example: { "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "email" }
  attribute_mapping json nullable

  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  unique(entity_id)                          -- SAML EntityIDs must be globally unique.
  index(oauth_provider_id)                   -- Join back to the parent provider.
}
```

### `sso_domains`

Maps email domains to SSO providers. When a user with `@acme.com` tries to sign in, your app
looks up this table to route them to Acme's SSO provider automatically. This is the
"connection-based routing" pattern from WorkOS and Supabase.

```pseudo
table sso_domains {
  id              uuid primary_key default auto_generate
  oauth_provider_id uuid not_null references oauth_providers(id) on_delete cascade
  domain          string unique not_null     -- e.g., "acme.com". One domain can only map to one provider.
  verified        boolean default false      -- Has the org proven they own this domain (via DNS TXT record or email)?
  verified_at     timestamp nullable         -- When verification succeeded.
  created_at      timestamp default now
}

indexes {
  unique(domain)                             -- Fast lookup: "Which provider handles @acme.com?"
  index(oauth_provider_id)                   -- "Which domains are claimed by this provider?"
}
```

### `oauth_clients`

For when your app acts as an OAuth *server* (issuing tokens to third-party apps). Most apps
don't need this — it's for platforms that expose APIs to external developers (like "Sign in with
YourApp" or third-party integrations). If you're only consuming OAuth (Google, GitHub), you
only need `oauth_providers`, not this table.

```pseudo
table oauth_clients {
  id              uuid primary_key default auto_generate  -- Also serves as the client_id in OAuth flows.
  name            string not_null            -- Display name shown in the consent screen ("Acme App wants to access your account").
  secret_hash     string not_null            -- Hashed client secret. Like passwords — never store plaintext.
  redirect_uris   string[] not_null          -- Allowed redirect URIs. Strictly validated during authorization.
  grant_types     string[] default []        -- e.g., ["authorization_code", "client_credentials"]. Controls which OAuth flows this client can use.
  scopes          string[] default []        -- Allowed scopes this client can request.

  -- App type affects security requirements.
  -- "web" = server-side (can keep secrets). "spa" = single-page app (public client, must use PKCE).
  -- "native" = mobile/desktop. "m2m" = machine-to-machine (no user involved).
  app_type        string nullable            -- "web", "spa", "native", or "m2m".

  organization_id uuid nullable references organizations(id) -- Which org owns this client. Null = platform-level.
  is_first_party  boolean default false      -- First-party clients skip the consent screen.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(organization_id)                     -- "List all OAuth clients for this org."
}
```

### `oauth_authorization_codes`

Short-lived authorization codes issued during the OAuth authorization code flow. After the user
grants consent, your server issues a code that the client exchanges for tokens. These codes are
single-use and expire in seconds to minutes.

```pseudo
table oauth_authorization_codes {
  id              uuid primary_key default auto_generate
  client_id       uuid not_null references oauth_clients(id) on_delete cascade
  user_id         uuid not_null references users(id) on_delete cascade
  code_hash       string unique not_null     -- Hashed authorization code. Single-use.
  redirect_uri    string not_null            -- Must exactly match the redirect_uri from the authorization request.
  scope           string nullable            -- Scopes granted by the user.

  -- PKCE (Proof Key for Code Exchange): required for public clients (SPAs, mobile apps).
  -- The client sends a code_challenge at authorization time, then proves it at token exchange.
  -- If your OAuth server only serves confidential (server-side) clients, you can skip PKCE.
  code_challenge  string nullable            -- The challenge value from the client.
  code_challenge_method string nullable      -- "S256" (recommended) or "plain" (not recommended).

  expires_at      timestamp not_null         -- Very short-lived: 30 seconds to 10 minutes.
  created_at      timestamp default now
}

indexes {
  unique(code_hash)                          -- Fast lookup during token exchange.
  index(expires_at)                          -- Cleanup job.
}
```

### `refresh_tokens`

Long-lived tokens used to obtain new access tokens without re-authentication. The key design
here is the `parent_id` self-reference from Supabase — it creates a rotation chain. When a
refresh token is used, it's revoked and a new child token is issued. If a revoked token is
reused (indicating theft), you can revoke the entire chain.

```pseudo
table refresh_tokens {
  id              bigint primary_key auto_increment  -- Bigint for high-volume rotation. UUIDs work too but are slower to index.
  session_id      uuid not_null references sessions(id) on_delete cascade
  token_hash      string unique not_null     -- Hashed token. The raw token is sent to the client.

  -- Rotation chain: each new token points to the token it replaced.
  -- If parent_id is null, this is the first token in the chain (issued at login).
  -- If a token with revoked=true is presented, revoke ALL tokens in the chain (reuse detection).
  parent_id       bigint nullable references refresh_tokens(id)

  revoked         boolean default false
  revoked_at      timestamp nullable         -- When this token was revoked (either by rotation or explicit logout).
  expires_at      timestamp not_null         -- Typically 7–30 days. Longer than access tokens, shorter than sessions.
  created_at      timestamp default now
}

indexes {
  unique(token_hash)                         -- Fast lookup on every token refresh.
  index(session_id)                          -- "Revoke all refresh tokens for this session" (logout).
  index(parent_id)                           -- Walk the rotation chain for reuse detection.
}
```

### `roles`

A named set of permissions. Roles use human-readable slugs (e.g., `"admin"`, `"org:editor"`)
so your code reads `if (hasRole("admin"))` instead of `if (hasRole(47))`. The `scope` field
implements WorkOS-style two-tier roles: environment-level roles (super admin across the whole
app) and organization-scoped roles (editor within a specific org).

```pseudo
table roles {
  id              uuid primary_key default auto_generate
  slug            string unique not_null     -- Human-readable key (e.g., "admin", "org:editor", "viewer"). Used in code.
  name            string not_null            -- Display name for admin UIs (e.g., "Administrator", "Organization Editor").
  description     string nullable            -- Explain what this role is for. Shown in role management UI.

  -- Scope determines where this role applies:
  -- "environment" = app-wide (e.g., super admin, platform support).
  -- "organization" = only within an org (e.g., org admin, org editor).
  -- This avoids needing separate tables for global roles vs org roles.
  scope           enum(environment, organization)

  -- System roles (admin, member, viewer) are created at setup and cannot be deleted.
  -- Prevents accidental "I deleted the admin role and locked everyone out" scenarios.
  is_system       boolean default false

  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  unique(slug)                               -- Lookup by slug in authorization checks.
  index(scope)                               -- "List all organization-scoped roles."
}
```

### `permissions`

A granular capability (e.g., `"posts:create"`, `"users:delete"`). Permissions use a
`resource:action` naming convention following WorkOS and Clerk. They're assigned to roles
(not directly to users) to keep the model manageable.

```pseudo
table permissions {
  id              uuid primary_key default auto_generate
  slug            string unique not_null     -- Structured key: "resource:action" (e.g., "posts:create", "billing:read", "users:delete").
  name            string not_null            -- Display name (e.g., "Create Posts").
  description     string nullable
  resource_type   string nullable            -- Groups permissions by resource (e.g., "posts", "users", "billing").
                                             -- Useful for building permission UIs: "Posts: ☑ create ☑ read ☐ delete".
  created_at      timestamp default now
}

indexes {
  unique(slug)                               -- Fast lookup in authorization checks.
  index(resource_type)                       -- "List all permissions for the 'posts' resource."
}
```

### `role_permissions`

Junction table linking roles to permissions. A role can have many permissions, and a permission
can belong to many roles. This is a pure join table — no extra fields needed.

```pseudo
table role_permissions {
  role_id         uuid not_null references roles(id) on_delete cascade
  permission_id   uuid not_null references permissions(id) on_delete cascade

  primary_key(role_id, permission_id)        -- Composite PK. No separate id column needed.
}

indexes {
  index(permission_id)                       -- "Which roles have this permission?" (reverse lookup).
}
```

### `user_roles`

Assigns roles to users at the environment (app-wide) level. For organization-scoped roles,
see `organization_members.role_id` instead. This table is for roles like "super admin" or
"platform support" that apply across the entire application, not within a specific org.

```pseudo
table user_roles {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade
  role_id         uuid not_null references roles(id) on_delete cascade
  assigned_by     uuid nullable references users(id) -- Who granted this role. Null if system-assigned.
  created_at      timestamp default now

  unique(user_id, role_id)                   -- A user can't have the same role twice.
}

indexes {
  index(user_id)                             -- "What roles does this user have?"
  index(role_id)                             -- "Which users have the admin role?"
}
```

### `organizations`

A tenant / workspace / company. The top-level grouping for multi-tenant apps. Users belong to
organizations through `organization_members`, and each membership has a role. An organization
can have verified domains, teams, and its own SSO configuration.

```pseudo
table organizations {
  id              uuid primary_key default auto_generate
  name            string not_null            -- Display name (e.g., "Acme Corporation").
  slug            string unique not_null     -- URL-safe identifier (e.g., "acme-corp"). Used in URLs: /orgs/acme-corp.
  logo_url        string nullable            -- Organization logo for branding.

  -- External IDs: for linking to external systems (billing, CRM, etc.).
  external_id     string unique nullable     -- Your own cross-system reference.
  stripe_customer_id string unique nullable  -- Direct Stripe link. Common enough to warrant its own column.

  max_members     integer nullable           -- Plan-based member limit. Null = unlimited. Enforced in your app logic.
  public_metadata  json nullable default {}  -- Same two-tier pattern as users. Client-readable, server-writable.
  private_metadata json nullable default {}  -- Server-only (e.g., internal billing notes, feature flags).

  created_at      timestamp default now
  updated_at      timestamp default now on_update
  deleted_at      timestamp nullable         -- Soft delete. Same GDPR considerations as users — see the users table note.
}

indexes {
  unique(slug)                               -- Lookup by slug in URLs.
  index(stripe_customer_id)                  -- Webhook handling: "Which org does this Stripe customer belong to?"
}
```

### `organization_members`

Links users to organizations with a role. This is the primary multi-tenancy junction table.
The `role_id` here must reference a role with `scope=organization` — environment-level roles
go in `user_roles` instead.

```pseudo
table organization_members {
  id              uuid primary_key default auto_generate
  organization_id uuid not_null references organizations(id) on_delete cascade
  user_id         uuid not_null references users(id) on_delete cascade
  role_id         uuid not_null references roles(id) -- Must be a role with scope=organization. Enforced in app logic.

  -- Membership lifecycle: pending → active → inactive.
  -- "pending" = invited but hasn't accepted yet.
  -- "inactive" = suspended but not removed (preserves history).
  status          enum(active, inactive, pending) default pending

  -- SCIM provisioning: if true, this membership is managed by an external directory (Okta, Azure AD, etc.).
  -- Directory-managed memberships shouldn't be editable through your app's UI.
  directory_managed boolean default false

  custom_attributes json nullable            -- Org-specific metadata for this member (e.g., department, title within the org).
  invited_by      uuid nullable references users(id) -- Who sent the invitation.
  joined_at       timestamp nullable         -- When status became "active". Null if still pending.
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  unique(organization_id, user_id)           -- A user can only be a member of an org once.
}

indexes {
  index(user_id)                             -- "Which orgs does this user belong to?"
  index(organization_id, status)             -- "List active members of this org."
}
```

### `organization_invitations`

Pending invitations to join an organization. Separate from `organization_members` because an
invitation can exist before the invitee even has a user account (they might sign up *after*
receiving the invite email).

```pseudo
table organization_invitations {
  id              uuid primary_key default auto_generate
  organization_id uuid not_null references organizations(id) on_delete cascade
  email           string not_null            -- Invitee's email. They may or may not have an account yet.
  role_id         uuid not_null references roles(id) -- The role they'll get upon acceptance.

  -- Invitation lifecycle: pending → accepted / expired / revoked.
  -- "revoked" = an admin cancelled it before the invitee accepted.
  status          enum(pending, accepted, expired, revoked) default pending

  token_hash      string unique not_null     -- Hashed invitation token. The raw token is sent in the invite email.
  inviter_id      uuid nullable references users(id) -- Who sent the invitation. Null if system-generated.
  expires_at      timestamp not_null         -- Typically 7 days. After this, the invitee must request a new invitation.
  accepted_at     timestamp nullable         -- When the invitee accepted.
  created_at      timestamp default now
}

indexes {
  index(organization_id, status)             -- "List pending invitations for this org."
  index(email)                               -- "Does this email have any pending invitations?" (checked at signup).
  unique(token_hash)                         -- Fast lookup when invitee clicks the link.
}
```

### `organization_domains`

Verified domains owned by an organization. Enables two powerful features:
1. **Auto-join**: users with `@acme.com` emails are automatically added to the Acme org on signup.
2. **SSO routing**: users with `@acme.com` are redirected to Acme's SSO provider.

Domain verification (via DNS TXT record or email) prevents an org from claiming a domain they don't own.

```pseudo
table organization_domains {
  id              uuid primary_key default auto_generate
  organization_id uuid not_null references organizations(id) on_delete cascade
  domain          string unique not_null     -- e.g., "acme.com". Lowercase, no protocol prefix.
  verified        boolean default false      -- Only verified domains should trigger auto-join or SSO routing.

  -- Verification method: "dns" (TXT record), "email" (verification email to admin@domain), etc.
  verification_method string nullable
  verification_token  string nullable        -- The token/value the org needs to set in DNS or confirm via email.
  verified_at     timestamp nullable         -- When verification succeeded.

  created_at      timestamp default now
}

indexes {
  unique(domain)                             -- Global uniqueness: one org per domain.
  index(organization_id)                     -- "Which domains does this org own?"
}
```

### `teams`

Sub-groups within an organization (e.g., "Engineering", "Marketing", "Design"). Lighter than
nested organizations — teams don't have their own billing, SSO, or domain verification. They're
just a way to group members for permissions or notifications. From Better-auth's organization plugin.

```pseudo
table teams {
  id              uuid primary_key default auto_generate
  organization_id uuid not_null references organizations(id) on_delete cascade
  name            string not_null            -- Display name (e.g., "Engineering").
  slug            string not_null            -- URL-safe identifier, unique within the org (e.g., "engineering").
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  unique(organization_id, slug)              -- Slugs must be unique within each org, not globally.
}

indexes {
  index(organization_id)                     -- "List all teams in this org."
}
```

### `team_members`

Links users to teams. Simpler than `organization_members` — no status lifecycle or directory
management. Just a role string for basic team-level permissions (e.g., "lead", "member").
If you need full RBAC at the team level, reference the `roles` table instead.

```pseudo
table team_members {
  id              uuid primary_key default auto_generate
  team_id         uuid not_null references teams(id) on_delete cascade
  user_id         uuid not_null references users(id) on_delete cascade
  role            string nullable            -- Simple team role (e.g., "lead", "member"). Not a FK — intentionally lightweight.
  created_at      timestamp default now

  unique(team_id, user_id)                   -- A user can only be in a team once.
}

indexes {
  index(team_id)                             -- "List all members of this team."
  index(user_id)                             -- "Which teams is this user on?"
}
```

### `audit_logs`

Immutable event log for security-relevant actions. Every login, role change, password reset,
and permission modification gets a row here. This single table replaces separate tables for
security events, session activities, and impersonation logs — they're all just events with
different `event_type` values. Follows Auth0's structured event code pattern.

```pseudo
table audit_logs {
  id              uuid primary_key default auto_generate

  -- Structured event codes using dot notation: resource.action.result
  -- Examples: "user.login.success", "user.login.failure", "role.assigned", "mfa.factor.created",
  --           "session.impersonation.started", "api_key.created", "org.member.invited"
  event_type      string not_null

  -- Polymorphic actor: who performed the action.
  -- Using type + id (not FKs) because audit logs must survive deletion of the actor.
  -- If a user is deleted, their audit trail should remain intact.
  actor_type      enum(user, system, api_key, service)
  actor_id        string nullable            -- user_id, api_key_id, or service name. Not a FK — intentional.

  -- Polymorphic target: what was acted upon.
  target_type     string nullable            -- e.g., "user", "organization", "role", "session".
  target_id       string nullable            -- The entity's ID. Not a FK — same reason as actor_id.

  organization_id uuid nullable references organizations(id) -- Org context. Null for environment-level events.
  ip_address      string nullable
  user_agent      string nullable
  metadata        json nullable              -- Event-specific details. Flexible: { "old_role": "member", "new_role": "admin" }.
  created_at      timestamp default now      -- Immutable. Audit logs are append-only — never update or delete.
}

indexes {
  index(event_type)                          -- "Show me all login failures."
  index(actor_type, actor_id)                -- "What has this user done?"
  index(target_type, target_id)              -- "What happened to this resource?"
  index(organization_id, created_at)         -- "Audit trail for this org, newest first."
  index(created_at)                          -- Time-range queries and retention policies.
}
```

### `api_keys`

Long-lived API keys for programmatic access. Unlike session tokens (which are tied to a browser),
API keys are used by scripts, CI/CD pipelines, and third-party integrations. The key itself is
shown once at creation (like Stripe's `sk_live_...`) — after that, only the hash is stored.

```pseudo
table api_keys {
  id              uuid primary_key default auto_generate
  user_id         uuid nullable references users(id) on_delete cascade   -- Null for org-level keys (not tied to a specific user).
  organization_id uuid nullable references organizations(id) on_delete cascade -- Null for personal keys.
  name            string not_null            -- User-assigned label (e.g., "CI/CD Pipeline", "Zapier Integration").
  key_prefix      string not_null            -- First 8 chars for identification (e.g., "sk_live_Ab"). Shown in the UI so users can tell keys apart.
  key_hash        string unique not_null     -- SHA-256 hash of the full key. Used for lookup on every API request.

  -- Scopes as a simple string array, not a junction table.
  -- API key permissions are typically simpler than full RBAC.
  -- Example: ["read:users", "write:posts"]. Null or empty = full access (be careful).
  scopes          string[] nullable

  last_used_at    timestamp nullable         -- Track usage for "stale key" detection.
  last_used_ip    string nullable
  expires_at      timestamp nullable         -- Null = never expires. Set an expiry for security-sensitive environments.
  revoked_at      timestamp nullable         -- Null = active. Set to revoke without deleting (preserves audit trail).
  created_at      timestamp default now
}

indexes {
  unique(key_hash)                           -- Fast lookup on every API request.
  index(user_id)                             -- "List my API keys."
  index(organization_id)                     -- "List all API keys for this org."
}
```

## Relationships

### One-to-Many

- `users` → `sessions` (a user has many sessions)
- `users` → `accounts` (a user has many linked accounts — OAuth, email/password, etc.)
- `users` → `mfa_factors` (a user can enroll multiple MFA methods)
- `users` → `mfa_recovery_codes` (a user has multiple recovery codes)
- `users` → `user_roles` (a user can have multiple roles)
- `sessions` → `refresh_tokens` (a session has many refresh tokens via rotation)
- `mfa_factors` → `mfa_challenges` (a factor can have multiple challenge attempts)
- `oauth_providers` → `saml_providers` (a SAML config extends an OAuth provider)
- `oauth_providers` → `sso_domains` (a provider can claim multiple domains)
- `oauth_clients` → `oauth_authorization_codes` (a client has many auth codes)
- `organizations` → `organization_members` (an org has many members)
- `organizations` → `organization_invitations` (an org has many invitations)
- `organizations` → `organization_domains` (an org can verify multiple domains)
- `organizations` → `teams` (an org has many teams)
- `teams` → `team_members` (a team has many members)
- `refresh_tokens` → `refresh_tokens` (self-referencing parent chain for rotation)

### Many-to-Many (via junction tables)

- `roles` ↔ `permissions` (through `role_permissions`)
- `users` ↔ `roles` (through `user_roles` for environment-level roles)
- `users` ↔ `organizations` (through `organization_members` with role)
- `users` ↔ `teams` (through `team_members`)

## Best Practices

- **Hash all tokens** — Store SHA-256 hashes of session tokens, verification tokens, and API keys. Never store raw tokens.
- **Cascade deletes from users** — Deleting a user should cascade to sessions, accounts, MFA factors, and recovery codes.
- **Use AAL levels on sessions** — Track authentication assurance level (aal1 = password only, aal2 = MFA verified) per session, not per user.
- **Unified accounts table** — Store both OAuth and credential (email/password) accounts in one table, differentiated by `provider_id`.
- **Slug-based roles and permissions** — Use human-readable slugs (e.g., `posts:create`) not just auto-increment IDs.
- **Two-tier roles** — Support both environment-level roles (super admin) and organization-scoped roles (org editor).
- **Refresh token rotation** — Use parent chains to detect token reuse and revoke entire chains.
- **Separate user-editable and admin-only metadata** — Prevent privilege escalation through metadata manipulation.

## Formats

Each table is a separate file within each format folder:

| Format         | Directory                            | Status  |
| -------------- | ------------------------------------ | ------- |
| Convex         | [`convex/`](./convex/)               | 🔲 Todo |
| SQL            | [`sql/`](./sql/)                     | 🔲 Todo |
| Prisma         | [`prisma/`](./prisma/)               | 🔲 Todo |
| MongoDB        | [`mongodb/`](./mongodb/)             | 🔲 Todo |
| Drizzle        | [`drizzle/`](./drizzle/)             | 🔲 Todo |
| SpacetimeDB    | [`spacetimedb/`](./spacetimedb/)     | 🔲 Todo |
| Firebase       | [`firebase/`](./firebase/)           | 🔲 Todo |
