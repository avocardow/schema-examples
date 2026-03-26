# Event Management / Ticketing

> Event creation, ticketing, attendee management, and check-in for conferences, concerts, workshops, and meetups.

## Overview

A complete event management and ticketing schema supporting the full event lifecycle — from creation and promotion through ticket sales, attendee management, check-in, and post-event updates. Covers single events and recurring series, multi-session conferences with speakers, tiered ticket pricing with promo codes, order processing, individual ticket issuance, transfer, waitlists, and attendance tracking.

Designed from a study of 10+ real implementations: ticketing platforms (Eventbrite, Ticketmaster, Tito, Eventzilla), event management tools (Luma, Meetup, Splash), open-source systems (Attendize, Open Event Server, Pretix), and the Schema.org Event vocabulary.

Key design decisions:
- **Event + Session hierarchy** — events are the top-level container; multi-session events (conferences, festivals) use `event_sessions` for individual talks/workshops within the event
- **Order → Ticket separation** — orders represent the purchase transaction (payment snapshot); tickets are individual attendee-level passes generated from order items. This follows the Eventbrite/Tito model where one order can produce multiple tickets
- **Tiered ticket types** — `ticket_types` define pricing tiers (GA, VIP, Early Bird) with capacity limits, sale windows, and per-type configuration
- **Promo codes with scoping** — discount codes can apply globally to all ticket types or be scoped to specific types via a junction table
- **Speaker profiles** — reusable speaker records linked to sessions via a junction table, supporting speakers across multiple events
- **Snapshot pricing on orders** — order items capture price, currency, and ticket type name at purchase time, immune to later changes
- **Check-in tracking** — individual check-in records per ticket per session, supporting partial attendance at multi-session events
- **Ticket transfers** — ownership transfer history for tickets, enabling secondary transfer with audit trail
- **Payment status tracking** — `payment_status` on orders tracks whether the order is paid without owning payment processing (handled by external billing domain)

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (18 tables)</summary>

- [`venues`](#1-venues)
- [`event_categories`](#2-event_categories)
- [`event_series`](#3-event_series)
- [`events`](#4-events)
- [`event_organizers`](#5-event_organizers)
- [`event_sessions`](#6-event_sessions)
- [`speakers`](#7-speakers)
- [`session_speakers`](#8-session_speakers)
- [`ticket_types`](#9-ticket_types)
- [`promo_codes`](#10-promo_codes)
- [`promo_code_ticket_types`](#11-promo_code_ticket_types)
- [`orders`](#12-orders)
- [`order_items`](#13-order_items)
- [`tickets`](#14-tickets)
- [`check_ins`](#15-check_ins)
- [`ticket_transfers`](#16-ticket_transfers)
- [`waitlist_entries`](#17-waitlist_entries)
- [`event_updates`](#18-event_updates)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users` | User identity for organizers, attendees, speakers, and order creators |

> **Payment processing** is handled externally (e.g., a billing/payments domain or direct payment provider integration). The `payment_status` field on orders tracks payment state without owning payment records.

## Tables

### Core Resources
- `venues` — Physical or virtual locations where events take place
- `event_categories` — Hierarchical categorization of events (conference, workshop, concert, etc.)
- `event_series` — Recurring event series linking related events (e.g., "Monthly Tech Meetup")

### Events
- `events` — Core event records with timing, capacity, visibility, and status
- `event_organizers` — Junction table linking users to events as organizers with roles
- `event_sessions` — Individual sessions/talks/workshops within a multi-session event

### Speakers
- `speakers` — Reusable speaker/performer profiles
- `session_speakers` — Junction table linking speakers to sessions with roles and display order

### Ticketing
- `ticket_types` — Ticket tiers with pricing, capacity, sale windows, and configuration
- `promo_codes` — Discount and promotional codes for events
- `promo_code_ticket_types` — Junction scoping promo codes to specific ticket types

### Orders & Tickets
- `orders` — Ticket purchase transactions with payment tracking
- `order_items` — Line items within an order (ticket type + quantity + price snapshot)
- `tickets` — Individual issued tickets (one per attendee per admission)

### Attendance
- `check_ins` — Attendance check-in records per ticket, optionally per session
- `ticket_transfers` — Transfer of ticket ownership between users

### Engagement
- `waitlist_entries` — Queue for sold-out events or ticket types
- `event_updates` — Announcements and updates posted to event attendees

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. venues

Physical or virtual locations where events take place. A venue defines the space — address, capacity, timezone — independent of any specific event. Events reference a venue but can override capacity. Supports both physical venues (convention centers, theaters) and virtual venues (Zoom, YouTube Live).

```pseudo
table venues {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Venue name (e.g., "Moscone Center", "Virtual - Zoom").
  slug            string unique not_null       -- URL-safe identifier.
  description     string nullable              -- Venue description and amenities.
  type            enum(physical, virtual, hybrid) not_null default physical

  -- Address fields (for physical/hybrid venues).
  address_line1   string nullable
  address_line2   string nullable
  city            string nullable
  state           string nullable
  postal_code     string nullable
  country         string nullable              -- ISO 3166-1 alpha-2 code (e.g., "US", "GB").
  latitude        decimal nullable             -- GPS coordinates for map display.
  longitude       decimal nullable

  -- Virtual venue details.
  virtual_url     string nullable              -- Meeting/streaming URL for virtual venues.
  virtual_platform string nullable             -- Platform name (e.g., "Zoom", "YouTube Live", "Teams").

  capacity        integer nullable             -- Maximum total capacity. Null = unlimited.
  timezone        string not_null              -- IANA timezone (e.g., "America/New_York").
  phone           string nullable
  email           string nullable
  website_url     string nullable
  is_active       boolean not_null default true

  created_by      uuid not_null references users(id) on_delete restrict
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(type)                                -- "All physical venues" or "All virtual venues."
    index(city, state)                         -- "Venues in this city/state."
    index(is_active)                           -- Filter active venues.
    index(created_by)                          -- "Venues created by this user."
    -- unique(slug) is already created by the field constraint above.
  }
}
```

**Design notes:**
- `latitude`/`longitude` support map integration for venue discovery.
- `virtual_platform` is a free-text string rather than an enum — platforms change frequently and new ones appear regularly.
- `capacity` on the venue is the physical limit; individual events may have lower capacity via `events.max_attendees`.

### 2. event_categories

Hierarchical categorization for event discovery and filtering. Supports nesting via `parent_id` for multi-level taxonomies (e.g., "Music" → "Rock", "Jazz"). Used on event listing pages and search filters.

```pseudo
table event_categories {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Category name (e.g., "Conference", "Workshop", "Concert").
  slug            string unique not_null       -- URL-safe identifier.
  description     string nullable              -- Optional description for category pages.
  parent_id       uuid nullable references event_categories(id) on_delete set_null
                                               -- Self-referencing for nested categories. Null = top-level.
  position        integer not_null default 0   -- Display order within the same parent level.
  color           string nullable              -- Hex color for UI display (e.g., "#E91E63").
  icon            string nullable              -- Icon identifier for UI (e.g., "music", "code", "workshop").
  is_active       boolean not_null default true

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(parent_id)                           -- "Subcategories of this category."
    index(is_active, position)                 -- "Active categories in display order."
    -- unique(slug) is already created by the field constraint above.
  }
}
```

### 3. event_series

Groups related recurring events into a named series. For example, a "Monthly JavaScript Meetup" series links the January, February, March instances. Each event in the series is a standalone `events` row that references the series.

```pseudo
table event_series {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Series name (e.g., "Monthly JavaScript Meetup").
  slug            string unique not_null       -- URL-safe identifier.
  description     string nullable              -- Series-level description.
  recurrence_rule string nullable              -- RFC 5545 RRULE for auto-generating future events (e.g., "FREQ=MONTHLY;BYDAY=1TH").
  created_by      uuid not_null references users(id) on_delete restrict

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(created_by)                          -- "Series created by this user."
    -- unique(slug) is already created by the field constraint above.
  }
}
```

**Design notes:**
- `recurrence_rule` uses RFC 5545 RRULE format for programmatic event generation. The application expands the rule to create individual event rows.
- Each event in a series is fully independent — it has its own venue, time, ticket types, etc. The series is a loose grouping for navigation and branding.

### 4. events

The core entity — a single event occurrence with its own timing, venue, capacity, and configuration. Events can be standalone or belong to a series. An event can have multiple sessions (for conferences), multiple ticket types, and its own organizer team.

```pseudo
table events {
  id              uuid primary_key default auto_generate
  series_id       uuid nullable references event_series(id) on_delete set_null
  category_id     uuid nullable references event_categories(id) on_delete set_null
  venue_id        uuid nullable references venues(id) on_delete set_null

  -- Basic info.
  title           string not_null              -- Event title (e.g., "React Summit 2025").
  slug            string unique not_null       -- URL-safe identifier.
  summary         string nullable              -- Short description for listing cards (< 300 chars).
  description     string nullable              -- Full description with formatting (Markdown/HTML).
  cover_image_url string nullable              -- Hero image URL.

  -- Timing.
  start_time      timestamp not_null           -- Event start (UTC).
  end_time        timestamp not_null           -- Event end (UTC).
  timezone        string not_null              -- IANA timezone for display (e.g., "America/Los_Angeles").
  is_all_day      boolean not_null default false -- All-day events don't show specific times.

  -- Capacity.
  max_attendees   integer nullable             -- Maximum total attendees. Null = unlimited (or limited by venue).

  -- Status and visibility.
  status          enum(draft, published, cancelled, postponed, completed) not_null default draft
                                               -- draft = not yet visible to the public.
                                               -- published = live and accepting registrations.
                                               -- cancelled = event will not happen.
                                               -- postponed = temporarily suspended, may reschedule.
                                               -- completed = event has concluded.
  visibility      enum(public, private, unlisted) not_null default public
                                               -- public = discoverable in listings and search.
                                               -- private = invitation only, not in listings.
                                               -- unlisted = accessible via direct link, not in listings.

  -- Registration settings.
  registration_open_at  timestamp nullable     -- When ticket sales open. Null = open immediately when published.
  registration_close_at timestamp nullable     -- When ticket sales close. Null = closes at event start.
  is_free         boolean not_null default false -- Whether this is a free event (no paid tickets).

  -- Contact.
  contact_email   string nullable              -- Public contact email for attendee questions.
  website_url     string nullable              -- External website for the event.

  created_by      uuid not_null references users(id) on_delete restrict
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(series_id)                           -- "All events in this series."
    index(category_id)                         -- "All events in this category."
    index(venue_id)                            -- "All events at this venue."
    index(status, start_time)                  -- "Published events ordered by date" — the main listing query.
    index(visibility)                          -- Filter by visibility.
    index(start_time, end_time)                -- "Events in this date range."
    index(created_by)                          -- "Events created by this user."
    -- unique(slug) is already created by the field constraint above.
  }
}
```

**Design notes:**
- `status` and `visibility` are separate concerns: an event can be published but private (invitation only), or draft but public (will be visible when published).
- `registration_open_at` / `registration_close_at` define the ticket sale window independently of the event dates. This supports "early bird" windows and "last chance" cutoffs.
- `is_free` is denormalized for query convenience — can also be derived from ticket types, but many listing pages filter "free events."
- `cover_image_url` stores a URL rather than a file reference — the actual image may be hosted on a CDN, in the file-management domain, or externally.

### 5. event_organizers

Junction table linking users to events as organizers. Supports multiple organizers per event with different roles (owner, admin, moderator). The owner is the user who created the event; additional organizers can be added with different permission levels.

```pseudo
table event_organizers {
  id              uuid primary_key default auto_generate
  event_id        uuid not_null references events(id) on_delete cascade
  user_id         uuid not_null references users(id) on_delete cascade
  role            enum(owner, admin, moderator, check_in_staff) not_null default admin
                                               -- owner = full control, cannot be removed.
                                               -- admin = manage event, tickets, and attendees.
                                               -- moderator = manage content and sessions.
                                               -- check_in_staff = check-in only access.

  created_at      timestamp default now

  indexes {
    composite_unique(event_id, user_id)        -- One role per user per event.
    index(user_id)                             -- "All events this user organizes."
    -- composite_unique(event_id, user_id) covers index(event_id) via leading column.
  }
}
```

### 6. event_sessions

Individual sessions, talks, or workshops within a multi-session event (e.g., conference talks, festival stages, workshop tracks). Each session has its own timing, optional venue override, capacity, and speaker assignments. For single-session events, this table is unused — the event itself is the session.

```pseudo
table event_sessions {
  id              uuid primary_key default auto_generate
  event_id        uuid not_null references events(id) on_delete cascade
  venue_id        uuid nullable references venues(id) on_delete set_null
                                               -- Optional venue/room override. Null = use event's venue.
  title           string not_null              -- Session title (e.g., "Keynote: The Future of Web").
  description     string nullable              -- Session description.
  start_time      timestamp not_null           -- Session start (UTC).
  end_time        timestamp not_null           -- Session end (UTC).
  track           string nullable              -- Track or stage name (e.g., "Main Stage", "Workshop Room A").
  max_attendees   integer nullable             -- Session-level capacity limit. Null = unlimited.
  position        integer not_null default 0   -- Display order within the event schedule.
  status          enum(scheduled, cancelled, rescheduled) not_null default scheduled

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(event_id, start_time)                -- "Sessions for this event ordered by time" — schedule view.
    index(event_id, track)                     -- "Sessions on this track" — track-based filtering.
    index(status)                              -- Filter by session status.
  }
}
```

**Design notes:**
- `track` is a free-text string rather than a separate table — tracks are lightweight labels that vary by event and don't need their own lifecycle management.
- `venue_id` enables room-level scheduling for conferences where different sessions happen in different rooms, all within the same overall venue.

### 7. speakers

Reusable speaker/performer profiles. A speaker can participate in multiple events across the platform. Linked to specific sessions via the `session_speakers` junction table. Speaker profiles are independent of events — they persist across the platform.

```pseudo
table speakers {
  id              uuid primary_key default auto_generate
  user_id         uuid nullable references users(id) on_delete set_null
                                               -- Link to user account if the speaker has one. Null for external speakers.
  name            string not_null              -- Speaker display name.
  email           string nullable              -- Contact email (may differ from user account email).
  bio             string nullable              -- Speaker bio for event pages.
  title           string nullable              -- Professional title (e.g., "CTO at Acme Corp").
  company         string nullable              -- Organization name.
  avatar_url      string nullable              -- Profile image URL.
  website_url     string nullable              -- Personal website.
  twitter_handle  string nullable              -- Twitter/X handle (e.g., "@johndoe").
  linkedin_url    string nullable              -- LinkedIn profile URL.
  is_active       boolean not_null default true

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(user_id)                             -- "Speaker profile for this user."
    index(is_active)                           -- Filter active speakers.
  }
}
```

**Design notes:**
- `user_id` is nullable — external speakers (keynote speakers from other organizations) may not have accounts on the platform.
- Social links are stored as separate fields rather than JSON to enable direct querying and consistent display.

### 8. session_speakers

Junction table linking speakers to event sessions. Supports multiple speakers per session (panel discussions) and multiple sessions per speaker (keynote + workshop). Includes per-assignment role and display ordering.

```pseudo
table session_speakers {
  id              uuid primary_key default auto_generate
  session_id      uuid not_null references event_sessions(id) on_delete cascade
  speaker_id      uuid not_null references speakers(id) on_delete cascade
  role            enum(speaker, moderator, panelist, host, keynote) not_null default speaker
  position        integer not_null default 0   -- Display order within the session.

  created_at      timestamp default now

  indexes {
    composite_unique(session_id, speaker_id)   -- One role per speaker per session.
    index(speaker_id)                          -- "All sessions for this speaker."
    -- composite_unique(session_id, speaker_id) covers index(session_id) via leading column.
  }
}
```

### 9. ticket_types

Ticket tiers and pricing for an event. Each event can have multiple ticket types (General Admission, VIP, Early Bird, Student, etc.) with independent pricing, capacity, sale windows, and configuration. The ticket type defines what is sold; individual `tickets` are issued from these types.

```pseudo
table ticket_types {
  id              uuid primary_key default auto_generate
  event_id        uuid not_null references events(id) on_delete cascade

  name            string not_null              -- Ticket type name (e.g., "General Admission", "VIP", "Early Bird").
  description     string nullable              -- What's included (e.g., "Access to all talks + lunch").
  price           integer not_null default 0   -- Ticket price in smallest currency unit (cents). 0 = free tier.
  currency        string not_null default 'USD' -- ISO 4217 currency code.

  -- Capacity.
  quantity_total  integer nullable             -- Total tickets available for this type. Null = unlimited.
  quantity_sold   integer not_null default 0   -- Running count of tickets sold. Denormalized for performance.
  min_per_order   integer not_null default 1   -- Minimum tickets per order for this type.
  max_per_order   integer not_null default 10  -- Maximum tickets per order for this type.

  -- Sale window.
  sale_start_at   timestamp nullable           -- When this type goes on sale. Null = uses event's registration_open_at.
  sale_end_at     timestamp nullable           -- When sales end. Null = uses event's registration_close_at.

  -- Configuration.
  is_active       boolean not_null default true
  is_hidden       boolean not_null default false -- Hidden types are only accessible via promo codes or direct links.
  position        integer not_null default 0   -- Display order on the event page.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(event_id, position)                  -- "Ticket types for this event in display order."
    index(event_id, is_active)                 -- "Active ticket types for this event."
  }
}
```

**Design notes:**
- `quantity_sold` is denormalized for performance — computing sold count from `tickets` table on every page load is expensive for popular events. Updated atomically on ticket issuance.
- `sale_start_at` / `sale_end_at` override the event-level registration window per ticket type, enabling staggered releases (Early Bird available first, then GA).
- `is_hidden` supports "secret" ticket types revealed only via promo codes — a common pattern for sponsor tickets or private discounts.

### 10. promo_codes

Discount and promotional codes for events. Supports percentage and fixed-amount discounts with usage limits and validity windows. Promo codes can apply to all ticket types or be scoped to specific types via the `promo_code_ticket_types` junction.

```pseudo
table promo_codes {
  id              uuid primary_key default auto_generate
  event_id        uuid not_null references events(id) on_delete cascade
  code            string not_null              -- The code entered by the customer (e.g., "EARLYBIRD20"). Case-insensitive matching in app logic.
  discount_type   enum(percentage, fixed) not_null
                                               -- percentage = % off (e.g., 20% off).
                                               -- fixed = fixed amount off (e.g., $10 off).
  discount_value  integer not_null             -- Percentage (0-100 whole number) or fixed amount in smallest currency unit (cents).
  currency        string nullable              -- ISO 4217 code. Required when discount_type = fixed.

  -- Usage limits.
  max_uses        integer nullable             -- Maximum total redemptions. Null = unlimited.
  times_used      integer not_null default 0   -- Running count of redemptions.
  max_uses_per_order integer not_null default 1 -- How many tickets per order this code can discount.

  -- Validity window.
  valid_from      timestamp nullable           -- Code becomes active. Null = active immediately.
  valid_until     timestamp nullable           -- Code expires. Null = no expiration.
  is_active       boolean not_null default true

  -- Scope: if no promo_code_ticket_types rows exist, applies to ALL ticket types for this event.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    composite_unique(event_id, code)           -- Codes are unique within an event.
    index(is_active)                           -- Filter active promo codes.
    -- composite_unique(event_id, code) covers index(event_id) via leading column.
  }
}
```

**Design notes:**
- `code` uniqueness is per-event, not global — different events can use the same code string.
- `times_used` is denormalized for quick validation at checkout. Check `times_used < max_uses` atomically.
- Scope is implicit: if the `promo_code_ticket_types` junction has no rows for a promo code, it applies to all ticket types. If rows exist, only those types are eligible.

### 11. promo_code_ticket_types

Junction table scoping promo codes to specific ticket types. When a promo code has entries in this table, it can only be applied to the listed ticket types. When no entries exist, the promo code applies to all ticket types for the event.

```pseudo
table promo_code_ticket_types {
  id              uuid primary_key default auto_generate
  promo_code_id   uuid not_null references promo_codes(id) on_delete cascade
  ticket_type_id  uuid not_null references ticket_types(id) on_delete cascade

  created_at      timestamp default now

  indexes {
    composite_unique(promo_code_id, ticket_type_id) -- One entry per code per ticket type.
    index(ticket_type_id)                           -- "Which promo codes apply to this ticket type."
    -- composite_unique(promo_code_id, ticket_type_id) covers index(promo_code_id) via leading column.
  }
}
```

### 12. orders

Ticket purchase transactions. An order groups one or more order items (ticket type + quantity) into a single transaction with payment tracking. The order captures the buyer, payment status, and totals at purchase time.

```pseudo
table orders {
  id              uuid primary_key default auto_generate
  event_id        uuid not_null references events(id) on_delete restrict
  user_id         uuid not_null references users(id) on_delete restrict
                                               -- The user who placed the order. Restrict: preserve order records.
  promo_code_id   uuid nullable references promo_codes(id) on_delete set_null
                                               -- Promo code applied to this order. Set null if code deleted.

  -- Financials (snapshot at order time, in smallest currency unit).
  subtotal        integer not_null default 0   -- Total before discount, in smallest currency unit (cents).
  discount_amount integer not_null default 0   -- Discount applied via promo code, in smallest currency unit.
  total           integer not_null default 0   -- Final amount charged (subtotal - discount), in smallest currency unit.
  currency        string not_null default 'USD'

  -- Status.
  status          enum(pending, confirmed, cancelled, refunded) not_null default pending
                                               -- pending = awaiting payment.
                                               -- confirmed = payment received, tickets issued.
                                               -- cancelled = order cancelled before completion.
                                               -- refunded = payment returned after completion.
  payment_status  enum(not_required, pending, paid, refunded, partially_refunded, failed) not_null default pending
  payment_method  string nullable              -- Payment method used (e.g., "card", "paypal", "free").

  -- Buyer details (snapshot).
  buyer_name      string not_null              -- Full name at order time.
  buyer_email     string not_null              -- Email for order confirmation and tickets.

  cancelled_at    timestamp nullable
  refunded_at     timestamp nullable
  confirmed_at    timestamp nullable
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(event_id, status)                    -- "All confirmed orders for this event."
    index(user_id)                             -- "All orders by this user."
    index(status)                              -- Filter by order status.
    index(buyer_email)                         -- "Orders for this email" (for guest lookup).
  }
}
```

**Design notes:**
- `buyer_name` and `buyer_email` are snapshotted at order time — the buyer may change their account details later, but the order record should reflect who bought what and where to send the tickets.
- All monetary fields are stored as integers in the smallest currency unit (cents for USD) to avoid floating-point precision errors in financial calculations.
- `payment_status` is separate from `status` because an order can be confirmed with pending payment (e.g., invoice-based) or cancelled without ever being paid.

### 13. order_items

Individual line items within an order. Each item represents a quantity of a specific ticket type purchased, with the price snapshotted at purchase time. After order confirmation, individual `tickets` are generated from order items.

```pseudo
table order_items {
  id              uuid primary_key default auto_generate
  order_id        uuid not_null references orders(id) on_delete cascade
  ticket_type_id  uuid nullable references ticket_types(id) on_delete set_null
                                               -- The ticket type purchased. Set null if type deleted; snapshot fields preserve details.

  -- Snapshot at purchase time.
  ticket_type_name string not_null             -- Ticket type name at time of purchase.
  unit_price      integer not_null             -- Price per ticket in smallest currency unit (cents), at time of purchase.
  quantity        integer not_null             -- Number of tickets purchased of this type.
  subtotal        integer not_null             -- unit_price * quantity, in smallest currency unit.
  currency        string not_null

  created_at      timestamp default now

  indexes {
    index(order_id)                            -- "All items in this order."
    index(ticket_type_id)                      -- "All order items for this ticket type."
  }
}
```

### 14. tickets

Individual issued tickets — one per attendee per admission. Generated from order items after order confirmation. Each ticket has a unique code for scanning/check-in, tracks its holder (who may differ from the buyer via transfer), and maintains its own lifecycle status.

```pseudo
table tickets {
  id              uuid primary_key default auto_generate
  order_item_id   uuid not_null references order_items(id) on_delete restrict
  event_id        uuid not_null references events(id) on_delete restrict
  ticket_type_id  uuid nullable references ticket_types(id) on_delete set_null

  -- Ticket holder (current owner — may differ from buyer after transfer).
  holder_user_id  uuid nullable references users(id) on_delete set_null
  holder_name     string not_null              -- Current holder name.
  holder_email    string not_null              -- Current holder email (for communications and check-in lookup).

  -- Unique ticket identifier.
  ticket_code     string unique not_null       -- Unique scannable code (e.g., UUID, short code, or QR payload).

  -- Status.
  status          enum(valid, used, cancelled, transferred, expired) not_null default valid
                                               -- valid = active, can be used for check-in.
                                               -- used = already checked in (fully consumed).
                                               -- cancelled = ticket revoked (refund, cancellation).
                                               -- transferred = ownership moved to another user (new ticket created).
                                               -- expired = event has passed without check-in.

  checked_in_at   timestamp nullable           -- When the ticket was first checked in. Convenience denormalization from check_ins.
  cancelled_at    timestamp nullable

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(event_id, status)                    -- "Valid tickets for this event."
    index(holder_user_id)                      -- "All tickets held by this user."
    index(holder_email)                        -- "Tickets for this email" (for check-in lookup).
    index(order_item_id)                       -- "Tickets generated from this order item."
    -- unique(ticket_code) is already created by the field constraint above.
  }
}
```

**Design notes:**
- `holder_user_id` is nullable — guest attendees may not have accounts.
- `ticket_code` is a unique scannable identifier for check-in. Can be a short alphanumeric code, UUID, or QR code payload.
- `checked_in_at` is denormalized from the `check_ins` table for quick ticket status queries. The `check_ins` table provides full audit detail.

### 15. check_ins

Attendance records for event check-in. Each record represents a check-in action on a ticket, optionally for a specific session. Supports multiple check-ins per ticket for multi-session events (checked in to each session separately). Records the method and who performed the check-in.

```pseudo
table check_ins {
  id              uuid primary_key default auto_generate
  ticket_id       uuid not_null references tickets(id) on_delete cascade
  session_id      uuid nullable references event_sessions(id) on_delete set_null
                                               -- Null for event-level check-in; set for session-level check-in.
  checked_in_by   uuid nullable references users(id) on_delete set_null
                                               -- Staff member who performed the check-in. Null for self-service.
  method          enum(qr_scan, manual, self_service, auto) not_null default qr_scan
                                               -- How the check-in was performed.
  checked_in_at   timestamp default now        -- When the check-in occurred.

  indexes {
    index(ticket_id)                           -- "All check-ins for this ticket."
    index(session_id, checked_in_at)           -- "Check-ins for this session" — session attendance report.
  }
}
```

**Design notes:**
- Session-level check-in supports conferences where attendees scan in per talk (for CEU credits, popularity tracking, etc.).
- `method` tracks how check-in was done for analytics — QR scanning is most common, but manual override and self-service kiosks are also supported.

### 16. ticket_transfers

Transfer history for tickets. When a ticket holder transfers their ticket to another person, a record is created capturing the from/to details. The `tickets` table is updated with the new holder information. Provides an audit trail for ticket ownership changes.

```pseudo
table ticket_transfers {
  id              uuid primary_key default auto_generate
  ticket_id       uuid not_null references tickets(id) on_delete cascade

  -- From (original holder).
  from_user_id    uuid nullable references users(id) on_delete set_null
  from_name       string not_null              -- Original holder name (snapshot).
  from_email      string not_null              -- Original holder email (snapshot).

  -- To (new holder).
  to_user_id      uuid nullable references users(id) on_delete set_null
  to_name         string not_null              -- New holder name.
  to_email        string not_null              -- New holder email.

  transferred_at  timestamp default now
  notes           string nullable              -- Optional notes about the transfer.

  created_at      timestamp default now

  indexes {
    index(ticket_id)                           -- "Transfer history for this ticket."
    index(from_user_id)                        -- "Transfers sent by this user."
    index(to_user_id)                          -- "Transfers received by this user."
  }
}
```

### 17. waitlist_entries

Queue for sold-out events or ticket types. When a customer cannot purchase tickets because the event or a specific ticket type is sold out, they can join a waitlist. If capacity opens up (cancellations), waitlisted customers are notified in order.

```pseudo
table waitlist_entries {
  id              uuid primary_key default auto_generate
  event_id        uuid not_null references events(id) on_delete cascade
  ticket_type_id  uuid nullable references ticket_types(id) on_delete cascade
                                               -- Specific ticket type waitlisted for. Null = any available ticket.
  user_id         uuid nullable references users(id) on_delete cascade
                                               -- User account if registered. Null for guest waitlist entries.
  name            string not_null              -- Waitlist entrant name.
  email           string not_null              -- Email for notifications.
  quantity        integer not_null default 1   -- Number of tickets desired.

  status          enum(waiting, notified, converted, expired, cancelled) not_null default waiting
                                               -- waiting = in queue.
                                               -- notified = spot opened, user notified.
                                               -- converted = user purchased tickets from notification.
                                               -- expired = notification window expired.
                                               -- cancelled = user left the waitlist.

  notified_at     timestamp nullable           -- When the user was notified of availability.
  expires_at      timestamp nullable           -- Notification expiration time.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(event_id, ticket_type_id, status)    -- "Waiting entries for this event/ticket type."
    index(user_id)                             -- "All waitlist entries for this user."
    index(email, status)                       -- "Active waitlist entries for this email."
    index(status, notified_at)                 -- "Notified entries that may have expired."
  }
}
```

### 18. event_updates

Announcements and updates posted by organizers to event attendees. Used for schedule changes, logistical information, reminders, and post-event follow-ups. Updates can be published or drafted, and can target all attendees or specific ticket types.

```pseudo
table event_updates {
  id              uuid primary_key default auto_generate
  event_id        uuid not_null references events(id) on_delete cascade
  author_id       uuid not_null references users(id) on_delete restrict

  title           string not_null              -- Update title/subject line.
  body            string not_null              -- Update content (Markdown/HTML).
  is_published    boolean not_null default false -- Draft vs published.
  is_pinned       boolean not_null default false -- Pinned updates appear at the top.
  published_at    timestamp nullable           -- When the update was published.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(event_id, is_published, published_at) -- "Published updates for this event, newest first."
    index(author_id)                            -- "Updates authored by this user."
  }
}
```

## Relationships

```
venues              1 ──── * events                      (one venue hosts many events)
venues              1 ──── * event_sessions              (one venue/room hosts many sessions)
event_categories    1 ──── * events                      (one category has many events)
event_categories    1 ──── * event_categories             (self-referencing: parent-child hierarchy)
event_series        1 ──── * events                      (one series contains many events)
events              1 ──── * event_organizers             (one event has many organizers)
events              1 ──── * event_sessions               (one event has many sessions)
events              1 ──── * ticket_types                 (one event has many ticket types)
events              1 ──── * promo_codes                  (one event has many promo codes)
events              1 ──── * orders                       (one event has many orders)
events              1 ──── * tickets                      (one event has many tickets)
events              1 ──── * waitlist_entries              (one event has many waitlist entries)
events              1 ──── * event_updates                (one event has many updates)
event_sessions      1 ──── * session_speakers             (one session has many speakers)
event_sessions      1 ──── * check_ins                    (one session has many check-ins)
speakers            1 ──── * session_speakers             (one speaker appears in many sessions)
ticket_types        1 ──── * promo_code_ticket_types      (one ticket type in many promo code scopes)
ticket_types        1 ──── * order_items                  (one ticket type in many order items)
ticket_types        1 ──── * tickets                      (one ticket type for many tickets)
ticket_types        1 ──── * waitlist_entries              (one ticket type has many waitlist entries)
promo_codes         1 ──── * promo_code_ticket_types      (one promo code scoped to many ticket types)
promo_codes         1 ──── * orders                       (one promo code used in many orders)
orders              1 ──── * order_items                  (one order has many items)
order_items         1 ──── * tickets                      (one order item generates many tickets)
tickets             1 ──── * check_ins                    (one ticket has many check-ins)
tickets             1 ──── * ticket_transfers             (one ticket has many transfers)
users               1 ──── * event_organizers             (one user organizes many events)
users               1 ──── * events                       (one user creates many events)
users               1 ──── * orders                       (one user places many orders)
users               1 ──── * tickets                      (one user holds many tickets)
users               1 ──── * waitlist_entries              (one user has many waitlist entries)
users               1 ──── * speakers                     (one user may have a speaker profile)
users               1 ──── * event_updates                (one user authors many updates)
```

## Best Practices

- **Capacity enforcement**: Check `ticket_types.quantity_sold < ticket_types.quantity_total` atomically when issuing tickets. Use row-level locking or optimistic concurrency to prevent overselling.
- **Amounts in smallest currency unit**: Store all monetary values (price, subtotal, total, discount amounts) as integers in the smallest currency unit (cents for USD). Prevents floating-point precision errors in financial calculations.
- **Snapshot pricing**: Always capture price, currency, and ticket type name on `order_items` at purchase time. Ticket types may be repriced — order records must reflect what was charged.
- **Promo code validation**: At checkout, verify: `is_active = true`, `times_used < max_uses`, within `valid_from`/`valid_until` window, and the ticket type is eligible (check `promo_code_ticket_types` junction or allow all if no rows exist).
- **Ticket generation**: Generate individual `tickets` rows from `order_items` after payment confirmation. Each ticket gets a unique `ticket_code` for scanning.
- **Check-in flow**: Scan `ticket_code` → look up ticket → verify `status = 'valid'` → create `check_ins` row → optionally update `tickets.checked_in_at` and `tickets.status = 'used'`.
- **Transfer flow**: Create `ticket_transfers` row with from/to details → update `tickets.holder_*` fields → set old ticket status to `transferred` if issuing a new ticket, or just update holder if keeping the same ticket.
- **Waitlist processing**: When a ticket is cancelled or capacity increases, query `waitlist_entries WHERE status = 'waiting'` for the matching event/ticket type, ordered by `created_at ASC`. Notify the first entry and set `status = 'notified'` with an `expires_at` deadline.
- **Timezone handling**: Store all absolute times in UTC. Use `events.timezone` and `venues.timezone` for display and communication only.
- **Event lifecycle**: Events should transition through `draft → published → completed` (or `cancelled`/`postponed`). Only published events should appear in public listings.
- **Free events**: When `events.is_free = true`, create a single free ticket type with `price = 0`. The order flow still applies — it just has a zero total.

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
