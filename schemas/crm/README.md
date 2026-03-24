# CRM

> Customer relationship management with contacts, companies, leads, deals, pipelines, activities, and custom fields.

## Overview

A complete CRM schema supporting the full customer lifecycle: capturing leads, managing contacts and companies, tracking deals through multi-stage pipelines, logging activities, creating follow-up tasks, and extending records with custom fields. Covers both B2B and B2C use cases from simple contact management to enterprise sales pipeline tracking.

Designed from a study of 10 real implementations: SaaS platforms (Salesforce, HubSpot, Pipedrive, Zoho CRM, Freshsales, Attio, Insightly, Copper) and open-source systems (SuiteCRM, Twenty CRM).

Key design decisions:
- **Separate leads table** over lifecycle stages on contacts — the dominant pattern (Salesforce, Zoho, Freshsales, SuiteCRM). Leads represent unqualified prospects before conversion. Developers who prefer the unified contact model can skip the leads table and add a lifecycle stage field to contacts.
- **Many-to-many contact-company** — a contact can work at or consult for multiple companies via `contact_companies` junction with role and primary flag, following the Salesforce/HubSpot pattern.
- **Multiple pipelines** — each pipeline defines its own ordered stages with optional win probability. Supports different sales processes (new business, renewal, upsell) per the industry standard.
- **Deal-contact roles** — `deal_contacts` junction with role enum (decision_maker, champion, influencer, end_user) following Salesforce OpportunityContactRole and Pipedrive DealParticipant.
- **Unified activity log** — single `activities` table with type enum (call, email, meeting) and nullable FKs to contact, company, and deal. Separate `tasks` table for follow-up items with due dates and completion tracking.
- **Notes as separate entity** — rich text notes with nullable FKs to contact, company, deal, and lead, allowing notes on any entity type.
- **Per-entity-type custom fields (EAV)** — `custom_fields` definitions scoped by entity type enum, `custom_field_options` for select types, and `custom_field_values` for actual data.
- **Type-safe tag junctions** — separate `contact_tags`, `company_tags`, and `deal_tags` junction tables rather than polymorphic references.

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (18 tables)</summary>

- [`contacts`](#1-contacts)
- [`companies`](#2-companies)
- [`contact_companies`](#3-contact_companies)
- [`leads`](#4-leads)
- [`pipelines`](#5-pipelines)
- [`pipeline_stages`](#6-pipeline_stages)
- [`deals`](#7-deals)
- [`deal_contacts`](#8-deal_contacts)
- [`activities`](#9-activities)
- [`tasks`](#10-tasks)
- [`notes`](#11-notes)
- [`tags`](#12-tags)
- [`contact_tags`](#13-contact_tags)
- [`company_tags`](#14-company_tags)
- [`deal_tags`](#15-deal_tags)
- [`custom_fields`](#16-custom_fields)
- [`custom_field_options`](#17-custom_field_options)
- [`custom_field_values`](#18-custom_field_values)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users` | User identity for record ownership, activity actors, task assignees, and audit trails |

> **Products and line items** are handled externally (e.g., the e-commerce domain). Deals store a monetary `value` without referencing a product catalog.

## Tables

### Core Entities
- `contacts` — Individual people with name, email, phone, and lifecycle tracking
- `companies` — Business organizations with domain, industry, and employee size
- `contact_companies` — Many-to-many linking contacts to companies with role and primary flag

### Lead Management
- `leads` — Unqualified prospects with source tracking, status, and conversion reference

### Pipeline & Deals
- `pipelines` — Named sales processes with default pipeline support
- `pipeline_stages` — Ordered stages within a pipeline with optional win probability
- `deals` — Active sales opportunities with value, expected close date, and pipeline stage

### Deal Relationships
- `deal_contacts` — Many-to-many linking deals to contacts with stakeholder roles

### Activities & Tasks
- `activities` — Logged interactions (calls, emails, meetings) linked to contacts, companies, and deals
- `tasks` — Follow-up to-do items with due dates, priority, and completion tracking

### Notes
- `notes` — Rich text notes attached to contacts, companies, deals, or leads

### Categorization
- `tags` — Reusable color-coded labels for categorizing records
- `contact_tags` — Junction: contacts ↔ tags
- `company_tags` — Junction: companies ↔ tags
- `deal_tags` — Junction: deals ↔ tags

### Custom Fields
- `custom_fields` — Field definitions per entity type (text, number, date, select, etc.)
- `custom_field_options` — Predefined options for select and multi_select custom fields
- `custom_field_values` — Actual values stored for custom fields on specific records

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. contacts

Individual people that the business interacts with — customers, prospects, partners, or any person worth tracking. Each contact has basic personal information, a primary email, optional phone, and a lifecycle stage indicating where they are in the customer journey. Contacts can be linked to multiple companies and deals.

```pseudo
table contacts {
  id              uuid primary_key default auto_generate
  first_name      string not_null              -- Given name.
  last_name       string not_null              -- Family name.
  email           string unique not_null        -- Primary email address.
  phone           string nullable              -- Primary phone number.
  title           string nullable              -- Job title (e.g., "VP of Engineering").
  lifecycle_stage enum(subscriber, lead, qualified, opportunity, customer, evangelist, other) not_null default lead
                                               -- Where this contact is in the customer journey.
                                               -- subscriber = signed up but not engaged.
                                               -- lead = engaged but not qualified.
                                               -- qualified = sales-qualified.
                                               -- opportunity = associated with an active deal.
                                               -- customer = closed-won deal.
                                               -- evangelist = active promoter.
                                               -- other = does not fit standard stages.
  source          enum(web, referral, organic, paid, social, event, cold_outreach, other) nullable
                                               -- How this contact was acquired.
  owner_id        uuid nullable references users(id) on_delete set_null
                                               -- Sales rep who owns this contact. Null = unassigned.
  avatar_url      string nullable              -- URL to a profile photo.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(owner_id)                            -- "Contacts owned by this user."
    index(lifecycle_stage)                     -- "All contacts at this stage."
    -- unique(email) is already created by the field constraint above.
  }
}
```

**Design notes:**
- `lifecycle_stage` tracks the contact's journey independent of any specific deal. Updated by the application as the contact progresses.
- `source` records original acquisition channel. Useful for attribution reporting.
- `owner_id` references the auth-rbac `users` table. Set null on user deletion to preserve the contact record.

### 2. companies

Business organizations that contacts work at or the business sells to. Companies are the "account" entity in B2B CRM. Each company has a domain for deduplication, industry classification, and employee size range.

```pseudo
table companies {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Company/organization name.
  domain          string unique nullable       -- Primary website domain (e.g., "acme.com"). Used for deduplication and enrichment.
  industry        string nullable              -- Industry sector (e.g., "Technology", "Healthcare").
  employee_count  integer nullable             -- Approximate number of employees.
  annual_revenue  decimal nullable             -- Estimated annual revenue for qualification.
  phone           string nullable              -- Main company phone number.
  address_street  string nullable
  address_city    string nullable
  address_state   string nullable
  address_country string nullable
  address_zip     string nullable
  website         string nullable              -- Full website URL.
  description     string nullable              -- Notes about the company.
  owner_id        uuid nullable references users(id) on_delete set_null
                                               -- Sales rep who owns this account.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(owner_id)                            -- "Companies owned by this user."
    index(industry)                            -- "Companies in this industry."
    -- unique(domain) is already created by the field constraint above.
  }
}
```

**Design notes:**
- `domain` enables automatic company matching when contacts sign up with a company email. Nullable for companies without a web presence.
- Address fields are flat (not a separate table) — the standard CRM pattern. For multi-address support, add an `addresses` table.
- `annual_revenue` uses decimal for precision in financial values.

### 3. contact_companies

Junction table linking contacts to companies. A contact can work at multiple companies (consultant, board member, contractor). Each association has a role and a primary flag to indicate the main company.

```pseudo
table contact_companies {
  id              uuid primary_key default auto_generate
  contact_id      uuid not_null references contacts(id) on_delete cascade
  company_id      uuid not_null references companies(id) on_delete cascade
  role            string nullable              -- Contact's role at this company (e.g., "CTO", "Advisor").
  is_primary      boolean not_null default false -- Whether this is the contact's primary company.

  created_at      timestamp default now

  indexes {
    composite_unique(contact_id, company_id)   -- One link per contact-company pair.
    index(company_id)                          -- "All contacts at this company."
    -- composite_unique(contact_id, company_id) covers index(contact_id) via leading column.
  }
}
```

**Design notes:**
- `is_primary` should have at most one `true` per contact — enforced at the application level.
- `role` is a free-text string (not an enum) since job titles are too varied to enumerate.

### 4. leads

Unqualified prospects before they enter the sales pipeline. Leads capture initial interest — a form submission, a trade show scan, or a cold outreach response. When qualified, leads are "converted" into a contact (and optionally a company and deal). The conversion workflow is a core CRM concept modeled in most enterprise systems.

```pseudo
table leads {
  id              uuid primary_key default auto_generate
  first_name      string not_null
  last_name       string not_null
  email           string unique not_null
  phone           string nullable
  company_name    string nullable              -- Company name as free text (not linked to companies table yet).
  title           string nullable              -- Job title.
  source          enum(web, referral, organic, paid, social, event, cold_outreach, other) nullable
                                               -- Acquisition channel.
  status          enum(new, contacted, qualified, unqualified, converted) not_null default new
                                               -- new = just captured, not yet contacted.
                                               -- contacted = outreach attempted.
                                               -- qualified = ready for conversion to contact.
                                               -- unqualified = not a fit.
                                               -- converted = successfully converted to contact/deal.
  converted_at    timestamp nullable           -- When the lead was converted.
  converted_contact_id uuid nullable references contacts(id) on_delete set_null
                                               -- The contact created from this lead upon conversion.
  owner_id        uuid nullable references users(id) on_delete set_null
                                               -- Sales rep assigned to this lead.
  notes           string nullable              -- Quick notes about the lead.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(status)                              -- "All leads at this status."
    index(owner_id)                            -- "Leads assigned to this user."
    index(source)                              -- "Leads from this channel."
    -- unique(email) is already created by the field constraint above.
  }
}
```

**Design notes:**
- `company_name` is free text (not an FK) because the company may not exist in the system yet. Upon conversion, the application creates or links to a `companies` record.
- `converted_contact_id` creates a traceable link from lead to contact for conversion reporting.
- `status = converted` is a terminal state — converted leads are typically excluded from active lead lists.

### 5. pipelines

Named sales processes that define how deals progress from open to won/lost. Most CRMs support multiple pipelines for different deal types (e.g., "New Business", "Renewal", "Enterprise", "Self-Serve"). One pipeline is marked as the default for new deals.

```pseudo
table pipelines {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Pipeline name (e.g., "New Business", "Renewal").
  description     string nullable
  is_default      boolean not_null default false -- Whether this is the default pipeline for new deals.
  position        integer not_null default 0   -- Display order among pipelines.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(position)                            -- "Pipelines in display order."
  }
}
```

**Design notes:**
- `is_default = true` should exist on at most one pipeline — enforced at the application level.
- Pipelines are global (not scoped to a user or team). For team-scoped pipelines, add a team FK.

### 6. pipeline_stages

Ordered stages within a pipeline. Each stage represents a milestone in the sales process (e.g., "Prospecting" → "Qualification" → "Proposal" → "Negotiation" → "Closed Won"). Stages have an optional win probability for revenue forecasting.

```pseudo
table pipeline_stages {
  id              uuid primary_key default auto_generate
  pipeline_id     uuid not_null references pipelines(id) on_delete cascade
  name            string not_null              -- Stage name (e.g., "Qualification", "Proposal Sent").
  position        integer not_null default 0   -- Display order within the pipeline.
  win_probability integer nullable             -- Expected win probability as percentage (0-100). Used for weighted forecasting.
  is_closed_won   boolean not_null default false -- Whether this stage means the deal is won.
  is_closed_lost  boolean not_null default false -- Whether this stage means the deal is lost.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(pipeline_id, position)               -- "Stages for this pipeline in order."
  }
}
```

**Design notes:**
- `is_closed_won` and `is_closed_lost` mark terminal stages. A deal at a closed stage is no longer active. Typically one won stage and one lost stage per pipeline.
- `win_probability` enables weighted pipeline forecasting: deal value × probability = expected revenue.
- Position ordering follows the left-to-right pipeline board layout.

### 7. deals

Active sales opportunities being pursued through a pipeline. Each deal has a monetary value, expected close date, and tracks through pipeline stages. Deals are the central revenue-generating entity in CRM — everything connects to deals (contacts, activities, tasks, notes).

```pseudo
table deals {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Deal title (e.g., "Acme Corp — Enterprise License").
  pipeline_id     uuid not_null references pipelines(id) on_delete restrict
  stage_id        uuid nullable references pipeline_stages(id) on_delete set_null
                                               -- Current pipeline stage. Null if stage was deleted.
  value           decimal nullable             -- Monetary value of the deal. Null = not yet estimated.
  currency        string not_null default 'USD' -- ISO 4217 currency code (e.g., "USD", "EUR").
  expected_close_date string nullable          -- Expected close date in YYYY-MM-DD. Contextual, not absolute.
  closed_at       timestamp nullable           -- When the deal was actually closed (won or lost).
  lost_reason     string nullable              -- Why the deal was lost. Null if not lost.
  priority        enum(low, medium, high) not_null default medium
  owner_id        uuid nullable references users(id) on_delete set_null
                                               -- Sales rep who owns this deal.
  company_id      uuid nullable references companies(id) on_delete set_null
                                               -- Primary company associated with this deal.
  contact_id      uuid nullable references contacts(id) on_delete set_null
                                               -- Primary contact for this deal. For quick access — full contact list in deal_contacts.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(pipeline_id, stage_id)               -- "Deals in this pipeline at this stage."
    index(owner_id)                            -- "Deals owned by this user."
    index(company_id)                          -- "Deals with this company."
    index(contact_id)                          -- "Deals with this contact."
    index(expected_close_date)                 -- "Deals expected to close by this date."
    index(closed_at)                           -- "Recently closed deals."
  }
}
```

**Design notes:**
- `contact_id` is a convenience FK for the primary contact. The full list of contacts involved in the deal is in `deal_contacts`. This avoids a join for the most common query.
- `expected_close_date` is a string (YYYY-MM-DD) — it's a calendar date, not an absolute moment.
- `pipeline_id` uses `on_delete restrict` — cannot delete a pipeline with active deals.
- `value` is decimal for financial precision. Currency is stored per deal for multi-currency support.
- `lost_reason` is free text — the application can provide predefined options while still allowing custom reasons.

### 8. deal_contacts

Junction table linking deals to contacts with a stakeholder role. A deal typically involves multiple people — the decision maker, a champion inside the company, influencers, and end users. This table tracks who's involved and their role in the deal.

```pseudo
table deal_contacts {
  id              uuid primary_key default auto_generate
  deal_id         uuid not_null references deals(id) on_delete cascade
  contact_id      uuid not_null references contacts(id) on_delete cascade
  role            enum(decision_maker, champion, influencer, end_user, other) not_null default other
                                               -- decision_maker = has authority to approve/sign.
                                               -- champion = internal advocate for the deal.
                                               -- influencer = influences the decision.
                                               -- end_user = will use the product/service.
                                               -- other = involved but role not specified.

  created_at      timestamp default now

  indexes {
    composite_unique(deal_id, contact_id)      -- One role per contact per deal.
    index(contact_id)                          -- "All deals this contact is involved in."
    -- composite_unique(deal_id, contact_id) covers index(deal_id) via leading column.
  }
}
```

### 9. activities

Logged interactions with contacts, companies, or deals. Activities record what happened — a call was made, an email was sent, a meeting occurred. This is the activity timeline that all CRMs display on record pages. Activities are historical records, not future tasks.

```pseudo
table activities {
  id              uuid primary_key default auto_generate
  type            enum(call, email, meeting) not_null
                                               -- call = phone call or video call.
                                               -- email = email sent or received.
                                               -- meeting = in-person or virtual meeting.
  subject         string not_null              -- Activity title/subject line.
  description     string nullable              -- Details or notes about the activity.
  occurred_at     timestamp not_null           -- When the activity happened.
  duration        integer nullable             -- Duration in minutes. Null for emails or unknown.

  -- Polymorphic links: at least one should be set, but all are nullable for flexibility.
  contact_id      uuid nullable references contacts(id) on_delete set_null
  company_id      uuid nullable references companies(id) on_delete set_null
  deal_id         uuid nullable references deals(id) on_delete set_null

  owner_id        uuid not_null references users(id) on_delete cascade
                                               -- User who logged the activity.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(contact_id, occurred_at)             -- "Activities for this contact, most recent first."
    index(company_id, occurred_at)             -- "Activities for this company, most recent first."
    index(deal_id, occurred_at)                -- "Activities for this deal, most recent first."
    index(owner_id)                            -- "Activities logged by this user."
    index(type)                                -- "All calls" or "all meetings."
  }
}
```

**Design notes:**
- Activities are not polymorphic in the anti-pattern sense — they have explicit nullable FKs to each entity type. An activity can be linked to a contact AND a company AND a deal simultaneously.
- `occurred_at` is when the activity actually happened (not when it was logged). It's a timestamp because activities happen at specific moments.
- `duration` is in minutes (not seconds) — appropriate granularity for sales activities.

### 10. tasks

Follow-up to-do items assigned to users. Tasks represent future work — "Call John on Tuesday", "Send proposal by Friday", "Follow up after demo". Tasks can be linked to contacts, companies, or deals. Unlike activities, tasks have a due date, priority, and completion state.

```pseudo
table tasks {
  id              uuid primary_key default auto_generate
  title           string not_null              -- Task description (e.g., "Send proposal to Acme Corp").
  description     string nullable              -- Additional details or instructions.
  due_date        string nullable              -- Due date in YYYY-MM-DD. Contextual, not absolute.
  priority        enum(low, medium, high) not_null default medium
  status          enum(todo, in_progress, completed, cancelled) not_null default todo
  completed_at    timestamp nullable           -- When the task was marked complete.

  -- Linked entities (all optional).
  contact_id      uuid nullable references contacts(id) on_delete set_null
  company_id      uuid nullable references companies(id) on_delete set_null
  deal_id         uuid nullable references deals(id) on_delete set_null

  owner_id        uuid not_null references users(id) on_delete cascade
                                               -- User responsible for this task.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(owner_id, status)                    -- "Open tasks for this user."
    index(due_date)                            -- "Tasks due by this date."
    index(contact_id)                          -- "Tasks related to this contact."
    index(deal_id)                             -- "Tasks related to this deal."
  }
}
```

**Design notes:**
- `due_date` is a string (YYYY-MM-DD) — a calendar date in the user's context.
- `status` tracks task lifecycle. `completed_at` is set when status changes to `completed`.
- Tasks are separate from activities: tasks represent future work to do; activities represent past interactions that occurred.

### 11. notes

Rich text notes attached to CRM records. Notes provide a freeform way to document information about contacts, companies, deals, or leads. All CRMs include notes as a core entity.

```pseudo
table notes {
  id              uuid primary_key default auto_generate
  content         string not_null              -- Note body (rich text / markdown).

  -- Linked entities (at least one should be set).
  contact_id      uuid nullable references contacts(id) on_delete cascade
  company_id      uuid nullable references companies(id) on_delete cascade
  deal_id         uuid nullable references deals(id) on_delete cascade
  lead_id         uuid nullable references leads(id) on_delete cascade

  created_by      uuid not_null references users(id) on_delete cascade

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(contact_id)                          -- "Notes for this contact."
    index(company_id)                          -- "Notes for this company."
    index(deal_id)                             -- "Notes for this deal."
    index(lead_id)                             -- "Notes for this lead."
    index(created_by)                          -- "Notes by this user."
  }
}
```

**Design notes:**
- Notes use `on_delete cascade` on entity FKs — when the entity is deleted, its notes are deleted too.
- A note can be linked to multiple entities simultaneously (e.g., a note about a contact at a company).

### 12. tags

Reusable color-coded labels for categorizing contacts, companies, and deals. Tags provide flexible classification beyond structured fields — "VIP", "Cold Lead", "Partner", "At Risk". Tags are global (not scoped to a user).

```pseudo
table tags {
  id              uuid primary_key default auto_generate
  name            string unique not_null       -- Tag display name (e.g., "VIP", "Partner", "At Risk").
  color           string nullable              -- Hex color (e.g., "#E11D48"). Null = default color.

  created_at      timestamp default now

  indexes {
    -- unique(name) is already created by the field constraint above.
  }
}
```

### 13. contact_tags

Junction table linking contacts to tags. A contact can have zero or more tags.

```pseudo
table contact_tags {
  id              uuid primary_key default auto_generate
  contact_id      uuid not_null references contacts(id) on_delete cascade
  tag_id          uuid not_null references tags(id) on_delete cascade

  created_at      timestamp default now

  indexes {
    composite_unique(contact_id, tag_id)       -- No duplicate tags on a contact.
    index(tag_id)                              -- "All contacts with this tag."
    -- composite_unique(contact_id, tag_id) covers index(contact_id) via leading column.
  }
}
```

### 14. company_tags

Junction table linking companies to tags.

```pseudo
table company_tags {
  id              uuid primary_key default auto_generate
  company_id      uuid not_null references companies(id) on_delete cascade
  tag_id          uuid not_null references tags(id) on_delete cascade

  created_at      timestamp default now

  indexes {
    composite_unique(company_id, tag_id)       -- No duplicate tags on a company.
    index(tag_id)                              -- "All companies with this tag."
    -- composite_unique(company_id, tag_id) covers index(company_id) via leading column.
  }
}
```

### 15. deal_tags

Junction table linking deals to tags.

```pseudo
table deal_tags {
  id              uuid primary_key default auto_generate
  deal_id         uuid not_null references deals(id) on_delete cascade
  tag_id          uuid not_null references tags(id) on_delete cascade

  created_at      timestamp default now

  indexes {
    composite_unique(deal_id, tag_id)          -- No duplicate tags on a deal.
    index(tag_id)                              -- "All deals with this tag."
    -- composite_unique(deal_id, tag_id) covers index(deal_id) via leading column.
  }
}
```

### 16. custom_fields

Field definitions for custom data on CRM entities. Each custom field is scoped to an entity type (contact, company, deal, or lead) and has a name, type, and optional configuration. Custom fields allow teams to capture domain-specific data without schema changes. Every major CRM supports this pattern.

```pseudo
table custom_fields {
  id              uuid primary_key default auto_generate
  entity_type     enum(contact, company, deal, lead) not_null
                                               -- Which entity type this field applies to.
  name            string not_null              -- Field label (e.g., "LinkedIn URL", "Deal Source").
  field_type      enum(text, number, date, select, multi_select, checkbox, url) not_null
  description     string nullable              -- Help text explaining the field's purpose.
  is_required     boolean not_null default false -- Whether this field must be filled.
  position        integer not_null default 0   -- Display order in forms.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(entity_type, position)               -- "Custom fields for this entity type in display order."
  }
}
```

**Design notes:**
- `entity_type` scopes field definitions to a specific entity. The same field name could exist for contacts and companies with different configurations.
- `field_type` determines validation and UI rendering. `select` and `multi_select` have predefined options in `custom_field_options`.
- `is_required` is enforced at the application level.

### 17. custom_field_options

Predefined options for `select` and `multi_select` custom fields. Each option has a display value, optional color, and ordering.

```pseudo
table custom_field_options {
  id              uuid primary_key default auto_generate
  custom_field_id uuid not_null references custom_fields(id) on_delete cascade
  value           string not_null              -- Option display value (e.g., "Enterprise", "SMB").
  color           string nullable              -- Hex color for visual distinction.
  position        integer not_null default 0   -- Display order in dropdowns.

  created_at      timestamp default now

  indexes {
    index(custom_field_id, position)           -- "Options for this field in display order."
  }
}
```

### 18. custom_field_values

Actual values stored for custom fields on specific entity records. Uses the EAV (Entity-Attribute-Value) pattern — one row per field per entity record. The `entity_id` references the record's UUID (contact, company, deal, or lead), and `entity_type` is derived from the custom field's `entity_type`.

```pseudo
table custom_field_values {
  id              uuid primary_key default auto_generate
  custom_field_id uuid not_null references custom_fields(id) on_delete cascade
  entity_id       uuid not_null               -- UUID of the contact, company, deal, or lead record.
                                               -- No FK constraint because it references multiple tables.
  value           string not_null              -- Value stored as string. Numbers as "42", dates as "2025-03-15",
                                               -- booleans as "true"/"false", select as the option value,
                                               -- multi_select as JSON array string.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    composite_unique(custom_field_id, entity_id) -- One value per field per entity record.
    index(entity_id)                           -- "All custom field values for this record."
    -- composite_unique(custom_field_id, entity_id) covers index(custom_field_id) via leading column.
  }
}
```

**Design notes:**
- `entity_id` is a UUID without a foreign key constraint since it references different tables depending on `entity_type` in the parent `custom_fields` row. Application logic ensures referential integrity.
- All values are stored as strings for uniformity. The application validates and casts based on `custom_fields.field_type`.

## Relationships

```
contacts           1 ──── * contact_companies     (one contact at many companies)
companies          1 ──── * contact_companies     (one company has many contacts)
contacts           1 ──── * deal_contacts          (one contact in many deals)
contacts           1 ──── * activities             (one contact has many activities)
contacts           1 ──── * tasks                  (one contact has many tasks)
contacts           1 ──── * notes                  (one contact has many notes)
contacts           1 ──── * contact_tags           (one contact has many tags)
companies          1 ──── * deals                  (one company has many deals)
companies          1 ──── * activities             (one company has many activities)
companies          1 ──── * notes                  (one company has many notes)
companies          1 ──── * company_tags           (one company has many tags)
leads              1 ──── * notes                  (one lead has many notes)
leads              1 ──── 0..1 contacts            (one lead converts to one contact)
pipelines          1 ──── * pipeline_stages        (one pipeline has many stages)
pipelines          1 ──── * deals                  (one pipeline has many deals)
pipeline_stages    1 ──── * deals                  (one stage has many deals)
deals              1 ──── * deal_contacts          (one deal has many contacts)
deals              1 ──── * activities             (one deal has many activities)
deals              1 ──── * tasks                  (one deal has many tasks)
deals              1 ──── * notes                  (one deal has many notes)
deals              1 ──── * deal_tags              (one deal has many tags)
tags               1 ──── * contact_tags           (one tag on many contacts)
tags               1 ──── * company_tags           (one tag on many companies)
tags               1 ──── * deal_tags              (one tag on many deals)
custom_fields      1 ──── * custom_field_options   (one field has many select options)
custom_fields      1 ──── * custom_field_values    (one field has many values across records)
users              1 ──── * contacts               (one user owns many contacts)
users              1 ──── * companies              (one user owns many companies)
users              1 ──── * leads                  (one user owns many leads)
users              1 ──── * deals                  (one user owns many deals)
users              1 ──── * activities             (one user logs many activities)
users              1 ──── * tasks                  (one user owns many tasks)
users              1 ──── * notes                  (one user creates many notes)
```

## Best Practices

- **Lead conversion**: When converting a lead, create a contact (copying name, email, phone, title), optionally create or link a company (from `company_name`), and optionally create a deal. Set `leads.status = converted`, `leads.converted_at`, and `leads.converted_contact_id`. Keep the lead record for attribution reporting.
- **Pipeline stages**: Seed default stages when creating a pipeline (e.g., "Prospecting", "Qualification", "Proposal", "Negotiation", "Closed Won", "Closed Lost"). Mark one stage `is_closed_won` and one `is_closed_lost`.
- **Deal forecasting**: Use weighted pipeline: `SUM(deals.value × pipeline_stages.win_probability / 100)` grouped by expected close date for revenue forecasting.
- **Activity timeline**: Display activities, tasks, and notes in a merged timeline view, sorted by date. This is the standard CRM record page pattern.
- **Deduplication**: Use `contacts.email` and `companies.domain` as natural dedup keys. Merge duplicates at the application level.
- **Custom field validation**: Validate `custom_field_values.value` at the application level based on `custom_fields.field_type`. The database stores all values as strings.
- **Tag management**: Tags are global and reusable. Use junction tables for type-safe assignment. Consider auto-complete in the UI to prevent tag proliferation.
- **Owner assignment**: Round-robin or weighted distribution of `owner_id` across sales reps. Track owner changes in an audit log if needed.
- **Soft deletes**: Consider adding `archived_at` to contacts, companies, and deals for recoverability. The current schema uses hard deletes with cascade for simplicity.
- **Access control**: Reference the Auth / RBAC domain for user permissions. Consider record-level visibility rules (e.g., "private to owner" vs. "visible to team").

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
