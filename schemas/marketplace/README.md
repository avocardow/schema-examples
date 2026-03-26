# Marketplace (Multi-vendor)

## Overview

Multi-vendor marketplace layer that sits on top of e-commerce, enabling multiple independent sellers to list and sell products through a single storefront. Covers the full vendor lifecycle: onboarding with document verification, public store profiles, team management, and business addresses; product listings bridging vendors to the shared product catalog with vendor-specific pricing per variant; order splitting into vendor sub-orders with independent fulfillment; granular commission rules (global, per-vendor, per-category); a double-entry balance and ledger system for vendor earnings and payouts; customer-vendor dispute resolution with message threads; and vendor reputation through customer reviews. Designed from a study of 8 systems: Sharetribe, Medusa.js, Stripe Connect, Spree Commerce, Dokan, CS-Cart Multi-Vendor, Mirakl, and Webkul.

Key design decisions: vendors as first-class entities separate from users (supports multi-member vendor teams); listing/offer model bridging vendors to e-commerce products (multiple vendors can sell the same product — Amazon pattern); order splitting into vendor sub-orders (each vendor sees only their portion); balance + ledger model for financial tracking (every money movement is an append-only ledger entry, with running balance for quick queries); granular commission rules with scope-based resolution (global → vendor → category, most specific wins); separate vendor profiles for public storefront data vs. operational vendor data.

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (17 tables)</summary>

- [`vendors`](#1-vendors)
- [`vendor_profiles`](#2-vendor_profiles)
- [`vendor_members`](#3-vendor_members)
- [`vendor_addresses`](#4-vendor_addresses)
- [`vendor_documents`](#5-vendor_documents)
- [`commission_rules`](#6-commission_rules)
- [`listings`](#7-listings)
- [`listing_variants`](#8-listing_variants)
- [`vendor_orders`](#9-vendor_orders)
- [`vendor_order_items`](#10-vendor_order_items)
- [`payouts`](#11-payouts)
- [`payout_items`](#12-payout_items)
- [`vendor_balances`](#13-vendor_balances)
- [`balance_transactions`](#14-balance_transactions)
- [`disputes`](#15-disputes)
- [`dispute_messages`](#16-dispute_messages)
- [`vendor_reviews`](#17-vendor_reviews)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users` | User identity for vendor ownership, team members, customers, and audit trails |
| [E-commerce](../e-commerce) | `products`, `product_variants`, `orders`, `order_items`, `categories` | Product catalog, variant pricing, order references, and category-based commissions |

## Tables

### Vendor Management

| # | Table | Description |
| - | ----- | ----------- |
| 1 | `vendors` | Core vendor entity with onboarding status and contact info |
| 2 | `vendor_profiles` | Public-facing store profiles with branding and policies |
| 3 | `vendor_members` | Staff/team members within a vendor with roles |
| 4 | `vendor_addresses` | Vendor business and return addresses |
| 5 | `vendor_documents` | KYC/verification documents for onboarding and compliance |

### Catalog & Listings

| # | Table | Description |
| - | ----- | ----------- |
| 6 | `commission_rules` | Commission rates with multi-scope support (global, vendor, category) |
| 7 | `listings` | Vendor product listings bridging vendors to e-commerce products |
| 8 | `listing_variants` | Vendor-specific variant pricing and availability |

### Orders

| # | Table | Description |
| - | ----- | ----------- |
| 9 | `vendor_orders` | Sub-orders routed to specific vendors (split from marketplace order) |
| 10 | `vendor_order_items` | Line items within vendor sub-orders |

### Finance & Payouts

| # | Table | Description |
| - | ----- | ----------- |
| 11 | `payouts` | Scheduled/completed payouts to vendors |
| 12 | `payout_items` | Individual line items within a payout |
| 13 | `vendor_balances` | Running balance per vendor |
| 14 | `balance_transactions` | Append-only ledger of all balance changes |

### Trust & Safety

| # | Table | Description |
| - | ----- | ----------- |
| 15 | `disputes` | Customer-vendor disputes on orders |
| 16 | `dispute_messages` | Communication messages within disputes |
| 17 | `vendor_reviews` | Customer reviews and ratings of vendors |

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. vendors

Core vendor entity representing an independent seller on the marketplace. Tracks onboarding status, verification, and primary contact information. Operational data lives here; public storefront data lives in `vendor_profiles`. Inspired by Spree Vendor, Mirakl Seller, and Stripe Connected Account.

```pseudo
table vendors {
  id              uuid primary_key default auto_generate
  owner_id        uuid not_null references users(id) on_delete restrict
                                               -- Primary owner/creator of the vendor account.
                                               -- Restrict: cannot delete a user who owns a vendor.
  name            string not_null              -- Legal/business name of the vendor.
  slug            string unique not_null       -- URL-friendly identifier for the vendor (e.g., "acme-electronics").
  email           string not_null              -- Primary contact email for the vendor.
  phone           string nullable              -- Contact phone number.
  status          enum(pending, active, suspended, deactivated) not_null default pending
                                               -- pending: awaiting review/approval.
                                               -- active: approved and can list/sell products.
                                               -- suspended: temporarily disabled (policy violation, investigation).
                                               -- deactivated: permanently closed by vendor or admin.
  verification_status enum(unverified, pending_review, verified, rejected) not_null default unverified
                                               -- unverified: no documents submitted.
                                               -- pending_review: documents submitted, awaiting review.
                                               -- verified: documents reviewed and approved (KYC complete).
                                               -- rejected: documents rejected — vendor must resubmit.
  commission_rate decimal nullable             -- Vendor-specific commission override (0.00–1.00). Null = use global/category rate.
  metadata        json nullable default {}     -- Extensible key-value data (payment provider IDs, tax info, etc.).
  approved_at     timestamp nullable           -- When the vendor was approved. Null = not yet approved.
  suspended_at    timestamp nullable           -- When the vendor was suspended. Null = not suspended.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(owner_id)
  index(status)
  index(verification_status)
}
```

**Design notes:**
- `owner_id` references `users` from Auth / RBAC — the user who created the vendor account. Other team members are in `vendor_members`.
- `commission_rate` at the vendor level overrides the global rate. Category-level rates (in `commission_rules`) can further override this. Resolution: most specific scope wins.
- `slug` enables SEO-friendly vendor URLs (e.g., `/vendors/acme-electronics`).
- `metadata` stores payment provider references (Stripe Connect account IDs, PayPal merchant IDs) without schema changes.

### 2. vendor_profiles

Public-facing store profile for a vendor. Contains all the branding, description, and policy information displayed on the vendor's storefront page. Separated from the `vendors` table to keep operational data private and public display data in a dedicated location. Inspired by Dokan vendor stores and Webkul seller profiles.

```pseudo
table vendor_profiles {
  id              uuid primary_key default auto_generate
  vendor_id       uuid unique not_null references vendors(id) on_delete cascade
                                               -- One profile per vendor.
                                               -- Cascade: deleting a vendor removes its profile.
  display_name    string not_null              -- Public display name (may differ from legal name).
  tagline         string nullable              -- Short tagline/slogan (e.g., "Quality electronics since 2010").
  description     string nullable              -- Full store description (may contain HTML/markdown).
  logo_url        string nullable              -- Vendor logo image URL.
  banner_url      string nullable              -- Store banner/hero image URL.
  website_url     string nullable              -- Vendor's external website.
  social_links    json nullable                -- Social media links as JSON (e.g., {"twitter": "...", "instagram": "..."}).
  return_policy   string nullable              -- Vendor-specific return policy text.
  shipping_policy string nullable              -- Vendor-specific shipping policy text.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}
```

**Design notes:**
- One-to-one relationship with `vendors` (enforced by `unique` on `vendor_id`).
- `display_name` allows vendors to use a storefront name different from their legal business name.
- Policies (`return_policy`, `shipping_policy`) enable vendor-specific terms that override marketplace defaults.

### 3. vendor_members

Staff and team members within a vendor organization. Supports multi-member vendor teams with role-based access. The vendor owner is always a member with the `owner` role. Inspired by Spree Vendor Users and CS-Cart vendor admin users.

```pseudo
table vendor_members {
  id              uuid primary_key default auto_generate
  vendor_id       uuid not_null references vendors(id) on_delete cascade
                                               -- Which vendor this member belongs to.
                                               -- Cascade: deleting a vendor removes all members.
  user_id         uuid not_null references users(id) on_delete cascade
                                               -- The user account. Cascade: removing a user removes their memberships.
  role            enum(owner, admin, editor, viewer) not_null default viewer
                                               -- owner: full control, cannot be removed.
                                               -- admin: manage products, orders, settings.
                                               -- editor: manage products and listings.
                                               -- viewer: read-only access to vendor dashboard.
  invited_by      uuid nullable references users(id) on_delete set_null
                                               -- Who invited this member. Null = original owner.
  joined_at       timestamp nullable           -- When the member accepted the invitation. Null = pending invite.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  composite_unique(vendor_id, user_id)        -- A user can only be a member of a vendor once.
  index(user_id)
}
```

**Design notes:**
- `composite_unique(vendor_id, user_id)` ensures a user can't be added to the same vendor twice.
- `joined_at` being null indicates a pending invitation that hasn't been accepted yet.
- The `owner` role is assigned to the vendor creator and cannot be removed via the team management UI (enforced in application logic).

### 4. vendor_addresses

Business and return addresses for vendors. Vendors may have multiple addresses for different purposes (business headquarters, warehouse, return processing). Inspired by Stripe Connect account address requirements and marketplace KYC standards.

```pseudo
table vendor_addresses {
  id              uuid primary_key default auto_generate
  vendor_id       uuid not_null references vendors(id) on_delete cascade
                                               -- Which vendor this address belongs to.
                                               -- Cascade: deleting a vendor removes all addresses.
  type            enum(business, warehouse, return) not_null
                                               -- business: legal/headquarters address.
                                               -- warehouse: inventory/fulfillment location.
                                               -- return: where customers send returns.
  label           string nullable              -- Display label (e.g., "Main Office", "East Coast Warehouse").
  address_line1   string not_null              -- Street address line 1.
  address_line2   string nullable              -- Street address line 2 (suite, unit, etc.).
  city            string not_null              -- City.
  region          string nullable              -- State, province, or region.
  postal_code     string nullable              -- Postal/ZIP code.
  country         string not_null              -- ISO 3166-1 alpha-2 country code.
  phone           string nullable              -- Phone number for this location.
  is_default      boolean not_null default false -- Whether this is the default address for its type.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(vendor_id, type)
}
```

### 5. vendor_documents

KYC (Know Your Customer) and verification documents submitted by vendors during onboarding. Tracks document type, review status, and expiry for compliance. Actual files are stored in external storage (referenced by URL). Inspired by Stripe Connect identity verification and Mirakl seller documents.

```pseudo
table vendor_documents {
  id              uuid primary_key default auto_generate
  vendor_id       uuid not_null references vendors(id) on_delete cascade
                                               -- Which vendor submitted this document.
                                               -- Cascade: deleting a vendor removes all documents.
  type            enum(business_license, tax_certificate, identity_proof, bank_statement, other) not_null
                                               -- business_license: business registration document.
                                               -- tax_certificate: tax ID or VAT certificate.
                                               -- identity_proof: government-issued ID (passport, driver's license).
                                               -- bank_statement: bank account verification.
                                               -- other: other supporting documents.
  file_url        string not_null              -- URL to the uploaded document (stored externally).
  file_name       string not_null              -- Original file name for display.
  status          enum(pending, approved, rejected) not_null default pending
                                               -- pending: submitted, awaiting admin review.
                                               -- approved: document verified and accepted.
                                               -- rejected: document rejected (invalid, expired, unreadable).
  rejection_reason string nullable             -- Why the document was rejected. Null if not rejected.
  reviewed_by     uuid nullable references users(id) on_delete set_null
                                               -- Admin who reviewed the document. Null = not yet reviewed.
  reviewed_at     timestamp nullable           -- When the document was reviewed.
  expires_at      timestamp nullable           -- Document expiry date. Null = no expiry.
  created_at      timestamp default now
}

indexes {
  index(vendor_id, type)
  index(status)
}
```

**Design notes:**
- Documents are stored externally (S3, cloud storage) — `file_url` is a reference, not the file itself.
- `expires_at` enables compliance workflows — the platform can notify vendors when documents are about to expire.
- Security: document URLs should be signed/temporary to prevent unauthorized access.

### 6. commission_rules

Commission rates with multi-scope support. Rules can apply globally (to all vendors), to a specific vendor, or to a specific product category. When multiple rules match, the most specific scope wins (category > vendor > global). Inspired by Spree Commerce commissions, CS-Cart commission grids, and Mirakl commission tiers.

```pseudo
table commission_rules {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Rule name for admin reference (e.g., "Global Default", "Electronics Category").
  scope           enum(global, vendor, category) not_null
                                               -- global: applies to all vendors/categories.
                                               -- vendor: applies to a specific vendor.
                                               -- category: applies to a specific product category.
  vendor_id       uuid nullable references vendors(id) on_delete cascade
                                               -- Target vendor when scope = vendor. Null for global/category rules.
                                               -- Cascade: removing a vendor removes their specific rules.
  category_id     uuid nullable references categories(id) on_delete cascade
                                               -- Target category when scope = category. Null for global/vendor rules.
                                               -- Cascade: removing a category removes its commission rules.
  rate_type       enum(percentage, flat, hybrid) not_null default percentage
                                               -- percentage: take a percentage of the sale.
                                               -- flat: fixed amount per transaction.
                                               -- hybrid: percentage + flat fee.
  percentage_rate decimal nullable             -- Commission percentage (0.00–1.00). Required when rate_type = percentage or hybrid.
  flat_rate       integer nullable             -- Flat commission amount in smallest currency unit. Required when rate_type = flat or hybrid.
  currency        string nullable              -- ISO 4217 currency code for flat_rate. Null when rate_type = percentage.
  min_commission  integer nullable             -- Minimum commission per transaction in smallest currency unit. Null = no minimum.
  max_commission  integer nullable             -- Maximum commission cap per transaction. Null = no cap.
  is_active       boolean not_null default true -- Whether this rule is currently active.
  priority        integer not_null default 0   -- Tie-breaking priority within the same scope. Higher = higher priority.
  effective_from  timestamp nullable           -- When this rule becomes active. Null = immediately.
  effective_to    timestamp nullable           -- When this rule expires. Null = no expiry.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(scope, is_active)
  index(vendor_id)
  index(category_id)
}
```

**Design notes:**
- Resolution order: category-specific rule > vendor-specific rule > global rule. Within the same scope, `priority` breaks ties.
- `hybrid` rate combines a percentage and a flat fee (e.g., 10% + $0.30 per transaction — similar to payment processor pricing).
- `effective_from` / `effective_to` enable scheduled commission changes (e.g., promotional periods with lower commission).

### 7. listings

Vendor product listings that bridge vendors to the shared e-commerce product catalog. Each listing represents a vendor's offer to sell a specific product. Multiple vendors can list the same product (Amazon-style marketplace). The listing controls vendor-specific status and handling time. Inspired by Mirakl offers, Amazon seller listings, and eBay listings.

```pseudo
table listings {
  id              uuid primary_key default auto_generate
  vendor_id       uuid not_null references vendors(id) on_delete cascade
                                               -- Which vendor is offering this product.
                                               -- Cascade: removing a vendor removes all their listings.
  product_id      uuid not_null references products(id) on_delete cascade
                                               -- Which e-commerce product this listing is for.
                                               -- Cascade: removing a product removes all vendor listings for it.
  status          enum(draft, pending_approval, active, paused, rejected, archived) not_null default draft
                                               -- draft: vendor is preparing the listing.
                                               -- pending_approval: submitted for marketplace review.
                                               -- active: approved and visible on storefront.
                                               -- paused: temporarily hidden by vendor.
                                               -- rejected: marketplace admin rejected the listing.
                                               -- archived: no longer available (vendor or system archived).
  condition       enum(new, refurbished, used_like_new, used_good, used_fair) not_null default new
                                               -- Product condition for this vendor's offer.
  handling_days   integer not_null default 1   -- Business days to prepare the order before shipping.
  rejection_reason string nullable             -- Why the listing was rejected. Null if not rejected.
  approved_at     timestamp nullable           -- When the listing was approved. Null = not yet approved.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  composite_unique(vendor_id, product_id)     -- A vendor can only list a product once.
  index(product_id, status)                   -- Find active listings for a product.
  index(status)
}
```

**Design notes:**
- `composite_unique(vendor_id, product_id)` prevents duplicate listings — one vendor, one listing per product.
- Listing approval workflow: draft → pending_approval → active (or rejected). Vendors cannot bypass marketplace review.
- `condition` supports used/refurbished product marketplaces (eBay, Amazon Renewed pattern).
- `handling_days` factors into estimated delivery time shown to customers.

### 8. listing_variants

Vendor-specific pricing and availability for each product variant within a listing. When a vendor lists a product, they can set individual prices, stock levels, and availability per variant (size, color, etc.). Inspired by Amazon seller pricing per ASIN variant and Mirakl offer pricing.

```pseudo
table listing_variants {
  id              uuid primary_key default auto_generate
  listing_id      uuid not_null references listings(id) on_delete cascade
                                               -- Parent listing. Cascade: removing a listing removes all variant pricing.
  variant_id      uuid not_null references product_variants(id) on_delete cascade
                                               -- Which product variant this pricing is for.
                                               -- Cascade: removing a variant removes vendor pricing for it.
  price           integer not_null             -- Vendor's price in smallest currency unit.
  currency        string not_null              -- ISO 4217 currency code.
  sale_price      integer nullable             -- Sale/promotional price. Null = no sale.
  stock_quantity  integer not_null default 0   -- Available stock for this vendor.
  is_active       boolean not_null default true -- Whether this variant is available from this vendor.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  composite_unique(listing_id, variant_id)    -- One price per variant per listing.
  index(variant_id, is_active)
}
```

**Design notes:**
- Price competition: customers see all active vendor prices for a variant and choose. The "Buy Box" winner is determined by application logic (price, rating, handling time, etc.).
- `stock_quantity` is vendor-specific — the same variant can have different stock levels per vendor.
- `sale_price` enables vendor-level promotions independent of marketplace-wide discounts.

### 9. vendor_orders

Sub-orders routed to specific vendors. When a marketplace order contains items from multiple vendors, it is split into one `vendor_order` per vendor. Each vendor sees and manages only their portion. Inspired by Medusa order splitting, Dokan sub-orders, and Spree vendor orders.

```pseudo
table vendor_orders {
  id              uuid primary_key default auto_generate
  order_id        uuid not_null references orders(id) on_delete restrict
                                               -- Parent marketplace order.
                                               -- Restrict: don't delete orders with vendor sub-orders.
  vendor_id       uuid not_null references vendors(id) on_delete restrict
                                               -- Which vendor this sub-order is assigned to.
                                               -- Restrict: don't delete vendors with outstanding orders.
  vendor_order_number string unique not_null   -- Human-readable vendor order number (e.g., "VO-20240315-A1B2").
  status          enum(pending, confirmed, processing, shipped, delivered, canceled, refunded) not_null default pending
  currency        string not_null              -- ISO 4217 currency code.
  subtotal        integer not_null             -- Sum of all line items for this vendor.
  shipping_total  integer not_null default 0   -- Shipping cost for this vendor's items.
  tax_total       integer not_null default 0   -- Tax on this vendor's items.
  discount_total  integer not_null default 0   -- Discount applied to this vendor's items.
  total           integer not_null             -- Final total: subtotal + shipping + tax - discount.
  commission_amount integer not_null default 0 -- Platform commission deducted from this order.
  vendor_earning  integer not_null default 0   -- Net vendor earning: total - commission.
  note            string nullable              -- Internal note about this vendor order.
  shipped_at      timestamp nullable           -- When the vendor shipped the order.
  delivered_at    timestamp nullable           -- When delivery was confirmed.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(order_id)
  index(vendor_id, status)
  index(status)
  index(created_at)
}
```

**Design notes:**
- One `vendor_order` per vendor per marketplace order. If a customer buys from 3 vendors, 3 vendor orders are created.
- `commission_amount` and `vendor_earning` are calculated at order creation time using the applicable `commission_rules`.
- All money fields are integers in the smallest currency unit (cents for USD).
- Vendors manage their sub-order lifecycle independently (confirm, ship, deliver).

### 10. vendor_order_items

Line items within a vendor sub-order. Each record maps to an item from the parent marketplace order, scoped to a specific vendor. Contains product snapshots frozen at purchase time.

```pseudo
table vendor_order_items {
  id              uuid primary_key default auto_generate
  vendor_order_id uuid not_null references vendor_orders(id) on_delete cascade
                                               -- Parent vendor order. Cascade: removing a vendor order removes its items.
  order_item_id   uuid not_null references order_items(id) on_delete cascade
                                               -- Reference to the original marketplace order item.
                                               -- Cascade: removing an order item removes the vendor copy.
  listing_variant_id uuid nullable references listing_variants(id) on_delete set_null
                                               -- Which vendor listing variant this item came from.
                                               -- Set null: listing may be archived after purchase.
  product_name    string not_null              -- Product name snapshot at time of purchase.
  variant_title   string not_null              -- Variant title snapshot (e.g., "Large / Blue").
  sku             string nullable              -- SKU snapshot.
  unit_price      integer not_null             -- Vendor's price per unit.
  quantity        integer not_null             -- Number of units.
  subtotal        integer not_null             -- unit_price × quantity.
  commission_amount integer not_null default 0 -- Commission on this line item.
  vendor_earning  integer not_null default 0   -- Vendor earning on this line item.
  created_at      timestamp default now
}

indexes {
  index(vendor_order_id)
  index(order_item_id)
}
```

### 11. payouts

Scheduled or completed payouts to vendors. Payouts batch multiple vendor order earnings into a single disbursement. Supports configurable payout schedules (daily, weekly, monthly). Inspired by Stripe Connect payouts and Dokan withdraw system.

```pseudo
table payouts {
  id              uuid primary_key default auto_generate
  vendor_id       uuid not_null references vendors(id) on_delete restrict
                                               -- Which vendor is receiving this payout.
                                               -- Restrict: don't delete vendors with payout records.
  payout_number   string unique not_null       -- Human-readable payout reference (e.g., "PAY-20240315-X1Y2").
  status          enum(pending, processing, completed, failed, canceled) not_null default pending
                                               -- pending: scheduled but not yet initiated.
                                               -- processing: payout initiated with payment provider.
                                               -- completed: funds transferred successfully.
                                               -- failed: transfer failed (retry or investigate).
                                               -- canceled: payout canceled before processing.
  currency        string not_null              -- ISO 4217 currency code.
  amount          integer not_null             -- Payout amount in smallest currency unit.
  fee             integer not_null default 0   -- Transfer fee deducted (e.g., bank transfer fee).
  net_amount      integer not_null             -- Amount vendor receives: amount - fee.
  provider        string nullable              -- Payment provider used (e.g., "stripe", "paypal", "bank_transfer").
  provider_id     string nullable              -- Provider-side payout/transfer ID.
  period_start    timestamp not_null           -- Start of the earnings period covered by this payout.
  period_end      timestamp not_null           -- End of the earnings period covered by this payout.
  note            string nullable              -- Internal note about the payout.
  completed_at    timestamp nullable           -- When the payout was completed.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(vendor_id, status)
  index(status)
  index(period_start, period_end)
}
```

**Design notes:**
- Payouts cover an earnings period (`period_start` to `period_end`). All settled vendor earnings in that period are batched into one payout.
- `net_amount` = `amount` - `fee`. The vendor sees the net amount deposited.
- `provider_id` enables reconciliation with the payment provider's records.

### 12. payout_items

Individual line items within a payout, linking each earning to its source vendor order. Provides a detailed breakdown of what is included in each payout for transparency and reconciliation.

```pseudo
table payout_items {
  id              uuid primary_key default auto_generate
  payout_id       uuid not_null references payouts(id) on_delete cascade
                                               -- Parent payout. Cascade: removing a payout removes its items.
  vendor_order_id uuid not_null references vendor_orders(id) on_delete restrict
                                               -- Which vendor order this earning comes from.
                                               -- Restrict: don't delete vendor orders included in payouts.
  amount          integer not_null             -- Vendor earning from this order included in the payout.
  commission      integer not_null default 0   -- Commission deducted from this order.
  created_at      timestamp default now
}

indexes {
  composite_unique(payout_id, vendor_order_id) -- Each vendor order appears once per payout.
  -- composite_unique(payout_id, vendor_order_id) covers index(payout_id) via leading column.
}
```

### 13. vendor_balances

Running balance per vendor. Updated transactionally with every balance-changing event (order earning, commission deduction, payout, refund, adjustment). Provides a quick-access current balance without summing the entire ledger. Inspired by Stripe Connect balance and Dokan vendor balance.

```pseudo
table vendor_balances {
  id              uuid primary_key default auto_generate
  vendor_id       uuid unique not_null references vendors(id) on_delete cascade
                                               -- One balance per vendor.
                                               -- Cascade: deleting a vendor removes its balance.
  currency        string not_null              -- ISO 4217 currency code.
  available       integer not_null default 0   -- Funds available for payout (cleared earnings minus pending payouts).
  pending         integer not_null default 0   -- Funds earned but not yet available (in escrow/hold period).
  total_earned    integer not_null default 0   -- Lifetime total earnings.
  total_paid_out  integer not_null default 0   -- Lifetime total payouts.
  updated_at      timestamp default now on_update
}
```

**Design notes:**
- One-to-one with `vendors` (enforced by `unique` on `vendor_id`).
- `available` = funds the vendor can withdraw now. `pending` = funds in escrow (e.g., waiting for delivery confirmation or dispute window to close).
- `total_earned` and `total_paid_out` provide lifetime summaries without querying the ledger.
- Balance must always be updated transactionally alongside `balance_transactions` entries.

### 14. balance_transactions

Append-only ledger of all balance changes for vendors. Every credit or debit to a vendor's balance is recorded as a transaction entry. Provides a complete audit trail for financial reconciliation. Inspired by Stripe Balance Transactions.

```pseudo
table balance_transactions {
  id              uuid primary_key default auto_generate
  vendor_id       uuid not_null references vendors(id) on_delete restrict
                                               -- Which vendor's balance this transaction affects.
                                               -- Restrict: don't delete vendors with transaction history.
  type            enum(earning, commission, payout, refund, adjustment, hold, release) not_null
                                               -- earning: vendor earned from a sale (credit).
                                               -- commission: platform commission deducted (debit).
                                               -- payout: funds paid out to vendor (debit).
                                               -- refund: refund deducted from vendor (debit).
                                               -- adjustment: manual adjustment by admin (credit or debit).
                                               -- hold: funds moved to pending/escrow (debit from available).
                                               -- release: funds released from escrow (credit to available).
  amount          integer not_null             -- Transaction amount in smallest currency unit. Positive = credit, negative = debit.
  currency        string not_null              -- ISO 4217 currency code.
  running_balance integer not_null             -- Vendor's available balance after this transaction.
  reference_type  string nullable              -- What entity this transaction references (e.g., "vendor_order", "payout", "refund").
  reference_id    string nullable              -- ID of the referenced entity.
  description     string nullable              -- Human-readable description of the transaction.
  created_at      timestamp default now
}

indexes {
  index(vendor_id, created_at)
  index(type)
  index(reference_type, reference_id)
}
```

**Design notes:**
- **Append-only** — transactions are never updated or deleted. Corrections are made by adding new adjustment entries.
- `running_balance` captures the balance snapshot at each point in time, enabling balance reconciliation without replaying the entire ledger.
- `reference_type` + `reference_id` provide a polymorphic link to the source event (order, payout, refund, etc.).

### 15. disputes

Customer-vendor disputes on marketplace orders. Covers the full dispute lifecycle from filing through resolution. The marketplace operator acts as mediator between customer and vendor. Inspired by eBay Resolution Center, Amazon A-to-Z Guarantee, and Stripe Disputes.

```pseudo
table disputes {
  id              uuid primary_key default auto_generate
  vendor_order_id uuid not_null references vendor_orders(id) on_delete restrict
                                               -- Which vendor order is disputed.
                                               -- Restrict: don't delete vendor orders with disputes.
  customer_id     uuid not_null references users(id) on_delete restrict
                                               -- Customer who filed the dispute.
                                               -- Restrict: don't delete users with active disputes.
  vendor_id       uuid not_null references vendors(id) on_delete restrict
                                               -- Vendor being disputed.
                                               -- Restrict: don't delete vendors with active disputes.
  reason          enum(not_received, not_as_described, defective, wrong_item, unauthorized, other) not_null
                                               -- not_received: item never arrived.
                                               -- not_as_described: item doesn't match listing.
                                               -- defective: item is broken/faulty.
                                               -- wrong_item: received a different item.
                                               -- unauthorized: customer didn't authorize the purchase.
                                               -- other: other issue.
  status          enum(open, under_review, escalated, resolved_customer, resolved_vendor, closed) not_null default open
                                               -- open: dispute filed, awaiting response.
                                               -- under_review: marketplace is reviewing evidence.
                                               -- escalated: escalated to marketplace admin for decision.
                                               -- resolved_customer: resolved in customer's favor (refund issued).
                                               -- resolved_vendor: resolved in vendor's favor (no refund).
                                               -- closed: dispute closed (no further action).
  description     string not_null              -- Customer's description of the issue.
  resolution_note string nullable              -- Admin's resolution explanation. Null until resolved.
  refund_amount   integer nullable             -- Refund amount if resolved in customer's favor. Null if no refund.
  currency        string not_null              -- ISO 4217 currency code.
  resolved_by     uuid nullable references users(id) on_delete set_null
                                               -- Admin who resolved the dispute. Null = not yet resolved.
  resolved_at     timestamp nullable           -- When the dispute was resolved.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(vendor_order_id)
  index(customer_id)
  index(vendor_id, status)
  index(status)
}
```

**Design notes:**
- Disputes reference `vendor_orders` (not the parent order) because disputes are between a specific customer and vendor.
- `refund_amount` is set when the dispute is resolved in the customer's favor — the actual refund is processed through the e-commerce domain's refunds system.
- The marketplace operator is the mediator — `resolved_by` tracks who made the final decision.

### 16. dispute_messages

Communication messages within a dispute thread. Supports messages from customers, vendors, and marketplace admins. Provides a full audit trail of dispute communication. Inspired by eBay case messages and Stripe dispute evidence.

```pseudo
table dispute_messages {
  id              uuid primary_key default auto_generate
  dispute_id      uuid not_null references disputes(id) on_delete cascade
                                               -- Which dispute this message belongs to.
                                               -- Cascade: deleting a dispute removes all messages.
  sender_id       uuid not_null references users(id) on_delete restrict
                                               -- Who sent this message.
                                               -- Restrict: don't delete users with dispute messages.
  sender_role     enum(customer, vendor, admin) not_null
                                               -- Role of the sender in this dispute context.
  body            string not_null              -- Message content.
  attachments     json nullable                -- Attached evidence as JSON array of URLs/metadata.
                                               -- Format: [{"url": "...", "name": "...", "type": "image/jpeg"}]
  created_at      timestamp default now
}

indexes {
  index(dispute_id, created_at)
}
```

**Design notes:**
- `sender_role` denotes the participant role in the dispute context (not their system role) — the same user could be a customer in one dispute and a vendor in another.
- `attachments` stores evidence (photos of damaged items, tracking screenshots, etc.) as JSON array of file references.

### 17. vendor_reviews

Customer reviews and ratings of vendors (separate from product reviews in the e-commerce domain). Helps build vendor reputation and trust. Only customers who have completed an order with the vendor can leave a review. Inspired by Amazon seller feedback, eBay seller ratings, and Etsy shop reviews.

```pseudo
table vendor_reviews {
  id              uuid primary_key default auto_generate
  vendor_id       uuid not_null references vendors(id) on_delete cascade
                                               -- Which vendor is being reviewed.
                                               -- Cascade: deleting a vendor removes all their reviews.
  customer_id     uuid not_null references users(id) on_delete cascade
                                               -- Customer who wrote the review.
                                               -- Cascade: deleting a user removes their vendor reviews.
  vendor_order_id uuid nullable references vendor_orders(id) on_delete set_null
                                               -- Which vendor order this review is for (proof of purchase).
                                               -- Set null: review persists if order is removed.
  rating          integer not_null             -- Rating from 1 to 5. Validated in application logic.
  title           string nullable              -- Review headline.
  body            string nullable              -- Full review text.
  status          enum(pending, approved, rejected) not_null default pending
                                               -- Moderation status. Only approved reviews are displayed.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(vendor_id, status)
  composite_unique(vendor_id, customer_id, vendor_order_id) -- One review per customer per vendor order.
  index(status)
}
```

**Design notes:**
- `vendor_order_id` ties the review to a specific purchase — ensures the reviewer actually bought from this vendor.
- `composite_unique(vendor_id, customer_id, vendor_order_id)` allows a customer to leave multiple reviews for the same vendor (one per order), but not duplicate reviews for the same order.
- Vendor aggregate rating (average stars, review count) should be computed and cached in application logic or `vendor_profiles`.

## Relationships

### One-to-Many

```
users                  1 ──── * vendors                 (user → owned vendors)
vendors                1 ──── 1 vendor_profiles         (vendor → store profile)
vendors                1 ──── * vendor_members           (vendor → team members)
users                  1 ──── * vendor_members           (user → vendor memberships)
vendors                1 ──── * vendor_addresses          (vendor → addresses)
vendors                1 ──── * vendor_documents          (vendor → documents)
vendors                1 ──── * commission_rules          (vendor → vendor-specific rules)
categories             1 ──── * commission_rules          (category → category-specific rules)
vendors                1 ──── * listings                  (vendor → product listings)
products               1 ──── * listings                  (product → vendor listings)
listings               1 ──── * listing_variants          (listing → variant pricing)
product_variants       1 ──── * listing_variants          (variant → vendor pricing)
orders                 1 ──── * vendor_orders             (order → vendor sub-orders)
vendors                1 ──── * vendor_orders             (vendor → their orders)
vendor_orders          1 ──── * vendor_order_items        (vendor order → items)
vendors                1 ──── * payouts                   (vendor → payouts)
payouts                1 ──── * payout_items              (payout → items)
vendors                1 ──── 1 vendor_balances           (vendor → balance)
vendors                1 ──── * balance_transactions      (vendor → ledger entries)
vendor_orders          1 ──── * disputes                  (vendor order → disputes)
vendors                1 ──── * disputes                  (vendor → disputes)
users                  1 ──── * disputes                  (customer → disputes)
disputes               1 ──── * dispute_messages          (dispute → messages)
vendors                1 ──── * vendor_reviews            (vendor → reviews)
users                  1 ──── * vendor_reviews            (customer → reviews)
```

### Many-to-Many (via junction tables)

```
vendors ←── listings ──→ products                        (vendors × products)
vendors ←── vendor_order_items ──→ order_items           (vendors × marketplace order items, via vendor_orders)
payouts ←── payout_items ──→ vendor_orders               (payouts × vendor orders)
```

## Best Practices

- **Commission resolution**: When calculating commission for an order, check for rules in order: category-specific → vendor-specific → global. Use `priority` to break ties within the same scope. Always fall back to the global rule.
- **Order splitting**: When a marketplace order is placed, split it into vendor sub-orders atomically. Calculate commission and create balance transactions in the same database transaction.
- **Balance integrity**: Always update `vendor_balances` and insert `balance_transactions` in the same database transaction. The ledger is the source of truth — if balance and ledger disagree, the ledger wins.
- **Escrow/hold period**: Use the `pending` balance field to hold funds until conditions are met (delivery confirmed, dispute window closed). Move from `pending` to `available` via `hold` and `release` balance transactions.
- **Payout batching**: Batch multiple vendor order earnings into a single payout to reduce transfer fees. Use `period_start`/`period_end` to define the earnings window.
- **Dispute flow**: Disputes should freeze the related vendor order earning (move from `available` to `pending` via a `hold` transaction). If resolved in customer's favor, debit the vendor's balance. If resolved in vendor's favor, release the hold.
- **Vendor onboarding**: Enforce document verification before allowing vendors to list products. Use `verification_status` on `vendors` and `status` on `vendor_documents` to track the KYC process.
- **Listing approval**: Implement a review workflow for new listings (draft → pending_approval → active). This prevents fraudulent or policy-violating listings from going live.
- **Soft deletion**: Vendors with order history should never be hard-deleted. Use `status = deactivated` instead. Their orders, payouts, and balance history must be preserved.
- **Access control**: Use Auth / RBAC for permission checks. Vendor members see only their vendor's data. Customers see public profiles and their own orders/disputes.

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
