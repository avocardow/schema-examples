# Helpdesk / Customer Support

> Ticket-based customer support with SLA tracking, knowledge base, team routing, satisfaction ratings, and custom fields.

## Overview

A complete helpdesk and customer support schema covering the full ticket lifecycle: customers submit requests through multiple channels, agents triage and respond, SLA policies enforce response and resolution targets, and a knowledge base enables self-service. Supports both B2C support desks and internal IT helpdesks.

Designed from a study of 10 real implementations: SaaS platforms (Zendesk, Freshdesk, Intercom, Help Scout) and open-source systems (Jira Service Management, osTicket, Zammad, GLPI, UVdesk, Linear).

Key design decisions:
- **Configurable status and priority lookup tables** over fixed enums — the dominant pattern (Zendesk, Freshdesk, Zammad, UVdesk, GLPI). Seed with defaults (open/pending/resolved/closed and low/medium/high/urgent) but allow runtime customization. An `is_closed` boolean on statuses distinguishes open from resolved states.
- **Typed ticket messages** for conversation threads — `ticket_messages` with type enum (reply, note, customer_message, system) and `is_private` flag. Covers public replies, internal notes, customer-initiated messages, and system-generated entries in a single table. Follows Help Scout, osTicket, Zammad, and UVdesk patterns.
- **Agent + Team assignment** — tickets have both `assigned_agent_id` and `assigned_team_id` for team-based routing with individual accountability. The dominant pattern across Zendesk, Freshdesk, and Zammad.
- **Multi-metric SLA policies** with per-priority targets for first response, next response, and resolution time. Business hour schedules with holiday exceptions for accurate SLA clock calculation. Modeled after Zendesk, Freshdesk, Zammad, and GLPI.
- **Self-referencing knowledge base categories** — `parent_id` on `kb_categories` supports any hierarchy depth (flat, 2-level, or 3-level) without requiring a separate sections entity.
- **Dual classification** — `type` enum on tickets (question/incident/problem/feature_request) for ITIL-lite classification, plus hierarchical `ticket_categories` for topic-based routing (Billing, Technical, Account).
- **Tags + Categories** — tags for flexible ad-hoc labeling, categories for structured classification. Different purposes, complementary systems.
- **Per-ticket satisfaction feedback** — simple CSAT with rating enum and optional comment. One response per ticket.
- **EAV custom fields** — `custom_fields` definitions for tickets, `custom_field_options` for dropdowns, `custom_field_values` for actual data. Scoped to tickets only (contact/org custom fields belong in auth-rbac or CRM). Same proven pattern as osTicket, Zendesk, and GLPI.
- **Ticket audit trail** — `ticket_activities` as an append-only log of all ticket changes for accountability, SLA debugging, and compliance reporting. Follows the Zendesk Ticket Audits and Zammad history pattern.

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (22 tables)</summary>

- [`ticket_statuses`](#1-ticket_statuses)
- [`ticket_priorities`](#2-ticket_priorities)
- [`ticket_categories`](#3-ticket_categories)
- [`sla_policies`](#4-sla_policies)
- [`business_schedules`](#5-business_schedules)
- [`business_schedule_entries`](#6-business_schedule_entries)
- [`business_schedule_holidays`](#7-business_schedule_holidays)
- [`sla_policy_targets`](#8-sla_policy_targets)
- [`tickets`](#9-tickets)
- [`ticket_messages`](#10-ticket_messages)
- [`ticket_attachments`](#11-ticket_attachments)
- [`ticket_followers`](#12-ticket_followers)
- [`ticket_activities`](#13-ticket_activities)
- [`kb_categories`](#14-kb_categories)
- [`kb_articles`](#15-kb_articles)
- [`canned_responses`](#16-canned_responses)
- [`tags`](#17-tags)
- [`ticket_tags`](#18-ticket_tags)
- [`ticket_feedback`](#19-ticket_feedback)
- [`custom_fields`](#20-custom_fields)
- [`custom_field_options`](#21-custom_field_options)
- [`custom_field_values`](#22-custom_field_values)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users` | User identity for agents, customers, message senders, article authors, and audit trails. Teams/groups for `assigned_team_id` are managed in auth-rbac. |

> **Customer/contact profiles** (organization, phone, timezone) are managed externally — either by the [CRM](../crm) domain or by extending the auth-rbac `users` table. The helpdesk domain references `users(id)` directly for requesters and agents.
>
> **File storage** is handled externally (e.g., the [File Management](../file-management-document-storage) domain). The `ticket_attachments` table stores file metadata and references without owning file storage infrastructure.

## Tables

### Ticket Core
- `ticket_statuses` — Configurable ticket lifecycle states with sort order and closed flag
- `ticket_priorities` — Configurable priority levels with sort order and color
- `ticket_categories` — Hierarchical topic categories for structured ticket classification
- `tickets` — Central support requests with subject, description, status, priority, assignment, and SLA tracking
- `ticket_messages` — Conversation thread entries: replies, internal notes, customer messages, and system events
- `ticket_attachments` — Files attached to ticket messages with metadata
- `ticket_followers` — Users subscribed to ticket updates (watchers/CCs)

### Audit Trail
- `ticket_activities` — Append-only log of all ticket changes for accountability and SLA debugging

### SLA Management
- `sla_policies` — Named SLA policies with activation and priority ordering
- `sla_policy_targets` — Per-priority response and resolution time targets within an SLA policy
- `business_schedules` — Named business hour schedules with timezone
- `business_schedule_entries` — Weekly time blocks defining when the SLA clock runs
- `business_schedule_holidays` — Date-based exceptions when the SLA clock pauses

### Knowledge Base
- `kb_categories` — Article categories with optional nesting via self-referencing parent
- `kb_articles` — Help center articles with status lifecycle, authorship, and helpfulness voting

### Templates
- `canned_responses` — Reusable reply templates for common responses

### Tagging
- `tags` — Reusable color-coded labels for flexible ticket classification
- `ticket_tags` — Junction linking tickets to tags

### Feedback
- `ticket_feedback` — Per-ticket customer satisfaction rating with optional comment

### Custom Fields
- `custom_fields` — Field definitions for extending tickets with custom data
- `custom_field_options` — Predefined choices for dropdown/select custom fields
- `custom_field_values` — Actual custom field values stored per ticket (EAV pattern)

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. ticket_statuses

Configurable ticket lifecycle states. Helpdesks need custom workflows — some teams use "waiting_on_vendor" or "escalated" states beyond the defaults. Each status has a sort order for display and an `is_closed` flag that tells the system whether tickets in this state count as resolved.

```pseudo
table ticket_statuses {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Display name (e.g., "Open", "Pending", "Resolved").
  slug            string unique not_null       -- URL-safe identifier (e.g., "open", "pending").
  sort_order      integer not_null default 0   -- Display order in status dropdowns and boards.
  color           string nullable              -- Hex color code for UI display (e.g., "#22c55e").
  is_closed       boolean not_null default false -- Whether this status represents a resolved/closed state.
  is_default      boolean not_null default false -- Whether this status is assigned to new tickets automatically.
  description     string nullable              -- Explains when to use this status.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(sort_order)                          -- "Statuses in display order."
    -- unique(slug) is already created by the field constraint above.
  }
}
```

**Design notes:**
- `is_closed` enables queries like "all open tickets" without hardcoding status names: `WHERE status.is_closed = false`.
- `is_default = true` should exist on exactly one status — enforced at the application level.
- Seed defaults: open (default, sort 0), pending (sort 1), in_progress (sort 2), resolved (closed, sort 3), closed (closed, sort 4).

### 2. ticket_priorities

Configurable priority levels. While most helpdesks use low/medium/high/urgent, some teams add "critical" or rename levels to match their processes.

```pseudo
table ticket_priorities {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Display name (e.g., "Low", "Medium", "High", "Urgent").
  slug            string unique not_null       -- URL-safe identifier (e.g., "low", "urgent").
  sort_order      integer not_null default 0   -- Display order; higher sort = higher urgency.
  color           string nullable              -- Hex color for UI (e.g., "#ef4444" for urgent).
  is_default      boolean not_null default false -- Whether this priority is assigned to new tickets automatically.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(sort_order)                          -- "Priorities in urgency order."
    -- unique(slug) is already created by the field constraint above.
  }
}
```

**Design notes:**
- `sort_order` doubles as urgency ranking for SLA target selection — higher sort = more urgent = tighter SLA targets.
- Seed defaults: low (sort 0), medium (default, sort 1), high (sort 2), urgent (sort 3).

### 3. ticket_categories

Hierarchical topic categories for structured ticket classification and routing. Categories like "Billing → Refunds" or "Technical → API → Authentication" help route tickets to the right team and power reporting dashboards.

```pseudo
table ticket_categories {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Category name (e.g., "Billing", "Technical Support").
  slug            string unique not_null       -- URL-safe identifier.
  description     string nullable              -- What types of tickets belong in this category.
  parent_id       uuid nullable references ticket_categories(id) on_delete set_null
                                               -- Parent category for nesting. Null = top-level.
  sort_order      integer not_null default 0   -- Display order among siblings.
  is_active       boolean not_null default true -- Whether this category is available for new tickets.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(parent_id, sort_order)               -- "Child categories of this parent in order."
    -- unique(slug) is already created by the field constraint above.
  }
}
```

**Design notes:**
- Self-referencing `parent_id` supports any nesting depth. Most helpdesks use 1-3 levels.
- `is_active = false` hides the category from new ticket forms without deleting historical data.
- Categories are for structured classification (routing, reporting). Tags handle ad-hoc labeling.

### 4. sla_policies

Named SLA policies that define response and resolution time commitments. Policies are matched to tickets based on conditions (priority, category, organization) and applied in sort order — first matching policy wins.

```pseudo
table sla_policies {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Policy name (e.g., "Enterprise SLA", "Standard SLA").
  description     string nullable              -- What conditions trigger this policy.
  is_active       boolean not_null default true -- Whether this policy is currently enforced.
  sort_order      integer not_null default 0   -- Evaluation priority — lower number = checked first.
  schedule_id     uuid nullable references business_schedules(id) on_delete set_null
                                               -- Business hours schedule for SLA clock. Null = 24/7.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(is_active, sort_order)               -- "Active policies in evaluation order."
  }
}
```

**Design notes:**
- SLA matching logic lives in application code (checking ticket priority, category, contact org, etc.). The `sort_order` determines which policy wins when multiple match.
- `schedule_id` links to business hours. Null means the SLA clock runs 24/7 (calendar hours).

### 5. business_schedules

Named business hour schedules defining when the SLA clock runs. A schedule represents a timezone and a set of weekly operating hours plus holiday exceptions.

```pseudo
table business_schedules {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Schedule name (e.g., "US East Business Hours", "24/7").
  timezone        string not_null              -- IANA timezone for this schedule (e.g., "America/New_York").
  is_default      boolean not_null default false -- Whether this is the fallback schedule.

  created_at      timestamp default now
  updated_at      timestamp default now on_update
}
```

**Design notes:**
- Multiple schedules support global teams: "US Business Hours", "EU Business Hours", "APAC Business Hours".
- `is_default = true` should exist on at most one schedule — enforced at the application level.

### 6. business_schedule_entries

Weekly time blocks within a business schedule. Each entry represents a work period on a specific day of the week (e.g., Monday 9:00–17:00). Multiple entries per day support split shifts.

```pseudo
table business_schedule_entries {
  id              uuid primary_key default auto_generate
  schedule_id     uuid not_null references business_schedules(id) on_delete cascade
  day_of_week     integer not_null             -- 0 = Sunday, 1 = Monday, ..., 6 = Saturday.
  start_time      string not_null              -- Start time in HH:MM format (e.g., "09:00").
  end_time        string not_null              -- End time in HH:MM format (e.g., "17:00").

  indexes {
    index(schedule_id, day_of_week)            -- "Time blocks for this schedule on this day."
  }
}
```

**Design notes:**
- `start_time` and `end_time` are strings (not timestamps) because they represent clock times in the schedule's timezone, not absolute UTC moments.
- Multiple entries per day handle split shifts (e.g., 09:00–12:00, 13:00–17:00 for a lunch break).
- No `created_at`/`updated_at` — these are configuration entries managed alongside the schedule.

### 7. business_schedule_holidays

Holiday exceptions when the SLA clock pauses for the entire day. Holidays override the weekly schedule — if a holiday falls on a working day, that day is treated as non-working.

```pseudo
table business_schedule_holidays {
  id              uuid primary_key default auto_generate
  schedule_id     uuid not_null references business_schedules(id) on_delete cascade
  name            string not_null              -- Holiday name (e.g., "Christmas Day", "Independence Day").
  date            string not_null              -- Holiday date in YYYY-MM-DD format.

  indexes {
    composite_unique(schedule_id, date)        -- One holiday per date per schedule.
    -- composite_unique(schedule_id, date) covers index(schedule_id) via leading column.
  }
}
```

**Design notes:**
- `date` is a string (not timestamp) because holidays are calendar dates, not absolute moments.
- Holidays must be added yearly for recurring holidays — the application handles recurrence logic.

### 8. sla_policy_targets

Per-priority time targets within an SLA policy. Each row defines the maximum allowed minutes for first response, next response, and resolution at a specific priority level. This is how "urgent tickets must be responded to within 1 hour and resolved within 4 hours" is modeled.

```pseudo
table sla_policy_targets {
  id                      uuid primary_key default auto_generate
  sla_policy_id           uuid not_null references sla_policies(id) on_delete cascade
  priority_id             uuid not_null references ticket_priorities(id) on_delete cascade
  first_response_minutes  integer nullable       -- Max minutes to first agent response. Null = not tracked.
  next_response_minutes   integer nullable        -- Max minutes between subsequent responses. Null = not tracked.
  resolution_minutes      integer nullable        -- Max minutes to resolution. Null = not tracked.

  indexes {
    composite_unique(sla_policy_id, priority_id) -- One target row per priority per policy.
    -- composite_unique(sla_policy_id, priority_id) covers index(sla_policy_id) via leading column.
  }
}
```

**Design notes:**
- Not all metrics need tracking — a policy might only enforce first response time. Nullable fields allow selective enforcement.
- Times are in minutes for simplicity. 60 = 1 hour, 480 = 8 hours (one business day at 8h/day), 1440 = 24 calendar hours.
- No `created_at`/`updated_at` — these are configuration entries managed alongside the policy.

### 9. tickets

The central entity — a customer support request. Tickets capture the subject, description, classification (type, category, priority, status), assignment (agent, team), SLA tracking timestamps, and channel of origin. Every interaction in the helpdesk revolves around tickets.

```pseudo
table tickets {
  id                  uuid primary_key default auto_generate
  subject             string not_null              -- Brief summary of the request (like an email subject line).
  description         string nullable              -- Initial detailed description. Nullable for tickets created from brief messages.
  status_id           uuid not_null references ticket_statuses(id) on_delete restrict
                                                   -- Current lifecycle state. Restrict delete to prevent orphaned tickets.
  priority_id         uuid not_null references ticket_priorities(id) on_delete restrict
                                                   -- Urgency level. Restrict delete to prevent orphaned tickets.
  type                enum(question, incident, problem, feature_request) not_null default question
                                                   -- ITIL-lite classification:
                                                   -- question = general inquiry / how-to.
                                                   -- incident = something is broken / service disruption.
                                                   -- problem = root cause investigation for recurring incidents.
                                                   -- feature_request = enhancement request.
  source              enum(email, web, phone, api, social) not_null default web
                                                   -- Channel through which the ticket was created.
  category_id         uuid nullable references ticket_categories(id) on_delete set_null
                                                   -- Topic category for routing and reporting.
  requester_id        uuid not_null references users(id) on_delete restrict
                                                   -- The customer who submitted this ticket.
  assigned_agent_id   uuid nullable references users(id) on_delete set_null
                                                   -- Individual agent working this ticket. Null = unassigned.
  assigned_team_id    uuid nullable                -- Team/group responsible for this ticket. Null = unrouted.
                                                   -- References auth-rbac teams/groups externally.
  sla_policy_id       uuid nullable references sla_policies(id) on_delete set_null
                                                   -- Applied SLA policy. Null = no SLA enforcement.
  due_at              timestamp nullable           -- Deadline for resolution based on SLA. Computed by application.
  first_response_at   timestamp nullable           -- When the first agent response was sent. For SLA tracking.
  resolved_at         timestamp nullable           -- When the ticket was resolved (status changed to closed).
  closed_at           timestamp nullable           -- When the ticket was formally closed (may differ from resolved).
  created_by          uuid not_null references users(id) on_delete restrict
                                                   -- User who created the ticket (may differ from contact for agent-created tickets).

  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    index(status_id)                               -- "All tickets at this status."
    index(priority_id)                             -- "All tickets at this priority."
    index(requester_id)                             -- "All tickets from this customer."
    index(assigned_agent_id)                       -- "Tickets assigned to this agent."
    index(assigned_team_id)                        -- "Tickets assigned to this team."
    index(category_id)                             -- "Tickets in this category."
    index(sla_policy_id)                           -- "Tickets under this SLA policy."
    index(created_at)                              -- "Tickets by creation date."
    index(due_at)                                  -- "Tickets approaching SLA deadline."
  }
}
```

**Design notes:**
- `status_id` and `priority_id` use `on_delete restrict` — deleting a status/priority that has tickets would orphan them. Application should reassign first.
- `requester_id` uses `on_delete restrict` — deleting a customer with open tickets should be prevented.
- `created_by` vs `requester_id`: an agent can create a ticket on behalf of a customer (e.g., phone call). `created_by` is the actor, `requester_id` is the customer.
- `assigned_team_id` is a plain UUID referencing teams/groups managed in the auth-rbac domain. No FK constraint — referential integrity is enforced at the application level.
- `first_response_at`, `resolved_at`, `closed_at` are set by the application as lifecycle events occur. Used for SLA compliance calculation.
- `due_at` is computed from `sla_policy_targets.resolution_minutes` and the applicable business schedule.

### 10. ticket_messages

Conversation thread entries on a ticket. Every interaction is a message: customer replies, agent responses, internal notes between agents, and system-generated events (auto-assignment, SLA breach, status change). Messages are append-only — the full conversation history is preserved.

```pseudo
table ticket_messages {
  id              uuid primary_key default auto_generate
  ticket_id       uuid not_null references tickets(id) on_delete cascade
  sender_id       uuid nullable references users(id) on_delete set_null
                                               -- Who sent this message. Null for system-generated messages.
  type            enum(reply, note, customer_message, system) not_null
                                               -- reply = agent response visible to customer.
                                               -- note = internal agent note, not visible to customer.
                                               -- customer_message = message from the customer.
                                               -- system = automated system event (assignment, SLA breach, etc.).
  body            string not_null              -- Message content (HTML or plain text).
  is_private      boolean not_null default false -- Whether this message is hidden from the customer.
  channel         enum(email, web, api, system) not_null default web
                                               -- Channel through which this message was sent.

  created_at      timestamp default now

  indexes {
    index(ticket_id, created_at)               -- "Messages for this ticket in chronological order."
    index(sender_id)                           -- "Messages sent by this user."
  }
}
```

**Design notes:**
- `is_private` is distinct from type: a `reply` is always public, a `note` is always private. The flag provides explicit control for edge cases and simplifies visibility queries.
- `channel` tracks how the message was delivered — an agent might reply via email integration or web UI.
- Messages are append-only: no `updated_at`. Edits should create new messages (or the application can add edit tracking as needed).
- Attachments are tracked in `ticket_attachments` with a `message_id` FK. Each attachment stores file metadata; actual file storage is handled externally.

### 11. ticket_attachments

Files attached to ticket messages. Each attachment stores lightweight metadata (name, URL, size, MIME type) and links to the message it was uploaded with. Actual file storage is managed externally (e.g., the file-management domain or cloud storage).

```pseudo
table ticket_attachments {
  id              uuid primary_key default auto_generate
  ticket_id       uuid not_null references tickets(id) on_delete cascade
  message_id      uuid nullable references ticket_messages(id) on_delete set_null
                                               -- Message this file was attached to. Null if orphaned.
  file_name       string not_null              -- Original file name (e.g., "screenshot.png").
  file_url        string not_null              -- URL or storage path to the file.
  file_size       integer nullable             -- File size in bytes.
  mime_type       string nullable              -- MIME type (e.g., "image/png", "application/pdf").
  uploaded_by     uuid not_null references users(id) on_delete restrict
                                               -- User who uploaded this file.

  created_at      timestamp default now

  indexes {
    index(ticket_id)                           -- "All attachments on this ticket."
    index(message_id)                          -- "Attachments on this message."
  }
}
```

**Design notes:**
- `ticket_id` provides direct ticket-level queries without joining through messages.
- `message_id` is nullable to handle edge cases where attachments exist without a message (e.g., inline ticket creation).
- File metadata is stored here; actual file bytes are managed by external storage. This table acts as a join/metadata layer.
- No `updated_at` — attachments are immutable once uploaded. Delete and re-upload to replace.

### 12. ticket_followers

Users subscribed to ticket updates. Followers receive notifications when new messages are added or ticket status changes. This covers the CC/watcher pattern found in most helpdesks.

```pseudo
table ticket_followers {
  id              uuid primary_key default auto_generate
  ticket_id       uuid not_null references tickets(id) on_delete cascade
  user_id         uuid not_null references users(id) on_delete cascade
                                               -- The user following this ticket (agent or customer).

  created_at      timestamp default now

  indexes {
    composite_unique(ticket_id, user_id)       -- One follow per user per ticket.
    index(user_id)                             -- "Tickets this user is following."
    -- composite_unique(ticket_id, user_id) covers index(ticket_id) via leading column.
  }
}
```

**Design notes:**
- Both agents and customers can follow tickets. The application controls notification logic based on message visibility (private notes only notify agent followers).
- The ticket's `requester_id` and `assigned_agent_id` are implicitly "followers" — this table tracks additional watchers.

### 13. ticket_activities

Append-only audit trail of all ticket changes. Every status change, assignment, priority update, and SLA event is logged for accountability, compliance reporting, and SLA debugging. Follows the Zendesk Ticket Audits and Zammad history pattern.

```pseudo
table ticket_activities {
  id              uuid primary_key default auto_generate
  ticket_id       uuid not_null references tickets(id) on_delete cascade
  user_id         uuid nullable references users(id) on_delete set_null
                                               -- User who performed the action. Null for system actions.
  action          enum(created, updated, status_changed, priority_changed, assigned, escalated, reopened, resolved, closed, sla_breached) not_null
                                               -- created = ticket created.
                                               -- updated = field value changed.
                                               -- status_changed = status transition.
                                               -- priority_changed = priority changed.
                                               -- assigned = agent or team assignment changed.
                                               -- escalated = ticket escalated to higher tier.
                                               -- reopened = ticket reopened from closed state.
                                               -- resolved = ticket marked as resolved.
                                               -- closed = ticket formally closed.
                                               -- sla_breached = SLA target exceeded.
  field           string nullable              -- Field that changed (e.g., "status_id", "priority_id", "assigned_agent_id").
  old_value       string nullable              -- Previous value as string.
  new_value       string nullable              -- New value as string.

  created_at      timestamp default now

  indexes {
    index(ticket_id, created_at)               -- "Activity history for this ticket in order."
    index(user_id)                             -- "All actions by this user."
  }
}
```

**Design notes:**
- Append-only: rows are never updated or deleted. The full history is preserved.
- `field`, `old_value`, `new_value` capture what changed. For the `created` action, these are null.
- Values are stored as strings for uniformity. The application converts UUIDs, enums, etc. to display names for the UI.
- `sla_breached` is logged by the SLA monitoring job when a target is exceeded — `field` stores which metric ("first_response", "resolution").

### 14. kb_categories

Knowledge base article categories with optional nesting. Categories organize help center content into a browsable hierarchy (e.g., "Getting Started", "Billing → Payments → Refunds", "API Reference").

```pseudo
table kb_categories {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Category name (e.g., "Getting Started", "Billing").
  slug            string unique not_null       -- URL-safe identifier for clean URLs.
  description     string nullable              -- Brief description of what this category covers.
  parent_id       uuid nullable references kb_categories(id) on_delete set_null
                                               -- Parent category for nesting. Null = top-level.
  sort_order      integer not_null default 0   -- Display order among siblings.
  is_published    boolean not_null default false -- Whether this category is visible in the help center.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(parent_id, sort_order)               -- "Child categories of this parent in order."
    -- unique(slug) is already created by the field constraint above.
  }
}
```

**Design notes:**
- Self-referencing `parent_id` replaces the Zendesk/Freshdesk 3-entity model (Category → Section → Article) with a single flexible table.
- `is_published = false` keeps draft categories hidden from the public help center.
- Deleting a parent sets children's `parent_id` to null, promoting them to top-level. Application may want to prevent this or cascade.

### 15. kb_articles

Help center articles for customer self-service. Articles have a lifecycle (draft → published → archived), authorship tracking, and helpfulness voting for content quality signals.

```pseudo
table kb_articles {
  id              uuid primary_key default auto_generate
  category_id     uuid nullable references kb_categories(id) on_delete set_null
                                               -- Category this article belongs to. Null = uncategorized.
  title           string not_null              -- Article title.
  slug            string unique not_null       -- URL-safe identifier for clean URLs.
  body            string not_null              -- Article content (HTML or Markdown).
  status          enum(draft, published, archived) not_null default draft
                                               -- draft = work in progress, not visible.
                                               -- published = live in help center.
                                               -- archived = removed from help center, preserved for reference.
  author_id       uuid not_null references users(id) on_delete restrict
                                               -- Agent who wrote this article.
  view_count      integer not_null default 0   -- Total page views. Incremented by application.
  helpful_count   integer not_null default 0   -- "Was this helpful? Yes" votes.
  not_helpful_count integer not_null default 0 -- "Was this helpful? No" votes.
  published_at    timestamp nullable           -- When the article was first published.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(category_id)                         -- "Articles in this category."
    index(status)                              -- "All published articles."
    index(author_id)                           -- "Articles by this author."
    -- unique(slug) is already created by the field constraint above.
  }
}
```

**Design notes:**
- `view_count`, `helpful_count`, `not_helpful_count` are denormalized counters. For high-traffic help centers, consider a separate analytics table.
- `published_at` is set by the application on first publish. Distinct from `created_at` (draft creation time).
- `author_id` uses `on_delete restrict` — deleting an author with published articles should be prevented.

### 16. canned_responses

Reusable reply templates for common support scenarios. Agents select a canned response to pre-fill their reply, saving time on repetitive questions like "How do I reset my password?" or "What's your refund policy?".

```pseudo
table canned_responses {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Template name for agent selection (e.g., "Password Reset Instructions").
  content         string not_null              -- Reply body content (HTML or plain text). May contain merge fields.
  folder          string nullable              -- Optional grouping folder (e.g., "Billing", "Technical").
  created_by_id   uuid not_null references users(id) on_delete restrict
                                               -- Agent who created this template.
  is_shared       boolean not_null default true -- true = visible to all agents. false = personal template.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(folder)                              -- "Templates in this folder."
    index(created_by_id)                       -- "Templates created by this agent."
    index(is_shared)                           -- "All shared templates."
  }
}
```

**Design notes:**
- `folder` is a simple string grouping — not a separate table. Most helpdesks use flat folder names (Freshdesk canned response folders, osTicket categories).
- `is_shared = false` creates personal templates visible only to the creator. Useful for agents with specialized reply styles.
- `content` may include merge fields (e.g., `{{customer.name}}`, `{{ticket.id}}`) — parsing is handled by the application.

### 17. tags

Reusable labels for flexible, ad-hoc ticket classification. Unlike categories (structured, hierarchical), tags are flat and can be freely created by agents. Used for cross-cutting concerns like "vip", "escalated", "bug-confirmed", "needs-followup".

```pseudo
table tags {
  id              uuid primary_key default auto_generate
  name            string unique not_null       -- Tag label (e.g., "vip", "escalated", "bug-confirmed").
  color           string nullable              -- Hex color for UI display.

  created_at      timestamp default now

  indexes {
    -- unique(name) is already created by the field constraint above.
  }
}
```

**Design notes:**
- Tag names are unique and case-sensitive. Application should normalize case on creation (e.g., lowercase).
- No `updated_at` — tags are simple labels. Renaming creates a new tag or updates in place.

### 18. ticket_tags

Junction table linking tickets to tags. A ticket can have multiple tags, and a tag can be applied to many tickets.

```pseudo
table ticket_tags {
  id              uuid primary_key default auto_generate
  ticket_id       uuid not_null references tickets(id) on_delete cascade
  tag_id          uuid not_null references tags(id) on_delete cascade

  created_at      timestamp default now

  indexes {
    composite_unique(ticket_id, tag_id)        -- One tag instance per ticket.
    index(tag_id)                              -- "All tickets with this tag."
    -- composite_unique(ticket_id, tag_id) covers index(ticket_id) via leading column.
  }
}
```

### 19. ticket_feedback

Per-ticket customer satisfaction rating. After a ticket is resolved, the customer can rate their experience. One rating per ticket — subsequent submissions update the existing record.

```pseudo
table ticket_feedback {
  id              uuid primary_key default auto_generate
  ticket_id       uuid unique not_null references tickets(id) on_delete cascade
                                               -- One feedback per ticket.
  rating          enum(good, bad) not_null     -- Binary CSAT: good (satisfied) or bad (unsatisfied).
                                               -- Binary is the industry standard (Zendesk, Help Scout).
  comment         string nullable              -- Optional free-text feedback from the customer.
  created_by_id   uuid not_null references users(id) on_delete restrict
                                               -- Customer who submitted the feedback.

  created_at      timestamp default now

  indexes {
    index(rating)                              -- "All tickets with bad ratings" for review.
    index(created_by_id)                       -- "All feedback from this customer."
    -- unique(ticket_id) is already created by the field constraint above.
  }
}
```

**Design notes:**
- Binary rating (good/bad) is the Zendesk/Help Scout standard. Simpler and more actionable than 1-5 scales.
- `created_by_id` uses `on_delete restrict` — preserving feedback attribution is important for CSAT reporting.
- Feedback is typically solicited via email after resolution. The application controls the survey trigger.

### 20. custom_fields

Field definitions for extending tickets with custom data. Each field has a type, label, and configuration. The EAV pattern (definitions + values) enables runtime-configurable forms without schema changes.

```pseudo
table custom_fields {
  id              uuid primary_key default auto_generate
  name            string unique not_null       -- Internal field identifier (e.g., "customer_tier").
  label           string not_null              -- Display label (e.g., "Customer Tier").
  field_type      enum(text, number, date, dropdown, checkbox, textarea, url, email) not_null
                                               -- Data type for validation and UI rendering.
  sort_order      integer not_null default 0   -- Display order in forms.
  is_required     boolean not_null default false -- Whether this field must be filled.
  is_active       boolean not_null default true -- Whether this field is shown on forms.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(sort_order)                          -- "Fields in form display order."
    -- unique(name) is already created by the field constraint above.
  }
}
```

**Design notes:**
- All custom fields apply to tickets. Contact/organization custom fields belong in auth-rbac or CRM domains.
- `field_type` determines validation rules and UI widget. The application validates `custom_field_values.value` based on this type.
- `is_active = false` hides the field from forms without deleting existing values.

### 21. custom_field_options

Predefined choices for dropdown and multi-select custom fields. Each option has a label and value, with sort ordering for display.

```pseudo
table custom_field_options {
  id              uuid primary_key default auto_generate
  custom_field_id uuid not_null references custom_fields(id) on_delete cascade
  label           string not_null              -- Display text shown to users.
  value           string not_null              -- Stored value (may differ from label).
  sort_order      integer not_null default 0   -- Display order in dropdown.

  indexes {
    index(custom_field_id, sort_order)         -- "Options for this field in display order."
  }
}
```

**Design notes:**
- Only relevant for `field_type = dropdown` fields. The application should validate that options are only created for dropdown fields.
- `label` vs `value`: label is human-readable ("Enterprise"), value is machine-friendly ("enterprise"). Enables i18n of labels without changing stored values.

### 22. custom_field_values

Actual custom field data stored per ticket (EAV values table). Each row stores one field's value for one ticket (e.g., ticket #123's "Customer Tier" = "Enterprise").

```pseudo
table custom_field_values {
  id              uuid primary_key default auto_generate
  custom_field_id uuid not_null references custom_fields(id) on_delete cascade
  ticket_id       uuid not_null references tickets(id) on_delete cascade
                                               -- The ticket this value belongs to.
  value           string nullable              -- The field value as a string. Application parses based on field_type.

  indexes {
    composite_unique(custom_field_id, ticket_id) -- One value per field per ticket.
    index(ticket_id)                           -- "All custom field values for this ticket."
    -- composite_unique(custom_field_id, ticket_id) covers index(custom_field_id) via leading column.
  }
}
```

**Design notes:**
- `ticket_id` is a direct FK to tickets, providing referential integrity. No generic entity_id needed since all custom fields are ticket-scoped.
- `value` stores all types as strings. The application converts based on `custom_fields.field_type`: numbers are parsed, dates are ISO-formatted strings, booleans are "true"/"false", dropdowns store the option value.

## Relationships

```
ticket_statuses      1 ──── * tickets                  (one status applied to many tickets)
ticket_priorities    1 ──── * tickets                  (one priority on many tickets)
ticket_categories    1 ──── * tickets                  (one category for many tickets)
ticket_categories    1 ──── * ticket_categories         (parent has many child categories)
sla_policies         1 ──── * tickets                  (one SLA policy applied to many tickets)
sla_policies         1 ──── * sla_policy_targets       (one policy has targets per priority)
business_schedules   1 ──── * sla_policies             (one schedule used by many policies)
business_schedules   1 ──── * business_schedule_entries (one schedule has many time blocks)
business_schedules   1 ──── * business_schedule_holidays (one schedule has many holidays)
ticket_priorities    1 ──── * sla_policy_targets       (one priority has targets in many policies)
tickets              1 ──── * ticket_messages          (one ticket has many messages)
tickets              1 ──── * ticket_attachments       (one ticket has many attachments)
tickets              1 ──── * ticket_followers         (one ticket has many followers)
tickets              1 ──── * ticket_activities        (one ticket has many activity log entries)
tickets              1 ──── * ticket_tags              (one ticket has many tags)
tickets              1 ──── 0..1 ticket_feedback       (one ticket has at most one feedback)
tickets              1 ──── * custom_field_values      (one ticket has many custom field values)
ticket_messages      1 ──── * ticket_attachments       (one message has many attachments)
tags                 1 ──── * ticket_tags              (one tag on many tickets)
kb_categories        1 ──── * kb_articles              (one category has many articles)
kb_categories        1 ──── * kb_categories            (parent has many child categories)
custom_fields        1 ──── * custom_field_options     (one field has many dropdown options)
custom_fields        1 ──── * custom_field_values      (one field has many values across tickets)
users                1 ──── * tickets                  (one user creates many tickets — created_by)
users                1 ──── * tickets                  (one customer requests many tickets — requester_id)
users                1 ──── * tickets                  (one agent assigned many tickets — assigned_agent_id)
users                1 ──── * ticket_messages          (one user sends many messages)
users                1 ──── * ticket_attachments       (one user uploads many attachments)
users                1 ──── * ticket_followers         (one user follows many tickets)
users                1 ──── * ticket_activities        (one user performs many actions)
users                1 ──── * kb_articles              (one author writes many articles)
users                1 ──── * canned_responses         (one user creates many templates)
users                1 ──── * ticket_feedback          (one user submits many feedback ratings)
```

## Best Practices

- **Ticket routing**: Use `ticket_categories` and `ticket_priorities` to auto-assign tickets to teams. The application matches category → team mappings and assigns `assigned_team_id` on ticket creation.
- **SLA enforcement**: On ticket create, match the ticket against active `sla_policies` (in `sort_order`) based on priority, category, and contact organization. Apply the first matching policy. Compute `due_at` from `sla_policy_targets.resolution_minutes` and the policy's `business_schedule`.
- **SLA clock calculation**: Use `business_schedule_entries` to compute elapsed business minutes. Subtract `business_schedule_holidays` dates. The SLA clock pauses when the ticket status has `is_closed = true` or when the status indicates "waiting on customer" (application-defined).
- **First response tracking**: Set `tickets.first_response_at` when the first `ticket_message` of type `reply` is created. Compare against `sla_policy_targets.first_response_minutes` for compliance.
- **Status transitions**: When changing status, if the new status has `is_closed = true`, set `tickets.resolved_at` (or `closed_at`). If reopening (changing from closed to open status), clear `resolved_at` and re-activate the SLA clock.
- **Ticket activity logging**: Log all ticket changes to `ticket_activities` — status transitions, assignment changes, priority updates, SLA breaches. Use for audit trails, compliance reporting, and SLA debugging. The activity log is append-only; never update or delete entries.
- **Knowledge base publishing**: Set `kb_articles.published_at` when status changes from `draft` to `published`. Display only articles where `status = published` and `kb_categories.is_published = true`.
- **Custom field validation**: Validate `custom_field_values.value` at the application level based on `custom_fields.field_type`. Check `is_required` on ticket creation. Validate dropdown values against `custom_field_options`.
- **Tag management**: Tags are global and reusable. Normalize tag names (lowercase, trim whitespace) on creation to prevent duplicates. Use auto-complete in the UI.
- **CSAT reporting**: Calculate CSAT score as `good_count / total_count × 100`. Filter by date range, team, agent, or category for granular analysis.
- **Canned response merge fields**: Parse `{{variable}}` patterns in `canned_responses.content` and replace with ticket/contact data before inserting into the reply. Common fields: `{{customer.name}}`, `{{ticket.id}}`, `{{agent.name}}`.
- **Soft deletes**: Consider adding `deleted_at` to tickets for recoverability. The current schema uses hard deletes with cascade.
- **Access control**: Reference the Auth / RBAC domain for agent permissions. Consider role-based visibility: agents see their team's tickets, admins see all tickets.

## Formats

| Format      | Status |
| ----------- | ------ |
| Convex      | ✅ Done |
| SQL         | ✅ Done |
| Prisma      | ✅ Done |
| MongoDB     | ✅ Done |
| Drizzle     | ✅ Done |
| SpacetimeDB | ✅ Done |
| Firebase    | ✅ Done |
