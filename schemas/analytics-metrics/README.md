# Analytics / Metrics

> Event tracking, session management, user identification, funnels, goals, dashboards, metrics definitions, pre-aggregated rollups, A/B experiments, and campaign attribution.

## Overview

A comprehensive analytics and metrics schema covering the full lifecycle of user behavior tracking — from raw event ingestion through aggregation and visualization. Supports product analytics (Mixpanel/Amplitude-style event tracking), web analytics (page views, sessions, campaigns), business intelligence (metric definitions, rollups, dashboards), and experimentation (A/B tests with variant assignments and results).

Designed from a study of 12+ systems: product analytics platforms (PostHog, Mixpanel, Amplitude, Heap), traffic analytics (Segment, GA4 BigQuery export), self-hosted analytics (Matomo, Umami, Plausible), metrics/BI layers (dbt MetricFlow, Cube.js, Looker), and A/B testing platforms (LaunchDarkly, Statsig, Optimizely).

Key architectural decisions: event-centric append-only log as the universal foundation, pre-aggregated rollups for dashboard performance (Matomo's two-tier pattern), semantic metrics layer for reusable metric definitions (dbt/Cube.js pattern), and exposure-based experiment tracking for clean causal inference.

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (20 tables)</summary>

- [Analytics / Metrics](#analytics--metrics)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Dependencies](#dependencies)
  - [Tables](#tables)
    - [Core Event Tracking](#core-event-tracking)
    - [User & Session Management](#user--session-management)
    - [Goals & Funnels](#goals--funnels)
    - [Campaign Attribution](#campaign-attribution)
    - [Metrics & Aggregation](#metrics--aggregation)
    - [Dashboards & Visualization](#dashboards--visualization)
    - [A/B Experiments](#ab-experiments)
  - [Schema](#schema)
    - [`event_types`](#event_types)
    - [`events`](#events)
    - [`event_properties`](#event_properties)
    - [`page_views`](#page_views)
    - [`anonymous_ids`](#anonymous_ids)
    - [`sessions`](#sessions)
    - [`goals`](#goals)
    - [`funnels`](#funnels)
    - [`funnel_steps`](#funnel_steps)
    - [`campaigns`](#campaigns)
    - [`metric_definitions`](#metric_definitions)
    - [`metric_rollups`](#metric_rollups)
    - [`saved_reports`](#saved_reports)
    - [`dashboards`](#dashboards)
    - [`dashboard_widgets`](#dashboard_widgets)
    - [`experiments`](#experiments)
    - [`experiment_variants`](#experiment_variants)
    - [`experiment_assignments`](#experiment_assignments)
    - [`experiment_results`](#experiment_results)
    - [`experiment_goals`](#experiment_goals)
  - [Relationships](#relationships)
    - [One-to-Many](#one-to-many)
    - [Many-to-Many (via junction)](#many-to-many-via-junction)
  - [Best Practices](#best-practices)
  - [Formats](#formats)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users` | User identity for event attribution, dashboard ownership, experiment management |

## Tables

### Core Event Tracking

- `event_types` — Registry of known event types with metadata
- `events` — Append-only event log (the universal analytics foundation)
- `event_properties` — Key-value properties attached to events (EAV pattern)
- `page_views` — Dedicated page view tracking with URL, referrer, and viewport data

### User & Session Management

- `anonymous_ids` — Maps anonymous device/browser IDs to known users
- `sessions` — User sessions with duration, page count, and entry/exit tracking

### Goals & Funnels

- `goals` — Conversion goals (event-based or page-view-based targets)
- `funnels` — Named multi-step conversion funnels
- `funnel_steps` — Ordered steps within a funnel

### Campaign Attribution

- `campaigns` — UTM campaign tracking with source, medium, and content

### Metrics & Aggregation

- `metric_definitions` — Semantic metrics layer (reusable metric formulas)
- `metric_rollups` — Pre-aggregated metric values by time period
- `saved_reports` — Saved query configurations for reusable reports

### Dashboards & Visualization

- `dashboards` — Dashboard containers with layout and sharing settings
- `dashboard_widgets` — Individual widgets/panels within a dashboard

### A/B Experiments

- `experiments` — A/B test definitions with hypothesis and traffic allocation
- `experiment_variants` — Variants (control/treatment) within an experiment
- `experiment_assignments` — User-to-variant assignments for experiment exposure
- `experiment_results` — Aggregated statistical results per variant per metric
- `experiment_goals` — Links experiments to the goals they measure

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### `event_types`

Registry of known event types. Provides a catalog of all trackable events with metadata
for documentation, categorization, and validation. Events reference this table to ensure
consistent naming. Inspired by Mixpanel's event taxonomy and Amplitude's event types.

```pseudo
table event_types {
  id            uuid primary_key default auto_generate
  name          string unique not_null               -- Machine-readable event name (e.g., "button_clicked", "page_viewed").
                                                     -- Snake_case convention. Unique prevents duplicate definitions.
  category      string nullable                      -- Grouping category (e.g., "engagement", "commerce", "navigation").
  display_name  string not_null                      -- Human-readable label (e.g., "Button Clicked", "Page Viewed").
  description   string nullable                      -- What this event represents and when it fires.
  is_active     boolean not_null default true         -- Whether this event type is currently being tracked.
                                                     -- Inactive types are hidden from UI but historical data is preserved.
  schema        json nullable                        -- Expected property schema for validation.
                                                     -- e.g., {"button_id": "string", "page": "string"}
  created_at    timestamp default now
  updated_at    timestamp default now on_update
}

indexes {
  index(category)                                    -- "All engagement events" — filter by category.
  index(is_active)                                   -- "All active event types."
}
```

**Design notes:**
- Separate table (not inline strings) enables event governance, documentation, and schema validation.
- `schema` field stores expected property structure for optional runtime validation of event payloads.

### `events`

The core analytics event log. Append-only — events are never updated or deleted.
Each row represents a single user action or system occurrence with timestamp, user context,
and session linkage. This is the universal foundation that all analytics queries build on.
Inspired by Segment's track calls, GA4's event model, and PostHog's events table.

```pseudo
table events {
  id            uuid primary_key default auto_generate
  event_type_id uuid not_null references event_types(id) on_delete restrict
                                                     -- What happened. Restrict: can't delete event types with recorded events.
  user_id       uuid nullable references users(id) on_delete set_null
                                                     -- Identified user. Null for anonymous events.
                                                     -- Set null: preserve event history if user is deleted.
  anonymous_id  string nullable                      -- Client-generated ID for anonymous tracking (cookie/device ID).
                                                     -- Used until the user is identified.
  session_id    uuid nullable references sessions(id) on_delete set_null
                                                     -- Session this event belongs to. Null for server-side events.

  -- Context
  timestamp     timestamp not_null                   -- When the event occurred (client-reported or server time).
  ip_address    string nullable                      -- Client IP. Nullable for server-side events. Used for geo-enrichment.
  user_agent    string nullable                      -- Raw User-Agent string for device/browser parsing.
  device_type   string nullable                      -- Parsed device category (e.g., "desktop", "mobile", "tablet").
  os            string nullable                      -- Parsed operating system (e.g., "Windows 11", "iOS 17").
  browser       string nullable                      -- Parsed browser (e.g., "Chrome 120", "Safari 17").
  country       string nullable                      -- ISO 3166-1 alpha-2 country code from geo-IP lookup.
  region        string nullable                      -- State/province/region from geo-IP lookup.
  city          string nullable                      -- City from geo-IP lookup.
  locale        string nullable                      -- User's locale (e.g., "en-US", "fr-FR").

  -- Source attribution
  referrer      string nullable                      -- HTTP Referer header. Where the user came from.
  campaign_id   uuid nullable references campaigns(id) on_delete set_null
                                                     -- UTM campaign attribution. Null for organic traffic.

  -- Extensible properties (denormalized for hot-path queries)
  properties    json nullable                        -- Event-specific key-value data (e.g., {"button_id": "signup", "plan": "pro"}).
                                                     -- Duplicates data in event_properties for query performance.

  created_at    timestamp default now                -- Server-side ingestion time (distinct from event timestamp).
}

indexes {
  index(event_type_id)                               -- "All click events."
  index(user_id, timestamp)                          -- "All events for this user, ordered by time."
  index(session_id)                                  -- "All events in this session."
  index(timestamp)                                   -- Time-range scans for dashboards and reports.
  index(campaign_id)                                 -- "All events attributed to this campaign."
  index(anonymous_id)                                -- "All events from this anonymous visitor."
  index(country)                                     -- Geographic filtering.
}
```

**Design notes:**
- Append-only: no `updated_at`. Events are immutable facts.
- `timestamp` is the business time (when it happened); `created_at` is ingestion time (when we received it).
- `properties` JSON provides denormalized hot-path access; `event_properties` table provides normalized querying.
- Both `user_id` and `anonymous_id` exist to support the identification lifecycle (anonymous → identified).

### `event_properties`

Normalized key-value properties for events. EAV (Entity-Attribute-Value) pattern enables
indexed queries on specific property values (e.g., "all events where plan = pro") without
scanning JSON. Complements the denormalized `properties` JSON on the events table.

```pseudo
table event_properties {
  id            uuid primary_key default auto_generate
  event_id      uuid not_null references events(id) on_delete cascade
                                                     -- The event this property belongs to.
                                                     -- Cascade: deleting an event removes its properties.
  key           string not_null                      -- Property name (e.g., "button_id", "plan", "page_url").
  value         string not_null                      -- Property value as text. Application-layer type coercion
                                                     -- based on the event_type's schema definition.

  created_at    timestamp default now
}

indexes {
  unique(event_id, key)                              -- One value per key per event.
  index(key, value)                                  -- "All events where plan = pro" — the primary EAV query pattern.
}
```

### `page_views`

Dedicated page view tracking. While page views could be stored as events with properties,
a dedicated table enables optimized queries for web analytics dashboards (top pages, bounce
rate, viewport analysis). Inspired by Umami's page_view table and GA4's page_view event.

```pseudo
table page_views {
  id            uuid primary_key default auto_generate
  event_id      uuid nullable references events(id) on_delete set_null
                                                     -- Link to the events table for unified querying.
                                                     -- Nullable: page views can exist independently.
  user_id       uuid nullable references users(id) on_delete set_null
  anonymous_id  string nullable                      -- Anonymous visitor tracking.
  session_id    uuid nullable references sessions(id) on_delete set_null

  url           string not_null                      -- Full page URL (e.g., "https://example.com/pricing").
  path          string not_null                      -- URL path only (e.g., "/pricing"). Indexed for aggregation.
  title         string nullable                      -- HTML page title at time of view.
  referrer      string nullable                      -- Where the user came from (HTTP Referer).
  hostname      string not_null                      -- Domain name (e.g., "example.com"). Supports multi-domain tracking.

  -- Viewport and screen data
  viewport_width  integer nullable                   -- Browser viewport width in pixels.
  viewport_height integer nullable                   -- Browser viewport height in pixels.
  screen_width    integer nullable                   -- Device screen width in pixels.
  screen_height   integer nullable                   -- Device screen height in pixels.

  -- Duration
  duration      integer nullable                     -- Time spent on page in seconds (computed on next navigation).
                                                     -- Null for the last page in a session (no exit event).

  timestamp     timestamp not_null                   -- When the page was viewed.
  created_at    timestamp default now
}

indexes {
  index(user_id, timestamp)                          -- "All pages viewed by this user."
  index(session_id)                                  -- "All pages in this session."
  index(path)                                        -- "How many views does /pricing have?"
  index(hostname, path)                              -- Multi-domain page aggregation.
  index(timestamp)                                   -- Time-range queries for dashboards.
  index(anonymous_id)                                -- "All pages viewed by this anonymous visitor."
}
```

### `anonymous_ids`

Maps anonymous browser/device identifiers to known users. Enables the identification
lifecycle: a visitor browses anonymously, then signs up or logs in, and their historical
events are retroactively attributed. Inspired by Segment's identify call and Mixpanel's
alias/identify pattern.

```pseudo
table anonymous_ids {
  id            uuid primary_key default auto_generate
  anonymous_id  string not_null                      -- Client-generated anonymous identifier (cookie, device ID, fingerprint).
  user_id       uuid not_null references users(id) on_delete cascade
                                                     -- The identified user this anonymous ID maps to.
                                                     -- Cascade: deleting a user removes their identity mappings.
  first_seen_at timestamp not_null                   -- When this anonymous ID was first observed.
  identified_at timestamp not_null                   -- When the anonymous ID was linked to the user.
  created_at    timestamp default now
}

indexes {
  unique(anonymous_id, user_id)                      -- One mapping per anonymous ID per user.
  index(user_id)                                     -- "All anonymous IDs for this user."
  index(anonymous_id)                                -- "Which user does this anonymous ID belong to?"
}
```

### `sessions`

User sessions with duration, engagement metrics, and entry/exit tracking.
Sessions group related events into a single visit. Uses the industry-standard 30-minute
inactivity timeout for session boundaries. Inspired by GA4's session model, Umami's
session table, and Matomo's visit tracking.

```pseudo
table sessions {
  id            uuid primary_key default auto_generate
  user_id       uuid nullable references users(id) on_delete set_null
                                                     -- Identified user. Null for anonymous sessions.
  anonymous_id  string nullable                      -- Anonymous visitor tracking.

  -- Timing
  started_at    timestamp not_null                   -- Session start time (first event timestamp).
  ended_at      timestamp nullable                   -- Session end time (last event timestamp). Null for active sessions.
  duration      integer nullable                     -- Session duration in seconds. Null for single-event sessions.

  -- Engagement metrics (denormalized for dashboard performance)
  page_count    integer not_null default 0            -- Number of pages viewed in this session.
  event_count   integer not_null default 0            -- Total events fired in this session.
  is_bounce     boolean not_null default true         -- Whether the session had only one page view.
                                                     -- Updated to false when a second page is viewed.

  -- Entry and exit
  entry_url     string nullable                      -- First page URL in the session.
  exit_url      string nullable                      -- Last page URL in the session. Updated on each page view.

  -- Context (captured at session start)
  ip_address    string nullable
  user_agent    string nullable
  device_type   string nullable                      -- "desktop", "mobile", "tablet"
  os            string nullable
  browser       string nullable
  country       string nullable                      -- ISO 3166-1 alpha-2
  region        string nullable
  city          string nullable
  locale        string nullable

  -- Attribution
  referrer      string nullable                      -- External referrer at session start.
  campaign_id   uuid nullable references campaigns(id) on_delete set_null

  created_at    timestamp default now
  updated_at    timestamp default now on_update
}

indexes {
  index(user_id, started_at)                         -- "All sessions for this user, ordered by time."
  index(anonymous_id)                                -- "All sessions for this anonymous visitor."
  index(started_at)                                  -- Time-range queries for dashboards.
  index(campaign_id)                                 -- "All sessions from this campaign."
  index(country)                                     -- Geographic session analysis.
  index(is_bounce)                                   -- Bounce rate calculations.
}
```

### `goals`

Conversion goals — measurable outcomes that matter to the business. A goal defines
what counts as a conversion: viewing a specific page, firing a specific event, or matching
a custom condition. Used by funnels and experiments to measure success. Inspired by
Matomo's Goals, GA4's conversions, and Plausible's goals.

```pseudo
table goals {
  id            uuid primary_key default auto_generate
  name          string not_null                      -- Human-readable goal name (e.g., "Signup Completed", "Purchase Made").
  description   string nullable                      -- Explain what this goal measures and why it matters.
  goal_type     enum(event, page_view, custom) not_null
                                                     -- event: fires when a specific event_type occurs.
                                                     -- page_view: fires when a specific URL pattern is visited.
                                                     -- custom: fires based on a custom condition (evaluated in app logic).
  event_type_id uuid nullable references event_types(id) on_delete set_null
                                                     -- For event-based goals: which event type triggers the goal.
  url_pattern   string nullable                      -- For page_view goals: URL pattern to match (e.g., "/thank-you*").
  value         decimal nullable                     -- Optional monetary value per conversion (e.g., 9.99 for a purchase).
  is_active     boolean not_null default true
  created_by    uuid not_null references users(id) on_delete restrict
  created_at    timestamp default now
  updated_at    timestamp default now on_update
}

indexes {
  index(goal_type)                                   -- "All event-based goals."
  index(event_type_id)                               -- "Goals triggered by this event type."
  index(is_active)                                   -- "All active goals."
  index(created_by)                                  -- "Goals created by this user."
}
```

### `funnels`

Named multi-step conversion funnels. A funnel defines an ordered sequence of steps
a user should complete (e.g., Visit → Sign Up → Activate → Purchase). Funnel analysis
shows where users drop off. Inspired by Mixpanel's Funnels, Amplitude's Funnel Analysis,
and PostHog's Funnels.

```pseudo
table funnels {
  id            uuid primary_key default auto_generate
  name          string not_null                      -- Funnel name (e.g., "Onboarding Funnel", "Purchase Flow").
  description   string nullable                      -- What this funnel measures.
  conversion_window integer not_null default 86400   -- Max seconds between first and last step to count as conversion.
                                                     -- Default: 24 hours (86400 seconds).
  is_active     boolean not_null default true
  created_by    uuid not_null references users(id) on_delete restrict
  created_at    timestamp default now
  updated_at    timestamp default now on_update
}

indexes {
  index(is_active)
  index(created_by)
}
```

### `funnel_steps`

Ordered steps within a funnel. Each step references an event type that the user must
complete. Steps are ordered by `step_order` (1-based). A user "converts" through a funnel
when they complete all steps in order within the conversion window.

```pseudo
table funnel_steps {
  id            uuid primary_key default auto_generate
  funnel_id     uuid not_null references funnels(id) on_delete cascade
                                                     -- Which funnel this step belongs to.
                                                     -- Cascade: deleting a funnel removes all its steps.
  event_type_id uuid not_null references event_types(id) on_delete restrict
                                                     -- The event that satisfies this step.
  step_order    integer not_null                     -- Position in the funnel (1, 2, 3, ...).
  name          string nullable                      -- Optional display name override (default: use event_type's display_name).
  created_at    timestamp default now
}

indexes {
  unique(funnel_id, step_order)                      -- Step order is unique within a funnel.
  unique(funnel_id, event_type_id)                   -- Each event type appears at most once per funnel.
}
```

### `campaigns`

UTM campaign tracking. Stores the standard UTM parameters for marketing attribution.
Each campaign record represents a unique combination of source/medium/campaign that drives
traffic. Inspired by GA4's campaign dimensions and Segment's campaign context.

```pseudo
table campaigns {
  id            uuid primary_key default auto_generate
  name          string not_null                      -- Campaign name (utm_campaign). e.g., "spring_sale_2024".
  source        string not_null                      -- Traffic source (utm_source). e.g., "google", "newsletter".
  medium        string not_null                      -- Marketing medium (utm_medium). e.g., "cpc", "email", "social".
  term          string nullable                      -- Paid search keywords (utm_term).
  content       string nullable                      -- Ad variant identifier (utm_content). For A/B testing ads.
  landing_url   string nullable                      -- The target URL this campaign drives to.
  is_active     boolean not_null default true
  created_by    uuid not_null references users(id) on_delete restrict
  created_at    timestamp default now
  updated_at    timestamp default now on_update
}

indexes {
  unique(source, medium, name)                       -- A campaign is uniquely identified by source + medium + name.
  index(is_active)
  index(created_by)
}
```

### `metric_definitions`

Semantic metrics layer — reusable metric formulas. Defines what a metric measures,
how it's computed, and what event type it's based on. Inspired by dbt's MetricFlow,
Cube.js measures, and Looker's LookML measures. Metrics are referenced by dashboards,
reports, and experiments.

```pseudo
table metric_definitions {
  id            uuid primary_key default auto_generate
  name          string unique not_null               -- Machine-readable metric key (e.g., "daily_active_users", "revenue_per_user").
  display_name  string not_null                      -- Human-readable label (e.g., "Daily Active Users", "Revenue Per User").
  description   string nullable                      -- What this metric measures, how to interpret it.
  aggregation   enum(count, sum, average, min, max, count_unique, percentile) not_null
                                                     -- How to aggregate the metric's values.
  event_type_id uuid nullable references event_types(id) on_delete set_null
                                                     -- The event type this metric is based on. Null for custom/composite metrics.
  property_key  string nullable                      -- Which event property to aggregate (e.g., "revenue", "duration").
                                                     -- Null for count-based metrics.
  filters       json nullable                        -- Pre-defined filters applied to the metric.
                                                     -- e.g., {"country": "US", "plan": "pro"}
  unit          string nullable                      -- Display unit (e.g., "users", "dollars", "seconds", "%").
  format        string nullable                      -- Display format hint (e.g., "number", "currency", "percentage", "duration").
  is_active     boolean not_null default true
  created_by    uuid not_null references users(id) on_delete restrict
  created_at    timestamp default now
  updated_at    timestamp default now on_update
}

indexes {
  -- unique(name) is already created by the field constraint above.
  index(event_type_id)                               -- "All metrics based on this event type."
  index(aggregation)                                 -- "All count-based metrics."
  index(is_active)
  index(created_by)
}
```

### `metric_rollups`

Pre-aggregated metric values by time period. Stores computed metric values at various
granularities (hourly, daily, weekly, monthly) for fast dashboard rendering without
re-querying raw events. Inspired by Matomo's archive tables, Cube.js pre-aggregations,
and TimescaleDB continuous aggregates.

```pseudo
table metric_rollups {
  id            uuid primary_key default auto_generate
  metric_id     uuid not_null references metric_definitions(id) on_delete cascade
                                                     -- Which metric this rollup is for.
                                                     -- Cascade: deleting a metric removes its rollup data.
  granularity   enum(hourly, daily, weekly, monthly) not_null
                                                     -- Time bucket size for this rollup.
  period_start  timestamp not_null                   -- Start of the time bucket (e.g., 2024-01-15 00:00:00 for a daily rollup).
  period_end    timestamp not_null                   -- End of the time bucket (exclusive).
  value         decimal not_null                     -- The aggregated metric value for this period.
  count         bigint not_null default 0            -- Number of raw events/records that contributed to this value.
  dimensions    json nullable                        -- Optional dimension breakdown.
                                                     -- e.g., {"country": "US", "device_type": "mobile"}
                                                     -- Null = total (no breakdown).
  computed_at   timestamp not_null                   -- When this rollup was last computed. For staleness detection.
  created_at    timestamp default now
}

indexes {
  unique(metric_id, granularity, period_start, dimensions)  -- One rollup per metric per period per dimension combo.
  index(metric_id, granularity, period_start)        -- "Daily values for this metric" — the primary dashboard query.
  index(period_start)                                -- Time-range scans across all metrics.
}
```

**Design notes:**
- Append-only-ish: rollups are recomputed (upserted), not updated in place. No `updated_at`.
- `dimensions` JSON enables multi-dimensional rollups (by country, device, plan, etc.) in a single table.

### `saved_reports`

Saved query configurations for reusable reports. Stores the full query definition
(metric, filters, date range, breakdown dimensions) so users can revisit analyses
without rebuilding them. Inspired by Mixpanel's saved reports and GA4's saved explorations.

```pseudo
table saved_reports {
  id            uuid primary_key default auto_generate
  name          string not_null                      -- Report name (e.g., "Weekly Revenue by Country").
  description   string nullable
  config        json not_null                        -- Full query configuration.
                                                     -- e.g., {"metrics": [...], "filters": {...}, "date_range": "last_30d", "group_by": ["country"]}
  visibility    enum(private, team, public) not_null default private
                                                     -- Who can see this report.
                                                     -- private = creator only. team = organization. public = all users.
  created_by    uuid not_null references users(id) on_delete cascade
                                                     -- Cascade: deleting a user removes their saved reports.
  created_at    timestamp default now
  updated_at    timestamp default now on_update
}

indexes {
  index(created_by)                                  -- "My saved reports."
  index(visibility)                                  -- "All public reports."
}
```

### `dashboards`

Dashboard containers with layout configuration and sharing settings.
A dashboard is a collection of widgets arranged in a grid layout. Inspired by
Grafana dashboards, Mixpanel boards, and Amplitude dashboards.

```pseudo
table dashboards {
  id            uuid primary_key default auto_generate
  name          string not_null                      -- Dashboard title (e.g., "Product Overview", "Marketing KPIs").
  description   string nullable
  layout        json nullable                        -- Grid layout configuration.
                                                     -- e.g., {"columns": 12, "rowHeight": 80}
  visibility    enum(private, team, public) not_null default private
  is_default    boolean not_null default false        -- Whether this is the default dashboard for the org/user.
  refresh_interval integer nullable                  -- Auto-refresh interval in seconds. Null = manual refresh.
  created_by    uuid not_null references users(id) on_delete restrict
  created_at    timestamp default now
  updated_at    timestamp default now on_update
}

indexes {
  index(created_by)                                  -- "My dashboards."
  index(visibility)                                  -- "All public dashboards."
  index(is_default)                                  -- "Find the default dashboard."
}
```

### `dashboard_widgets`

Individual widgets/panels within a dashboard. Each widget visualizes a metric
or query result in a specific chart type. Positioned via a grid coordinate system.

```pseudo
table dashboard_widgets {
  id            uuid primary_key default auto_generate
  dashboard_id  uuid not_null references dashboards(id) on_delete cascade
                                                     -- Which dashboard this widget belongs to.
                                                     -- Cascade: deleting a dashboard removes all its widgets.
  metric_id     uuid nullable references metric_definitions(id) on_delete set_null
                                                     -- The metric this widget displays. Null for custom query widgets.
  title         string nullable                      -- Widget title override. Null = use metric's display_name.
  chart_type    enum(line, bar, area, pie, number, table, funnel, map) not_null default line
                                                     -- Visualization type.
  config        json nullable                        -- Widget-specific configuration.
                                                     -- e.g., {"date_range": "last_7d", "filters": {...}, "colors": [...]}
  position_x    integer not_null default 0           -- Grid column position (0-based).
  position_y    integer not_null default 0           -- Grid row position (0-based).
  width         integer not_null default 6           -- Widget width in grid units.
  height        integer not_null default 4           -- Widget height in grid units.
  created_at    timestamp default now
  updated_at    timestamp default now on_update
}

indexes {
  index(dashboard_id)                                -- "All widgets in this dashboard."
  index(metric_id)                                   -- "All widgets showing this metric."
}
```

### `experiments`

A/B test definitions. Each experiment tests a hypothesis by splitting traffic
across variants and measuring the impact on one or more goals. Inspired by LaunchDarkly's
experiments, Statsig's experiments, and Optimizely's experiment model.

```pseudo
table experiments {
  id            uuid primary_key default auto_generate
  name          string not_null                      -- Experiment name (e.g., "New Checkout Flow v2").
  description   string nullable
  hypothesis    string nullable                      -- What you expect to happen (e.g., "New checkout will increase conversion by 10%").
  status        enum(draft, running, paused, completed) not_null default draft
  traffic_percentage decimal not_null default 1.0    -- Fraction of eligible traffic included (0.0-1.0).
                                                     -- 1.0 = 100% of traffic, 0.5 = 50%, etc.
  started_at    timestamp nullable                   -- When the experiment started running.
  ended_at      timestamp nullable                   -- When the experiment was stopped.
  created_by    uuid not_null references users(id) on_delete restrict
  created_at    timestamp default now
  updated_at    timestamp default now on_update
}

indexes {
  index(status)                                      -- "All running experiments."
  index(created_by)                                  -- "Experiments created by this user."
}
```

### `experiment_variants`

Variants within an experiment (control and treatment groups). Each experiment
has at least two variants: a control (baseline) and one or more treatments.
Traffic is split across variants according to their weight.

```pseudo
table experiment_variants {
  id            uuid primary_key default auto_generate
  experiment_id uuid not_null references experiments(id) on_delete cascade
                                                     -- Which experiment this variant belongs to.
                                                     -- Cascade: deleting an experiment removes all its variants.
  name          string not_null                      -- Variant name (e.g., "Control", "Treatment A", "Treatment B").
  description   string nullable
  is_control    boolean not_null default false        -- Whether this is the baseline variant.
  weight        decimal not_null default 0.5          -- Traffic allocation weight (0.0-1.0). Weights across variants should sum to 1.0.
  config        json nullable                        -- Variant-specific configuration/payload.
                                                     -- e.g., {"button_color": "green", "layout": "v2"}
  created_at    timestamp default now
}

indexes {
  unique(experiment_id, name)                        -- Variant names are unique within an experiment.
  index(experiment_id)                               -- "All variants for this experiment."
}
```

### `experiment_assignments`

User-to-variant assignments. Records which variant each user was assigned to,
ensuring consistent experience and enabling exposure-based analysis. Assignment is
deterministic (based on user hash) and recorded on first exposure. Inspired by
Statsig's exposure logging and LaunchDarkly's experiment events.

```pseudo
table experiment_assignments {
  id            uuid primary_key default auto_generate
  experiment_id uuid not_null references experiments(id) on_delete cascade
  variant_id    uuid not_null references experiment_variants(id) on_delete cascade
  user_id       uuid nullable references users(id) on_delete set_null
  anonymous_id  string nullable                      -- For anonymous experiment participants.
  assigned_at   timestamp not_null                   -- When the user was first exposed to the variant.
  created_at    timestamp default now
}

indexes {
  unique(experiment_id, user_id)                     -- One assignment per user per experiment.
  index(experiment_id, variant_id)                   -- "All users in this variant."
  index(user_id)                                     -- "All experiments this user is in."
  index(assigned_at)                                 -- Time-range queries for exposure analysis.
}
```

### `experiment_results`

Aggregated statistical results per variant per metric. Stores the computed
outcome of an experiment: sample size, mean, confidence interval, and statistical
significance. Updated periodically by a background analysis job. Inspired by
Optimizely's results API and Statsig's Pulse results.

```pseudo
table experiment_results {
  id            uuid primary_key default auto_generate
  experiment_id uuid not_null references experiments(id) on_delete cascade
  variant_id    uuid not_null references experiment_variants(id) on_delete cascade
  metric_id     uuid not_null references metric_definitions(id) on_delete cascade
  sample_size   bigint not_null default 0            -- Number of users/events in the sample.
  mean_value    decimal nullable                     -- Average metric value for this variant.
  stddev        decimal nullable                     -- Standard deviation.
  ci_lower      decimal nullable                     -- 95% confidence interval lower bound.
  ci_upper      decimal nullable                     -- 95% confidence interval upper bound.
  p_value       decimal nullable                     -- Statistical significance (p-value vs control).
  lift          decimal nullable                     -- Relative change vs control (e.g., 0.12 = +12%).
  is_significant boolean not_null default false      -- Whether the result is statistically significant (p < 0.05).
  computed_at   timestamp not_null                   -- When these results were last computed.
  created_at    timestamp default now
  updated_at    timestamp default now on_update
}

indexes {
  unique(experiment_id, variant_id, metric_id)       -- One result per variant per metric per experiment.
  index(experiment_id)                               -- "All results for this experiment."
}
```

### `experiment_goals`

Links experiments to the goals they measure. An experiment can track multiple
goals (primary and secondary). This junction table enables many-to-many between
experiments and goals.

```pseudo
table experiment_goals {
  id            uuid primary_key default auto_generate
  experiment_id uuid not_null references experiments(id) on_delete cascade
  goal_id       uuid not_null references goals(id) on_delete cascade
  is_primary    boolean not_null default false        -- Whether this is the experiment's primary success metric.
                                                     -- Each experiment should have exactly one primary goal.
  created_at    timestamp default now
}

indexes {
  unique(experiment_id, goal_id)                     -- A goal can only be linked once per experiment.
  index(goal_id)                                     -- "All experiments measuring this goal."
}
```

## Relationships

### One-to-Many

```
event_types      1 ──── * events                (one event type has many recorded events)
event_types      1 ──── * funnel_steps           (one event type used in many funnel steps)
event_types      1 ──── * goals                  (one event type triggers many goals)
event_types      1 ──── * metric_definitions     (one event type feeds many metrics)
events           1 ──── * event_properties       (one event has many properties)
events           1 ──── * page_views             (one event links to one page view)
users            1 ──── * events                 (one user generates many events)
users            1 ──── * sessions               (one user has many sessions)
users            1 ──── * anonymous_ids           (one user has many anonymous IDs)
users            1 ──── * goals                  (one user creates many goals)
users            1 ──── * funnels                (one user creates many funnels)
users            1 ──── * campaigns              (one user creates many campaigns)
users            1 ──── * metric_definitions     (one user creates many metrics)
users            1 ──── * saved_reports          (one user creates many reports)
users            1 ──── * dashboards             (one user creates many dashboards)
users            1 ──── * experiments            (one user creates many experiments)
users            1 ──── * experiment_assignments (one user has many experiment assignments)
sessions         1 ──── * events                 (one session contains many events)
sessions         1 ──── * page_views             (one session has many page views)
campaigns        1 ──── * events                 (one campaign attributes many events)
campaigns        1 ──── * sessions               (one campaign attributes many sessions)
funnels          1 ──── * funnel_steps            (one funnel has many steps)
dashboards       1 ──── * dashboard_widgets       (one dashboard has many widgets)
metric_definitions 1 ── * metric_rollups          (one metric has many rollup entries)
metric_definitions 1 ── * dashboard_widgets       (one metric shown in many widgets)
metric_definitions 1 ── * experiment_results      (one metric measured in many experiments)
experiments      1 ──── * experiment_variants     (one experiment has many variants)
experiments      1 ──── * experiment_assignments  (one experiment has many user assignments)
experiments      1 ──── * experiment_results      (one experiment has many results)
experiments      1 ──── * experiment_goals        (one experiment tracks many goals)
experiment_variants 1 ── * experiment_assignments (one variant has many user assignments)
experiment_variants 1 ── * experiment_results     (one variant has many result entries)
```

### Many-to-Many (via junction)

```
experiments    * ──── * goals    (via experiment_goals)
```

## Best Practices

- **Append-only events**: Never update or delete events. They are immutable facts. Use `created_at` for ingestion time and `timestamp` for business time.
- **Pre-aggregate for dashboards**: Use `metric_rollups` to pre-compute metric values at various granularities. Dashboard queries should read rollups, not scan raw events.
- **Anonymous → identified lifecycle**: Use `anonymous_ids` to link pre-signup behavior to users after identification. Backfill events when a user is identified.
- **Session timeout**: Use a 30-minute inactivity window (industry standard) to define session boundaries. Sessions are created and updated as events arrive.
- **UTM discipline**: Enforce the standard 5 UTM parameters (source, medium, campaign, term, content) in the `campaigns` table. Don't add custom UTM fields — use `events.properties` for campaign-specific data.
- **Experiment hygiene**: Every experiment should have exactly one primary goal (via `experiment_goals.is_primary`). Start with a hypothesis. Don't peek at results before reaching statistical significance.
- **Metric definitions as code**: Treat `metric_definitions` as a semantic layer. Define metrics once, use everywhere (dashboards, reports, experiments). Avoid ad-hoc metric calculations in application code.

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
