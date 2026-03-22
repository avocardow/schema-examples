# Notifications System

## Overview

Multi-channel notification delivery, preference management, templates, workflows, and engagement tracking. Supports email, SMS, push, in-app, chat, and webhook channels with per-category × per-channel user preferences, digest/batching workflows, polymorphic recipients, and full delivery audit trails. This is a foundational domain — most other domains reference it for notifying users about events.

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (18 tables)</summary>

- [`notification_events`](#notification_events)
- [`notifications`](#notifications)
- [`notification_feeds`](#notification_feeds)
- [`notification_categories`](#notification_categories)
- [`notification_templates`](#notification_templates)
- [`notification_template_contents`](#notification_template_contents)
- [`notification_channels`](#notification_channels)
- [`notification_delivery_attempts`](#notification_delivery_attempts)
- [`device_tokens`](#device_tokens)
- [`email_suppression_list`](#email_suppression_list)
- [`notification_preferences`](#notification_preferences)
- [`notification_preference_defaults`](#notification_preference_defaults)
- [`quiet_hours`](#quiet_hours)
- [`notification_topics`](#notification_topics)
- [`notification_subscriptions`](#notification_subscriptions)
- [`notification_workflows`](#notification_workflows)
- [`notification_workflow_steps`](#notification_workflow_steps)
- [`notification_workflow_runs`](#notification_workflow_runs)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

- [Auth / RBAC](../auth-rbac) — `users` table for recipient references and preference ownership. If you don't use auth-rbac, replace `references users(id)` with your own user table.

## Tables

### Core

- `notification_events`
- `notifications`
- `notification_feeds`

### Templates & Content

- `notification_categories`
- `notification_templates`
- `notification_template_contents`

### Delivery

- `notification_channels`
- `notification_delivery_attempts`
- `device_tokens`
- `email_suppression_list`

### Preferences

- `notification_preferences`
- `notification_preference_defaults`
- `quiet_hours`

### Subscriptions & Routing

- `notification_topics`
- `notification_subscriptions`

### Workflows

- `notification_workflows`
- `notification_workflow_steps`
- `notification_workflow_runs`

## Schema

### `notification_events`

What happened — the trigger that causes notifications to be sent. One row per occurrence. This is the
"event" half of the event → notification split used by Novu, Knock, MagicBell, and Rails Noticed.
The event stores the trigger context once; per-recipient state lives in the `notifications` table.

```pseudo
table notification_events {
  id              uuid primary_key default auto_generate
  category_id     uuid not_null references notification_categories(id) on_delete restrict
                                               -- What kind of event this is (e.g., "comments", "billing", "security").
                                               -- Restrict delete: don't orphan events by deleting their category.

  -- Polymorphic actor: who/what triggered this event.
  -- Follows the Activity Streams 2.0 pattern (actor/verb/object/target).
  -- Can be a user, a system process, an API key, a webhook, etc.
  actor_type      string nullable              -- e.g., "user", "system", "api_key", "service". Null for system-generated events with no specific actor.
  actor_id        string nullable              -- The actor's ID. Not a FK — actors can be any entity type.

  -- Polymorphic target: what was acted upon.
  -- e.g., the comment that was created, the invoice that was paid, the PR that was merged.
  target_type     string nullable              -- e.g., "comment", "invoice", "pull_request".
  target_id       string nullable              -- The target's ID. Not a FK — targets can be any entity type.

  -- Threading: lightweight grouping for related events.
  -- All events with the same thread_key are logically related (e.g., all comments on issue #456).
  -- Client-side can group notifications by this key. Group by thread_key to build thread views.
  thread_key      string nullable              -- e.g., "issue:456", "pr:789", "order:123". Free-form string.

  -- Workflow: if this event was triggered via a workflow, link it here.
  workflow_id     uuid nullable references notification_workflows(id) on_delete set_null

  -- The event payload. Contains all the data needed to render notification templates.
  -- This is the single source of truth for the event — individual notifications don't duplicate it.
  -- Example: { "comment_body": "Looks good!", "issue_title": "Fix login bug", "repo": "acme/app" }
  data            json nullable default {}

  -- Idempotency: prevent duplicate events from the same trigger.
  -- Your app sets this to a deterministic key (e.g., "comment:created:12345").
  -- If a second event arrives with the same key, it's silently dropped or merged.
  idempotency_key string unique nullable       -- Null = no dedup (every trigger creates a new event).

  -- Expiration: for time-sensitive events (OTP codes, flash sales, event reminders).
  -- After this time, the event and its notifications should not be delivered or displayed.
  -- Null = never expires.
  expires_at      timestamp nullable

  created_at      timestamp default now        -- Events are immutable (append-only). No updated_at — if the
                                               -- trigger context needs to change, create a new event.
}

indexes {
  index(category_id)                           -- "All events of this type."
  index(actor_type, actor_id)                  -- "What events did this actor trigger?"
  index(target_type, target_id)                -- "What events relate to this target?"
  index(thread_key)                            -- "All events in this thread."
  index(created_at)                            -- Time-range queries and retention cleanup.
  -- unique(idempotency_key) is already created by the field constraint above.
}
```

### `notifications`

A per-recipient notification record. One row per recipient per event. This is the "notification"
half of the event → notification split. Tracks delivery status (from the provider) and engagement
status (from the user) as separate concerns — following Knock's two-track model.

```pseudo
table notifications {
  id              uuid primary_key default auto_generate
  event_id        uuid not_null references notification_events(id) on_delete cascade
                                               -- The event that triggered this notification. Cascade: if the event is deleted, its notifications go too.

  -- Polymorphic recipient: who this notification is for.
  -- Can be a user, a team, an organization, a channel — any entity that has a notification inbox.
  -- If you only notify users: set recipient_type = 'user' everywhere and ignore the column.
  -- Removing a column you don't need is trivial. Adding polymorphic support later is not.
  recipient_type  string not_null              -- e.g., "user", "team", "organization".
  recipient_id    string not_null              -- The recipient's ID. Not a FK — recipients can be any entity type.

  -- Why this person was notified. Inspired by GitHub's 15 notification reasons.
  -- Valuable for filtering ("show me only notifications where I was @mentioned")
  -- and for preference UIs ("notify me about assignments but not subscriptions").
  reason          string nullable              -- e.g., "mention", "assign", "review_requested", "subscription", "watching", "team_mention", "state_change", "ci_activity", "approval_requested".

  -- Delivery status: mutually exclusive, progresses through a lifecycle.
  -- This tracks whether the notification was successfully handed off to a delivery provider.
  -- For per-channel delivery details, see `notification_delivery_attempts`.
  delivery_status enum(pending, queued, sent, delivered, failed, canceled) default pending
                                               -- pending = created, not yet processed.
                                               -- queued = in the delivery queue.
                                               -- sent = handed off to at least one provider.
                                               -- delivered = confirmed delivery from at least one provider.
                                               -- failed = all delivery attempts exhausted.
                                               -- canceled = delivery was canceled (e.g., event expired, workflow aborted).

  -- Engagement status: nullable timestamps that can coexist.
  -- A notification can be seen AND read AND archived simultaneously.
  -- Timestamps over booleans: captures *when*, not just *whether*.
  seen_at         timestamp nullable           -- The notification appeared in the user's feed/list. Drives badge count ("unseen" count).
  read_at         timestamp nullable           -- The user explicitly opened/clicked the notification. NULL = unread.
  interacted_at   timestamp nullable           -- The user performed the notification's primary action (e.g., clicked a CTA button).
  archived_at     timestamp nullable           -- Soft archive. Hidden from default feed but still queryable.

  -- Expiration: inherited from the event or overridden per-notification.
  -- After this time, the notification should not be displayed in feeds.
  expires_at      timestamp nullable

  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(event_id)                              -- "All notifications for this event" (fan-out query).
  index(recipient_type, recipient_id, read_at) -- "Unread notifications for this user" — the most common query.
  index(recipient_type, recipient_id, created_at) -- "Notification feed for this user, newest first."
  index(recipient_type, recipient_id, seen_at) -- "Unseen count for badge."
  index(delivery_status)                       -- "Find all failed notifications for retry."
  index(expires_at)                            -- Cleanup job: archive or delete expired notifications.
}
```

### `notification_feeds`

Named UI surfaces where notifications can appear. Examples: the bell icon dropdown, an activity tab,
an announcements banner, an admin alerts panel. Feeds are orthogonal to categories — a "comment"
notification (category) might appear in both the "general" feed (bell icon) and the "activity" feed
(activity tab). Users who only need one notification list can ignore this table entirely.

```pseudo
table notification_feeds {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Display name (e.g., "General", "Activity", "Announcements").
  slug            string unique not_null       -- URL-safe identifier (e.g., "general", "activity", "announcements"). Used in API calls: GET /feeds/general.
  description     string nullable              -- Explain what this feed is for. Shown in admin UI.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  -- unique(slug) is already created by the field constraint above.
}
```

### `notification_categories`

Classification of notification types. Categories serve two purposes: (1) organizing notifications
for user preferences ("I want email for billing but not for comments"), and (2) routing notifications
to feeds. Every notification event belongs to exactly one category. Categories are defined by the
app developer, not by users.

```pseudo
table notification_categories {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Display name (e.g., "Comments", "Billing", "Security Alerts").
  slug            string unique not_null       -- Identifier used in code and API (e.g., "comments", "billing", "security").
  description     string nullable              -- Explain what triggers notifications in this category.
  color           string nullable              -- Hex color for UI display (e.g., "#3B82F6"). Optional.
  icon            string nullable              -- Icon identifier or URL for UI display. Optional.

  -- Critical/required notifications bypass user preferences entirely.
  -- Security alerts, billing failures, legal notices, and account lockouts should be is_required=true.
  -- Users cannot opt out of required categories. Your preference evaluation logic must check this.
  is_required     boolean default false

  -- Default feed: where notifications of this category appear.
  -- Null = no default feed (appears in all feeds).
  default_feed_id uuid nullable references notification_feeds(id) on_delete set_null

  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  -- unique(slug) is already created by the field constraint above.
  index(is_required)                           -- "List all required categories" (for preference UI: grey out these toggles).
}
```

### `notification_templates`

Reusable content definitions for a notification category. Templates contain interpolatable strings
(using Liquid, Handlebars, or your preferred templating engine) that are rendered with the event's
`data` payload at delivery time. One category can have multiple templates (e.g., different wording
for different audiences or A/B testing).

```pseudo
table notification_templates {
  id              uuid primary_key default auto_generate
  category_id     uuid not_null references notification_categories(id) on_delete cascade
  name            string not_null              -- Internal name (e.g., "Comment Created — Default", "Comment Created — Digest").
  slug            string unique not_null       -- Identifier used in code (e.g., "comment_created_default").

  -- Default content (channel-agnostic). Used when no channel-specific template_content exists.
  -- For channel-specific variants (short SMS, rich HTML email, structured in-app), see notification_template_contents.
  title_template  string nullable              -- e.g., "New comment on {{issue_title}}"
  body_template   string nullable              -- e.g., "{{actor_name}} commented: {{comment_body}}"
  action_url_template string nullable          -- e.g., "{{app_url}}/issues/{{issue_id}}#comment-{{comment_id}}"

  is_active       boolean default true         -- Toggle a template without deleting it. Inactive templates are skipped during delivery.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(category_id)                           -- "All templates for this category."
  -- unique(slug) is already created by the field constraint above.
}
```

### `notification_template_contents`

Per-channel content variants for a template. SMS needs short text (160 chars). Email needs a subject
line and rich HTML. Push needs a title and a short body. In-app needs structured blocks. Rather than
cramming everything into one template row, each channel gets its own content definition with
channel-specific metadata.

```pseudo
table notification_template_contents {
  id              uuid primary_key default auto_generate
  template_id     uuid not_null references notification_templates(id) on_delete cascade

  -- Which channel this content is for.
  channel_type    enum(email, sms, push, in_app, chat, webhook) not_null

  -- Content fields. All are templates (interpolatable with event data).
  subject         string nullable              -- Email subject, push title. Not applicable for SMS or webhook.
  body            string not_null              -- The main content. HTML for email, plain text for SMS, structured for in-app.

  -- Channel-specific metadata as JSON. Keeps the table clean while supporting provider-specific fields.
  -- Email: { "preheader": "...", "reply_to": "...", "from_name": "..." }
  -- Push: { "icon": "...", "sound": "default", "badge_count": 1, "image_url": "..." }
  -- In-app: { "blocks": [...], "cta": { "url": "...", "label": "..." } }
  -- SMS: { "sender_id": "..." }
  -- Webhook: { "method": "POST", "headers": {...} }
  metadata        json nullable default {}

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  unique(template_id, channel_type)            -- One content variant per channel per template.
}

indexes {
  index(template_id)                           -- "All channel variants for this template."
}
```

### `notification_channels`

Configured delivery provider instances. Each row is a specific provider setup — not an abstract
channel type but an actual configured provider like "SendGrid for production email" or "Twilio for
SMS." Supports multiple providers per channel type for failover (if SendGrid is down, fall back to
Postmark) and conditional routing (use provider A for transactional email, provider B for marketing).

```pseudo
table notification_channels {
  id              uuid primary_key default auto_generate

  -- What type of delivery channel this provider serves.
  channel_type    enum(email, sms, push, in_app, chat, webhook) not_null

  -- Which third-party provider powers this channel.
  -- Known values: 'sendgrid', 'ses', 'postmark', 'resend', 'mailgun' (email),
  --               'twilio', 'vonage', 'plivo' (sms),
  --               'fcm', 'apns', 'onesignal', 'expo' (push),
  --               'slack', 'discord', 'teams' (chat),
  --               'custom' (webhook / self-hosted).
  provider        string not_null

  name            string not_null              -- Display name (e.g., "SendGrid Production", "Twilio SMS").

  -- ⚠️  Provider credentials MUST be encrypted at rest.
  -- Contains API keys, auth tokens, webhook secrets — whatever the provider needs.
  -- Example: { "api_key": "SG.xxx", "from_email": "noreply@example.com" }
  -- Your app decrypts this at delivery time.
  credentials     json not_null

  is_active       boolean default true         -- Toggle a provider on/off without deleting its configuration.

  -- Primary flag: the default provider for this channel type.
  -- Only one channel per channel_type should be primary.
  -- Your delivery logic should use the primary channel unless a workflow step specifies otherwise.
  is_primary      boolean default false

  -- Failover priority: lower number = higher priority.
  -- When the primary fails, try the next provider in priority order.
  -- Example: SendGrid (priority 1) → Postmark (priority 2) → SES (priority 3).
  priority        integer default 0

  -- Provider-specific configuration that doesn't fit in credentials.
  -- Example: { "region": "us-east-1", "rate_limit": 100, "sandbox_mode": true }
  config          json nullable default {}

  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(channel_type, is_active)               -- "All active email providers" (for delivery routing).
  index(channel_type, is_primary)              -- "Which provider is the default for email?"
  index(channel_type, priority)                -- "Failover order for this channel type."
}
```

### `notification_delivery_attempts`

Per-notification, per-channel delivery attempt log. Every time the system tries to deliver a
notification through a channel, a row is created here. This enables full delivery audit trails,
retry tracking, and provider response logging — inspired by Novu's ExecutionDetails and Knock's
MessageDeliveryLog.

```pseudo
table notification_delivery_attempts {
  id              uuid primary_key default auto_generate
  notification_id uuid not_null references notifications(id) on_delete cascade
  channel_id      uuid not_null references notification_channels(id) on_delete restrict
                                               -- Restrict: don't delete a channel that has delivery history.

  -- Delivery lifecycle. Mutually exclusive, progresses forward.
  status          enum(pending, queued, sent, delivered, bounced, failed) not_null default pending
                                               -- pending = attempt created, not yet processed.
                                               -- queued = in the delivery queue, waiting to be sent.
                                               -- sent = handed off to the provider (provider accepted the request).
                                               -- delivered = provider confirmed delivery to the recipient.
                                               -- bounced = provider reported a bounce (email bounced, push token invalid, etc.).
                                               -- failed = provider returned an error or max retries exhausted.

  -- Provider's message ID. Used to match incoming webhooks (delivery receipts, bounces, complaints)
  -- back to this delivery attempt.
  provider_message_id string nullable          -- e.g., SendGrid's "X-Message-Id", Twilio's "SM..." SID.

  -- Raw provider response. Invaluable for debugging delivery issues.
  -- Store the full response (or a summary) so you don't have to dig through provider dashboards.
  provider_response json nullable              -- e.g., { "status": 202, "headers": {...}, "body": {...} }

  error_code      string nullable              -- Provider-specific error code (e.g., "550", "InvalidRegistration").
  error_message   string nullable              -- Human-readable error description.

  -- Retry tracking.
  attempt_number  integer not_null default 1   -- Which attempt this is (1 = first try, 2 = first retry, etc.).
  next_retry_at   timestamp nullable           -- When the next retry is scheduled. Null = no retry planned (success or max retries reached).

  sent_at         timestamp nullable           -- When the provider accepted the request.
  delivered_at    timestamp nullable           -- When delivery was confirmed (from provider webhook).
  created_at      timestamp default now
  updated_at      timestamp default now on_update  -- Tracks the latest status transition. Especially important for
                                               -- bounced/failed states which don't have their own timestamp columns.
}

indexes {
  index(notification_id)                       -- "All delivery attempts for this notification."
  index(channel_id, status)                    -- "All failed deliveries for this channel" (provider health monitoring).
  index(provider_message_id)                   -- "Match incoming webhook to delivery attempt."
  index(status, next_retry_at)                 -- "Find pending retries that are due."
  index(created_at)                            -- Time-range queries and retention cleanup.
}
```

### `device_tokens`

Push notification device tokens and web push subscriptions. Each row is one device/browser that can
receive push notifications for a specific user. A user typically has multiple device tokens (phone,
tablet, laptop browser). Tokens expire, get refreshed, and become invalid — the `is_active` flag
and `expires_at` timestamp help manage the lifecycle.

```pseudo
table device_tokens {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade

  -- Platform: which type of device/browser this token is for.
  platform        enum(ios, android, web, macos, windows) not_null

  -- The push token itself. This is the opaque string from FCM, APNs, or the web push endpoint.
  -- For native push: the registration/device token from FCM or APNs.
  -- For web push: the push subscription endpoint URL (the full URL, not just the token).
  token           string not_null

  -- Which push service provider issued/manages this token.
  provider        string not_null              -- e.g., "fcm", "apns", "web_push", "onesignal", "expo".

  -- App identifier: which app this token belongs to (for multi-app setups).
  app_id          string nullable              -- e.g., Firebase project ID, APNs bundle ID. Null if only one app.

  -- Web Push specific fields (RFC 8030 / VAPID).
  -- These are null for native push tokens. For web push, they come from the PushSubscription object.
  p256dh_key      string nullable              -- ECDH P-256 public key from the browser. Used to encrypt push payloads.
  auth_key        string nullable              -- 16-byte authentication secret from the browser. Used with p256dh for encryption.
  endpoint_url    string nullable              -- Web push endpoint URL (e.g., "https://fcm.googleapis.com/fcm/send/...").
                                               -- For web push, this may be the same as `token`. Store both for clarity.

  -- Device metadata: useful for debugging and analytics.
  device_name     string nullable              -- e.g., "iPhone 15 Pro", "Chrome on MacBook". User-friendly label.
  device_model    string nullable              -- e.g., "iPhone15,3", "Pixel 8". Machine-readable model ID.
  os_version      string nullable              -- e.g., "17.2", "14". Operating system version.
  app_version     string nullable              -- e.g., "2.1.0". Your app's version on this device.

  is_active       boolean default true         -- Set to false when the provider reports the token as invalid.
                                               -- Your app should handle "token not registered" errors by setting this to false.
  last_used_at    timestamp nullable           -- When a push was last successfully sent to this token. For stale token cleanup.
  expires_at      timestamp nullable           -- Some tokens have explicit expiry. Null = no known expiry.

  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(user_id)                               -- "All devices for this user" (for fan-out push delivery).
  index(user_id, platform, is_active)          -- "Active iOS devices for this user."
  index(token, provider)                       -- "Look up a device by token" (for token refresh/invalidation).
  index(is_active, last_used_at)               -- "Stale active tokens" (cleanup job: tokens not used in 30+ days).
}
```

### `email_suppression_list`

Email addresses that should not be sent to. Prevents sending to addresses that will bounce (damaging
sender reputation), have filed spam complaints, or have explicitly unsubscribed. Every serious email
provider (SendGrid, Postmark, Resend) maintains suppression lists — this table mirrors that data
locally so your notification system can check before attempting delivery.

```pseudo
table email_suppression_list {
  id              uuid primary_key default auto_generate

  email           string not_null              -- The suppressed email address. Lowercase, trimmed.

  -- Why this address is suppressed.
  reason          enum(hard_bounce, soft_bounce, spam_complaint, manual_unsubscribe, invalid_address) not_null
                                               -- hard_bounce = mailbox doesn't exist (permanent). Never send again.
                                               -- soft_bounce = temporary delivery failure. May clear after a cooling period.
                                               -- spam_complaint = recipient marked your email as spam. Never send again.
                                               -- manual_unsubscribe = user clicked unsubscribe link. Respect immediately.
                                               -- invalid_address = address format is invalid or domain doesn't exist.

  -- How this suppression was created.
  source          enum(provider_webhook, user_action, admin, system) not_null
                                               -- provider_webhook = bounce/complaint webhook from SendGrid, Postmark, etc.
                                               -- user_action = user clicked unsubscribe link in your app.
                                               -- admin = manually added by an admin.
                                               -- system = automated detection (e.g., repeated soft bounces promoted to hard bounce).

  -- Which provider reported the suppression (for webhook-sourced entries).
  channel_id      uuid nullable references notification_channels(id) on_delete set_null

  -- Provider-specific details for debugging.
  -- e.g., { "bounce_type": "550", "provider_message": "Mailbox not found", "original_message_id": "..." }
  details         json nullable

  suppressed_at   timestamp not_null default now -- When the suppression took effect. May differ from created_at if back-dated from provider data.
  expires_at      timestamp nullable           -- Null = permanent suppression. Set for soft bounces that should be retried.
  created_at      timestamp default now        -- When this row was created.

  unique(email, reason)                        -- One entry per email per reason. An address can be suppressed for multiple reasons.
}

indexes {
  index(email)                                 -- "Is this email suppressed?" (checked before every email delivery).
  index(reason)                                -- "All hard bounces" (for reporting).
  index(expires_at)                            -- Cleanup job: remove expired soft bounce suppressions.
}
```

### `notification_preferences`

Per-user opt-in/opt-out controls. This is the user layer of the three-tier preference hierarchy:
system defaults → tenant defaults → user overrides. Preferences form a matrix of categories ×
channels. The most specific preference wins: a preference for category + channel overrides a
preference for just category, which overrides a global preference.

```pseudo
table notification_preferences {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade

  -- Category scope: which notification category this preference applies to.
  -- Null = global preference (applies to all categories that don't have a specific preference).
  category_id     uuid nullable references notification_categories(id) on_delete cascade

  -- Channel scope: which delivery channel this preference applies to.
  -- Null = all channels (applies to all channels that don't have a specific preference).
  channel_type    enum(email, sms, push, in_app, chat, webhook) nullable

  -- The preference value. true = opted in, false = opted out.
  -- ⚠️  This does NOT override is_required categories. Your preference evaluation logic must check
  --     notification_categories.is_required before consulting this table.
  enabled         boolean not_null

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  -- A user can have at most one preference per category/channel combination.
  -- The four valid combinations:
  --   (user, null, null)           = global: "I want/don't want notifications"
  --   (user, category, null)       = category-wide: "I want/don't want billing notifications"
  --   (user, null, channel)        = channel-wide: "I don't want SMS notifications"
  --   (user, category, channel)    = specific: "I want email for billing, but not push"
  --
  -- ⚠️  Nullable columns in unique constraints: In PostgreSQL, NULL != NULL for uniqueness,
  --     so this constraint alone won't prevent duplicate (user, null, null) rows.
  --     SQL implementations need partial unique indexes or COALESCE wrappers.
  --     Other formats (MongoDB sparse indexes, Convex app-level validation) handle this differently.
  unique(user_id, category_id, channel_type)
}

indexes {
  index(user_id)                               -- "All preferences for this user."
  index(user_id, category_id)                  -- "User's preferences for this category."
}
```

### `notification_preference_defaults`

System-level and tenant-level default preferences. Same structure as user preferences but scoped to
the entire system or to a specific tenant (organization). Forms the base layers of the three-tier
preference hierarchy: system defaults → tenant defaults → user overrides. Users only need to set
preferences where they disagree with the defaults.

```pseudo
table notification_preference_defaults {
  id              uuid primary_key default auto_generate

  -- Scope: where this default applies.
  -- "system" = applies to all users across the entire platform.
  -- "tenant" = applies to all users within a specific organization/tenant.
  scope           enum(system, tenant) not_null

  -- Tenant ID: only set when scope = "tenant".
  -- References your tenant/organization entity. Not a FK to keep this domain portable —
  -- some apps use organizations, some use workspaces, some use teams.
  scope_id        string nullable              -- The tenant/org ID. Null when scope = "system".

  -- Category and channel scope: same semantics as notification_preferences.
  category_id     uuid nullable references notification_categories(id) on_delete cascade
  channel_type    enum(email, sms, push, in_app, chat, webhook) nullable

  enabled         boolean not_null

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  -- ⚠️  Same nullable unique constraint caveat as notification_preferences.
  --     SQL implementations need partial unique indexes or COALESCE wrappers for nullable columns.
  unique(scope, scope_id, category_id, channel_type)
}

indexes {
  index(scope, scope_id)                       -- "All defaults for this tenant."
  index(scope)                                 -- "All system-level defaults."
}
```

### `quiet_hours`

Per-user Do Not Disturb schedules with timezone support. Separate from preferences because quiet
hours are temporal (when to suppress notifications) while preferences are categorical (what to
suppress). During quiet hours, non-critical notifications are held and delivered when quiet hours
end. Critical/required notifications still deliver immediately.

```pseudo
table quiet_hours {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade

  -- Timezone: quiet hours are evaluated in the user's local time.
  -- Without this, "10pm–8am" is meaningless — 10pm where?
  timezone        string not_null              -- IANA timezone (e.g., "America/New_York", "Europe/London", "Asia/Tokyo").

  -- The quiet window. start_time and end_time are local times (no date component).
  -- Cross-midnight schedules work naturally: start=22:00, end=08:00 means 10pm to 8am.
  start_time      string not_null              -- Local time in HH:MM format (e.g., "22:00").
  end_time        string not_null              -- Local time in HH:MM format (e.g., "08:00").

  -- Which days of the week the schedule applies. This enables "weekdays only" or "weekends only" DND.
  -- Stored as an array of ISO day numbers: 1=Monday, 2=Tuesday, ..., 7=Sunday.
  -- Example: [1,2,3,4,5] = weekdays only. [1,2,3,4,5,6,7] = every day.
  -- If your format doesn't support arrays, use a bitmask integer (bit 0=Mon, bit 1=Tue, etc.).
  days_of_week    integer[] not_null           -- Array of ISO day numbers (1-7).

  is_active       boolean default true         -- Toggle the schedule without deleting it.

  -- Ad-hoc snooze: temporary DND override (like Slack's "Pause notifications for 1 hour").
  -- When set, quiet hours are in effect regardless of the schedule until this timestamp.
  -- Null = no active snooze. Your app clears this when the snooze expires.
  snooze_until    timestamp nullable

  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(user_id)                               -- "Quiet hours for this user."
  index(user_id, is_active)                    -- "Does this user have active quiet hours?" (checked before every delivery).
}
```

### `notification_topics`

Named pub/sub groups for fan-out delivery. When a notification targets a topic, it fans out to all
subscribers of that topic. Topics are defined by the app developer (e.g., "project:123:updates",
"marketing", "product-announcements"). Different from categories: a category classifies what the
notification _is_, a topic determines who _receives_ it.

```pseudo
table notification_topics {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Display name (e.g., "Project Updates", "Marketing Newsletter").
  slug            string unique not_null       -- Identifier used in code and API (e.g., "project_updates", "marketing").
  description     string nullable              -- Explain what subscribing to this topic means.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  -- unique(slug) is already created by the field constraint above.
}
```

### `notification_subscriptions`

Links users to topics. When a notification targets a topic, the system looks up all subscriptions
for that topic and creates a notification for each subscriber. Supports per-topic, per-channel
granularity — a user might subscribe their email to "marketing" but not their push notifications.

```pseudo
table notification_subscriptions {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade
  topic_id        uuid not_null references notification_topics(id) on_delete cascade

  -- Channel scope: which channel this subscription applies to.
  -- Null = subscribed on all channels. Set to a specific channel to subscribe only that channel.
  -- Example: user subscribes email to "marketing" but not push.
  channel_type    enum(email, sms, push, in_app, chat, webhook) nullable

  created_at      timestamp default now

  -- ⚠️  Same nullable unique constraint caveat as notification_preferences.
  --     SQL implementations need partial unique indexes or COALESCE wrappers for nullable channel_type.
  unique(user_id, topic_id, channel_type)      -- One subscription per user per topic per channel.
}

indexes {
  index(topic_id)                              -- "All subscribers to this topic" (for fan-out).
  index(user_id)                               -- "All topics this user is subscribed to."
}
```

### `notification_workflows`

Orchestration definitions for multi-step notification delivery. A workflow defines the sequence of
steps that happen when an event is triggered: which channels to deliver to, in what order, with what
delays, digest windows, and conditions. Inspired by Novu's NotificationTemplate (workflow) and
Knock's workflow steps.

```pseudo
table notification_workflows {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Display name (e.g., "Comment Notification", "Weekly Digest").
  slug            string unique not_null       -- Identifier used in code and API (e.g., "comment_notification").
  description     string nullable

  -- Link to the category this workflow handles.
  -- A category can have multiple workflows (e.g., immediate + digest versions).
  category_id     uuid nullable references notification_categories(id) on_delete set_null

  -- Critical workflows bypass user preferences entirely.
  -- Use sparingly: security alerts, billing failures, legal notices.
  is_critical     boolean default false

  is_active       boolean default true         -- Toggle a workflow without deleting it.

  -- The trigger identifier: what your app code calls to fire this workflow.
  -- Example: your app calls notificationService.trigger("comment_created", { ... })
  -- The system matches "comment_created" to this workflow's trigger_identifier.
  trigger_identifier string unique not_null    -- Must be unique. Used in API/SDK calls.

  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  -- unique(slug) and unique(trigger_identifier) are already created by field constraints above.
  index(category_id)                           -- "All workflows for this category."
  index(is_active)                             -- "All active workflows."
}
```

### `notification_workflow_steps`

Individual steps within a workflow. Steps execute in order (by `step_order`). Each step can be a
channel delivery, a delay, a digest (batch), a condition check, or a throttle. Configuration for
each step type is stored in the `config` JSON field.

```pseudo
table notification_workflow_steps {
  id              uuid primary_key default auto_generate
  workflow_id     uuid not_null references notification_workflows(id) on_delete cascade

  -- Execution order within the workflow. Steps run in ascending order.
  step_order      integer not_null

  -- What this step does.
  step_type       enum(channel, delay, digest, condition, throttle) not_null
                                               -- channel = deliver to a specific channel.
                                               -- delay = wait for a duration before proceeding.
                                               -- digest = batch/accumulate events within a time window.
                                               -- condition = evaluate a rule; skip remaining steps if false.
                                               -- throttle = limit delivery frequency (e.g., max 1 per hour).

  -- For channel steps: which channel type to deliver to.
  -- Null for non-channel step types.
  channel_type    enum(email, sms, push, in_app, chat, webhook) nullable

  -- Step configuration as JSON. Schema depends on step_type:
  -- channel:   { "channel_id": "uuid" }  — optional: use a specific provider. Null = use primary.
  -- delay:     { "duration": "5m", "unit": "minutes" }  — how long to wait.
  -- digest:    { "window": "1h", "key": "thread_key", "max_events": 100 }  — batching config.
  -- condition: { "field": "data.priority", "operator": "eq", "value": "high" }  — condition rule.
  -- throttle:  { "limit": 1, "window": "1h", "key": "recipient_id" }  — rate limit config.
  config          json nullable default {}

  -- Should the workflow stop if this step fails?
  -- true = abort remaining steps (fail-fast). false = continue to next step (best-effort).
  should_stop_on_fail boolean default false

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  unique(workflow_id, step_order)              -- Step order must be unique within a workflow.
}

indexes {
  index(workflow_id)                           -- "All steps for this workflow, in order."
}
```

### `notification_workflow_runs`

Execution instances of a workflow. Each time a workflow is triggered (by an event), a run is created
to track the execution state. This enables monitoring, debugging, and retry of failed workflow
executions.

```pseudo
table notification_workflow_runs {
  id              uuid primary_key default auto_generate
  workflow_id     uuid not_null references notification_workflows(id) on_delete cascade
  event_id        uuid not_null references notification_events(id) on_delete cascade

  -- Execution lifecycle.
  status          enum(pending, running, completed, failed, canceled) not_null default pending
                                               -- pending = run created, not yet started.
                                               -- running = actively executing steps.
                                               -- completed = all steps finished successfully.
                                               -- failed = a step failed and should_stop_on_fail was true, or a fatal error occurred.
                                               -- canceled = manually canceled or event expired before completion.

  -- Which step the workflow is currently on (or last completed).
  -- Useful for debugging: "this run failed at step 3 of 5."
  current_step_order integer nullable

  -- Error details if the run failed.
  error_message   string nullable              -- Human-readable description of what went wrong.
  error_step_id   uuid nullable references notification_workflow_steps(id) on_delete set_null
                                               -- Which step caused the failure.

  started_at      timestamp nullable           -- When execution began.
  completed_at    timestamp nullable           -- When execution finished (success or failure).
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(workflow_id, status)                   -- "All failed runs for this workflow" (monitoring dashboard).
  index(event_id)                              -- "Workflow run for this event."
  index(status, created_at)                    -- "All pending runs" (for the workflow executor to pick up).
  index(created_at)                            -- Time-range queries and retention cleanup.
}
```

## Relationships

### One-to-Many

- `notification_categories` → `notification_events` (a category has many events)
- `notification_events` → `notifications` (an event fans out to many recipient notifications)
- `notification_feeds` → `notification_categories` (a feed is the default for many categories, via `default_feed_id`)
- `notification_categories` → `notification_templates` (a category has many templates)
- `notification_templates` → `notification_template_contents` (a template has many channel-specific content variants)
- `notification_channels` → `notification_delivery_attempts` (a channel has many delivery attempts)
- `notifications` → `notification_delivery_attempts` (a notification has many delivery attempts across channels)
- `notification_topics` → `notification_subscriptions` (a topic has many subscribers)
- `notification_categories` → `notification_preferences` (a category appears in many user preferences)
- `notification_categories` → `notification_preference_defaults` (a category appears in many default preferences)
- `notification_workflows` → `notification_workflow_steps` (a workflow has many ordered steps)
- `notification_workflows` → `notification_workflow_runs` (a workflow has many execution runs)
- `notification_events` → `notification_workflow_runs` (an event triggers a workflow run)
- `notification_workflows` → `notification_events` (a workflow is referenced by many events, via `workflow_id`)
- `users` → `notifications` (a user receives many notifications, via polymorphic `recipient_type` + `recipient_id`)
- `users` → `device_tokens` (a user has many device tokens)
- `users` → `notification_preferences` (a user has many preferences)
- `users` → `quiet_hours` (a user has quiet hour schedules)
- `users` → `notification_subscriptions` (a user has many topic subscriptions)

### Many-to-Many (via junction tables)

- `users` ↔ `notification_topics` (through `notification_subscriptions`)

## Best Practices

- **Separate event from notification** — One event, many notifications. The event stores trigger context once; notifications track per-recipient state. Avoid duplicating event data across recipients.
- **Two-track status model** — Keep delivery status (enum, mutually exclusive: pending → sent → delivered) separate from engagement status (nullable timestamps that coexist: seen_at, read_at, archived_at).
- **Timestamps over booleans** — Use `read_at` (nullable timestamp) instead of `is_read` (boolean). Captures _when_, not just _whether_. `NULL` = unread.
- **Respect the preference hierarchy** — Always evaluate: system defaults → tenant defaults → user overrides. Most specific wins. Required categories bypass all preferences.
- **Check suppression before delivery** — Before sending email, check `email_suppression_list`. Sending to bounced/complained addresses damages sender reputation.
- **Encrypt provider credentials** — The `notification_channels.credentials` field contains API keys and secrets. Encrypt at rest, decrypt only at delivery time.
- **Index for the unread query** — `(recipient_type, recipient_id, read_at)` is the most important index. It powers the "unread count" badge that every notification UI needs.
- **Use idempotency keys** — Set `notification_events.idempotency_key` to prevent duplicate notifications from retried API calls or event storms.
- **Isolate channels** — Email provider outage should not block push delivery. Queue and deliver each channel independently.
- **Expire time-sensitive notifications** — Set `expires_at` on events and notifications for OTP codes, flash sales, and event reminders. Don't show stale notifications.
- **Cascade deletes carefully** — Events cascade to notifications. Notifications cascade to delivery attempts. But categories and channels use restrict/set_null to prevent accidental data loss.

## Formats

Each table is a separate file within each format folder:

| Format         | Directory                            | Status  |
| -------------- | ------------------------------------ | ------- |
| Convex         | [`convex/`](./convex/)               | ✅ Done |
| SQL            | [`sql/`](./sql/)                     | ✅ Done |
| Prisma         | [`prisma/`](./prisma/)               | ✅ Done |
| MongoDB        | [`mongodb/`](./mongodb/)             | ✅ Done |
| Drizzle        | [`drizzle/`](./drizzle/)             | ✅ Done |
| SpacetimeDB    | [`spacetimedb/`](./spacetimedb/)     | ✅ Done |
| Firebase       | [`firebase/`](./firebase/)           | ✅ Done |
