# Auth / RBAC

## Overview

Authentication, session management, role-based access control, multi-factor authentication, OAuth/SSO, and multi-tenant organization support. This is the foundational domain — most other domains reference it for user identity and authorization.

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
