# Auction

## Overview

Online auction platform supporting multiple auction formats — English (ascending), Dutch (descending), sealed-bid, and buy-now-only — with real-time bidding, proxy/automatic bidding, anti-sniping auto-extension, and configurable bid increment rules. Covers the full auction lifecycle: item listing with images and condition grading, auction creation with reserve prices and buyer's premiums, immutable bid history, watchlists for engagement, winner determination on close, and bidirectional feedback between buyers and sellers. Designed from a study of 10 systems: eBay, Catawiki, Christie's/Sotheby's, GunBroker, HCL Commerce, Bazaar, 32auctions, Red-Gate's auction data model, System Design Handbook, and Auction-Bidding-System.

Key design decisions: items and auctions as separate entities (items can be re-listed across multiple auctions); auction type as an enum supporting four canonical formats; immutable append-only bid history for audit trails and dispute resolution; proxy bidding via a `max_amount` field (eBay pattern — system auto-bids incrementally up to the bidder's maximum); denormalized `current_price` on auctions for instant display without aggregate queries; anti-sniping via `effective_end_time` that auto-extends when bids arrive near close; configurable tiered bid increment rules (price range → minimum increment); hierarchical categories for item organization; and bidirectional feedback (buyer↔seller) after transactions.

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (9 tables)</summary>

- [`categories`](#1-categories)
- [`bid_increment_rules`](#2-bid_increment_rules)
- [`items`](#3-items)
- [`item_images`](#4-item_images)
- [`auctions`](#5-auctions)
- [`bids`](#6-bids)
- [`watchlists`](#7-watchlists)
- [`auction_winners`](#8-auction_winners)
- [`feedback`](#9-feedback)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users` | User identity for sellers, bidders, watchers, and feedback authors |

## Tables

### Auction Configuration

| # | Table | Description |
| - | ----- | ----------- |
| 1 | `categories` | Hierarchical item categories with self-referencing parent |
| 2 | `bid_increment_rules` | Tiered bid increment rules mapping price ranges to minimum bid increments |

### Items & Media

| # | Table | Description |
| - | ----- | ----------- |
| 3 | `items` | Auction items with descriptions, condition grading, and seller reference |
| 4 | `item_images` | Ordered images/media attachments for items |

### Auctions & Bidding

| # | Table | Description |
| - | ----- | ----------- |
| 5 | `auctions` | Core auction entity with type, timing, pricing rules, and current state |
| 6 | `bids` | Immutable append-only bid history with proxy bidding support |

### Engagement

| # | Table | Description |
| - | ----- | ----------- |
| 7 | `watchlists` | User auction watchlist entries for tracking and notifications |

### Post-Auction

| # | Table | Description |
| - | ----- | ----------- |
| 8 | `auction_winners` | Winning bid records created on auction close for settlement |
| 9 | `feedback` | Bidirectional feedback and ratings between buyers and sellers |

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. categories

Hierarchical categories for organizing auction items. Supports nested categories via self-referencing `parent_id` (e.g., Electronics > Phones > iPhone). Top-level categories have `parent_id = null`. Inspired by eBay's category taxonomy and Catawiki's curated category tree.

```pseudo
table categories {
  id              uuid primary_key default auto_generate
  parent_id       uuid nullable references categories(id) on_delete set_null
                                               -- Parent category for hierarchy. Null = top-level.
  name            string not_null              -- Display name (e.g., "Electronics", "Collectibles").
  slug            string unique not_null       -- URL-friendly identifier (e.g., "electronics").
  description     string nullable              -- Optional category description.
  sort_order      integer not_null default 0   -- Display order within parent.
  is_active       boolean not_null default true -- Whether category is visible and accepting new items.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(parent_id)
  index(slug)                                  -- unique already creates an index; listed for clarity.
  index(sort_order)
}
```

**Design notes:**
- Self-referencing `parent_id` enables unlimited nesting depth. Application logic should enforce a reasonable max depth (e.g., 4 levels).
- `slug` enables SEO-friendly category URLs (e.g., `/categories/electronics/phones`).
- `sort_order` controls display ordering within sibling categories.
- `is_active` allows hiding categories without deleting them (preserves existing item references).

### 2. bid_increment_rules

Tiered bid increment rules that map price ranges to minimum bid increments. Prevents penny-bidding by requiring meaningful bid increases. Can be global (no auction reference) or auction-specific overrides. Inspired by eBay and GunBroker's published bid increment tables.

```pseudo
table bid_increment_rules {
  id              uuid primary_key default auto_generate
  auction_id      uuid nullable references auctions(id) on_delete cascade
                                               -- Null = global default rule. Non-null = auction-specific override.
  min_price       decimal not_null             -- Lower bound of price range (inclusive).
  max_price       decimal nullable             -- Upper bound of price range (exclusive). Null = no upper limit (final tier).
  increment       decimal not_null             -- Minimum bid increment for this price range.
  created_at      timestamp default now
}

indexes {
  index(auction_id)
  index(min_price)
}
```

**Design notes:**
- Rows with `auction_id = null` are global defaults (e.g., $0–$1 → $0.25 increment, $1–$5 → $0.50, etc.).
- Rows with `auction_id` set override globals for that specific auction.
- `max_price = null` on the highest tier means "any price above `min_price`".
- Application logic: find the rule where `current_price >= min_price AND (max_price IS NULL OR current_price < max_price)`, preferring auction-specific rules over globals.

### 3. items

Auction items with descriptions, condition grading, and seller reference. An item represents a physical or digital good that can be listed in one or more auctions. Separated from auctions to support re-listing (item didn't sell, reserve not met) and multiple identical items. Inspired by eBay's item listing, Catawiki's lot descriptions, and GunBroker's condition grading.

```pseudo
table items {
  id              uuid primary_key default auto_generate
  seller_id       uuid not_null references users(id) on_delete restrict
                                               -- The user who owns/is selling this item.
                                               -- Restrict: cannot delete a user with listed items.
  category_id     uuid nullable references categories(id) on_delete set_null
                                               -- Item category. Null = uncategorized.
  title           string not_null              -- Item title/name (e.g., "Vintage Rolex Submariner 1967").
  description     string nullable              -- Detailed item description (may contain HTML/markdown).
  condition       enum(new, like_new, excellent, good, fair, poor) not_null default new
                                               -- Physical condition grading.
                                               -- new: unopened/unused.
                                               -- like_new: opened but essentially unused.
                                               -- excellent: minimal signs of use.
                                               -- good: normal wear, fully functional.
                                               -- fair: noticeable wear, functional.
                                               -- poor: significant wear, may have defects.
  condition_notes string nullable              -- Additional notes about condition (e.g., "small scratch on back").
  metadata        json nullable default {}     -- Extensible attributes (dimensions, weight, material, etc.).
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(seller_id)
  index(category_id)
  index(condition)
}
```

**Design notes:**
- `seller_id` references `users` from Auth / RBAC — the person selling the item.
- Items can be re-listed in new auctions if they don't sell (reserve not met, auction cancelled).
- `condition` enum covers the standard grading scale used by eBay, GunBroker, and other platforms.
- `metadata` stores item-specific attributes (dimensions, weight, provenance) without schema changes.
- Images are in the separate `item_images` table for ordering and flexibility.

### 4. item_images

Ordered images and media attachments for auction items. Supports multiple images per item with explicit ordering and alt text for accessibility. Inspired by eBay's multi-image listings and Catawiki's professional photography requirements.

```pseudo
table item_images {
  id              uuid primary_key default auto_generate
  item_id         uuid not_null references items(id) on_delete cascade
                                               -- Which item this image belongs to.
                                               -- Cascade: deleting an item removes all its images.
  url             string not_null              -- Image URL (CDN or storage path).
  alt_text        string nullable              -- Accessibility alt text describing the image.
  sort_order      integer not_null default 0   -- Display order. 0 = primary/hero image.
  created_at      timestamp default now
}

indexes {
  index(item_id)
}
```

**Design notes:**
- `sort_order = 0` is the primary/thumbnail image shown in search results and auction cards.
- Separate table (vs. JSON array) supports ordering, alt text, and individual image management.
- Cascade delete ensures no orphaned images when an item is removed.

### 5. auctions

Core auction entity representing a single auction event for an item. Supports multiple auction types (English, Dutch, sealed-bid, buy-now-only), reserve prices, buyer's premiums, proxy bidding, and anti-sniping auto-extension. Contains denormalized current price for fast display. Inspired by eBay, Catawiki, Christie's, GunBroker, and the System Design Handbook.

```pseudo
table auctions {
  id                  uuid primary_key default auto_generate
  item_id             uuid not_null references items(id) on_delete restrict
                                               -- The item being auctioned.
                                               -- Restrict: cannot delete an item with active/completed auctions.
  seller_id           uuid not_null references users(id) on_delete restrict
                                               -- Denormalized from item for query performance.
                                               -- Restrict: cannot delete a user with auctions.
  auction_type        enum(english, dutch, sealed_bid, buy_now_only) not_null default english
                                               -- english: ascending price, highest bidder wins.
                                               -- dutch: descending price, first to accept wins.
                                               -- sealed_bid: hidden bids, highest wins at close.
                                               -- buy_now_only: fixed price, no bidding.
  status              enum(draft, scheduled, active, closing, closed, cancelled) not_null default draft
                                               -- draft: created but not yet scheduled.
                                               -- scheduled: start_time set, waiting to open.
                                               -- active: accepting bids.
                                               -- closing: in anti-snipe extension window.
                                               -- closed: auction ended, winner determined.
                                               -- cancelled: cancelled by seller or admin.
  title               string not_null          -- Auction title (may differ from item title for marketing).
  description         string nullable          -- Auction-specific description or terms.
  starting_price      decimal not_null         -- Opening/starting bid price.
  reserve_price       decimal nullable         -- Minimum price for sale. Null = no reserve (absolute auction).
  buy_now_price       decimal nullable         -- Fixed price to purchase immediately. Null = no buy-now option.
  current_price       decimal not_null default 0 -- Denormalized current highest bid (or starting price if no bids).
  bid_count           integer not_null default 0 -- Denormalized total number of bids placed.
  highest_bidder_id   uuid nullable references users(id) on_delete set_null
                                               -- Current highest bidder. Null = no bids yet.
  buyer_premium_pct   decimal nullable         -- Buyer's premium percentage (0.00–1.00). Null = no premium.
  start_time          timestamp nullable       -- When the auction opens for bidding. Null = draft.
  end_time            timestamp nullable       -- Original scheduled end time. Null = draft.
  effective_end_time  timestamp nullable       -- Actual end time (may be extended by anti-sniping). Null = draft.
  extension_seconds   integer not_null default 300
                                               -- Seconds to extend if bid arrives in extension window (default 5 min).
  extension_window_seconds integer not_null default 300
                                               -- Window before end_time in which bids trigger extension (default 5 min).
  currency            string not_null default 'USD' -- ISO 4217 currency code.
  closed_at           timestamp nullable       -- Actual close timestamp. Null = not yet closed.
  created_at          timestamp default now
  updated_at          timestamp default now on_update
}

indexes {
  index(item_id)
  index(seller_id)
  index(status)
  index(auction_type)
  index(effective_end_time)
  -- composite_unique(item_id, status) would be ideal but not applied:
  -- multiple closed/cancelled auctions per item are valid.
}
```

**Design notes:**
- `seller_id` is denormalized from `items.seller_id` for query performance (list auctions by seller without joining items).
- `current_price` and `bid_count` are denormalized — updated atomically with each new bid for instant display.
- `effective_end_time` starts equal to `end_time` and extends when bids arrive within `extension_window_seconds` of closing.
- `reserve_price` is nullable — null means an absolute auction (no minimum, item sells regardless).
- `buy_now_price` enables hybrid auctions (bid or buy immediately). When someone buys now, auction closes immediately.
- `buyer_premium_pct` is the percentage added to the hammer price charged to the winning bidder (e.g., 0.15 = 15% premium). Standard in traditional auction houses (Christie's, Sotheby's, Catawiki).
- `currency` supports multi-currency auctions. Defaults to USD.

### 6. bids

Immutable append-only bid records. Every bid placed is recorded permanently for audit trails, dispute resolution, and analytics. Supports proxy/automatic bidding via `max_amount`. Bids are never updated or deleted — only new bids are appended. Inspired by eBay's proxy bidding, System Design Handbook's idempotent bid design, and HCL Commerce's bid logging.

```pseudo
table bids {
  id              uuid primary_key default auto_generate
  auction_id      uuid not_null references auctions(id) on_delete restrict
                                               -- Which auction this bid is on.
                                               -- Restrict: cannot delete an auction with bids.
  bidder_id       uuid not_null references users(id) on_delete restrict
                                               -- Who placed this bid.
                                               -- Restrict: cannot delete a user with bid history.
  amount          decimal not_null             -- The visible bid amount placed.
  max_amount      decimal nullable             -- Maximum proxy bid amount. Null = exact bid (no proxy).
                                               -- System auto-bids up to this amount in increments.
  status          enum(active, outbid, winning, won, cancelled) not_null default active
                                               -- active: currently the highest bid.
                                               -- outbid: surpassed by a higher bid.
                                               -- winning: auction closed, pending settlement.
                                               -- won: settlement complete.
                                               -- cancelled: retracted by bidder or admin.
  is_proxy        boolean not_null default false -- Whether this bid was auto-placed by the proxy system.
  ip_address      string nullable              -- Bidder's IP address for fraud detection.
  created_at      timestamp default now        -- Server-assigned timestamp (never client-provided).
}

indexes {
  index(auction_id)
  index(bidder_id)
  composite_unique(auction_id, amount)         -- No two bids on the same auction can have the same amount.
  index(status)
}
```

**Design notes:**
- **Append-only**: Bids are never updated or deleted. Status changes (outbid, won) create a state trail.
- **Proxy bidding**: When `max_amount` is set, the system auto-places `is_proxy = true` bids up to that maximum in increments defined by `bid_increment_rules`.
- **`composite_unique(auction_id, amount)`**: Enforces that each bid amount is unique within an auction — two bidders cannot bid the exact same amount.
- `created_at` is server-assigned (never client-provided) to ensure correct ordering.
- `ip_address` supports fraud detection (e.g., detecting shill bidding from the seller's IP).

### 7. watchlists

User watchlist entries for tracking auctions of interest. Enables notifications (outbid alerts, closing soon, price changes) and quick access to watched auctions. Core engagement feature on every major auction platform. Inspired by eBay's Watch List.

```pseudo
table watchlists {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade
                                               -- The user watching the auction.
                                               -- Cascade: deleting a user removes their watchlist.
  auction_id      uuid not_null references auctions(id) on_delete cascade
                                               -- The auction being watched.
                                               -- Cascade: deleting an auction removes watchlist entries.
  notify_outbid   boolean not_null default true  -- Notify when user is outbid on this auction.
  notify_ending   boolean not_null default true  -- Notify when auction is about to end.
  created_at      timestamp default now
}

indexes {
  composite_unique(user_id, auction_id)        -- A user can only watch an auction once.
  -- composite_unique(user_id, auction_id) covers index(user_id) via leading column.
  index(auction_id)
}
```

**Design notes:**
- `composite_unique(user_id, auction_id)` prevents duplicate watchlist entries and covers queries for "all auctions watched by user X" via leading column.
- Notification preferences are per-watchlist-entry — users can customize which alerts they receive per auction.
- Cascade deletes on both sides ensure no orphaned entries.

### 8. auction_winners

Winner records created when an auction closes. Captures the winning bid, final price, buyer's premium, and settlement status. Decoupled from bid records to provide a clean post-auction settlement entity. Inspired by HCL Commerce's WINBID table and traditional auction house settlement workflows.

```pseudo
table auction_winners {
  id              uuid primary_key default auto_generate
  auction_id      uuid unique not_null references auctions(id) on_delete restrict
                                               -- One winner per auction.
                                               -- Restrict: cannot delete a completed auction.
  winning_bid_id  uuid unique not_null references bids(id) on_delete restrict
                                               -- The winning bid.
                                               -- Restrict: cannot delete the winning bid.
  winner_id       uuid not_null references users(id) on_delete restrict
                                               -- The winning bidder (denormalized from bid).
                                               -- Restrict: cannot delete a winning user.
  seller_id       uuid not_null references users(id) on_delete restrict
                                               -- The seller (denormalized from auction/item).
                                               -- Restrict: cannot delete a selling user.
  hammer_price    decimal not_null             -- Final auction price (the winning bid amount).
  buyer_premium   decimal not_null default 0   -- Buyer's premium amount (hammer_price * buyer_premium_pct).
  total_price     decimal not_null             -- Total due from buyer (hammer_price + buyer_premium).
  settlement_status enum(pending, paid, shipped, completed, disputed, refunded) not_null default pending
                                               -- pending: awaiting payment.
                                               -- paid: buyer has paid.
                                               -- shipped: item shipped by seller.
                                               -- completed: item received, transaction done.
                                               -- disputed: buyer or seller opened a dispute.
                                               -- refunded: payment refunded.
  paid_at         timestamp nullable           -- When payment was received. Null = not yet paid.
  shipped_at      timestamp nullable           -- When item was shipped. Null = not yet shipped.
  completed_at    timestamp nullable           -- When transaction was marked complete. Null = not yet complete.
  notes           string nullable              -- Admin/internal notes about settlement.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(winner_id)
  index(seller_id)
  index(settlement_status)
}
```

**Design notes:**
- One-to-one with `auctions` (enforced by `unique` on `auction_id`). Only auctions that close with a valid winning bid get a winner record.
- `hammer_price` + `buyer_premium` = `total_price`. Pre-computed for display and reporting.
- `settlement_status` tracks the full post-auction lifecycle: payment → shipping → completion.
- Denormalized `winner_id` and `seller_id` avoid joins for common queries (e.g., "all auctions I've won").

### 9. feedback

Bidirectional feedback and ratings between buyers and sellers after a completed auction. Supports both buyer-to-seller and seller-to-buyer ratings. Core trust mechanism for auction platforms. Inspired by eBay's feedback system and Catawiki's seller ratings.

```pseudo
table feedback {
  id              uuid primary_key default auto_generate
  auction_winner_id uuid not_null references auction_winners(id) on_delete cascade
                                               -- Which completed auction this feedback is for.
                                               -- Cascade: removing a winner record removes feedback.
  author_id       uuid not_null references users(id) on_delete cascade
                                               -- Who wrote the feedback.
                                               -- Cascade: removing a user removes their authored feedback.
  recipient_id    uuid not_null references users(id) on_delete cascade
                                               -- Who receives the feedback.
                                               -- Cascade: removing a user removes feedback about them.
  direction       enum(buyer_to_seller, seller_to_buyer) not_null
                                               -- Direction of feedback.
                                               -- buyer_to_seller: winner rates the seller.
                                               -- seller_to_buyer: seller rates the winning buyer.
  rating          integer not_null             -- Rating score (1–5).
  comment         string nullable              -- Optional text feedback.
  created_at      timestamp default now
}

indexes {
  composite_unique(auction_winner_id, direction) -- One feedback per direction per auction.
  -- composite_unique(auction_winner_id, direction) covers index(auction_winner_id) via leading column.
  index(recipient_id)
  index(author_id)
}
```

**Design notes:**
- Each completed auction allows up to two feedback entries: one from buyer to seller, one from seller to buyer. Enforced by `composite_unique(auction_winner_id, direction)`.
- `rating` is 1–5 (application-enforced range). Enables aggregate seller/buyer reputation scores.
- Feedback is tied to `auction_winners` (not `auctions`) to ensure only completed transactions generate feedback.
- `author_id` and `recipient_id` are both `users` references — the direction enum clarifies the role.

## Relationships

```
categories       1 ──── * categories           (self-referencing hierarchy: parent → children)
categories       1 ──── * items                (one category has many items)
users            1 ──── * items                (one seller has many items)
items            1 ──── * item_images           (one item has many images)
items            1 ──── * auctions             (one item can be auctioned multiple times)
auctions         1 ──── * bids                 (one auction has many bids)
auctions         1 ──── * watchlists           (one auction has many watchers)
auctions         1 ──── * bid_increment_rules  (one auction can override global increment rules)
auctions         1 ──── 1 auction_winners      (one auction has at most one winner)
auction_winners  1 ──── * feedback             (one winner record has up to two feedback entries)
users            1 ──── * auctions             (one seller has many auctions)
users            1 ──── * bids                 (one bidder has many bids)
users            1 ──── * watchlists           (one user watches many auctions)
users            1 ──── * auction_winners      (one user wins many auctions)
users            1 ──── * feedback             (one user authors/receives many feedback entries)
```

## Best Practices

- **Immutable bids**: Never update or delete bid records. Use status changes for state transitions. This preserves the audit trail for dispute resolution.
- **Atomic bid placement**: Update `auctions.current_price`, `auctions.bid_count`, and `auctions.highest_bidder_id` in the same transaction as inserting the bid. Use database transactions or optimistic concurrency control.
- **Anti-sniping**: When a bid arrives within `extension_window_seconds` of `effective_end_time`, extend `effective_end_time` by `extension_seconds`. This prevents last-second sniping.
- **Proxy bidding**: When a bidder sets `max_amount`, the system should auto-place bids (with `is_proxy = true`) at the minimum increment above the current price, up to `max_amount`.
- **Server-side timestamps**: Always use server-assigned `created_at` for bid ordering. Never trust client-provided timestamps.
- **Winner determination**: On auction close, create an `auction_winners` record from the highest bid. For sealed-bid auctions, reveal all bids at close and pick the highest.
- **Reserve price handling**: If the highest bid is below `reserve_price` at close, do not create an `auction_winners` record. Mark the auction as closed with no winner. The item can be re-listed.

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
