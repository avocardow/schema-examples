# SaaS / Multi-Tenant

> Tenant configuration, feature entitlements, usage metering, outbound webhooks, and third-party integrations for multi-tenant SaaS platforms.

## Overview

A complete SaaS platform infrastructure schema covering the concerns that make an application multi-tenant beyond basic auth: how tenants configure their workspace, what features they can access, how usage is tracked and enforced, how they receive event notifications via webhooks, and how they connect third-party services.

Designed from a study of 10 real implementations: identity platforms (WorkOS, Clerk), billing/entitlement systems (Stripe Entitlements, Stigg, Schematic), feature flag services (LaunchDarkly), webhook infrastructure (Svix), multi-tenancy frameworks (ABP Framework, Nile), and data modeling research (Garrett Dimon's SaaS entitlements model).

Key design decisions:
- **Organizations as tenants** — the `organizations` table from [Auth / RBAC](../auth-rbac) is the tenant entity. This domain adds configuration, entitlements, and integrations on top of that foundation rather than duplicating it.
- **Three-type feature entitlements** (boolean, limit, metered) — the consensus model across Stigg, Schematic, and Garrett Dimon. Boolean features gate access (on/off), limit features cap usage (max seats, max projects), and metered features track consumption (API calls, storage GB).
- **Tenant-level feature grants with source tracking** — `tenant_features` records which features a tenant can access, at what limit, from what source (plan default, manual override, trial, or custom deal). Plan definitions live in the [Subscription / Membership](../subscription-membership) domain; this domain stores the resolved entitlements.
- **Append-only usage events with periodic summaries** — raw usage events are immutable for audit trails. Pre-aggregated summaries enable fast quota checks without scanning the full event log. Follows the Stripe/Stigg metering pattern.
- **Svix-style webhook model** — four-tier architecture (event types → endpoints → messages → delivery attempts) for complete webhook lifecycle tracking. Per-endpoint event filtering, signing secrets for payload verification, and comprehensive delivery logging.
- **EAV tenant settings** — key-value pairs for flexible per-tenant configuration (timezone, locale, defaults) without schema migrations for new settings.
- **Structured branding** — dedicated columns for white-label customization (logo, colors, favicon). Fixed schema because branding fields are well-known and stable.
- **Custom domains** — tenant-owned domain routing with DNS verification and SSL certificate tracking for white-label experiences.

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (14 tables)</summary>

- [`tenant_settings`](#1-tenant_settings)
- [`tenant_branding`](#2-tenant_branding)
- [`custom_domains`](#3-custom_domains)
- [`features`](#4-features)
- [`tenant_features`](#5-tenant_features)
- [`usage_events`](#6-usage_events)
- [`usage_summaries`](#7-usage_summaries)
- [`webhook_event_types`](#8-webhook_event_types)
- [`webhook_endpoints`](#9-webhook_endpoints)
- [`webhook_endpoint_event_types`](#10-webhook_endpoint_event_types)
- [`webhook_messages`](#11-webhook_messages)
- [`webhook_delivery_attempts`](#12-webhook_delivery_attempts)
- [`integration_definitions`](#13-integration_definitions)
- [`tenant_integrations`](#14-tenant_integrations)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `organizations`, `users` | `organizations` is the tenant entity. `users` for ownership, audit trails, and action attribution. |

> **Subscription plans and billing** are managed externally by the planned [Subscription / Membership](../subscription-membership) domain. The `tenant_features` table tracks resolved entitlements with a `source` field indicating whether access came from a plan, manual override, trial, or custom deal — but plan definitions and billing logic are not part of this domain.

## Tables

### Tenant Configuration
- `tenant_settings` — Key-value configuration pairs per tenant (timezone, locale, defaults)
- `tenant_branding` — White-label visual customization per tenant (logo, colors, favicon, custom CSS)
- `custom_domains` — Custom domain mapping for white-label routing with DNS verification and SSL status

### Features & Entitlements
- `features` — Feature catalog with type taxonomy (boolean, limit, metered) and metadata
- `tenant_features` — Per-tenant feature grants with limit values, source tracking, and expiry

### Usage Metering
- `usage_events` — Append-only log of billable/trackable usage events per tenant per feature
- `usage_summaries` — Pre-aggregated usage totals per tenant per feature per billing period

### Webhooks
- `webhook_event_types` — Catalog of available webhook event types
- `webhook_endpoints` — Tenant-registered callback URLs with signing secrets and status
- `webhook_endpoint_event_types` — Junction: which event types each endpoint subscribes to
- `webhook_messages` — Outbound webhook message payloads tied to event occurrences
- `webhook_delivery_attempts` — Per-endpoint delivery attempt log with status, response, and timing

### Integrations
- `integration_definitions` — Available third-party integrations with metadata and configuration schema
- `tenant_integrations` — Per-tenant connected integration instances with encrypted credentials

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. tenant_settings

Key-value configuration pairs per tenant. Stores operational settings like timezone, locale, default currency, and any custom configuration the application defines. New settings can be added without schema migrations — the application defines known keys and their expected value types.

```pseudo
table tenant_settings {
  id              uuid primary_key default auto_generate
  organization_id uuid not_null references organizations(id) on_delete cascade
                                               -- The tenant this setting belongs to. From Auth / RBAC.
  key             string not_null              -- Setting identifier (e.g., "timezone", "locale", "default_currency").
  value           string not_null              -- Setting value as string. Application parses based on key.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    composite_unique(organization_id, key)    -- One value per key per tenant.
    -- composite_unique(organization_id, key) covers index(organization_id) via leading column.
  }
}
```

**Design notes:**
- EAV pattern: flexible key-value storage. The application defines a registry of known keys with expected types and defaults.
- Common keys: `timezone` (IANA string, e.g., "America/New_York"), `locale` (BCP-47, e.g., "en-US"), `default_currency` (ISO 4217, e.g., "USD"), `date_format` (e.g., "YYYY-MM-DD").
- Values are always strings. The application validates and parses based on the key. Boolean settings use "true"/"false".
- Missing keys fall back to application-defined defaults. Only explicitly set values are stored.

### 2. tenant_branding

White-label visual customization per tenant. Stores branding assets and theme configuration for tenants that want a custom look. Unlike settings (key-value), branding uses fixed columns because the fields are well-known, stable, and benefit from type safety.

```pseudo
table tenant_branding {
  id              uuid primary_key default auto_generate
  organization_id uuid unique not_null references organizations(id) on_delete cascade
                                               -- One branding record per tenant. From Auth / RBAC.
  logo_url        string nullable              -- Primary logo URL (header, emails).
  logo_dark_url   string nullable              -- Logo variant for dark backgrounds.
  favicon_url     string nullable              -- Browser tab icon URL.
  primary_color   string nullable              -- Primary brand color as hex (e.g., "#4f46e5").
  accent_color    string nullable              -- Secondary/accent color as hex.
  background_color string nullable             -- Background color override as hex.
  custom_css      string nullable              -- Custom CSS snippet for advanced theming.
  support_email   string nullable              -- Branded support contact email.
  support_url     string nullable              -- Branded help center or support page URL.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    -- unique(organization_id) is already created by the field constraint above.
  }
}
```

**Design notes:**
- One branding record per tenant (1:1 relationship via unique constraint on `organization_id`).
- All fields are nullable — tenants without branding use the platform's default theme.
- Colors are stored as hex strings. The application validates format on write.
- `custom_css` enables advanced white-labeling but should be sanitized to prevent XSS.
- `support_email` and `support_url` allow tenants to brand their support touchpoints.
- File storage for logos/favicons is managed externally (e.g., the file-management domain or CDN). This table stores URLs only.

### 3. custom_domains

Custom domain mapping for white-label routing. Tenants can use their own domains (e.g., `app.customer.com`) instead of the platform's default subdomain. Each domain requires DNS verification and SSL certificate provisioning.

```pseudo
table custom_domains {
  id                  uuid primary_key default auto_generate
  organization_id     uuid not_null references organizations(id) on_delete cascade
                                                   -- The tenant that owns this domain. From Auth / RBAC.
  domain              string unique not_null       -- The custom domain (e.g., "app.customer.com").
  verification_method enum(cname, txt) not_null default cname
                                                   -- DNS verification method.
                                                   -- cname = CNAME record pointing to platform.
                                                   -- txt = TXT record with verification token.
  verification_token  string not_null              -- Token or target value for DNS verification.
  is_verified         boolean not_null default false -- Whether DNS verification has been confirmed.
  verified_at         timestamp nullable           -- When verification was last confirmed.
  ssl_status          enum(pending, active, failed, expired) not_null default pending
                                                   -- SSL certificate provisioning status.
                                                   -- pending = certificate not yet issued.
                                                   -- active = certificate valid and serving.
                                                   -- failed = provisioning failed (DNS not ready, rate limit).
                                                   -- expired = certificate expired, needs renewal.
  ssl_expires_at      timestamp nullable           -- SSL certificate expiration date.
  is_primary          boolean not_null default false -- Whether this is the primary domain for the tenant.

  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    index(organization_id)                        -- "All custom domains for this tenant."
    -- unique(domain) is already created by the field constraint above.
  }
}
```

**Design notes:**
- Distinct from `organization_domains` in auth-rbac, which handles email domain verification for SSO auto-join. Custom domains here are for application routing and white-labeling.
- A tenant can have multiple custom domains (e.g., one for the app, one for the API, one for docs). `is_primary` marks the canonical domain.
- The application runs a background job to verify DNS records using `verification_method` and `verification_token`.
- SSL provisioning (e.g., via Let's Encrypt) is triggered after DNS verification succeeds. The application manages certificate renewal before `ssl_expires_at`.
- `ssl_status = failed` triggers an alert. Common causes: DNS propagation delay, rate limiting by the CA.

### 4. features

Feature catalog defining all gatable capabilities of the platform. Each feature has a type that determines how entitlements are evaluated: boolean (on/off access), limit (numeric cap), or metered (usage-tracked with optional limit).

```pseudo
table features {
  id              uuid primary_key default auto_generate
  key             string unique not_null       -- Machine-readable identifier (e.g., "api_access", "max_seats", "storage_gb").
  name            string not_null              -- Human-readable name (e.g., "API Access", "Maximum Seats", "Storage").
  description     string nullable              -- Explains what this feature controls.
  feature_type    enum(boolean, limit, metered) not_null
                                               -- boolean = on/off access gate.
                                               -- limit = numeric cap (e.g., max 10 seats).
                                               -- metered = usage-tracked with optional limit (e.g., API calls/month).
  unit            string nullable              -- Unit of measurement for limit/metered features (e.g., "seats", "GB", "requests").
  is_enabled      boolean not_null default true -- Global kill switch. false = disabled for all tenants regardless of entitlements.
  sort_order      integer not_null default 0   -- Display order in feature lists and pricing pages.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(feature_type)                        -- "All features of this type."
    index(is_enabled)                          -- "All active features."
    -- unique(key) is already created by the field constraint above.
  }
}
```

**Design notes:**
- `key` is the stable machine-readable identifier used in application code for entitlement checks (e.g., `if (hasFeature("api_access"))`).
- `feature_type` determines evaluation logic: boolean checks `tenant_features` existence, limit checks `tenant_features.limit_value`, metered checks `usage_summaries` against `tenant_features.limit_value`.
- `unit` is descriptive — used in UI for display ("5 seats", "10 GB"). Null for boolean features.
- `is_enabled = false` is a global kill switch that overrides all tenant entitlements. Useful for deprecating features or emergency disabling.
- `sort_order` controls display in pricing pages, feature comparison tables, and admin UIs.

### 5. tenant_features

Per-tenant feature grants. Each row represents a tenant's access to a specific feature with optional limit values, source tracking (how did they get this feature?), and expiry. This is the resolved entitlement — the runtime source of truth for "can this tenant use this feature?".

```pseudo
table tenant_features {
  id              uuid primary_key default auto_generate
  organization_id uuid not_null references organizations(id) on_delete cascade
                                               -- The tenant receiving this entitlement. From Auth / RBAC.
  feature_id      uuid not_null references features(id) on_delete cascade
                                               -- The feature being granted.
  is_enabled      boolean not_null default true -- Whether this entitlement is active.
  limit_value     integer nullable             -- Numeric limit for limit/metered features (e.g., 10 seats, 1000 requests).
                                               -- Null = unlimited (for limit/metered) or not applicable (for boolean).
  source          enum(plan, override, trial, custom) not_null default plan
                                               -- plan = derived from subscription plan defaults.
                                               -- override = manually set by admin.
                                               -- trial = temporary trial access.
                                               -- custom = custom enterprise deal.
  expires_at      timestamp nullable           -- When this entitlement expires. Null = no expiry.
  notes           string nullable              -- Admin notes (e.g., "Extended trial for enterprise evaluation").

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    composite_unique(organization_id, feature_id) -- One entitlement per feature per tenant.
    index(feature_id)                             -- "All tenants with this feature."
    index(source)                                 -- "All trial entitlements" for expiry monitoring.
    index(expires_at)                             -- "Entitlements expiring soon" for cleanup jobs.
    -- composite_unique(organization_id, feature_id) covers index(organization_id) via leading column.
  }
}
```

**Design notes:**
- One row per feature per tenant. The composite unique ensures no duplicate grants.
- `source` tracks provenance: `plan` = came from subscription plan defaults (synced by the billing system), `override` = admin manually granted/modified, `trial` = temporary trial access, `custom` = negotiated enterprise deal.
- `expires_at` is primarily for `trial` and `custom` sources. A background job should deactivate expired entitlements.
- `limit_value = null` for limit/metered features means unlimited. For boolean features, `limit_value` is not applicable (null).
- Entitlement evaluation: check `features.is_enabled` (global), then `tenant_features.is_enabled` (tenant), then `tenant_features.expires_at` (not expired), then type-specific logic (boolean → granted, limit → check value, metered → check usage_summaries against limit_value).

### 6. usage_events

Append-only log of billable or trackable usage events. Every metered action (API call, file upload, message sent, compute minute consumed) is recorded as an immutable event. Used for billing aggregation, quota enforcement, and audit trails.

```pseudo
table usage_events {
  id              uuid primary_key default auto_generate
  organization_id uuid not_null references organizations(id) on_delete cascade
                                               -- The tenant that consumed the resource. From Auth / RBAC.
  feature_id      uuid not_null references features(id) on_delete cascade
                                               -- The metered feature this event counts toward.
  quantity        integer not_null default 1   -- Amount consumed in this event (e.g., 1 API call, 5 GB, 100 messages).
  user_id         uuid nullable references users(id) on_delete set_null
                                               -- User who triggered the event. Null for system-generated usage.
  metadata        json nullable                -- Additional context (e.g., endpoint path, resource type, IP address).
  idempotency_key string nullable              -- Client-provided key to prevent duplicate event recording.

  created_at      timestamp default now

  indexes {
    index(organization_id, feature_id, created_at) -- "Usage for this tenant's feature over time." Primary query path.
    index(idempotency_key)                         -- "Dedup check for this idempotency key."
  }
}
```

**Design notes:**
- Append-only: rows are never updated or deleted (except by retention policy cleanup). Immutability ensures audit integrity.
- `quantity` defaults to 1 for single-action events (API calls). Batch events can record higher quantities (e.g., 50 emails sent in a batch).
- `idempotency_key` prevents duplicate recording when clients retry. The application checks for existing events with the same key before inserting. Nullable because not all event sources provide idempotency.
- `metadata` stores unstructured context for debugging and detailed reporting (e.g., `{"endpoint": "/api/v1/users", "method": "POST"}`).
- No `updated_at` — events are immutable.
- For high-volume metered features, consider partitioning this table by `created_at` (time-based partitioning) and running a retention policy to archive old events.

### 7. usage_summaries

Pre-aggregated usage totals per tenant per feature per billing period. A background job periodically rolls up `usage_events` into summaries for fast quota checks and billing calculations. Summaries avoid scanning the full events table on every entitlement check.

```pseudo
table usage_summaries {
  id              uuid primary_key default auto_generate
  organization_id uuid not_null references organizations(id) on_delete cascade
                                               -- The tenant. From Auth / RBAC.
  feature_id      uuid not_null references features(id) on_delete cascade
                                               -- The metered feature.
  period_start    timestamp not_null           -- Start of the aggregation period (inclusive).
  period_end      timestamp not_null           -- End of the aggregation period (exclusive).
  total_quantity  bigint not_null default 0    -- Sum of usage_events.quantity for this period.
  event_count     integer not_null default 0   -- Number of usage_events in this period.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    composite_unique(organization_id, feature_id, period_start) -- One summary per feature per tenant per period.
    index(period_start, period_end)                              -- "Summaries for this billing period."
    -- composite_unique(organization_id, feature_id, period_start) covers index(organization_id) via leading column.
  }
}
```

**Design notes:**
- The aggregation period is flexible — `period_start`/`period_end` can represent monthly billing cycles, weekly windows, or any interval the application defines.
- `total_quantity` is the sum of `usage_events.quantity` within the period. `event_count` is the number of events (useful for average-per-event calculations).
- A background job runs periodically (e.g., every 5 minutes) to update summaries from new `usage_events`. The job is idempotent — re-running produces the same result.
- Quota enforcement reads from summaries: `IF usage_summaries.total_quantity >= tenant_features.limit_value THEN deny`.
- Summaries are updated (not append-only) — the job recalculates totals for the current period on each run.

### 8. webhook_event_types

Catalog of available webhook event types that tenants can subscribe to. Each event type defines a category of notification (e.g., "user.created", "invoice.paid", "project.archived").

```pseudo
table webhook_event_types {
  id              uuid primary_key default auto_generate
  key             string unique not_null       -- Event type identifier in dot notation (e.g., "user.created", "invoice.paid").
  name            string not_null              -- Human-readable name (e.g., "User Created").
  description     string nullable              -- Explains when this event is triggered and what the payload contains.
  is_enabled      boolean not_null default true -- Whether this event type can be subscribed to.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(is_enabled)                          -- "All active event types."
    -- unique(key) is already created by the field constraint above.
  }
}
```

**Design notes:**
- `key` uses dot notation following CloudEvents conventions: `{resource}.{action}` (e.g., "user.created", "user.deleted", "invoice.paid", "project.updated").
- `is_enabled = false` hides the event type from subscription UIs and stops new subscriptions. Existing subscriptions are not affected (the application skips disabled types during dispatch).
- Event types are platform-global, not per-tenant. All tenants see the same catalog.
- The application registers event types at deploy time or via admin API. This table is the canonical list.

### 9. webhook_endpoints

Tenant-registered callback URLs for receiving webhook notifications. Each endpoint has a URL, a signing secret for payload verification, and a health status. Endpoints can subscribe to specific event types via `webhook_endpoint_event_types`.

```pseudo
table webhook_endpoints {
  id              uuid primary_key default auto_generate
  organization_id uuid not_null references organizations(id) on_delete cascade
                                               -- The tenant that owns this endpoint. From Auth / RBAC.
  url             string not_null              -- Callback URL (e.g., "https://api.customer.com/webhooks").
  description     string nullable              -- Human-readable label (e.g., "Production webhook", "Slack integration").
  signing_secret  string not_null              -- Secret key for HMAC-SHA256 payload signing. Hashed in storage.
                                               -- Shown once on creation, then only the hash is stored.
  status          enum(active, paused, disabled) not_null default active
                                               -- active = receiving webhooks normally.
                                               -- paused = temporarily stopped by the tenant.
                                               -- disabled = auto-disabled after repeated failures.
  failure_count   integer not_null default 0   -- Consecutive delivery failures. Reset on success.
  last_success_at timestamp nullable           -- When the last successful delivery occurred.
  last_failure_at timestamp nullable           -- When the last failed delivery occurred.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(organization_id)                     -- "All endpoints for this tenant."
    index(status)                              -- "All active endpoints" for dispatch.
  }
}
```

**Design notes:**
- `signing_secret` is stored as a hash (like API keys in auth-rbac). The raw secret is shown once on creation. The application uses it to compute HMAC-SHA256 signatures on outbound payloads so receivers can verify authenticity.
- `status = disabled` is set automatically when `failure_count` exceeds a threshold (e.g., 10 consecutive failures). The tenant must re-enable manually after fixing their endpoint.
- `failure_count` resets to 0 on any successful delivery. Used to trigger automatic disabling.
- `last_success_at` and `last_failure_at` provide health visibility in the tenant's dashboard.
- Endpoints without event type subscriptions (via `webhook_endpoint_event_types`) receive all events. Subscribing to specific types filters the dispatch.

### 10. webhook_endpoint_event_types

Junction table linking webhook endpoints to the event types they subscribe to. If an endpoint has no rows in this table, it receives all events. If it has rows, it only receives the subscribed types.

```pseudo
table webhook_endpoint_event_types {
  id              uuid primary_key default auto_generate
  endpoint_id     uuid not_null references webhook_endpoints(id) on_delete cascade
  event_type_id   uuid not_null references webhook_event_types(id) on_delete cascade

  created_at      timestamp default now

  indexes {
    composite_unique(endpoint_id, event_type_id) -- One subscription per event type per endpoint.
    index(event_type_id)                          -- "All endpoints subscribed to this event type."
    -- composite_unique(endpoint_id, event_type_id) covers index(endpoint_id) via leading column.
  }
}
```

**Design notes:**
- Empty subscriptions (no rows for an endpoint) = wildcard, receives all events. This is the Svix convention — simpler for tenants who want everything.
- The application checks this table during dispatch: for each active endpoint, if no subscription rows exist, include it. If rows exist, only include if the message's event type matches.
- No `updated_at` — subscriptions are immutable. To change, delete and re-create.

### 11. webhook_messages

Outbound webhook message payloads. Each row represents one event occurrence that needs to be delivered to subscribed endpoints. A single message can fan out to multiple endpoints via `webhook_delivery_attempts`.

```pseudo
table webhook_messages {
  id              uuid primary_key default auto_generate
  organization_id uuid not_null references organizations(id) on_delete cascade
                                               -- The tenant this event belongs to. From Auth / RBAC.
  event_type_id   uuid not_null references webhook_event_types(id) on_delete restrict
                                               -- The type of event. Restrict delete to preserve message history.
  event_id        string not_null              -- Application-generated event identifier for deduplication and correlation.
  payload         json not_null                -- The webhook payload (JSON body sent to endpoints).

  created_at      timestamp default now

  indexes {
    index(organization_id, created_at)         -- "Messages for this tenant by date."
    index(event_type_id)                       -- "Messages of this type."
    index(event_id)                            -- "Lookup by application event ID."
  }
}
```

**Design notes:**
- `event_id` is an application-generated identifier (not the DB primary key). It correlates with the system event that triggered the webhook (e.g., "evt_abc123"). Used for deduplication and debugging.
- `payload` is the complete JSON body delivered to endpoints. Stored for replay, debugging, and audit purposes.
- `event_type_id` uses `on_delete restrict` — deleting an event type with existing messages should be prevented. Disable the type instead.
- No `updated_at` — messages are immutable once created.
- Retention policy: the application should archive or delete old messages based on tenant plan (e.g., 30 days for free, 90 days for paid).

### 12. webhook_delivery_attempts

Delivery attempt log for webhook messages to specific endpoints. Each row represents one attempt to deliver a message to one endpoint — including status, HTTP response code, response body, and timing. Failed attempts trigger retries with exponential backoff.

```pseudo
table webhook_delivery_attempts {
  id              uuid primary_key default auto_generate
  message_id      uuid not_null references webhook_messages(id) on_delete cascade
  endpoint_id     uuid not_null references webhook_endpoints(id) on_delete cascade
                                               -- The target endpoint for this delivery.
  attempt_number  integer not_null default 1   -- Attempt sequence (1 = first try, 2 = first retry, etc.).
  status          enum(pending, success, failed) not_null default pending
                                               -- pending = queued for delivery.
                                               -- success = 2xx response received.
                                               -- failed = non-2xx response, timeout, or connection error.
  http_status     integer nullable             -- HTTP response status code (e.g., 200, 404, 500). Null if connection failed.
  response_body   string nullable              -- Truncated response body for debugging. Null if connection failed.
  error_message   string nullable              -- Error description for failed attempts (e.g., "Connection timeout", "SSL error").
  attempted_at    timestamp nullable           -- When the delivery was attempted.
  duration_ms     integer nullable             -- Response time in milliseconds.
  next_retry_at   timestamp nullable           -- When the next retry is scheduled. Null if no retry (success or max attempts).

  created_at      timestamp default now

  indexes {
    index(message_id, attempt_number)          -- "Delivery attempts for this message in order."
    index(endpoint_id, created_at)             -- "Recent deliveries to this endpoint."
    index(status, next_retry_at)               -- "Pending retries due now."
  }
}
```

**Design notes:**
- One row per attempt per endpoint per message. A message delivered to 3 endpoints with 1 retry each = 6 rows.
- `attempt_number` starts at 1 and increments with each retry. The application caps retries (e.g., max 5 attempts).
- `next_retry_at` is computed using exponential backoff (e.g., 30s, 2m, 15m, 1h, 4h). A background job polls for `status = failed AND next_retry_at <= now()`.
- `response_body` is truncated (e.g., first 1024 characters) to avoid storing large error pages.
- `duration_ms` tracks endpoint latency for health monitoring.
- On success: `status = success`, `endpoint.failure_count = 0`, `endpoint.last_success_at = now()`.
- On failure: `status = failed`, `endpoint.failure_count += 1`, `endpoint.last_failure_at = now()`. If `failure_count > threshold`, set `endpoint.status = disabled`.

### 13. integration_definitions

Catalog of available third-party integrations. Each definition describes an integration (Slack, GitHub, Stripe, Jira, etc.) with its authentication method, configuration schema, and status. Platform-global — not per-tenant.

```pseudo
table integration_definitions {
  id              uuid primary_key default auto_generate
  key             string unique not_null       -- Machine-readable identifier (e.g., "slack", "github", "stripe").
  name            string not_null              -- Display name (e.g., "Slack", "GitHub", "Stripe").
  description     string nullable              -- What this integration does and how it connects.
  icon_url        string nullable              -- Integration logo/icon URL for UI display.
  auth_method     enum(oauth2, api_key, webhook, none) not_null
                                               -- oauth2 = OAuth 2.0 authorization code flow.
                                               -- api_key = API key/token authentication.
                                               -- webhook = inbound webhook (no outbound auth needed).
                                               -- none = no authentication required.
  config_schema   json nullable                -- JSON Schema defining required configuration fields.
                                               -- Used by the UI to render integration setup forms.
  is_enabled      boolean not_null default true -- Whether this integration is available for tenants to install.
  sort_order      integer not_null default 0   -- Display order in integration marketplace.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(is_enabled)                          -- "All available integrations."
    -- unique(key) is already created by the field constraint above.
  }
}
```

**Design notes:**
- `config_schema` is a JSON Schema document that describes required fields for the integration (e.g., Slack needs a channel ID, GitHub needs a repo owner/name). The application uses this to render setup forms and validate tenant configuration.
- `auth_method` determines the connection flow: `oauth2` redirects the user to the provider, `api_key` prompts for a token, `webhook` provides an inbound URL, `none` connects immediately.
- `is_enabled = false` hides the integration from the marketplace without removing existing connections.
- Platform admins manage this table. Tenants browse and install integrations via the UI.

### 14. tenant_integrations

Per-tenant connected integration instances. Each row represents a tenant's active connection to a third-party service. Stores encrypted credentials, configuration, and status.

```pseudo
table tenant_integrations {
  id                    uuid primary_key default auto_generate
  organization_id       uuid not_null references organizations(id) on_delete cascade
                                                     -- The tenant that connected this integration. From Auth / RBAC.
  integration_id        uuid not_null references integration_definitions(id) on_delete restrict
                                                     -- The integration type. Restrict delete to prevent orphaning.
  status                enum(active, inactive, error) not_null default active
                                                     -- active = connected and functioning.
                                                     -- inactive = manually disabled by tenant.
                                                     -- error = connection broken (expired token, revoked access).
  encrypted_credentials json nullable                -- Encrypted OAuth tokens, API keys, etc. Application handles encryption.
                                                     -- NEVER store plaintext credentials.
  config                json nullable                -- Integration-specific configuration (e.g., channel ID, repo name).
                                                     -- Validated against integration_definitions.config_schema.
  connected_by          uuid not_null references users(id) on_delete restrict
                                                     -- User who set up this integration.
  last_synced_at        timestamp nullable           -- When data was last synced with the external service.
  error_message         string nullable              -- Last error description if status = error.

  created_at            timestamp default now
  updated_at            timestamp default now on_update

  indexes {
    composite_unique(organization_id, integration_id) -- One connection per integration per tenant.
    index(integration_id)                              -- "All tenants using this integration."
    index(status)                                      -- "All errored integrations" for monitoring.
    -- composite_unique(organization_id, integration_id) covers index(organization_id) via leading column.
  }
}
```

**Design notes:**
- One connection per integration per tenant (composite unique). A tenant can't have two Slack connections — they configure the single connection.
- `encrypted_credentials` stores a JSON blob encrypted at the application level. Contents depend on `auth_method`: OAuth2 stores `{access_token, refresh_token, expires_at}`, API key stores `{api_key}`. NEVER store plaintext.
- `config` stores integration-specific settings validated against `integration_definitions.config_schema` (e.g., `{"channel": "#general", "notify_on": ["ticket.created"]}` for Slack).
- `status = error` is set when the application detects a broken connection (e.g., OAuth token refresh fails, API key is revoked). `error_message` describes the failure.
- `connected_by` uses `on_delete restrict` — the user who set up the integration should not be deleted while the integration is active.
- `last_synced_at` tracks data synchronization for integrations that pull data (e.g., GitHub issue sync).

## Relationships

```
organizations          1 ──── * tenant_settings                  (one tenant has many settings)
organizations          1 ──── 0..1 tenant_branding               (one tenant has at most one branding record)
organizations          1 ──── * custom_domains                   (one tenant has many custom domains)
organizations          1 ──── * tenant_features                  (one tenant has many feature entitlements)
organizations          1 ──── * usage_events                     (one tenant generates many usage events)
organizations          1 ──── * usage_summaries                  (one tenant has many usage summaries)
organizations          1 ──── * webhook_endpoints                (one tenant has many webhook endpoints)
organizations          1 ──── * webhook_messages                 (one tenant has many webhook messages)
organizations          1 ──── * tenant_integrations              (one tenant has many integrations)
features               1 ──── * tenant_features                  (one feature granted to many tenants)
features               1 ──── * usage_events                     (one feature tracked in many events)
features               1 ──── * usage_summaries                  (one feature summarized for many tenants)
webhook_event_types    1 ──── * webhook_endpoint_event_types     (one event type subscribed by many endpoints)
webhook_event_types    1 ──── * webhook_messages                 (one event type triggers many messages)
webhook_endpoints      1 ──── * webhook_endpoint_event_types     (one endpoint subscribes to many event types)
webhook_endpoints      1 ──── * webhook_delivery_attempts        (one endpoint receives many delivery attempts)
webhook_messages       1 ──── * webhook_delivery_attempts        (one message has many delivery attempts)
integration_definitions 1 ──── * tenant_integrations             (one integration type connected by many tenants)
users                  1 ──── * usage_events                     (one user triggers many usage events)
users                  1 ──── * tenant_integrations              (one user connects many integrations)
```

## Best Practices

- **Entitlement evaluation flow**: Check `features.is_enabled` (global kill switch) → `tenant_features` exists and `is_enabled = true` → `tenant_features.expires_at` is null or in the future → type-specific logic (boolean = granted, limit = check `limit_value`, metered = check `usage_summaries.total_quantity` against `limit_value`).
- **Usage event recording**: Record events asynchronously (message queue) to avoid blocking the user's request. The API returns success immediately; a background worker inserts the event and updates summaries.
- **Usage summary aggregation**: Run a background job every few minutes to roll up new `usage_events` into `usage_summaries`. The job is idempotent — it recalculates totals from events for the current period. For real-time quota enforcement, also increment the summary atomically on each event insert.
- **Webhook dispatch flow**: On event occurrence → insert `webhook_messages` row → query `webhook_endpoints` for the tenant (status = active) → filter by `webhook_endpoint_event_types` (or include all if no subscriptions) → create `webhook_delivery_attempts` rows (status = pending) → worker processes pending attempts.
- **Webhook retry strategy**: Use exponential backoff (30s, 2m, 15m, 1h, 4h). Cap at 5 attempts. After max attempts, leave the attempt as `failed`. After N consecutive failures across all deliveries to an endpoint, set `endpoint.status = disabled`. Alert the tenant.
- **Webhook signing**: Compute HMAC-SHA256 of the payload using the endpoint's `signing_secret`. Include the signature in the `Webhook-Signature` header. Receivers verify by recomputing the HMAC. Follow the Standard Webhooks specification.
- **Custom domain verification**: On domain creation, generate a `verification_token` and instruct the tenant to create a DNS record. Run a background job to check DNS records periodically. Once verified, trigger SSL certificate provisioning.
- **Integration credential security**: Encrypt credentials at the application level before storing in `encrypted_credentials`. Use envelope encryption (encrypt with a data key, wrap the data key with a master key). Rotate encryption keys periodically.
- **Feature flag vs entitlement**: Use `features.is_enabled` as a global kill switch (feature flag). Use `tenant_features` for per-tenant access control (entitlement). They serve different purposes: flags are operational (enable/disable for everyone), entitlements are commercial (which tenants paid for this).
- **Tenant settings defaults**: Don't insert rows for default values. If a key is missing from `tenant_settings`, the application uses its hardcoded default. Only store explicit overrides. This keeps the table small and makes defaults easy to change globally.
- **Data retention**: Implement retention policies for high-volume tables: `usage_events` (archive after 90 days), `webhook_messages` (delete after 30-90 days based on plan), `webhook_delivery_attempts` (delete after 30 days). Summaries are kept indefinitely for billing history.

## Formats

| Format      | Status |
| ----------- | ------ |
| Convex      | ✅ |
| SQL         | ✅ |
| Prisma      | ✅ |
| MongoDB     | ✅ |
| Drizzle     | ✅ |
| SpacetimeDB | ✅ |
| Firebase    | ✅ |
