# Email / Campaign Marketing

> Contacts, lists, campaigns, templates, automation workflows, engagement tracking, and compliance for email marketing.

## Overview

Email marketing schema for managing contacts (subscribers), organizing them into lists and dynamic segments, sending targeted campaigns with reusable templates, tracking engagement (opens, clicks, bounces), and automating drip sequences. Modeled after patterns from Mailchimp, SendGrid, Listmonk, Brevo, ConvertKit, and Mautic.

Key design decisions: contacts are distinct from app users (contacts are recipients, users are senders); list membership tracks per-list subscription status independently of global contact status; segments are dynamic (filter criteria stored as JSON, no materialized membership); campaigns target lists and/or segments via a junction table; per-contact send records enable delivery audit trails; engagement events are append-only for analytics; suppression entries prevent sending to problematic addresses; and automation workflows support multi-step drip sequences with enrollment tracking.

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (16 tables)</summary>

- [`contacts`](#1-contacts)
- [`contact_lists`](#2-contact_lists)
- [`contact_list_members`](#3-contact_list_members)
- [`tags`](#4-tags)
- [`contact_tag_assignments`](#5-contact_tag_assignments)
- [`segments`](#6-segments)
- [`templates`](#7-templates)
- [`campaigns`](#8-campaigns)
- [`campaign_recipients`](#9-campaign_recipients)
- [`campaign_sends`](#10-campaign_sends)
- [`campaign_events`](#11-campaign_events)
- [`campaign_links`](#12-campaign_links)
- [`suppression_entries`](#13-suppression_entries)
- [`automation_workflows`](#14-automation_workflows)
- [`automation_steps`](#15-automation_steps)
- [`automation_enrollments`](#16-automation_enrollments)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users` | App user identity — the person who creates/manages campaigns, lists, and templates |

## Tables

### Contacts & Organization

| # | Table | Description |
| - | ----- | ----------- |
| 1 | `contacts` | Email recipients/subscribers with status and metadata |
| 2 | `contact_lists` | Mailing lists/audiences for organizing contacts |
| 3 | `contact_list_members` | Many-to-many membership of contacts in lists |
| 4 | `tags` | Labels for categorizing and segmenting contacts |
| 5 | `contact_tag_assignments` | Many-to-many assignment of tags to contacts |
| 6 | `segments` | Dynamic contact groups based on filter criteria |

### Content

| # | Table | Description |
| - | ----- | ----------- |
| 7 | `templates` | Reusable email templates (HTML + plain text) |

### Campaigns & Tracking

| # | Table | Description |
| - | ----- | ----------- |
| 8 | `campaigns` | Email campaigns with type, status, and scheduling |
| 9 | `campaign_recipients` | Links campaigns to target lists and/or segments |
| 10 | `campaign_sends` | Per-contact send record for each campaign |
| 11 | `campaign_events` | Engagement events (open, click, bounce, complaint, unsubscribe) |
| 12 | `campaign_links` | Tracked URLs within campaign content |

### Compliance

| # | Table | Description |
| - | ----- | ----------- |
| 13 | `suppression_entries` | Global suppression list (bounces, complaints, manual blocks) |

### Automation

| # | Table | Description |
| - | ----- | ----------- |
| 14 | `automation_workflows` | Automated email sequences (drip campaigns, welcome series) |
| 15 | `automation_steps` | Individual steps within a workflow |
| 16 | `automation_enrollments` | Contact progress through an automation workflow |

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. contacts

Email recipients/subscribers. Distinct from `users` (app users who manage campaigns). A contact
is someone who receives emails. Global status tracks whether they can receive mail at all;
per-list subscription status is tracked separately in `contact_list_members`.

```pseudo
table contacts {
  id              uuid primary_key default auto_generate
  email           string unique not_null             -- Canonical email address. Lowercased on insert.
  first_name      string nullable
  last_name       string nullable
  status          enum(active, unsubscribed, bounced, complained) not_null default active
                                                     -- active = can receive mail.
                                                     -- unsubscribed = globally opted out.
                                                     -- bounced = hard bounce detected.
                                                     -- complained = marked as spam.
  metadata        json nullable default {}           -- Custom fields (e.g., company, location, preferences).
  created_by      uuid nullable references users(id) on_delete set_null  -- App user who added this contact.
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    -- unique(email) is already created by the field constraint above.
    index(status)
    index(created_at)
  }
}
```

**Design notes:**
- Email is unique and lowercased. Contacts exist independently of lists.
- Status is global — a bounced contact won't receive email from any list. Per-list status is in `contact_list_members`.
- `metadata` stores arbitrary custom fields as JSON, following the Mailchimp/SendGrid pattern of flexible contact attributes.

### 2. contact_lists

Mailing lists / audiences. The primary grouping mechanism for contacts. A contact can belong to
multiple lists, each with its own subscription status. Lists are created by app users to organize
their audience.

```pseudo
table contact_lists {
  id              uuid primary_key default auto_generate
  name            string not_null
  description     string nullable
  created_by      uuid nullable references users(id) on_delete set_null
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(created_by)
  }
}
```

### 3. contact_list_members

Junction table linking contacts to lists. Each membership has its own subscription status —
a contact can be subscribed to one list and unsubscribed from another. Follows Listmonk's
clean separation of contact status vs. subscription status.

```pseudo
table contact_list_members {
  id              uuid primary_key default auto_generate
  contact_id      uuid not_null references contacts(id) on_delete cascade
  list_id         uuid not_null references contact_lists(id) on_delete cascade
  status          enum(subscribed, unsubscribed, unconfirmed) not_null default subscribed
                                                     -- subscribed = active member.
                                                     -- unsubscribed = opted out of this list.
                                                     -- unconfirmed = double opt-in pending.
  subscribed_at   timestamp nullable                 -- When the contact confirmed subscription.
  unsubscribed_at timestamp nullable                 -- When the contact opted out.
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    composite_unique(contact_id, list_id)            -- One membership per contact per list.
    index(list_id, status)                           -- "All subscribed contacts on this list."
  }
}
```

**Design notes:**
- `subscribed_at` is set when status transitions to `subscribed` (e.g., after double opt-in confirmation).
- `unsubscribed_at` records when the contact opted out for compliance audit trails.
- composite_unique(contact_id, list_id) covers index(contact_id) via leading column.

### 4. tags

Labels for organizing and filtering contacts. Simpler than lists — no subscription status, just
present or absent. Tags are the primary mechanism for contact segmentation in platforms like
ConvertKit. Created by app users.

```pseudo
table tags {
  id              uuid primary_key default auto_generate
  name            string unique not_null             -- Tag display name (e.g., "VIP", "Trial User", "Webinar Attendee").
  description     string nullable
  created_by      uuid nullable references users(id) on_delete set_null
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}
```

### 5. contact_tag_assignments

Junction table linking contacts to tags. Many-to-many relationship.

```pseudo
table contact_tag_assignments {
  id              uuid primary_key default auto_generate
  contact_id      uuid not_null references contacts(id) on_delete cascade
  tag_id          uuid not_null references tags(id) on_delete cascade
  created_at      timestamp default now

  indexes {
    composite_unique(contact_id, tag_id)             -- One assignment per contact per tag.
    index(tag_id)                                    -- "All contacts with this tag."
    -- composite_unique(contact_id, tag_id) covers index(contact_id) via leading column.
  }
}
```

### 6. segments

Dynamic contact groups defined by filter criteria. Unlike lists, segments don't store membership
explicitly — they're evaluated at query time. Filter criteria stored as JSON, following
SendGrid's pattern. Segments auto-update as contact data changes.

```pseudo
table segments {
  id              uuid primary_key default auto_generate
  name            string not_null
  description     string nullable
  filter_criteria json not_null                      -- JSON filter rules. Example:
                                                     -- { "conditions": [
                                                     --   { "field": "status", "op": "eq", "value": "active" },
                                                     --   { "field": "tags", "op": "contains", "value": "VIP" }
                                                     -- ], "match": "all" }
  created_by      uuid nullable references users(id) on_delete set_null
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(created_by)
  }
}
```

**Design notes:**
- `filter_criteria` is the application layer's responsibility to interpret. The schema just stores the rules.
- No `segment_members` table — segments are dynamic. Materializing membership would require constant re-evaluation and introduces staleness.

### 7. templates

Reusable email content templates. A template defines the HTML and plain-text body, subject line,
and from address. Campaigns reference templates or override with inline content.

```pseudo
table templates {
  id              uuid primary_key default auto_generate
  name            string not_null
  subject         string nullable                    -- Default subject line. Campaign can override.
  html_body       string nullable                    -- HTML email content with merge tag placeholders.
  text_body       string nullable                    -- Plain-text fallback.
  from_name       string nullable                    -- Default sender name.
  from_email      string nullable                    -- Default sender email address.
  created_by      uuid nullable references users(id) on_delete set_null
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(created_by)
  }
}
```

### 8. campaigns

The central entity. A campaign represents a single email send to a targeted audience. Supports
regular sends, A/B tests, and automated sends. Status follows a lifecycle:
draft → scheduled → sending → sent (with paused/cancelled branches).

```pseudo
table campaigns {
  id              uuid primary_key default auto_generate
  name            string not_null                    -- Internal campaign name.
  subject         string nullable                    -- Email subject line. Overrides template subject.
  from_name       string nullable                    -- Sender name. Overrides template from_name.
  from_email      string nullable                    -- Sender email. Overrides template from_email.
  reply_to        string nullable                    -- Reply-to address.

  -- Content: either reference a template or provide inline content.
  template_id     uuid nullable references templates(id) on_delete set_null
  html_body       string nullable                    -- Inline HTML content. Overrides template if set.
  text_body       string nullable                    -- Inline plain-text content.

  status          enum(draft, scheduled, sending, paused, cancelled, sent) not_null default draft
  campaign_type   enum(regular, ab_test) not_null default regular

  -- Scheduling
  scheduled_at    timestamp nullable                 -- When to send. Null = send immediately when triggered.
  sent_at         timestamp nullable                 -- When sending actually started.

  -- A/B test configuration (only for ab_test type).
  -- The parent campaign holds the winning variant after the test completes.
  ab_test_winner_id uuid nullable                    -- Self-reference: ID of the winning campaign variant.
  ab_test_sample_pct integer nullable                -- Percentage of recipients for A/B test sample (e.g., 20 = 20%).
  ab_test_metric  enum(open_rate, click_rate) nullable  -- Metric to determine the winner.

  created_by      uuid nullable references users(id) on_delete set_null
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(status)
    index(campaign_type)
    index(template_id)
    index(scheduled_at)
    index(created_at)
  }
}
```

**Design notes:**
- A/B testing: the parent campaign has `campaign_type = ab_test`. Variant campaigns are separate rows with the same structure. `ab_test_winner_id` points to the winning variant after the test completes.
- `ab_test_winner_id` is a self-referencing FK to `campaigns(id)`. Not declared as a formal FK to avoid circular complexity in some formats — handled as a loose reference.
- Content priority: inline `html_body`/`text_body` > `template_id` content. This lets campaigns customize templates.

### 9. campaign_recipients

Junction table linking campaigns to their target audiences (lists and/or segments). A campaign
can target multiple lists and segments simultaneously.

```pseudo
table campaign_recipients {
  id              uuid primary_key default auto_generate
  campaign_id     uuid not_null references campaigns(id) on_delete cascade
  list_id         uuid nullable references contact_lists(id) on_delete cascade
  segment_id      uuid nullable references segments(id) on_delete cascade
  created_at      timestamp default now

  indexes {
    index(campaign_id)
    index(list_id)
    index(segment_id)
  }
}
```

**Design notes:**
- Each row targets either a list or a segment (one of `list_id`/`segment_id` should be non-null).
- A campaign can have multiple recipient rows to target several lists and segments.

### 10. campaign_sends

Per-contact send record for a campaign. One row per contact per campaign. Tracks the delivery
lifecycle from queued through sent to delivered (or bounced/dropped). This is the core delivery
audit trail.

```pseudo
table campaign_sends {
  id              uuid primary_key default auto_generate
  campaign_id     uuid not_null references campaigns(id) on_delete cascade
  contact_id      uuid not_null references contacts(id) on_delete cascade
  status          enum(queued, sent, delivered, bounced, dropped, deferred) not_null default queued
                                                     -- queued = in send queue.
                                                     -- sent = handed to email provider.
                                                     -- delivered = confirmed delivery.
                                                     -- bounced = hard or soft bounce.
                                                     -- dropped = suppressed (on suppression list).
                                                     -- deferred = temporary failure, will retry.
  sent_at         timestamp nullable                 -- When the email was sent to the provider.
  delivered_at    timestamp nullable                 -- When delivery was confirmed.
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    composite_unique(campaign_id, contact_id)        -- One send per contact per campaign.
    index(contact_id)
    index(status)
    index(sent_at)
  }
}
```

### 11. campaign_events

Append-only engagement event log. Tracks opens, clicks, bounces, complaints, and unsubscribes
per send. Multiple events per send are expected (e.g., multiple opens, clicks on different links).

```pseudo
table campaign_events {
  id              uuid primary_key default auto_generate
  send_id         uuid not_null references campaign_sends(id) on_delete cascade
  event_type      enum(open, click, bounce, complaint, unsubscribe) not_null
  link_id         uuid nullable references campaign_links(id) on_delete set_null  -- For click events.
  metadata        json nullable                      -- Extra event data (e.g., bounce reason, user agent, IP).
  occurred_at     timestamp not_null default now      -- When the event happened.

  indexes {
    index(send_id)
    index(event_type)
    index(occurred_at)
  }
}
```

**Design notes:**
- Append-only: events are never updated or deleted (except for retention cleanup).
- `link_id` is only populated for `click` events.
- `metadata` stores provider-specific details (bounce codes, IP addresses, user agents).

### 12. campaign_links

Tracked URLs within campaign email content. Each unique URL in a campaign gets one row.
Click events reference this table to identify which link was clicked.

```pseudo
table campaign_links {
  id              uuid primary_key default auto_generate
  campaign_id     uuid not_null references campaigns(id) on_delete cascade
  original_url    string not_null                    -- The destination URL.
  position        integer nullable                   -- Link position in the email (1st, 2nd, etc.).
  created_at      timestamp default now

  indexes {
    index(campaign_id)
    composite_unique(campaign_id, original_url)      -- One tracking record per URL per campaign.
  }
}
```

### 13. suppression_entries

Global suppression list. Prevents sending to email addresses that have bounced, complained, or
been manually blocked. Check this before every send. Sending to suppressed addresses damages
sender reputation and violates CAN-SPAM/GDPR compliance.

```pseudo
table suppression_entries {
  id              uuid primary_key default auto_generate
  email           string not_null                    -- Suppressed email address.
  reason          enum(hard_bounce, complaint, manual, list_unsubscribe) not_null
                                                     -- hard_bounce = permanent delivery failure.
                                                     -- complaint = recipient marked as spam.
                                                     -- manual = admin manually suppressed.
                                                     -- list_unsubscribe = via List-Unsubscribe header.
  source_campaign_id uuid nullable references campaigns(id) on_delete set_null  -- Campaign that triggered the suppression.
  created_by      uuid nullable references users(id) on_delete set_null  -- For manual suppressions.
  created_at      timestamp default now

  indexes {
    unique(email)                                    -- One suppression per email address.
    index(reason)
  }
}
```

**Design notes:**
- `email` is unique — only the first suppression reason is kept. To re-enable, delete the entry.
- Check suppression before every send. If a contact's email is in this table, drop the send.

### 14. automation_workflows

Automated email sequences (drip campaigns, welcome series, re-engagement flows). A workflow
defines a trigger condition and contains ordered steps. Contacts are enrolled when the trigger
fires and progress through steps automatically.

```pseudo
table automation_workflows {
  id              uuid primary_key default auto_generate
  name            string not_null
  description     string nullable
  trigger_type    enum(list_join, tag_added, manual, event) not_null
                                                     -- list_join = contact added to a specific list.
                                                     -- tag_added = contact assigned a specific tag.
                                                     -- manual = contacts enrolled manually/via API.
                                                     -- event = custom application event.
  trigger_config  json nullable default {}           -- Trigger parameters. Example for list_join:
                                                     -- { "list_id": "uuid" }. For tag_added: { "tag_id": "uuid" }.
  is_active       boolean not_null default true      -- Toggle without deleting.
  created_by      uuid nullable references users(id) on_delete set_null
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(is_active)
    index(trigger_type)
  }
}
```

### 15. automation_steps

Individual steps within an automation workflow. Steps execute in order by `step_order`. Each step
is either an email send, a delay, or a condition check.

```pseudo
table automation_steps {
  id              uuid primary_key default auto_generate
  workflow_id     uuid not_null references automation_workflows(id) on_delete cascade
  step_order      integer not_null                   -- Execution order (ascending).
  step_type       enum(send_email, delay, condition) not_null
                                                     -- send_email = send a template to the contact.
                                                     -- delay = wait for a duration before next step.
                                                     -- condition = evaluate a rule; skip if false.
  template_id     uuid nullable references templates(id) on_delete set_null  -- For send_email steps.
  config          json nullable default {}           -- Step-specific config:
                                                     -- send_email: { "subject_override": "..." }
                                                     -- delay: { "duration_hours": 24 }
                                                     -- condition: { "field": "status", "op": "eq", "value": "active" }
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    composite_unique(workflow_id, step_order)         -- Step order must be unique within a workflow.
    index(template_id)
  }
}
```

### 16. automation_enrollments

Tracks a contact's progress through an automation workflow. One row per contact per workflow.
Records which step they're on, whether they've completed or exited the workflow.

```pseudo
table automation_enrollments {
  id              uuid primary_key default auto_generate
  workflow_id     uuid not_null references automation_workflows(id) on_delete cascade
  contact_id      uuid not_null references contacts(id) on_delete cascade
  current_step_id uuid nullable references automation_steps(id) on_delete set_null
  status          enum(active, completed, paused, exited) not_null default active
                                                     -- active = progressing through steps.
                                                     -- completed = finished all steps.
                                                     -- paused = temporarily halted.
                                                     -- exited = removed before completion (unsubscribed, condition failed).
  enrolled_at     timestamp not_null default now      -- When the contact entered the workflow.
  completed_at    timestamp nullable                  -- When the contact finished or exited.
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    composite_unique(workflow_id, contact_id)         -- One enrollment per contact per workflow.
    index(contact_id)
    index(status)
  }
}
```

## Relationships

### One-to-Many

```
contacts          1 ──── * contact_list_members     (a contact belongs to many lists)
contact_lists     1 ──── * contact_list_members     (a list has many members)
contacts          1 ──── * contact_tag_assignments  (a contact has many tags)
tags              1 ──── * contact_tag_assignments  (a tag applies to many contacts)
templates         1 ──── * campaigns                (a template is used by many campaigns)
campaigns         1 ──── * campaign_recipients      (a campaign targets many lists/segments)
contact_lists     1 ──── * campaign_recipients      (a list is targeted by many campaigns)
segments          1 ──── * campaign_recipients      (a segment is targeted by many campaigns)
campaigns         1 ──── * campaign_sends           (a campaign has many send records)
contacts          1 ──── * campaign_sends           (a contact has send records across campaigns)
campaign_sends    1 ──── * campaign_events          (a send has many engagement events)
campaigns         1 ──── * campaign_links           (a campaign has many tracked links)
campaign_links    1 ──── * campaign_events          (a link has many click events)
campaigns         1 ──── * suppression_entries      (a campaign can trigger many suppressions)
automation_workflows 1 ── * automation_steps        (a workflow has many steps)
automation_workflows 1 ── * automation_enrollments  (a workflow has many enrolled contacts)
contacts          1 ──── * automation_enrollments   (a contact can be enrolled in many workflows)
templates         1 ──── * automation_steps         (a template is used in many workflow steps)
automation_steps  1 ──── * automation_enrollments   (a step has many contacts currently on it)
users             1 ──── * contacts                 (a user creates many contacts, via created_by)
users             1 ──── * contact_lists            (a user creates many lists)
users             1 ──── * tags                     (a user creates many tags)
users             1 ──── * segments                 (a user creates many segments)
users             1 ──── * templates                (a user creates many templates)
users             1 ──── * campaigns                (a user creates many campaigns)
users             1 ──── * suppression_entries      (a user creates manual suppressions)
users             1 ──── * automation_workflows     (a user creates many workflows)
```

### Many-to-Many (via junction tables)

```
contacts ↔ contact_lists   (through contact_list_members)
contacts ↔ tags            (through contact_tag_assignments)
```

## Best Practices

- **Check suppression before every send** — Before sending to a contact, check `suppression_entries` for their email. Sending to hard-bounced or complained addresses damages sender reputation.
- **Separate contact status from list status** — A contact can be globally active but unsubscribed from a specific list. Always check both `contacts.status` and `contact_list_members.status`.
- **Lowercase emails on insert** — Normalize email addresses to lowercase in `contacts.email` and `suppression_entries.email` to prevent duplicates from case differences.
- **Double opt-in** — Use `contact_list_members.status = unconfirmed` for new subscriptions, then transition to `subscribed` after confirmation. Store `subscribed_at` for compliance records.
- **Respect unsubscribe immediately** — CAN-SPAM requires honoring opt-outs within 10 business days; GDPR requires immediate suppression. Process unsubscribes synchronously.
- **Link tracking via redirect** — Replace URLs in campaign HTML with tracking URLs that redirect through your server, recording a `campaign_events` click event with the corresponding `campaign_links` row.
- **Idempotent sends** — The `composite_unique(campaign_id, contact_id)` on `campaign_sends` prevents duplicate sends to the same contact for the same campaign.
- **Automation re-enrollment** — The `composite_unique(workflow_id, contact_id)` on `automation_enrollments` prevents duplicate enrollments. To re-enroll, delete the old record first.

## Formats

Each table is a separate file within each format folder:

| Format      | Directory                        | Status  |
| ----------- | -------------------------------- | ------- |
| Convex      | [`convex/`](./convex/)           | ✅ Done |
| SQL         | [`sql/`](./sql/)                 | ✅ Done |
| Prisma      | [`prisma/`](./prisma/)           | ✅ Done |
| MongoDB     | [`mongodb/`](./mongodb/)         | ✅ Done |
| Drizzle     | [`drizzle/`](./drizzle/)         | ✅ Done |
| SpacetimeDB | [`spacetimedb/`](./spacetimedb/) | ✅ Done |
| Firebase    | [`firebase/`](./firebase/)       | ✅ Done |
