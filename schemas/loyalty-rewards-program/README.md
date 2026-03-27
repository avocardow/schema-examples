# Loyalty / Rewards Program

> Points-based loyalty programs with earning rules, tiered membership, reward catalogs, and point transaction ledgers.

## Overview

A complete loyalty and rewards program schema covering the full lifecycle from program configuration through member enrollment, point earning and redemption, reward fulfillment, and tiered VIP membership. Supports multiple concurrent programs with independent earning rules, time-limited promotions, configurable tier qualification, and a full point transaction audit trail.

Designed from a study of 11 real implementations: Square Loyalty API, Smile.io, LoyaltyLion, Yotpo Loyalty, Open Loyalty (open-source), Voucherify, Talon.One, Antavo, Kangaroo Rewards, Salesforce Loyalty Management, and Stamp Me.

Key design decisions: immutable points transaction ledger with cached balance on member (7/11 implementations use this pattern — provides audit trail, expiration tracking, and balance derivability while cached balance enables fast reads); earning rules as separate entities from programs (7/11 use this — configurable without code changes, supports multiple simultaneous rules per program); separate promotions entity for time-limited bonus campaigns (Square, Talon.One, and Salesforce all distinguish permanent rules from temporary promotions); reward catalog with redemption lifecycle tracking (8/11 separate what's available from what's been claimed — enables inventory limits, status tracking, and fulfillment); tier definitions with separate member tier assignments (9/11 implement tiers — join table with temporal tracking enables tier history, expiration, and manual overrides); tier benefits as first-class entities (Salesforce, Antavo, Smile.io — tiers unlock specific perks beyond point thresholds); single point currency per program (only 3/11 need multi-currency — single currency covers 90%+ of use cases); rolling per-batch point expiration with `expires_at` on each transaction (Voucherify, Square, Talon.One — supports FIFO redemption and notification triggers).

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (11 tables)</summary>

- [`loyalty_programs`](#1-loyalty_programs)
- [`loyalty_members`](#2-loyalty_members)
- [`earning_rules`](#3-earning_rules)
- [`promotions`](#4-promotions)
- [`points_transactions`](#5-points_transactions)
- [`rewards`](#6-rewards)
- [`reward_redemptions`](#7-reward_redemptions)
- [`tiers`](#8-tiers)
- [`tier_benefits`](#9-tier_benefits)
- [`member_tiers`](#10-member_tiers)
- [`member_activities`](#11-member_activities)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users` | User identity for member enrollment and admin audit trails |

> **Referral tracking** is handled by the [Affiliate / Referral Program](../affiliate-referral-program) domain. Earning rules can award points for referral events, but the referral infrastructure itself (clicks, attribution, referral codes) lives in that domain. **Order/purchase data** for spend-based earning is referenced via polymorphic `source_reference_type` + `source_reference_id` on points transactions — no hard FK dependency on e-commerce.

## Tables

### Program Configuration

| # | Table | Description |
| - | ----- | ----------- |
| 1 | `loyalty_programs` | Top-level program configuration with currency, earning, and expiration settings |

### Membership

| # | Table | Description |
| - | ----- | ----------- |
| 2 | `loyalty_members` | Enrollment of a user in a program with cached point balances |

### Points System

| # | Table | Description |
| - | ----- | ----------- |
| 3 | `earning_rules` | Rules defining how members earn points (event type, amount, conditions) |
| 4 | `promotions` | Time-limited bonus earning campaigns (multipliers, fixed bonuses) |
| 5 | `points_transactions` | Immutable ledger of every point movement (earn, redeem, expire, adjust) |

### Rewards & Redemption

| # | Table | Description |
| - | ----- | ----------- |
| 6 | `rewards` | Catalog of available rewards with points cost and inventory tracking |
| 7 | `reward_redemptions` | Records of members redeeming points for rewards with fulfillment lifecycle |

### Tiers / VIP

| # | Table | Description |
| - | ----- | ----------- |
| 8 | `tiers` | Tier/VIP level definitions with qualification thresholds and ordering |
| 9 | `tier_benefits` | Specific benefits unlocked at each tier (multipliers, perks, access) |
| 10 | `member_tiers` | Assignment of members to tiers with temporal tracking and history |

### Activity & Engagement

| # | Table | Description |
| - | ----- | ----------- |
| 11 | `member_activities` | Log of member actions that may trigger earning rules |

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. loyalty_programs

Top-level container for loyalty program configuration. Each program defines its own point currency, earning rules, expiration policy, and tier structure. Supports multiple concurrent programs (e.g., a retail loyalty program and a separate dining rewards program). Inspired by Square Loyalty Programs, Smile.io program configuration, and Voucherify Loyalty Campaigns.

```pseudo
table loyalty_programs {
  id                    uuid primary_key default auto_generate
  name                  string not_null              -- Program name (e.g., "Star Rewards", "VIP Club").
  slug                  string unique not_null       -- URL-friendly identifier for the program.
  description           string nullable              -- Description of the program and its benefits.
  status                enum(draft, active, paused, archived) not_null default draft
                                                     -- draft: program being configured.
                                                     -- active: accepting members and tracking points.
                                                     -- paused: temporarily stopped (no new earning).
                                                     -- archived: permanently closed.
  currency_name         string not_null default "points"
                                                     -- Display name for the point currency (e.g., "points", "stars", "miles").
  points_per_currency   decimal not_null default 1   -- Points earned per unit of spending currency (e.g., 1 point per $1 = 1.00).
  currency              string nullable              -- ISO 4217 currency code for spend-based earning. Null for non-monetary programs.
  points_expiry_days    integer nullable              -- Rolling expiration: days after which earned points expire. Null = no expiration.
  allow_negative        boolean not_null default false
                                                     -- Whether member balance can go negative (e.g., for point adjustments).
  is_public             boolean not_null default true -- Whether the program is publicly visible for enrollment.
  terms_url             string nullable              -- URL to program terms and conditions.
  metadata              json nullable default {}     -- Extensible program data (branding, feature flags, etc.).
  created_by            uuid not_null references users(id) on_delete restrict  -- Admin who created the program.
  created_at            timestamp default now
  updated_at            timestamp default now on_update

  indexes {
    index(status)
    index(created_by)
  }
}
```

**Design notes:**
- `currency_name` is a display label for the point unit (e.g., "stars" for Starbucks, "miles" for airlines). Not an ISO currency code.
- `points_per_currency` defines the default earning rate for spend-based rules. Individual earning rules can override this.
- `points_expiry_days` is the default expiration window. Each `points_transaction` calculates its own `expires_at` from this value at creation time. Null means points never expire.
- `allow_negative` is usually false. Only enable for programs that support point borrowing or deferred adjustments.

### 2. loyalty_members

Enrollment of a user in a specific loyalty program. Each member record represents one user's membership in one program, carrying cached point balances for fast reads and enrollment status for access control. A user can be a member of multiple programs. Inspired by Square Loyalty Accounts, LoyaltyLion Customer data, and Open Loyalty Customer accounts.

```pseudo
table loyalty_members {
  id                    uuid primary_key default auto_generate
  program_id            uuid not_null references loyalty_programs(id) on_delete cascade
                                                     -- Which program this member belongs to.
                                                     -- Cascade: removing a program removes all its members.
  user_id               uuid not_null references users(id) on_delete cascade
                                                     -- The user account. Cascade: removing a user removes their memberships.
  member_number         string unique not_null       -- Unique member identifier (e.g., "MEM-20250101-X1Y2", loyalty card number).
  status                enum(active, suspended, banned) not_null default active
                                                     -- active: earning and redeeming points normally.
                                                     -- suspended: temporarily frozen (pending review).
                                                     -- banned: permanently excluded from program.
  points_balance        integer not_null default 0   -- Current available points (cached from ledger).
  points_pending        integer not_null default 0   -- Points earned but not yet confirmed/available.
  lifetime_points       integer not_null default 0   -- Total points ever earned (never decreases).
  points_redeemed       integer not_null default 0   -- Total points ever spent on rewards.
  points_expired        integer not_null default 0   -- Total points lost to expiration.
  enrolled_at           timestamp not_null default now  -- When the member enrolled.
  suspended_at          timestamp nullable           -- When the member was suspended. Null if not suspended.
  metadata              json nullable default {}     -- Extensible member data (preferences, tags, referral source).
  created_at            timestamp default now
  updated_at            timestamp default now on_update

  indexes {
    composite_unique(program_id, user_id)            -- A user can only be a member of a program once.
    index(user_id)
    index(status)
    index(points_balance)
  }
}
```

**Design notes:**
- `composite_unique(program_id, user_id)` prevents duplicate enrollment.
- `points_balance` is a cached value derived from the `points_transactions` ledger. Must be updated transactionally with every ledger entry. If cache and ledger disagree, the ledger is the source of truth.
- `lifetime_points` only counts earned points (not bonuses from adjustments). Used for tier qualification in programs that use lifetime points as the qualification metric.
- `points_pending` tracks points that are earned but awaiting confirmation (e.g., points from a purchase that hasn't shipped yet). Pending points become available after a configurable delay.
- `enrolled_at` may differ from `created_at` if the member record is pre-created during an import.

### 3. earning_rules

Rules defining how members earn points in a program. Each rule specifies an event type (purchase, signup, review, etc.), how many points are awarded, and optional conditions. Rules are permanent configurations — for time-limited bonus campaigns, use `promotions` instead. Inspired by Smile.io Earning Rules, Square Accrual Rules, and Voucherify Earning Rules.

```pseudo
table earning_rules {
  id                    uuid primary_key default auto_generate
  program_id            uuid not_null references loyalty_programs(id) on_delete cascade
                                                     -- Which program this rule belongs to.
                                                     -- Cascade: removing a program removes all its rules.
  name                  string not_null              -- Display name (e.g., "1 point per $1 spent", "50 points for review").
  description           string nullable              -- Explanation of the rule for members.
  event_type            string not_null              -- The triggering event type (e.g., "purchase", "signup", "review", "referral", "birthday", "custom").
  earning_type          enum(fixed, per_currency, multiplier) not_null default fixed
                                                     -- fixed: award a fixed number of points.
                                                     -- per_currency: points = amount × points_per_currency (from program or override).
                                                     -- multiplier: multiply base points by a factor.
  points_amount         integer nullable             -- Fixed points to award. Required when earning_type = fixed.
  multiplier            decimal nullable             -- Multiplier factor (e.g., 2.0 = double points). Required when earning_type = multiplier.
  min_purchase_amount   integer nullable             -- Minimum transaction amount (smallest currency unit) to trigger rule. Null = no minimum.
  max_points_per_event  integer nullable             -- Cap on points earned per event. Null = no cap.
  conditions            json nullable                -- Additional conditions as structured JSON (e.g., product categories, minimum quantity).
  is_active             boolean not_null default true -- Whether this rule is currently active.
  sort_order            integer not_null default 0   -- Display ordering for the member-facing rules list.
  created_at            timestamp default now
  updated_at            timestamp default now on_update

  indexes {
    index(program_id, is_active)
    index(event_type)
  }
}
```

**Design notes:**
- `event_type` is a string (not enum) because event types are extensible — programs can define custom events beyond the standard set (purchase, signup, review, referral, birthday, check_in, social_share, etc.).
- `earning_type` determines the calculation: `fixed` = always award `points_amount`; `per_currency` = points = transaction amount × rate; `multiplier` = multiply base earning by `multiplier`.
- `conditions` stores structured rule conditions in JSON (e.g., `{"categories": ["electronics"], "min_quantity": 2}`). Application code evaluates these against the triggering event.
- `min_purchase_amount` and `max_points_per_event` are common guardrails found in Square, Smile.io, and Voucherify.

### 4. promotions

Time-limited bonus earning campaigns that temporarily boost point earning beyond standard rules. Promotions can multiply points from qualifying events or award fixed bonus points during a promotional window. Inspired by Square Loyalty Promotions (up to 10 active/scheduled) and Talon.One campaign rules.

```pseudo
table promotions {
  id                    uuid primary_key default auto_generate
  program_id            uuid not_null references loyalty_programs(id) on_delete cascade
                                                     -- Which program this promotion belongs to.
                                                     -- Cascade: removing a program removes all its promotions.
  name                  string not_null              -- Promotion name (e.g., "Double Points Weekend", "Holiday Bonus").
  description           string nullable              -- Description of the promotion for members.
  promotion_type        enum(multiplier, fixed_bonus) not_null default multiplier
                                                     -- multiplier: multiply earning by a factor during the promotion.
                                                     -- fixed_bonus: award extra fixed points per qualifying event.
  multiplier            decimal nullable             -- Earning multiplier (e.g., 2.0 = double, 3.0 = triple). Required when promotion_type = multiplier.
  bonus_points          integer nullable             -- Fixed bonus points per qualifying event. Required when promotion_type = fixed_bonus.
  event_type            string nullable              -- Limit promotion to a specific event type. Null = applies to all earning events.
  conditions            json nullable                -- Additional conditions for promotion eligibility (JSON).
  status                enum(scheduled, active, ended, canceled) not_null default scheduled
                                                     -- scheduled: promotion set up but not yet started.
                                                     -- active: currently running.
                                                     -- ended: promotion period completed.
                                                     -- canceled: promotion canceled before completion.
  starts_at             timestamp not_null           -- When the promotion begins.
  ends_at               timestamp not_null           -- When the promotion ends.
  max_points_per_member integer nullable             -- Maximum total bonus points a single member can earn from this promotion. Null = no cap.
  created_at            timestamp default now
  updated_at            timestamp default now on_update

  indexes {
    index(program_id, status)
    index(status)
    index(starts_at, ends_at)
  }
}
```

**Design notes:**
- Promotions are distinct from earning rules: earning rules are permanent configurations, promotions are time-bound bonus campaigns.
- `multiplier` applies on top of the earning rule's base points (e.g., 2.0 × 10 base points = 20 points).
- `bonus_points` is additive — awarded in addition to the base earning.
- `event_type` can filter which events qualify. Null means the promotion applies to all earning events.
- `max_points_per_member` prevents abuse by capping how much a single member can benefit from one promotion.

### 5. points_transactions

Immutable ledger of every point movement in a member's account. Each entry records a credit or debit with the running balance after the transaction. Supports point expiration via per-batch `expires_at` tracking. This is the audit trail and source of truth for all point balances — cached balances on `loyalty_members` must always reconcile with this ledger. Inspired by Square Loyalty Events, Open Loyalty Points Transfers, and Salesforce Transaction Journals.

```pseudo
table points_transactions {
  id                    uuid primary_key default auto_generate
  member_id             uuid not_null references loyalty_members(id) on_delete restrict
                                                     -- Which member's account this transaction affects.
                                                     -- Restrict: don't delete members with transaction history.
  type                  enum(earn, redeem, expire, adjust, bonus) not_null
                                                     -- earn: points awarded from an earning rule or purchase.
                                                     -- redeem: points spent on a reward.
                                                     -- expire: points removed due to expiration.
                                                     -- adjust: manual admin adjustment (credit or debit).
                                                     -- bonus: points from a promotion or special campaign.
  points                integer not_null             -- Points affected. Positive = credit, negative = debit.
  balance_after         integer not_null             -- Member's available balance after this transaction.
  description           string nullable              -- Human-readable description (e.g., "Earned 100 points for $100 purchase").
  source_reference_type string nullable              -- Type of source entity (e.g., "earning_rule", "reward_redemption", "promotion", "order").
  source_reference_id   string nullable              -- ID of the source entity.
  earning_rule_id       uuid nullable references earning_rules(id) on_delete set_null
                                                     -- The earning rule that triggered this transaction. Null for non-earning events.
  promotion_id          uuid nullable references promotions(id) on_delete set_null
                                                     -- The promotion that boosted this earning. Null for non-promotional events.
  redemption_id         uuid nullable references reward_redemptions(id) on_delete set_null
                                                     -- The redemption that spent these points. Null for non-redemption events.
  expires_at            timestamp nullable           -- When these earned points expire. Null for non-expirable points or debits.
  is_pending            boolean not_null default false
                                                     -- Whether these points are pending confirmation (not yet available).
  confirmed_at          timestamp nullable           -- When pending points were confirmed and made available.
  created_at            timestamp default now

  indexes {
    index(member_id, created_at)
    index(type)
    index(expires_at)
    index(is_pending)
    index(source_reference_type, source_reference_id)
  }
}
```

**Design notes:**
- **Append-only** — transactions are never updated or deleted. Corrections are made by adding adjustment entries. The only mutable fields are `is_pending` and `confirmed_at` (for the pending → confirmed transition).
- `balance_after` captures the running balance snapshot, enabling point-in-time balance reconstruction and reconciliation without replaying the entire ledger.
- `expires_at` is calculated at creation time from `loyalty_programs.points_expiry_days`. A scheduled job queries `expires_at <= NOW() AND type = 'earn' AND points > 0` to expire point batches (creating new `expire` entries).
- `source_reference_type` + `source_reference_id` provide polymorphic linkage to external systems (orders, events, activities) without hard FK dependencies.
- `earning_rule_id`, `promotion_id`, and `redemption_id` are direct FK links for the most common internal references.
- `is_pending` supports the LoyaltyLion/Yotpo pattern of delayed point confirmation (e.g., points from a purchase aren't available until the order ships).

### 6. rewards

Catalog of rewards available for point redemption in a program. Each reward defines its type, points cost, and optional inventory limits. Supports multiple reward types: discounts, free products, free shipping, gift cards, experiences, and custom rewards with type-specific configuration in metadata. Inspired by Smile.io Points Products, Square Reward Tiers, and Voucherify Rewards.

```pseudo
table rewards {
  id                    uuid primary_key default auto_generate
  program_id            uuid not_null references loyalty_programs(id) on_delete cascade
                                                     -- Which program this reward belongs to.
                                                     -- Cascade: removing a program removes all its rewards.
  name                  string not_null              -- Reward name (e.g., "$5 Off", "Free Shipping", "VIP Early Access").
  description           string nullable              -- Detailed description of the reward.
  reward_type           enum(discount_percentage, discount_fixed, free_product, free_shipping, gift_card, experience, custom) not_null
                                                     -- discount_percentage: percentage off a purchase.
                                                     -- discount_fixed: fixed amount off in smallest currency unit.
                                                     -- free_product: specific product at no cost.
                                                     -- free_shipping: free shipping on an order.
                                                     -- gift_card: gift card or store credit.
                                                     -- experience: non-monetary reward (event access, priority support).
                                                     -- custom: app-defined reward type.
  points_cost           integer not_null             -- Number of points required to redeem this reward.
  reward_value          integer nullable             -- Monetary value in smallest currency unit. Null for non-monetary rewards.
  currency              string nullable              -- ISO 4217 currency for reward_value. Null for non-monetary rewards.
  image_url             string nullable              -- Reward image for display.
  inventory             integer nullable             -- Available quantity. Null = unlimited.
  max_redemptions_per_member integer nullable         -- Maximum times a single member can redeem this reward. Null = unlimited.
  is_active             boolean not_null default true -- Whether this reward is currently available for redemption.
  min_tier_id           uuid nullable references tiers(id) on_delete set_null
                                                     -- Minimum tier required to redeem. Null = available to all members.
  metadata              json nullable                -- Type-specific configuration (e.g., discount code template, product SKU, experience details).
  sort_order            integer not_null default 0   -- Display ordering in the rewards catalog.
  valid_from            timestamp nullable           -- Reward available starting from this date. Null = available immediately.
  valid_until           timestamp nullable           -- Reward expires after this date. Null = no expiry.
  created_at            timestamp default now
  updated_at            timestamp default now on_update

  indexes {
    index(program_id, is_active)
    index(reward_type)
    index(min_tier_id)
  }
}
```

**Design notes:**
- `reward_type` enum covers the common reward types found across 8+ implementations. The `custom` type with `metadata` allows app-specific extensions.
- `points_cost` is always required — every reward has a point price. Variable-cost rewards (e.g., "$1 off per 100 points") are modeled as multiple reward entries or handled in application logic.
- `inventory` enables limited-edition rewards. Application code decrements on redemption and prevents over-redemption.
- `min_tier_id` gates exclusive rewards behind tier membership (e.g., "VIP-only experiences").
- `max_redemptions_per_member` prevents abuse (e.g., "one per member per lifetime").

### 7. reward_redemptions

Records of members redeeming points for rewards. Each redemption has a lifecycle from pending through fulfilled or canceled. Tracks the points spent and links to both the member and the reward for reconciliation and analytics. Inspired by Smile.io Points Purchases + Reward Fulfillments, Square Loyalty Rewards, and Yotpo Point Redemptions.

```pseudo
table reward_redemptions {
  id                    uuid primary_key default auto_generate
  member_id             uuid not_null references loyalty_members(id) on_delete restrict
                                                     -- Which member redeemed.
                                                     -- Restrict: don't delete members with redemption history.
  reward_id             uuid not_null references rewards(id) on_delete restrict
                                                     -- Which reward was redeemed.
                                                     -- Restrict: don't delete rewards with redemption history.
  points_spent          integer not_null             -- Number of points deducted for this redemption.
  status                enum(pending, fulfilled, canceled, expired) not_null default pending
                                                     -- pending: redemption requested, awaiting fulfillment.
                                                     -- fulfilled: reward delivered to the member.
                                                     -- canceled: redemption canceled (points refunded).
                                                     -- expired: redemption expired before fulfillment.
  coupon_code           string nullable              -- Generated coupon/discount code for discount-type rewards.
  fulfilled_at          timestamp nullable           -- When the reward was delivered/fulfilled.
  canceled_at           timestamp nullable           -- When the redemption was canceled.
  expires_at            timestamp nullable           -- When the redemption expires if not fulfilled.
  metadata              json nullable                -- Additional redemption data (delivery details, fulfillment notes).
  created_at            timestamp default now
  updated_at            timestamp default now on_update

  indexes {
    index(member_id, created_at)
    index(reward_id)
    index(status)
  }
}
```

**Design notes:**
- `on_delete restrict` on both `member_id` and `reward_id` ensures redemption history is never lost. Rewards and members with redemptions cannot be hard-deleted.
- `coupon_code` is generated at redemption time for discount-type rewards (e.g., "SAVE5-X1Y2Z3"). Application code generates unique codes and optionally syncs with e-commerce.
- Redemption cancellation triggers a `points_transaction` with type `adjust` to refund the points.
- `expires_at` supports time-limited redemptions (e.g., "use your reward within 30 days").

### 8. tiers

Tier/VIP level definitions within a program. Each tier has qualification thresholds, ordering, and a set of associated benefits. Members qualify for tiers based on configurable criteria (lifetime points earned, amount spent, or transaction count). Inspired by Smile.io VIP Tiers, LoyaltyLion Loyalty Tiers, Voucherify tier qualification, and Yotpo VIP eligibility.

```pseudo
table tiers {
  id                    uuid primary_key default auto_generate
  program_id            uuid not_null references loyalty_programs(id) on_delete cascade
                                                     -- Which program this tier belongs to.
                                                     -- Cascade: removing a program removes all its tiers.
  name                  string not_null              -- Tier name (e.g., "Bronze", "Silver", "Gold", "Platinum").
  slug                  string not_null              -- URL-friendly identifier within the program.
  description           string nullable              -- Description of tier benefits and requirements.
  position              integer not_null             -- Tier rank (1 = lowest tier, higher = more exclusive).
  qualification_type    enum(points_earned, amount_spent, transaction_count) not_null default points_earned
                                                     -- points_earned: qualify by total lifetime points earned.
                                                     -- amount_spent: qualify by cumulative spend amount.
                                                     -- transaction_count: qualify by number of qualifying transactions.
  qualification_value   integer not_null             -- Threshold to reach this tier (e.g., 1000 points, $500, 10 transactions).
  qualification_period_days integer nullable         -- Rolling qualification window in days. Null = lifetime qualification.
  retain_days           integer nullable             -- Days to retain tier after qualification period ends. Null = retain until re-evaluation.
  icon_url              string nullable              -- Tier badge/icon for display.
  color                 string nullable              -- Brand color for the tier (hex code).
  is_default            boolean not_null default false
                                                     -- Whether this is the base tier assigned to new members.
  metadata              json nullable                -- Additional tier configuration (e.g., tier-specific earning multiplier).
  created_at            timestamp default now
  updated_at            timestamp default now on_update

  indexes {
    composite_unique(program_id, slug)               -- Slugs are unique within a program.
    -- composite_unique(program_id, slug) covers index(program_id) via leading column.
    composite_unique(program_id, position)           -- Each position is unique within a program.
    index(is_default)
  }
}
```

**Design notes:**
- `qualification_type` supports the three most common qualification criteria found across implementations (Yotpo, Voucherify, Antavo). Application code evaluates members against the configured criteria.
- `qualification_value` is the threshold for the tier. For `points_earned`, this is the minimum lifetime points. For `amount_spent`, it's the minimum spend in smallest currency unit. For `transaction_count`, it's the number of qualifying transactions.
- `qualification_period_days` enables rolling windows (e.g., "spend $1000 in the last 365 days to qualify for Gold"). Null means qualification is based on all-time activity.
- `retain_days` implements a grace period — members keep their tier for this many days after they no longer meet qualification criteria, giving them a chance to re-qualify.
- `is_default` marks the base tier (e.g., "Bronze") that all new members are assigned to. Only one tier per program should have `is_default = true`.

### 9. tier_benefits

Specific benefits unlocked at each tier level. Each benefit has a type and value, enabling tier-based perks like point multipliers, free shipping, early access, and birthday bonuses. Separating benefits from tiers allows multiple benefits per tier and easy configuration changes. Inspired by Salesforce Loyalty Benefits, Antavo Benefits module, and Smile.io VIP tier perks.

```pseudo
table tier_benefits {
  id                    uuid primary_key default auto_generate
  tier_id               uuid not_null references tiers(id) on_delete cascade
                                                     -- Which tier grants this benefit.
                                                     -- Cascade: removing a tier removes its benefits.
  benefit_type          enum(points_multiplier, free_shipping, early_access, birthday_bonus, exclusive_rewards, priority_support, custom) not_null
                                                     -- points_multiplier: multiply base point earning by value.
                                                     -- free_shipping: free shipping on orders.
                                                     -- early_access: early access to sales/products.
                                                     -- birthday_bonus: bonus points on member's birthday.
                                                     -- exclusive_rewards: access to tier-exclusive rewards.
                                                     -- priority_support: priority customer support.
                                                     -- custom: app-defined benefit type.
  value                 string nullable              -- Benefit value (e.g., "2.0" for 2× multiplier, "500" for 500 birthday points).
  description           string not_null              -- Member-facing description of the benefit.
  is_active             boolean not_null default true -- Whether this benefit is currently active.
  sort_order            integer not_null default 0   -- Display ordering within the tier.
  created_at            timestamp default now
  updated_at            timestamp default now on_update

  indexes {
    index(tier_id)
    index(benefit_type)
  }
}
```

**Design notes:**
- `value` is stored as a string to accommodate different value types per benefit_type: multipliers ("2.0"), point amounts ("500"), or null for boolean benefits (free shipping, early access).
- Benefits are evaluated by application code — the schema stores the configuration, the app implements the logic (e.g., applying a points multiplier during earning, checking tier access before showing exclusive rewards).
- `custom` benefit type with a string value provides extensibility for app-specific perks not covered by the standard types.

### 10. member_tiers

Assignment of members to tier levels with temporal tracking. Each record captures when a member entered a tier, when their qualification expires, and whether the assignment was automatic or manual. Supports full tier history — when a member moves up or down, the previous record gets an `ended_at` timestamp and a new record is created. Inspired by Smile.io VIP Tier Changes, LoyaltyLion Tier Memberships, and Voucherify tier assignment tracking.

```pseudo
table member_tiers {
  id                    uuid primary_key default auto_generate
  member_id             uuid not_null references loyalty_members(id) on_delete cascade
                                                     -- Which member this tier assignment is for.
                                                     -- Cascade: removing a member removes their tier history.
  tier_id               uuid not_null references tiers(id) on_delete cascade
                                                     -- Which tier the member is assigned to.
                                                     -- Cascade: removing a tier removes its assignments.
  is_current            boolean not_null default true -- Whether this is the member's current tier assignment.
  started_at            timestamp not_null default now -- When the member entered this tier.
  ends_at               timestamp nullable           -- When this tier assignment expires. Null = no expiration.
  ended_at              timestamp nullable           -- When the member actually left this tier. Null = still active.
  qualification_snapshot json nullable               -- Snapshot of qualification data at time of assignment (e.g., points earned, spend amount).
  is_manual             boolean not_null default false
                                                     -- Whether this was a manual admin override vs automatic qualification.
  created_at            timestamp default now
  updated_at            timestamp default now on_update

  indexes {
    index(member_id, is_current)
    index(tier_id)
    index(ends_at)
  }
}
```

**Design notes:**
- `is_current` enables fast lookup of a member's current tier without scanning history. Application code must ensure only one `is_current = true` per member.
- `ended_at` vs `ends_at`: `ends_at` is the scheduled expiration (from `tiers.retain_days`), while `ended_at` is when the member actually left the tier (could be due to expiration, downgrade, or upgrade).
- `qualification_snapshot` records the qualification criteria at the time of assignment (e.g., `{"points_earned": 1500, "period_start": "2025-01-01"}`). This preserves the historical context even if the tier's qualification rules change later.
- `is_manual` distinguishes admin overrides (e.g., upgrading a VIP customer manually) from automatic tier changes based on qualification rules.

### 11. member_activities

Log of member actions that may trigger earning rules. Not every activity results in points — the activity is recorded first, then evaluated against earning rules. Provides a complete engagement history independent of the points ledger. Inspired by Smile.io Activities, LoyaltyLion Activities, and Antavo Events.

```pseudo
table member_activities {
  id                    uuid primary_key default auto_generate
  member_id             uuid not_null references loyalty_members(id) on_delete cascade
                                                     -- Which member performed the activity.
                                                     -- Cascade: removing a member removes their activity history.
  activity_type         string not_null              -- Type of activity (e.g., "purchase", "review", "referral", "check_in", "social_share").
  description           string nullable              -- Human-readable description of the activity.
  source                string nullable              -- Source system (e.g., "web", "mobile", "pos", "api").
  reference_type        string nullable              -- Type of external entity (e.g., "order", "review", "referral").
  reference_id          string nullable              -- ID of the external entity.
  monetary_value        integer nullable             -- Monetary value of the activity in smallest currency unit (e.g., order total). Null for non-monetary activities.
  currency              string nullable              -- ISO 4217 currency code for monetary_value.
  points_awarded        integer nullable             -- Points awarded for this activity (populated after earning rule evaluation). Null if no points awarded.
  transaction_id        uuid nullable references points_transactions(id) on_delete set_null
                                                     -- Link to the points transaction generated by this activity.
                                                     -- Set null: transaction can be voided without deleting the activity record.
  metadata              json nullable                -- Additional activity data (product details, review text, location, etc.).
  created_at            timestamp default now

  indexes {
    index(member_id, created_at)
    index(activity_type)
    index(reference_type, reference_id)
    index(transaction_id)
  }
}
```

**Design notes:**
- `activity_type` is a string (not enum) because activities are extensible — different programs track different types of engagement.
- Activities are recorded before points are awarded. The flow is: record activity → evaluate earning rules → if a rule matches, create a `points_transaction` → set `points_awarded` and `transaction_id` on the activity.
- `source` tracks where the activity came from (web, mobile, POS terminal, API integration) for analytics.
- `monetary_value` + `currency` capture the financial aspect of monetary activities (purchases) used by `per_currency` earning rules.
- No `updated_at` — activities are append-only. The only mutable fields are `points_awarded` and `transaction_id`, set once after earning rule evaluation.

## Relationships

### One-to-Many

```
users                  1 ──── * loyalty_members          (user → program memberships)
loyalty_programs       1 ──── * loyalty_members          (program → enrolled members)
loyalty_programs       1 ──── * earning_rules            (program → earning rules)
loyalty_programs       1 ──── * promotions               (program → promotional campaigns)
loyalty_programs       1 ──── * rewards                  (program → reward catalog)
loyalty_programs       1 ──── * tiers                    (program → tier definitions)
loyalty_members        1 ──── * points_transactions      (member → point ledger entries)
loyalty_members        1 ──── * reward_redemptions       (member → reward claims)
loyalty_members        1 ──── * member_tiers             (member → tier history)
loyalty_members        1 ──── * member_activities        (member → activity log)
rewards                1 ──── * reward_redemptions       (reward → redemption records)
tiers                  1 ──── * tier_benefits            (tier → associated benefits)
tiers                  1 ──── * member_tiers             (tier → assigned members)
tiers                  1 ──── * rewards                  (tier → tier-gated rewards, via min_tier_id)
```

### Optional References

```
points_transactions ──── ? earning_rules               (transaction may link to earning rule)
points_transactions ──── ? promotions                   (transaction may link to promotion)
points_transactions ──── ? reward_redemptions           (transaction may link to redemption)
member_activities   ──── ? points_transactions          (activity may link to generated transaction)
```

## Best Practices

- **Ledger is source of truth**: The `points_transactions` table is the authoritative record of all point movements. Cached balances on `loyalty_members` must be updated transactionally with every ledger entry. If they drift, run a reconciliation job that sums the ledger.
- **Point earning flow**: Record `member_activity` → evaluate `earning_rules` → if match, create `points_transaction` (type = earn) → update `loyalty_members.points_balance` and `lifetime_points` → optionally apply `promotions` (create additional bonus transaction).
- **Redemption flow**: Verify member has sufficient `points_balance` → create `reward_redemption` (status = pending) → create `points_transaction` (type = redeem, negative points) → update balance → fulfill reward → set redemption status = fulfilled.
- **Expiration flow**: Scheduled job queries `points_transactions WHERE type = 'earn' AND expires_at <= NOW() AND points > 0` → for each batch, create an `expire` transaction deducting the remaining points → update `loyalty_members.points_expired` and `points_balance`.
- **Tier evaluation**: Scheduled job or on-activity trigger evaluates each member's qualification metrics against tier thresholds → if member qualifies for a higher tier, create new `member_tiers` record (is_current = true) and mark old record (is_current = false, ended_at = now) → if member drops below current tier and retention period has passed, downgrade.
- **Pending points**: For purchase-based earning, create points with `is_pending = true`. After order confirmation (e.g., shipment), update to `is_pending = false` and `confirmed_at = now()`. Only confirmed points count toward `points_balance`.
- **Cancellation refunds**: When a redemption is canceled, create an `adjust` type points transaction to refund the points. Never modify or delete the original `redeem` transaction.
- **Fraud prevention**: Use `earning_rules.max_points_per_event`, `rewards.max_redemptions_per_member`, and `promotions.max_points_per_member` to cap earning and spending. Monitor for suspicious patterns (rapid point earning, immediate redemption).
- **Access control**: Use Auth / RBAC for permission checks. Members see only their own data. Program admins manage rules, rewards, and tiers. Balance-modifying operations require elevated permissions.

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
