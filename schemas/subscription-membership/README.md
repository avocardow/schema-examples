# Subscription / Membership

> Subscription plans, pricing, billing lifecycle, invoices, payment methods, coupons, and provider webhook sync for recurring billing.

## Overview

A complete subscription and membership billing schema covering the consumer side of recurring payments: defining plans with flexible pricing, managing subscription lifecycles (trials, active billing, pauses, cancellations), storing invoice history, tracking payment methods, applying coupon discounts, and syncing state with external billing providers via webhooks.

Designed from a study of 10 real implementations: billing platforms (Stripe Billing, Chargebee, Recurly, Paddle, Braintree/PayPal, Zuora), membership systems (Memberful, Ghost Memberships), e-commerce subscriptions (WooCommerce Subscriptions), and consumer-side frameworks (Laravel Cashier, Lemon Squeezy).

Key design decisions:
- **Consumer-side focus** — this schema is for apps that *use* billing providers (Stripe, Chargebee, Paddle), not for building a billing provider. Every table stores enough local state for entitlement checks and billing history display, with provider IDs for webhook-driven sync.
- **Plan/Price split** — the universal consensus pattern (Stripe, Paddle, Chargebee, Recurly). Plans describe what you sell; prices define how much and how often. One plan can have multiple prices (monthly vs annual, multi-currency, different tiers).
- **Multi-line subscriptions via subscription items** — a subscription contains one or more items, each referencing a price. Supports base plan + add-ons in a single subscription, following the Stripe/Chargebee/Paddle pattern.
- **Billing customer entity** — a dedicated `customers` table linking to auth-rbac `users` or `organizations`. Billing needs its own customer record for provider sync, default payment method, billing email, and tax ID — separate from the identity model.
- **Multi-provider support** — every syncable table has `provider_type` + `provider_id` columns rather than single-provider assumptions (e.g., `stripe_id`). Apps can switch providers or use multiple providers simultaneously.
- **Invoice storage with line items** — local copies of invoices for billing history display, receipt generation, and analytics. Provider is the source of truth, but apps need to display invoices without API calls.
- **Unified subscription status lifecycle** — a consensus enum across all studied providers: `trialing`, `active`, `past_due`, `paused`, `canceled`, `expired`, `incomplete`. Combined with grace period timestamps (`canceled_at` + `ends_at`) for nuanced access decisions.
- **Tokenized payment methods** — stores provider tokens, card brand, and last four digits for display. Never stores raw card numbers (PCI compliance).
- **Usage metering delegated** — usage tracking lives in the [SaaS / Multi-tenant](../saas-multi-tenant) domain (`usage_events`, `usage_summaries`). This domain records that a price is usage-based; the actual metering happens elsewhere.

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (11 tables)</summary>

- [`customers`](#1-customers)
- [`payment_methods`](#2-payment_methods)
- [`plans`](#3-plans)
- [`plan_prices`](#4-plan_prices)
- [`subscriptions`](#5-subscriptions)
- [`subscription_items`](#6-subscription_items)
- [`invoices`](#7-invoices)
- [`invoice_items`](#8-invoice_items)
- [`coupons`](#9-coupons)
- [`coupon_redemptions`](#10-coupon_redemptions)
- [`provider_webhook_events`](#11-provider_webhook_events)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users`, `organizations` | User and organization identity. `customers` references either a user or organization as the billing entity. |

> **Usage metering** is handled by the [SaaS / Multi-tenant](../saas-multi-tenant) domain (`usage_events`, `usage_summaries`). Plan prices can be usage-based, but consumption tracking lives in that domain. **Feature entitlements** derived from active subscriptions are resolved in `tenant_features` (saas-multi-tenant).

## Tables

### Customer & Billing
- `customers` — Billing customer entity linking to auth-rbac user or organization, with provider sync and default payment method
- `payment_methods` — Tokenized payment instruments per customer (card, bank account, PayPal) with brand and last-four for display

### Plans & Pricing
- `plans` — Subscription plan definitions (Starter, Pro, Enterprise) with display metadata and provider product sync
- `plan_prices` — Price points for plans with billing interval, currency, trial days, and pricing type (recurring, one-time, usage-based)

### Subscriptions
- `subscriptions` — Core subscription records with status lifecycle, billing period tracking, trial/cancel/pause timestamps, and provider sync
- `subscription_items` — Line items within a subscription (base plan + add-ons) referencing specific plan prices with quantity

### Invoices & Billing History
- `invoices` — Local copies of billing invoices with status, amounts, period, and provider-hosted URLs for receipts
- `invoice_items` — Line items on invoices (plan charges, proration credits, one-time charges) with period and amount breakdown

### Coupons & Discounts
- `coupons` — Discount definitions with type (percentage or fixed), duration, redemption limits, and optional customer-facing code
- `coupon_redemptions` — Records of coupons applied to specific customer subscriptions with provider discount sync

### Provider Sync
- `provider_webhook_events` — Raw webhook event log for idempotency, debugging, and replay with provider event deduplication

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. customers

Billing customer entity that bridges auth-rbac identities to billing provider customer records. Each customer represents a billable entity — either an individual user or an organization — with their own payment methods, subscriptions, and invoices. Stores the provider's customer ID for webhook sync, a billing email (which may differ from the auth email), and optional tax identification.

```pseudo
table customers {
  id                  uuid primary_key default auto_generate
  user_id             uuid nullable references users(id) on_delete set_null
                                                 -- Individual user as billing entity. From Auth / RBAC.
                                                 -- Nullable because customer may be org-level instead.
  organization_id     uuid nullable references organizations(id) on_delete set_null
                                                 -- Organization as billing entity. From Auth / RBAC.
                                                 -- Nullable because customer may be user-level instead.
  name                string not_null             -- Display name for billing (person or company name).
  email               string not_null             -- Billing contact email. May differ from auth email.
  currency            string nullable             -- Preferred currency (ISO 4217, e.g., "usd", "eur").
  tax_id              string nullable             -- Tax identification number (VAT, EIN, GST, etc.).
  metadata            json nullable               -- Provider-specific or app-specific metadata.
  provider_type       string nullable             -- Billing provider name (e.g., "stripe", "chargebee", "paddle").
  provider_id         string nullable             -- Provider's customer ID (e.g., "cus_abc123" in Stripe).
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    index(user_id)
    index(organization_id)
    index(provider_type, provider_id)             -- Look up customer by provider reference.
  }
}
```

**Design notes:**
- Either `user_id` or `organization_id` should be set (not both, not neither), but this is an application-level invariant, not a schema constraint, to keep the schema simple and portable across formats.
- `provider_type` + `provider_id` enables multi-provider support. A customer can exist across Stripe and PayPal simultaneously with different provider IDs.
- `currency` stores the customer's default currency for new subscriptions. Individual plan prices may use different currencies.

### 2. payment_methods

Tokenized payment instruments stored per customer. Contains only display-safe information (card brand, last four digits, expiration) and the provider's payment method token for charging. Never stores raw card numbers, CVVs, or full account numbers — all sensitive data lives at the billing provider (PCI compliance).

```pseudo
table payment_methods {
  id                  uuid primary_key default auto_generate
  customer_id         uuid not_null references customers(id) on_delete cascade
                                                 -- The billing customer who owns this payment method.
  type                enum(card, bank_account, paypal, sepa_debit, ideal, other) not_null
                                                 -- Payment instrument type.
  card_brand          string nullable             -- Card network (e.g., "visa", "mastercard", "amex"). Null for non-card types.
  card_last4          string nullable             -- Last four digits for display. Null for non-card types.
  card_exp_month      integer nullable            -- Card expiration month (1-12). Null for non-card types.
  card_exp_year       integer nullable            -- Card expiration year (e.g., 2027). Null for non-card types.
  is_default          boolean not_null default false
                                                 -- Whether this is the customer's default payment method.
  provider_type       string nullable             -- Billing provider name (e.g., "stripe").
  provider_id         string nullable             -- Provider's payment method ID (e.g., "pm_abc123").
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    index(customer_id)
    index(provider_type, provider_id)
  }
}
```

**Design notes:**
- Card fields are nullable because non-card payment types (bank account, PayPal) don't have card metadata.
- `is_default` is denormalized for convenience. The application should ensure at most one default per customer.
- The provider token (`provider_id`) is used for creating charges/subscriptions. The display fields are for showing "Visa ending in 4242" in the UI.

### 3. plans

Subscription plan definitions representing what customers can subscribe to — e.g., "Starter", "Pro", "Enterprise". Plans define the product identity (name, description, features summary) while `plan_prices` define the billing specifics (amount, interval, currency). This separation follows the universal Stripe/Paddle/Chargebee pattern of decoupling "what" from "how much."

```pseudo
table plans {
  id                  uuid primary_key default auto_generate
  name                string not_null             -- Display name (e.g., "Pro Plan", "Team Plan").
  description         string nullable             -- Marketing description shown on pricing pages.
  is_active           boolean not_null default true
                                                 -- Whether this plan is available for new subscriptions.
                                                 -- Inactive plans can still have existing subscribers.
  sort_order          integer not_null default 0  -- Display ordering on pricing pages.
  metadata            json nullable               -- App-specific data (feature flags, limits, tier level).
  provider_type       string nullable             -- Billing provider name.
  provider_id         string nullable             -- Provider's product ID (e.g., "prod_abc123" in Stripe).
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    index(is_active)
    index(provider_type, provider_id)
  }
}
```

**Design notes:**
- `is_active` controls visibility for new signups. Existing subscribers on inactive plans continue their subscriptions — the plan isn't deleted.
- `sort_order` enables drag-and-drop reordering on pricing pages without changing plan IDs.
- `metadata` stores app-specific plan attributes (e.g., `{"max_seats": 10, "storage_gb": 100}`) that the application interprets for feature gating. For a richer entitlement system, see the SaaS / Multi-tenant domain's `features` and `tenant_features` tables.

### 4. plan_prices

Price points for plans defining billing amount, currency, and interval. A single plan can have multiple prices — monthly vs annual, different currencies, tiered pricing — enabling flexible pricing strategies. Each price syncs with the billing provider's price/rate entity.

```pseudo
table plan_prices {
  id                  uuid primary_key default auto_generate
  plan_id             uuid not_null references plans(id) on_delete cascade
                                                 -- The plan this price belongs to.
  nickname            string nullable             -- Internal label (e.g., "Monthly USD", "Annual EUR").
  type                enum(recurring, one_time, usage_based) not_null default recurring
                                                 -- How this price is charged.
                                                 -- recurring = billed every interval.
                                                 -- one_time = charged once (setup fee, migration fee).
                                                 -- usage_based = billed based on metered consumption.
  amount              integer not_null            -- Price in smallest currency unit (e.g., cents). 1999 = $19.99.
  currency            string not_null             -- ISO 4217 currency code (e.g., "usd", "eur", "gbp").
  interval            enum(day, week, month, year) nullable
                                                 -- Billing interval for recurring prices. Null for one_time.
  interval_count      integer not_null default 1  -- Number of intervals per billing cycle (e.g., 3 months = interval=month, count=3).
  trial_period_days   integer nullable            -- Free trial days before first charge. Null = no trial.
  is_active           boolean not_null default true
                                                 -- Whether this price is available for new subscriptions.
  metadata            json nullable               -- Provider-specific or app-specific price metadata.
  provider_type       string nullable             -- Billing provider name.
  provider_id         string nullable             -- Provider's price ID (e.g., "price_abc123" in Stripe).
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    index(plan_id)
    index(is_active)
    index(provider_type, provider_id)
  }
}
```

**Design notes:**
- `amount` is stored in smallest currency unit (cents) as an integer to avoid floating-point precision issues. This follows the Stripe convention: `1999` = $19.99 USD.
- `interval` is nullable because one-time prices don't have a billing interval.
- `trial_period_days` is set at the price level (not plan level) because different pricing tiers may offer different trial lengths. This matches Stripe's model.
- Usage-based prices reference a meter or feature externally. The actual usage tracking lives in the SaaS / Multi-tenant domain.

### 5. subscriptions

Core subscription records tracking the billing lifecycle for a customer. Each subscription has a status indicating where it is in the lifecycle (trialing → active → canceled → expired), period tracking for the current billing cycle, trial and cancellation timestamps, and pause/resume scheduling. This is the central table for entitlement decisions — "does this customer have an active subscription?"

```pseudo
table subscriptions {
  id                      uuid primary_key default auto_generate
  customer_id             uuid not_null references customers(id) on_delete cascade
                                                 -- The billing customer who owns this subscription.
  status                  enum(trialing, active, past_due, paused, canceled, expired, incomplete) not_null default incomplete
                                                 -- Current subscription lifecycle state.
                                                 -- trialing = free trial active.
                                                 -- active = billing normally.
                                                 -- past_due = payment failed, retrying (dunning).
                                                 -- paused = billing temporarily suspended.
                                                 -- canceled = scheduled to end or in grace period.
                                                 -- expired = actually ended, no longer active.
                                                 -- incomplete = initial payment not yet completed.
  current_period_start    timestamp nullable      -- Start of the current billing period.
  current_period_end      timestamp nullable      -- End of the current billing period (next invoice date).
  trial_start             timestamp nullable      -- When the trial began. Null if no trial.
  trial_end               timestamp nullable      -- When the trial ends/ended. Null if no trial.
  canceled_at             timestamp nullable      -- When cancellation was requested. Null if not canceled.
  ended_at                timestamp nullable      -- When the subscription actually terminated. Null if still active.
  cancel_at_period_end    boolean not_null default false
                                                 -- If true, subscription cancels at current_period_end rather than immediately.
                                                 -- Combined with canceled_at, this implements the "grace period" pattern.
  paused_at               timestamp nullable      -- When the subscription was paused. Null if not paused.
  resumes_at              timestamp nullable      -- Scheduled resume date for paused subscriptions.
  billing_cycle_anchor    timestamp nullable      -- Reference date for aligning billing cycles.
  coupon_id               uuid nullable references coupons(id) on_delete set_null
                                                 -- Currently applied coupon discount. Null if none.
  metadata                json nullable           -- Provider-specific or app-specific subscription metadata.
  provider_type           string nullable         -- Billing provider name.
  provider_id             string nullable         -- Provider's subscription ID (e.g., "sub_abc123" in Stripe).
  created_at              timestamp default now
  updated_at              timestamp default now on_update

  indexes {
    index(customer_id)
    index(status)
    index(provider_type, provider_id)
  }
}
```

**Design notes:**
- **Grace period logic**: A subscription is "on grace period" when `canceled_at IS NOT NULL` AND `cancel_at_period_end = true` AND `current_period_end > NOW()`. The customer retains access until the period ends.
- **Status vs timestamps**: Status provides fast filtering ("give me all active subscriptions"). Timestamps provide precise lifecycle tracking ("when exactly was this canceled?"). Both are needed.
- `billing_cycle_anchor` controls when invoices are generated. Useful for aligning all of a customer's subscriptions to the same billing date.
- `coupon_id` references the currently active coupon. The coupon's duration determines how many cycles the discount applies. Historical coupon usage is tracked in `coupon_redemptions`.

### 6. subscription_items

Line items within a subscription, each referencing a specific plan price. Every subscription has at least one item (the base plan). Additional items represent add-ons, extra seats, or supplementary services. This multi-line model follows the Stripe/Chargebee/Paddle pattern and supports composable subscriptions.

```pseudo
table subscription_items {
  id                      uuid primary_key default auto_generate
  subscription_id         uuid not_null references subscriptions(id) on_delete cascade
                                                 -- The subscription this item belongs to.
  plan_price_id           uuid not_null references plan_prices(id) on_delete restrict
                                                 -- The price being charged for this item.
                                                 -- Restrict delete to prevent orphaning active subscription items.
  quantity                integer not_null default 1
                                                 -- Number of units (e.g., seats, licenses). 1 for flat-rate.
  metadata                json nullable           -- Provider-specific item metadata.
  provider_type           string nullable         -- Billing provider name.
  provider_id             string nullable         -- Provider's subscription item ID.
  created_at              timestamp default now
  updated_at              timestamp default now on_update

  indexes {
    composite_unique(subscription_id, plan_price_id)  -- One item per price per subscription.
    -- composite_unique(subscription_id, plan_price_id) covers index(subscription_id) via leading column.
    index(plan_price_id)
  }
}
```

**Design notes:**
- `quantity` enables per-seat pricing (e.g., 5 seats at $10/seat/month = $50/month). For flat-rate plans, quantity is always 1.
- The composite unique constraint prevents duplicate price entries on the same subscription. To change quantity, update the existing item.
- `on_delete restrict` on `plan_price_id` prevents deleting a price that has active subscriptions. Deactivate the price (`is_active = false`) instead.

### 7. invoices

Local copies of billing invoices generated by the payment provider. Stores enough information to display invoice history, show amounts due/paid, and link to provider-hosted invoice pages and PDF downloads. The provider remains the source of truth — these records are synced via webhooks.

```pseudo
table invoices {
  id                  uuid primary_key default auto_generate
  customer_id         uuid not_null references customers(id) on_delete cascade
                                                 -- The billing customer this invoice is for.
  subscription_id     uuid nullable references subscriptions(id) on_delete set_null
                                                 -- The subscription that generated this invoice. Null for one-time invoices.
  status              enum(draft, open, paid, void, uncollectible) not_null default draft
                                                 -- Invoice lifecycle state.
                                                 -- draft = being prepared, not yet finalized.
                                                 -- open = finalized, awaiting payment.
                                                 -- paid = payment received.
                                                 -- void = canceled, no payment expected.
                                                 -- uncollectible = payment failed after all retry attempts.
  currency            string not_null             -- ISO 4217 currency code for this invoice.
  subtotal            integer not_null default 0  -- Sum of line items before tax, in smallest currency unit.
  tax                 integer not_null default 0  -- Total tax amount, in smallest currency unit.
  total               integer not_null default 0  -- Subtotal + tax, in smallest currency unit.
  amount_paid         integer not_null default 0  -- Amount actually paid, in smallest currency unit.
  amount_due          integer not_null default 0  -- Amount remaining to be paid (total - amount_paid).
  period_start        timestamp nullable          -- Start of the billing period this invoice covers.
  period_end          timestamp nullable          -- End of the billing period this invoice covers.
  due_date            timestamp nullable          -- Payment due date. Null for immediately-due invoices.
  paid_at             timestamp nullable          -- When payment was received. Null if unpaid.
  hosted_invoice_url  string nullable             -- Provider-hosted page where customer can pay/view the invoice.
  invoice_pdf_url     string nullable             -- Provider-hosted PDF download URL.
  metadata            json nullable               -- Provider-specific or app-specific invoice metadata.
  provider_type       string nullable             -- Billing provider name.
  provider_id         string nullable             -- Provider's invoice ID (e.g., "in_abc123" in Stripe).
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    index(customer_id)
    index(subscription_id)
    index(status)
    index(provider_type, provider_id)
  }
}
```

**Design notes:**
- All monetary amounts are in smallest currency unit (cents) as integers. This prevents floating-point precision issues and matches billing provider conventions.
- `amount_due` is denormalized (`total - amount_paid`) for convenience in queries. The application keeps it in sync.
- `subscription_id` is nullable to support one-time invoices (setup fees, migration charges) not tied to a subscription.
- Provider URLs (`hosted_invoice_url`, `invoice_pdf_url`) enable linking customers directly to provider-hosted invoice pages without building a custom invoice renderer.

### 8. invoice_items

Individual line items on an invoice — plan charges, proration credits/debits, one-time fees, and tax line items. Each item shows what was charged, how much, for what period, and whether it's a proration adjustment from a subscription change.

```pseudo
table invoice_items {
  id                  uuid primary_key default auto_generate
  invoice_id          uuid not_null references invoices(id) on_delete cascade
                                                 -- The invoice this line item belongs to.
  plan_price_id       uuid nullable references plan_prices(id) on_delete set_null
                                                 -- The plan price this charge relates to. Null for non-plan charges (e.g., tax, one-time fee).
  description         string not_null             -- Human-readable description (e.g., "Pro Plan — Monthly", "Proration credit").
  amount              integer not_null            -- Line item amount in smallest currency unit. Negative for credits.
  currency            string not_null             -- ISO 4217 currency code.
  quantity            integer not_null default 1  -- Number of units charged.
  is_proration        boolean not_null default false
                                                 -- Whether this item is a proration adjustment from a subscription change.
  period_start        timestamp nullable          -- Start of the period this item covers. Null for non-recurring items.
  period_end          timestamp nullable          -- End of the period this item covers. Null for non-recurring items.
  provider_type       string nullable             -- Billing provider name.
  provider_id         string nullable             -- Provider's invoice item/line item ID.
  created_at          timestamp default now

  indexes {
    index(invoice_id)
    index(plan_price_id)
  }
}
```

**Design notes:**
- `amount` can be negative for proration credits (e.g., downgrade from Pro to Starter mid-cycle generates a credit for unused Pro days).
- `is_proration` flags items that result from mid-cycle subscription changes (upgrades/downgrades). Useful for displaying "Proration credit" vs regular charges in the UI.
- No `updated_at` — invoice items are immutable once the invoice is finalized. Changes are modeled as new line items (e.g., credit notes create negative items).

### 9. coupons

Discount definitions that can be applied to subscriptions. Each coupon defines the discount mechanics — percentage off or fixed amount, how long the discount lasts (once, repeating for N months, or forever), and optional redemption limits. Coupons may have a customer-facing code for self-service application or be applied internally.

```pseudo
table coupons {
  id                  uuid primary_key default auto_generate
  code                string nullable             -- Customer-facing coupon code (e.g., "SAVE20"). Null for internal-only coupons.
  name                string not_null             -- Internal name for the coupon (e.g., "Black Friday 2025").
  discount_type       enum(percentage, fixed_amount) not_null
                                                 -- How the discount is calculated.
  discount_value      integer not_null            -- Discount amount. For percentage: 20 = 20% off.
                                                 -- For fixed_amount: value in smallest currency unit (e.g., 500 = $5.00 off).
  currency            string nullable             -- ISO 4217 currency code. Required for fixed_amount, null for percentage.
  duration            enum(once, repeating, forever) not_null default once
                                                 -- How many billing cycles the discount applies.
                                                 -- once = first invoice only.
                                                 -- repeating = applies for duration_in_months billing cycles.
                                                 -- forever = applies to all future invoices.
  duration_in_months  integer nullable            -- Number of months the discount recurs. Required when duration = repeating.
  max_redemptions     integer nullable            -- Maximum total times this coupon can be redeemed. Null = unlimited.
  times_redeemed      integer not_null default 0  -- Counter of how many times this coupon has been applied.
  is_active           boolean not_null default true
                                                 -- Whether this coupon can be applied to new subscriptions.
  valid_from          timestamp nullable          -- Coupon is valid starting from this date. Null = valid immediately.
  valid_until         timestamp nullable          -- Coupon expires after this date. Null = no expiry.
  metadata            json nullable               -- Provider-specific or app-specific coupon metadata.
  provider_type       string nullable             -- Billing provider name.
  provider_id         string nullable             -- Provider's coupon ID (e.g., "coup_abc123").
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    unique(code)                                  -- Coupon codes must be unique when present.
    index(is_active)
    index(provider_type, provider_id)
  }
}
```

**Design notes:**
- `code` is nullable to support internal coupons applied by support staff or automation that don't need a customer-facing code. The unique constraint allows multiple nulls (coupons without codes).
- `discount_value` is always an integer. For percentages, it's the whole number (20 = 20%). For fixed amounts, it's in smallest currency unit (500 = $5.00).
- `times_redeemed` is a denormalized counter updated when a `coupon_redemption` is created. Enables quick limit checks without counting redemptions.
- The `duration` model follows Stripe's coupon duration pattern — simple and covers all common discount scenarios.

### 10. coupon_redemptions

Records of coupons applied to specific customer subscriptions. Tracks which customer redeemed which coupon, on which subscription, and when. Enables per-customer redemption limits, usage analytics, and historical discount tracking even after a coupon is deactivated.

```pseudo
table coupon_redemptions {
  id                  uuid primary_key default auto_generate
  coupon_id           uuid not_null references coupons(id) on_delete cascade
                                                 -- The coupon that was redeemed.
  customer_id         uuid not_null references customers(id) on_delete cascade
                                                 -- The customer who redeemed the coupon.
  subscription_id     uuid nullable references subscriptions(id) on_delete set_null
                                                 -- The subscription the coupon was applied to. Null if applied at customer level.
  redeemed_at         timestamp not_null default now
                                                 -- When the coupon was applied.
  provider_type       string nullable             -- Billing provider name.
  provider_id         string nullable             -- Provider's discount/redemption ID.
  created_at          timestamp default now

  indexes {
    index(coupon_id)
    index(customer_id)
    index(subscription_id)
  }
}
```

**Design notes:**
- `subscription_id` is nullable because some coupons are applied at the customer level (affecting all subscriptions) rather than a specific subscription.
- No `updated_at` — redemptions are append-only. A coupon removal creates a new event or simply deletes the redemption record.
- The combination of `coupon_id` + `customer_id` can be used to enforce per-customer redemption limits at the application level.

### 11. provider_webhook_events

Raw webhook event log for billing provider event processing. Every webhook received from a billing provider (Stripe, Chargebee, Paddle, etc.) is recorded here for idempotency (preventing double-processing), debugging (inspecting event payloads), and replay (reprocessing missed or failed events). Deduplicated by the provider's unique event ID.

```pseudo
table provider_webhook_events {
  id                  uuid primary_key default auto_generate
  provider_type       string not_null             -- Billing provider name (e.g., "stripe", "chargebee", "paddle").
  provider_event_id   string not_null             -- Provider's unique event ID (e.g., "evt_abc123" in Stripe).
  event_type          string not_null             -- Provider event type (e.g., "invoice.paid", "subscription.updated").
  payload             json not_null               -- Raw event payload as received from the provider.
  processed_at        timestamp nullable          -- When this event was successfully processed. Null if pending or failed.
  processing_error    string nullable             -- Error message if processing failed. Null if successful or pending.
  created_at          timestamp default now

  indexes {
    composite_unique(provider_type, provider_event_id)  -- Deduplicate events per provider.
    -- composite_unique(provider_type, provider_event_id) covers index(provider_type) via leading column.
    index(event_type)
    index(processed_at)                           -- Find unprocessed events (WHERE processed_at IS NULL).
  }
}
```

**Design notes:**
- The composite unique on `(provider_type, provider_event_id)` prevents processing the same event twice. On webhook receipt, attempt an insert — if it conflicts, the event was already received.
- `payload` stores the complete raw event for debugging and replay. The application parses the payload to extract entity IDs and update local records.
- `processed_at` is null until the event is successfully processed. Combined with `processing_error`, this enables a dead-letter queue pattern: query for events where `processed_at IS NULL AND processing_error IS NOT NULL` to find failed events needing attention.
- No `updated_at` — the only mutable fields are `processed_at` and `processing_error`, which are set once during processing.

## Relationships

```
users                1 ──── * customers                (one user may have multiple billing profiles)
organizations        1 ──── * customers                (one org may have multiple billing profiles)
customers            1 ──── * payment_methods           (one customer has many payment methods)
customers            1 ──── * subscriptions             (one customer has many subscriptions)
customers            1 ──── * invoices                  (one customer has many invoices)
customers            1 ──── * coupon_redemptions         (one customer has many coupon redemptions)
plans                1 ──── * plan_prices               (one plan has many prices)
plan_prices          1 ──── * subscription_items         (one price is used in many subscription items)
plan_prices          1 ──── * invoice_items              (one price is referenced in many invoice items)
subscriptions        1 ──── * subscription_items         (one subscription has many items)
subscriptions        1 ──── * invoices                  (one subscription generates many invoices)
subscriptions        1 ──── * coupon_redemptions         (one subscription has many coupon redemptions)
coupons              1 ──── * subscriptions              (one coupon is applied to many subscriptions)
coupons              1 ──── * coupon_redemptions         (one coupon has many redemptions)
invoices             1 ──── * invoice_items              (one invoice has many line items)
```

## Best Practices

- **Provider is source of truth** — local records are synced copies. When in doubt, fetch from the provider API. Use webhooks for real-time sync and periodic reconciliation jobs for drift detection.
- **Idempotent webhook processing** — always check `provider_webhook_events` before processing. Insert-on-conflict pattern prevents double-processing.
- **Amount in smallest unit** — store all monetary values as integers in the smallest currency unit (cents for USD/EUR, pence for GBP). Prevents floating-point precision errors.
- **Grace period checks** — to determine if a canceled subscription still has access: `canceled_at IS NOT NULL AND cancel_at_period_end = true AND current_period_end > NOW()`.
- **Never store raw card data** — only store tokenized references from the billing provider. PCI DSS compliance requires all sensitive payment data to live at the provider.
- **Soft deactivation over hard deletes** — deactivate plans and prices (`is_active = false`) rather than deleting them. Active subscriptions reference these records.
- **Reconciliation** — implement periodic jobs that compare local subscription/invoice state with the provider API to detect and fix webhook-missed updates.

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
