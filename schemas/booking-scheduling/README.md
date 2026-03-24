# Booking / Scheduling

> Appointment booking and scheduling with services, providers, availability management, and booking lifecycle.

## Overview

A complete booking and scheduling schema supporting service-based appointment booking with provider management, flexible availability rules, group bookings, custom intake forms, and waitlists. Covers the full booking lifecycle from service discovery through scheduling, confirmation, completion, cancellation, and no-show tracking.

Designed from a study of 10+ real implementations: scheduling platforms (Calendly, Cal.com, Acuity Scheduling, SimplyBook.me, Setmore), appointment APIs (Square Appointments, Microsoft Bookings), open-source systems (Easy!Appointments, Amelia), and the iCalendar specification (RFC 5545).

Key design decisions:
- **Time-range availability** over slot-based — availability is modeled as weekly rules with date-specific overrides; slot computation is an application concern
- **Provider-service junction** — many-to-many relationship between providers and services, supporting per-pairing overrides (custom price, duration)
- **Rich booking lifecycle** — pending → confirmed → completed, with declined, cancelled, and no_show states for full workflow coverage
- **Capacity-based group bookings** — `max_attendees` on services with a `booking_attendees` table tracks individual participants
- **Buffer times on services** — `buffer_before` and `buffer_after` (in minutes) prevent back-to-back scheduling, following Microsoft Bookings and Acuity patterns
- **Custom intake fields** — configurable per-service questions with typed responses, enabling flexible booking forms without schema changes
- **Payment status tracking** — `payment_status` on bookings tracks whether the booking is paid without owning payment processing (handled by external billing domain or provider)
- **Recurring booking support** — `recurrence_group_id` links recurring instances; `recurrence_rule` (RFC 5545 RRULE) stores the recurrence pattern on the first instance

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (17 tables)</summary>

- [`service_categories`](#1-service_categories)
- [`services`](#2-services)
- [`service_addons`](#3-service_addons)
- [`locations`](#4-locations)
- [`providers`](#5-providers)
- [`provider_services`](#6-provider_services)
- [`provider_locations`](#7-provider_locations)
- [`schedules`](#8-schedules)
- [`schedule_rules`](#9-schedule_rules)
- [`schedule_overrides`](#10-schedule_overrides)
- [`custom_fields`](#11-custom_fields)
- [`bookings`](#12-bookings)
- [`booking_attendees`](#13-booking_attendees)
- [`booking_services`](#14-booking_services)
- [`booking_custom_field_answers`](#15-booking_custom_field_answers)
- [`booking_reminders`](#16-booking_reminders)
- [`waitlist_entries`](#17-waitlist_entries)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users` | User identity for providers, booking creators, and attendees |

> **Payment processing** is handled externally (e.g., a billing/payments domain or direct payment provider integration). The `payment_status` field on bookings tracks the booking's payment state without owning payment records.

## Tables

### Core Resources
- `service_categories` — Grouping and categorization of services
- `services` — Bookable services with duration, price, buffer times, and capacity
- `service_addons` — Optional add-on extras for services (additional time and price)
- `locations` — Physical or virtual locations where services are delivered
- `providers` — Staff or professionals who deliver services
- `provider_services` — Many-to-many linking providers to services with optional overrides
- `provider_locations` — Many-to-many linking providers to locations

### Availability
- `schedules` — Named availability schedules owned by a provider
- `schedule_rules` — Weekly recurring availability rules (day-of-week + time range)
- `schedule_overrides` — Date-specific exceptions to regular schedule

### Booking Configuration
- `custom_fields` — Custom intake questions configurable per service

### Bookings
- `bookings` — The actual reservations with full lifecycle tracking
- `booking_attendees` — Individual attendees for group bookings
- `booking_services` — Services and addons included in a booking
- `booking_custom_field_answers` — Responses to custom intake questions
- `booking_reminders` — Scheduled reminders for upcoming bookings
- `waitlist_entries` — Queue for fully-booked time slots

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. service_categories

Hierarchical grouping of services for organization and display. Supports nesting via `parent_id` for multi-level categorization (e.g., "Hair" → "Cuts", "Coloring"). Used for filtering and browsing services on the booking page.

```pseudo
table service_categories {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Display name (e.g., "Hair", "Spa", "Consulting").
  slug            string unique not_null       -- URL-safe identifier for the category.
  description     string nullable              -- Optional description shown on booking pages.
  parent_id       uuid nullable references service_categories(id) on_delete set_null
                                               -- Self-referencing for nested categories. Null = top-level category.
  position        integer not_null default 0   -- Display order within the same parent level.
  is_active       boolean not_null default true -- Inactive categories are hidden from booking pages.
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(parent_id)                           -- "All subcategories of this category."
    index(is_active, position)                 -- "Active categories in display order."
    -- unique(slug) is already created by the field constraint above.
  }
}
```

**Design notes:**
- `slug` enables SEO-friendly URLs for service category pages.
- `position` allows manual ordering within each level of the hierarchy.
- Self-referencing `parent_id` supports unlimited nesting depth, though 2-3 levels is typical.

### 2. services

The core bookable entity — what customers select when making a booking. Each service defines its duration, price, buffer times, and capacity. Services are assigned to providers via the `provider_services` junction table and grouped via `service_categories`.

```pseudo
table services {
  id              uuid primary_key default auto_generate
  category_id     uuid nullable references service_categories(id) on_delete set_null
  name            string not_null              -- Service name (e.g., "30-Minute Consultation", "Deep Tissue Massage").
  slug            string unique not_null       -- URL-safe identifier.
  description     string nullable              -- Detailed description shown on booking page.

  -- Timing.
  duration        integer not_null             -- Service duration in minutes (e.g., 30, 60, 90).
  buffer_before   integer not_null default 0   -- Minutes of padding before the appointment. Prevents back-to-back.
  buffer_after    integer not_null default 0   -- Minutes of padding after the appointment.

  -- Pricing.
  price           decimal nullable             -- Base price. Null = free or "contact for pricing."
  currency        string nullable              -- ISO 4217 currency code (e.g., "USD", "EUR"). Null when price is null.

  -- Capacity for group bookings.
  max_attendees   integer not_null default 1   -- Maximum participants per booking. 1 = individual, >1 = group/class.
  min_attendees   integer not_null default 1   -- Minimum participants needed. Useful for classes that need a quorum.

  -- Scheduling policy.
  min_notice      integer not_null default 0   -- Minimum advance notice in minutes. Prevents last-minute bookings.
  max_advance     integer not_null default 43200  -- Maximum advance booking in minutes. Default = 30 days.
  slot_interval   integer nullable             -- Time slot interval in minutes for availability display. Null = use duration.

  -- Visibility.
  is_active       boolean not_null default true -- Inactive services are hidden from booking pages.
  is_private      boolean not_null default false -- Private services require a direct link to book.

  color           string nullable              -- Hex color for calendar display (e.g., "#4A90D9").

  created_by      uuid not_null references users(id) on_delete restrict
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(category_id)                         -- "All services in this category."
    index(is_active, is_private)               -- "Active public services" (the main booking page query).
    index(created_by)                          -- "Services created by this user."
    -- unique(slug) is already created by the field constraint above.
  }
}
```

**Design notes:**
- `buffer_before` and `buffer_after` are stored separately (not a single `padding`) because pre-appointment prep and post-appointment cleanup often differ in duration.
- `slot_interval` controls how availability is displayed. A 60-minute service with `slot_interval = 15` shows slots at 9:00, 9:15, 9:30, etc. Null means slots match the service duration.
- `min_notice` and `max_advance` define the booking window. These follow Microsoft Bookings' `minimumLeadTime` and `maximumAdvance` scheduling policy pattern.
- `price` is nullable to support free services and "contact for pricing" scenarios. `currency` is only meaningful when price is set.

### 3. service_addons

Optional add-on extras that can be booked alongside a parent service. Add-ons add time and/or cost to the base service but cannot be booked independently. Examples: "Deep conditioning" added to a haircut, "Extra 15 minutes" added to a massage. Follows the Acuity Scheduling add-on pattern.

```pseudo
table service_addons {
  id              uuid primary_key default auto_generate
  service_id      uuid not_null references services(id) on_delete cascade
                                               -- The parent service this addon belongs to.
  name            string not_null              -- Addon name (e.g., "Deep Conditioning Treatment").
  description     string nullable              -- Optional description.
  duration        integer not_null default 0   -- Additional minutes added to the appointment.
  price           decimal not_null default 0   -- Additional cost. 0 = free addon.
  currency        string nullable              -- ISO 4217 code. Null when price is 0.
  position        integer not_null default 0   -- Display order within the parent service.
  is_active       boolean not_null default true
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(service_id, position)                -- "Addons for this service in display order."
    index(is_active)                           -- Filter active addons.
  }
}
```

### 4. locations

Physical or virtual locations where services are delivered. A business may operate from multiple locations (e.g., "Downtown Office", "Satellite Clinic") or offer virtual services (video call, phone). Providers are assigned to locations via the `provider_locations` junction.

```pseudo
table locations {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Location name (e.g., "Main Office", "Virtual").
  slug            string unique not_null       -- URL-safe identifier.
  type            enum(physical, virtual) not_null default physical
  description     string nullable

  -- Address fields (for physical locations).
  address_line1   string nullable
  address_line2   string nullable
  city            string nullable
  state           string nullable
  postal_code     string nullable
  country         string nullable              -- ISO 3166-1 alpha-2 code (e.g., "US", "GB").

  -- Virtual location details.
  virtual_url     string nullable              -- Meeting link for virtual locations (e.g., Zoom URL).

  timezone        string not_null              -- IANA timezone (e.g., "America/New_York"). Used for availability calculation.
  phone           string nullable
  email           string nullable

  is_active       boolean not_null default true
  position        integer not_null default 0   -- Display order.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(type)                                -- "All physical locations" or "All virtual locations."
    index(is_active, position)                 -- "Active locations in display order."
    -- unique(slug) is already created by the field constraint above.
  }
}
```

**Design notes:**
- `timezone` is required on locations, not optional. All availability calculations anchor to the location's timezone.
- Physical and virtual locations share the same table. Virtual locations leave address fields null and set `virtual_url`.
- Address is flattened into inline fields rather than a separate `addresses` table — locations are a single-address entity.

### 5. providers

Staff members or professionals who deliver services. Each provider references a user from the auth-rbac domain and adds booking-specific fields like bio, timezone, and active status. Providers are linked to services and locations via junction tables.

```pseudo
table providers {
  id              uuid primary_key default auto_generate
  user_id         uuid unique not_null references users(id) on_delete cascade
                                               -- One provider record per user. Cascade: if user is deleted, remove provider profile.
  display_name    string not_null              -- Name shown on booking pages. May differ from the user's account name.
  bio             string nullable              -- Provider bio/description for the booking page.
  avatar_url      string nullable              -- Profile image URL.
  timezone        string not_null              -- IANA timezone. Used for availability display and schedule management.
  phone           string nullable              -- Direct contact phone.
  email           string nullable              -- Booking-specific email (may differ from user's account email).

  is_active       boolean not_null default true -- Inactive providers don't appear on booking pages.
  is_accepting    boolean not_null default true -- Whether the provider is currently accepting new bookings. Can be toggled independently of is_active.
  position        integer not_null default 0   -- Display order on booking pages.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    -- unique(user_id) is already created by the field constraint above.
    index(is_active, is_accepting)             -- "Active providers accepting bookings."
    index(is_active, position)                 -- "Active providers in display order."
  }
}
```

**Design notes:**
- `is_active` vs `is_accepting`: A provider can be active (visible) but not accepting new bookings (e.g., on vacation, fully booked this month). This two-flag pattern avoids hiding the provider's profile entirely.
- `user_id` is unique — one provider profile per user. The provider record adds booking-specific fields that don't belong on the core `users` table.

### 6. provider_services

Junction table linking providers to services. Defines which providers can deliver which services, with optional per-pairing overrides for price and duration. For example, a senior stylist might charge more or take longer for the same haircut service.

```pseudo
table provider_services {
  id              uuid primary_key default auto_generate
  provider_id     uuid not_null references providers(id) on_delete cascade
  service_id      uuid not_null references services(id) on_delete cascade

  -- Optional per-provider overrides. Null = use the service defaults.
  custom_price    decimal nullable             -- Override price for this provider-service pair.
  custom_duration integer nullable             -- Override duration in minutes.

  is_active       boolean not_null default true -- Can deactivate a specific provider-service pairing.

  created_at      timestamp default now

  composite_unique(provider_id, service_id)    -- One record per provider per service.
}

indexes {
  index(service_id)                            -- "All providers for this service."
  -- composite_unique(provider_id, service_id) covers index(provider_id) via leading column.
}
```

**Design notes:**
- `custom_price` and `custom_duration` allow per-provider pricing without duplicating the service definition. The application falls back to `services.price` and `services.duration` when these are null.

### 7. provider_locations

Junction table linking providers to locations. Defines which providers work at which locations. A provider may work at multiple locations on different days.

```pseudo
table provider_locations {
  id              uuid primary_key default auto_generate
  provider_id     uuid not_null references providers(id) on_delete cascade
  location_id     uuid not_null references locations(id) on_delete cascade
  is_primary      boolean not_null default false -- Whether this is the provider's primary location.

  created_at      timestamp default now

  composite_unique(provider_id, location_id)   -- One record per provider per location.
}

indexes {
  index(location_id)                           -- "All providers at this location."
  -- composite_unique(provider_id, location_id) covers index(provider_id) via leading column.
}
```

### 8. schedules

Named availability schedules owned by a provider. A provider may have multiple schedules (e.g., "Regular Hours", "Summer Hours") and assign different schedules to different services. The schedule contains rules (weekly recurring) and overrides (date-specific exceptions). Follows the Cal.com Schedule model.

```pseudo
table schedules {
  id              uuid primary_key default auto_generate
  provider_id     uuid not_null references providers(id) on_delete cascade
  name            string not_null              -- Schedule name (e.g., "Regular Hours", "Weekend Only").
  timezone        string not_null              -- IANA timezone for this schedule's rules.
  is_default      boolean not_null default false -- Whether this is the provider's default schedule. Only one per provider should be true.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(provider_id)                         -- "All schedules for this provider."
    index(provider_id, is_default)             -- "Default schedule for this provider."
  }
}
```

**Design notes:**
- A provider can have multiple schedules but only one default. The default is used when a service doesn't specify a schedule.
- `timezone` is on the schedule (not inherited from the provider) because a provider might have different schedules in different timezones (e.g., traveling provider).

### 9. schedule_rules

Weekly recurring availability rules within a schedule. Each rule defines a day-of-week and a time window when the provider is available. Multiple rules per day support split shifts (e.g., 9:00-12:00 and 14:00-18:00 on Monday). Follows the Cal.com Availability model with day-of-week + time ranges.

```pseudo
table schedule_rules {
  id              uuid primary_key default auto_generate
  schedule_id     uuid not_null references schedules(id) on_delete cascade
  day_of_week     integer not_null             -- 0 = Sunday, 1 = Monday, ..., 6 = Saturday. Matches JavaScript Date.getDay().
  start_time      string not_null              -- Start time in HH:MM 24-hour format (e.g., "09:00").
  end_time        string not_null              -- End time in HH:MM 24-hour format (e.g., "17:00"). Must be after start_time.

  created_at      timestamp default now

  indexes {
    index(schedule_id, day_of_week)            -- "All availability windows for this schedule on this day."
  }
}
```

**Design notes:**
- Times are stored as strings in HH:MM format rather than full timestamps. These are clock times within the schedule's timezone, not absolute moments.
- Multiple rules per day support split shifts: a doctor available 9:00-12:00 and 14:00-17:00 on Monday has two rules.
- Day-of-week uses 0-6 (Sunday-Saturday) following JavaScript convention (most common in web apps).

### 10. schedule_overrides

Date-specific exceptions to a provider's regular weekly schedule. Overrides take precedence over rules for the specified date. Can add availability (e.g., working on a usually-off day) or block availability (e.g., holiday, personal day). Follows the Easy!Appointments working plan exceptions pattern.

```pseudo
table schedule_overrides {
  id              uuid primary_key default auto_generate
  schedule_id     uuid not_null references schedules(id) on_delete cascade
  override_date   string not_null              -- The specific date in YYYY-MM-DD format.
  start_time      string nullable              -- Available from (HH:MM). Null when is_available = false (entire day blocked).
  end_time        string nullable              -- Available until (HH:MM). Null when is_available = false.
  is_available    boolean not_null default true -- true = available during start_time-end_time (overrides normal unavailability).
                                               -- false = unavailable all day (overrides normal availability). start_time/end_time ignored.
  reason          string nullable              -- Why this override exists (e.g., "Holiday", "Training day").

  created_at      timestamp default now

  indexes {
    index(schedule_id, override_date)          -- "Overrides for this schedule on this date."
  }
}
```

**Design notes:**
- `override_date` is a string in YYYY-MM-DD format rather than a full timestamp. The date is interpreted in the schedule's timezone.
- `is_available = false` blocks the entire day regardless of start_time/end_time (they can be null). This handles holidays, sick days, vacation, etc.
- `is_available = true` with start_time/end_time adds a custom availability window that replaces the regular rules for that date.

### 11. custom_fields

Custom intake questions configurable per service. When a customer books a service, they're presented with these questions in addition to standard fields (name, email). Supports different field types (text, textarea, select, checkbox, etc.). Follows the Calendly/Microsoft Bookings custom questions pattern.

```pseudo
table custom_fields {
  id              uuid primary_key default auto_generate
  service_id      uuid not_null references services(id) on_delete cascade
  label           string not_null              -- Question text (e.g., "What's the reason for your visit?").
  field_type      enum(text, textarea, select, multi_select, checkbox, number, date, phone, email) not_null
  placeholder     string nullable              -- Placeholder text for input fields.
  is_required     boolean not_null default false -- Whether the customer must answer this question.
  options         json nullable                -- For select/multi_select: array of option strings (e.g., ["New patient", "Returning patient"]).
  position        integer not_null default 0   -- Display order within the service's form.
  is_active       boolean not_null default true

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(service_id, position)                -- "Custom fields for this service in display order."
  }
}
```

**Design notes:**
- `options` is stored as JSON because the number and content of options varies per field. Only used for `select` and `multi_select` types.
- `field_type` includes common form field types. The application validates responses based on this type.

### 12. bookings

The central table — an actual reservation made by a customer for a service with a provider at a specific time. Tracks the full lifecycle: pending → confirmed → completed, with declined, cancelled, and no_show terminal states. Supports both individual and group bookings (capacity tracked via `booking_attendees`).

```pseudo
table bookings {
  id              uuid primary_key default auto_generate
  provider_id     uuid not_null references providers(id) on_delete restrict
                                               -- The provider delivering the service. Restrict: don't delete providers with bookings.
  location_id     uuid nullable references locations(id) on_delete set_null
                                               -- Where the booking takes place. Null for provider-default location.
  customer_id     uuid not_null references users(id) on_delete restrict
                                               -- The user who made the booking. Restrict: preserve booking records.
  schedule_id     uuid nullable references schedules(id) on_delete set_null
                                               -- Which schedule was used for availability. Informational; null if schedule deleted.

  -- Timing.
  start_time      timestamp not_null           -- Appointment start (UTC).
  end_time        timestamp not_null           -- Appointment end (UTC). Computed from service duration + addons.
  timezone        string not_null              -- Customer's IANA timezone at booking time. For display/communication purposes.

  -- Status lifecycle.
  status          enum(pending, confirmed, completed, cancelled, declined, no_show) not_null default pending
                                               -- pending = awaiting provider confirmation.
                                               -- confirmed = accepted, scheduled.
                                               -- completed = service was delivered.
                                               -- cancelled = cancelled by customer or provider (see cancelled_by).
                                               -- declined = provider rejected the booking request.
                                               -- no_show = customer did not attend.

  -- Cancellation/decline details.
  cancelled_by    uuid nullable references users(id) on_delete set_null
                                               -- Who cancelled or declined. Null when status is not cancelled/declined.
  cancellation_reason string nullable          -- Free-text reason for cancellation or decline.
  cancelled_at    timestamp nullable           -- When the cancellation/decline occurred.

  -- Notes.
  customer_notes  string nullable              -- Notes from the customer at booking time.
  provider_notes  string nullable              -- Internal notes from the provider. Not visible to the customer.

  -- Payment tracking (actual payment processing is handled externally).
  payment_status  enum(not_required, pending, paid, refunded, partially_refunded) not_null default not_required
                                               -- not_required = free service or pay-at-venue.
                                               -- pending = payment expected but not yet received.
                                               -- paid = payment confirmed.
                                               -- refunded / partially_refunded = after cancellation.

  -- Source tracking.
  source          enum(online, manual, api, import) not_null default online
                                               -- online = customer booked via web/app.
                                               -- manual = provider created the booking manually.
                                               -- api = created via API integration.
                                               -- import = imported from external system.

  -- Recurring booking linkage.
  recurrence_group_id uuid nullable            -- Groups recurring booking instances. All bookings in a recurring series share the same group ID.
  recurrence_rule string nullable              -- RRULE string (RFC 5545) on the first instance only (e.g., "FREQ=WEEKLY;BYDAY=TU;COUNT=10").

  confirmed_at    timestamp nullable           -- When the booking was confirmed.
  completed_at    timestamp nullable           -- When the booking was marked complete.
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(provider_id, start_time)             -- "Bookings for this provider, ordered by time" — the provider's calendar view.
    index(customer_id, start_time)             -- "Bookings for this customer, ordered by time" — the customer's booking history.
    index(status)                              -- "All pending bookings" (for confirmation queue).
    index(start_time, end_time)                -- "Bookings in this time range" (for availability checking / conflict detection).
    index(location_id)                         -- "Bookings at this location."
    index(recurrence_group_id)                 -- "All bookings in this recurring series."
  }
}
```

**Design notes:**
- `start_time` and `end_time` are stored in UTC. The `timezone` field preserves the customer's local timezone for display in emails and receipts.
- `cancelled_by` distinguishes customer-initiated vs. provider-initiated cancellations (important for cancellation policies and analytics).
- `provider_id` and `customer_id` use `on_delete restrict` — deleting a user who has bookings should be blocked, not cascade-delete the booking history.
- `source` tracks how the booking was created, useful for analytics and conversion tracking.
- `payment_status` tracks whether the booking has been paid without owning payment processing logic. Actual payment records live in a billing/payments domain or payment provider — this field is the booking's view of that state.
- `recurrence_group_id` links recurring booking instances (e.g., weekly therapy sessions). The first instance stores the `recurrence_rule` (RFC 5545 RRULE format); the application expands the rule into individual booking rows that share the group ID.

### 13. booking_attendees

Individual attendees for group bookings. For 1-on-1 bookings, the customer on the booking IS the sole attendee and no rows are needed here. For group bookings (classes, workshops), each participant gets a row. Supports per-attendee status tracking (confirmed, cancelled, no_show).

```pseudo
table booking_attendees {
  id              uuid primary_key default auto_generate
  booking_id      uuid not_null references bookings(id) on_delete cascade
  user_id         uuid nullable references users(id) on_delete set_null
                                               -- The attendee's user account. Null for guest attendees (not registered).
  name            string not_null              -- Attendee name (always stored, even for registered users, as a snapshot).
  email           string not_null              -- Attendee email.
  phone           string nullable

  status          enum(confirmed, cancelled, no_show) not_null default confirmed
                                               -- Individual attendee status. A group booking can have mixed statuses.

  cancelled_at    timestamp nullable
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(booking_id)                          -- "All attendees for this booking."
    index(user_id)                             -- "All bookings this user is attending."
    index(email)                               -- "All bookings for this email" (for guest lookup).
  }
}
```

**Design notes:**
- `user_id` is nullable to support guest attendees who don't have an account. Name and email are always stored as a snapshot to avoid joins and survive user deletion.
- Individual status per attendee supports partial group attendance — some attendees can cancel without affecting the whole booking.

### 14. booking_services

Services (and addons) included in a booking. A booking can include one primary service and zero or more addons. Each row records the service/addon used, along with the price and duration at the time of booking (snapshot values that don't change if the service is later updated).

```pseudo
table booking_services {
  id              uuid primary_key default auto_generate
  booking_id      uuid not_null references bookings(id) on_delete cascade
  service_id      uuid nullable references services(id) on_delete set_null
                                               -- The service. Set null if service is deleted; booking record preserves snapshot.
  addon_id        uuid nullable references service_addons(id) on_delete set_null
                                               -- The addon, if this row is an addon. Null for primary services.

  -- Snapshot at booking time (won't change if service/addon is later updated).
  service_name    string not_null              -- Name at time of booking.
  duration        integer not_null             -- Duration in minutes at time of booking.
  price           decimal nullable             -- Price at time of booking. Null = free.
  currency        string nullable

  is_primary      boolean not_null default true -- true = primary service, false = addon.
  position        integer not_null default 0   -- Display order.

  created_at      timestamp default now

  indexes {
    index(booking_id)                          -- "All services/addons in this booking."
    index(service_id)                          -- "All bookings using this service."
  }
}
```

**Design notes:**
- `service_name`, `duration`, `price`, and `currency` are snapshot values captured at booking time. This ensures booking records remain accurate even if the service is later renamed, repriced, or deleted.
- `is_primary` distinguishes the main service from addons. A booking has exactly one primary service and zero or more addons.

### 15. booking_custom_field_answers

Responses to custom intake questions for a booking. Each row stores one answer to one custom field. Linked to both the booking and the custom field definition.

```pseudo
table booking_custom_field_answers {
  id              uuid primary_key default auto_generate
  booking_id      uuid not_null references bookings(id) on_delete cascade
  custom_field_id uuid not_null references custom_fields(id) on_delete cascade
  value           string not_null              -- The answer as a string. For multi_select, stored as JSON array string.

  created_at      timestamp default now

  composite_unique(booking_id, custom_field_id) -- One answer per booking per custom field.
}

indexes {
  index(custom_field_id)                       -- "All answers for this custom field" (for analytics).
  -- composite_unique(booking_id, custom_field_id) covers index(booking_id) via leading column.
}
```

### 16. booking_reminders

Scheduled reminders for upcoming bookings. Each reminder defines when to send a notification relative to the booking start time. The actual notification delivery is handled by the notifications-system domain — this table only defines the schedule. Supports multiple reminders per booking (e.g., 24 hours before and 1 hour before).

```pseudo
table booking_reminders {
  id              uuid primary_key default auto_generate
  booking_id      uuid not_null references bookings(id) on_delete cascade
  remind_at       timestamp not_null           -- When the reminder should be sent (UTC). Pre-computed from booking start_time minus offset.
  type            enum(customer, provider, all) not_null default customer
                                               -- Who receives the reminder.
  offset_minutes  integer not_null             -- How many minutes before the booking this reminder fires. Stored for reference (remind_at is the computed value).
  status          enum(pending, sent, failed, cancelled) not_null default pending

  sent_at         timestamp nullable           -- When the reminder was actually sent.
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(booking_id)                          -- "All reminders for this booking."
    index(status, remind_at)                   -- "Pending reminders due before this time" — the reminder worker query.
  }
}
```

**Design notes:**
- `remind_at` is pre-computed (booking start_time minus offset_minutes) to enable a simple worker query: `SELECT * FROM booking_reminders WHERE status = 'pending' AND remind_at <= NOW()`.
- `offset_minutes` is stored alongside `remind_at` for display purposes ("Reminder: 24 hours before your appointment").

### 17. waitlist_entries

Queue for fully-booked time slots. When a customer's desired time is unavailable, they can join the waitlist. If a booking is cancelled, the next waitlisted customer can be notified and offered the slot. Entries are ordered by creation time (first come, first served).

```pseudo
table waitlist_entries {
  id              uuid primary_key default auto_generate
  service_id      uuid not_null references services(id) on_delete cascade
  provider_id     uuid nullable references providers(id) on_delete cascade
                                               -- Preferred provider. Null = any available provider.
  customer_id     uuid not_null references users(id) on_delete cascade
  location_id     uuid nullable references locations(id) on_delete set_null

  -- Desired time window.
  preferred_date  string not_null              -- Preferred date in YYYY-MM-DD format.
  preferred_start string nullable              -- Preferred earliest start time (HH:MM). Null = any time.
  preferred_end   string nullable              -- Preferred latest start time (HH:MM). Null = any time.

  status          enum(waiting, notified, booked, expired, cancelled) not_null default waiting
                                               -- waiting = in the queue.
                                               -- notified = slot opened, customer notified.
                                               -- booked = customer accepted and booking created.
                                               -- expired = notification expired without response.
                                               -- cancelled = customer cancelled their waitlist entry.

  notified_at     timestamp nullable           -- When the customer was notified of availability.
  expires_at      timestamp nullable           -- When the notification expires (customer must respond by this time).
  notes           string nullable              -- Optional notes from the customer.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(service_id, preferred_date, status)  -- "Waitlisted customers for this service on this date."
    index(customer_id, status)                 -- "This customer's active waitlist entries."
    index(status, notified_at)                 -- "Notified entries that may have expired."
  }
}
```

**Design notes:**
- `preferred_date` is a string (YYYY-MM-DD) rather than a timestamp. Combined with optional `preferred_start` and `preferred_end`, it lets customers express time preferences flexibly.
- The lifecycle is: `waiting` → `notified` (when a slot opens) → `booked` (if they accept) or `expired` (if they don't respond in time).
- `provider_id` is nullable — customers can waitlist for a specific provider or "any available provider."

## Relationships

```
service_categories   1 ──── * services                     (one category has many services)
service_categories   1 ──── * service_categories            (self-referencing: parent-child hierarchy)
services             1 ──── * service_addons                (one service has many addons)
services             1 ──── * provider_services             (one service offered by many providers)
services             1 ──── * custom_fields                 (one service has many custom fields)
services             1 ──── * booking_services              (one service appears in many bookings)
services             1 ──── * waitlist_entries              (one service has many waitlist entries)
providers            1 ──── * provider_services             (one provider offers many services)
providers            1 ──── * provider_locations            (one provider works at many locations)
providers            1 ──── * schedules                     (one provider has many schedules)
providers            1 ──── * bookings                      (one provider has many bookings)
providers            1 ──── * waitlist_entries              (one provider has many waitlist entries)
locations            1 ──── * provider_locations            (one location has many providers)
locations            1 ──── * bookings                      (one location has many bookings)
schedules            1 ──── * schedule_rules                (one schedule has many weekly rules)
schedules            1 ──── * schedule_overrides            (one schedule has many date overrides)
bookings             1 ──── * booking_attendees             (one booking has many attendees)
bookings             1 ──── * booking_services              (one booking includes many services/addons)
bookings             1 ──── * booking_custom_field_answers  (one booking has many answers)
bookings             1 ──── * booking_reminders             (one booking has many reminders)
custom_fields        1 ──── * booking_custom_field_answers  (one field has many answers across bookings)
users                1 ──── * providers                     (one user has one provider profile)
users                1 ──── * bookings                      (one user has many bookings as customer)
users                1 ──── * booking_attendees             (one user attends many bookings)
users                1 ──── * waitlist_entries              (one user has many waitlist entries)
```

## Best Practices

- **Availability computation**: Calculate available slots at query time by intersecting schedule rules (minus overrides) with existing bookings (conflict detection). Don't pre-compute and store slots — they become stale immediately.
- **Double-booking prevention**: Use `start_time`/`end_time` overlap queries with row-level locking or optimistic concurrency to prevent double-booking the same provider at the same time.
- **Buffer time**: When checking availability, include `buffer_before` and `buffer_after` in the occupied window. A 60-minute service with 15-minute buffers occupies a 90-minute window.
- **Timezone handling**: Store all absolute times in UTC. Use the `timezone` fields on locations, schedules, and bookings for display/conversion only.
- **Snapshot values**: Always snapshot service name, price, and duration onto `booking_services` at booking time. Service definitions change — booking records must reflect what was booked, not the current service state.
- **Soft cancellation**: Never hard-delete bookings. Use the `cancelled` status with `cancelled_by` and `cancellation_reason` for audit trails and analytics.
- **Reminder worker**: Run a periodic job that queries `booking_reminders WHERE status = 'pending' AND remind_at <= NOW()` to fire reminders. Update status to `sent` or `failed`.
- **Waitlist processing**: When a booking is cancelled, query `waitlist_entries` for matching service/provider/date with `status = 'waiting'` ordered by `created_at ASC`. Notify the first match.
- **Payment integration**: Update `payment_status` via webhooks from your payment provider (Stripe, Square, etc.). The booking schema tracks *whether* payment happened, not *how* — payment records and refund logic live in the billing/payments domain.
- **Recurring bookings**: Store the RRULE on the first instance, then expand it into individual booking rows sharing the same `recurrence_group_id`. To cancel a series, query by `recurrence_group_id`. To modify "this and future," create a new group ID from the modification point forward.

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
