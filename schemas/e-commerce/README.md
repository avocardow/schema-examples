# E-Commerce

## Overview

Single-vendor e-commerce covering the full purchase lifecycle: product catalog with brands, variants, tags, and collections; multi-currency pricing with exchange rates; shopping carts with payment sessions; orders with line-item snapshots; payments and refunds; fulfillment with per-item tracking, shipping zones, and provider integrations; returns; discounts with usage tracking; tax configuration; wishlists; and product reviews. Designed from a study of 10 systems: Shopify, Saleor, Medusa, WooCommerce, Magento, Stripe, Spree, PrestaShop, Solidus, and BigCommerce.

Key design decisions: product/variant split with JSON-based option values (Shopify pattern — simpler than relational option tables); separate `prices` table for multi-currency support (Stripe/Medusa pattern); persistent carts with payment sessions for modern checkout flows; order items snapshot all product data at purchase time (immutable history); fulfillments with per-item tracking and provider integrations for partial shipments; shipping profiles for product-level shipping requirements; return authorizations for the full return lifecycle; soft deletes on products only (orders are never deleted).

Multi-vendor marketplace, subscriptions, inventory/warehouse management, and loyalty programs are separate domains.

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (35 tables)</summary>

- [`categories`](#1-categories)
- [`brands`](#2-brands)
- [`products`](#3-products)
- [`product_variants`](#4-product_variants)
- [`product_images`](#5-product_images)
- [`product_collections`](#6-product_collections)
- [`product_collection_items`](#7-product_collection_items)
- [`product_tags`](#8-product_tags)
- [`product_tag_assignments`](#9-product_tag_assignments)
- [`currencies`](#10-currencies)
- [`prices`](#11-prices)
- [`tax_rates`](#12-tax_rates)
- [`discounts`](#13-discounts)
- [`discount_usages`](#14-discount_usages)
- [`addresses`](#15-addresses)
- [`wishlists`](#16-wishlists)
- [`wishlist_items`](#17-wishlist_items)
- [`carts`](#18-carts)
- [`cart_items`](#19-cart_items)
- [`payment_sessions`](#20-payment_sessions)
- [`orders`](#21-orders)
- [`order_items`](#22-order_items)
- [`order_status_history`](#23-order_status_history)
- [`payment_methods`](#24-payment_methods)
- [`payments`](#25-payments)
- [`refunds`](#26-refunds)
- [`shipping_profiles`](#27-shipping_profiles)
- [`shipping_zones`](#28-shipping_zones)
- [`shipping_methods`](#29-shipping_methods)
- [`fulfillment_providers`](#30-fulfillment_providers)
- [`fulfillments`](#31-fulfillments)
- [`fulfillment_items`](#32-fulfillment_items)
- [`return_authorizations`](#33-return_authorizations)
- [`return_items`](#34-return_items)
- [`product_reviews`](#35-product_reviews)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users` | Customer identity, order ownership, review authorship, audit trails |

## Tables

### Catalog

| # | Table | Description |
| - | ----- | ----------- |
| 1 | `categories` | Hierarchical product categories with parent-child tree |
| 2 | `brands` | Brand/manufacturer entities with logos and slugs |
| 3 | `products` | Core product entity with option definitions |
| 4 | `product_variants` | Purchasable SKU-level units with option values |
| 5 | `product_images` | Product and variant media with sort ordering |
| 6 | `product_collections` | Curated product groupings (bestsellers, seasonal, sale) |
| 7 | `product_collection_items` | Products in collections (many-to-many junction) |
| 8 | `product_tags` | Tag entities with slugs for SEO-friendly filtering |
| 9 | `product_tag_assignments` | Products ↔ Tags (many-to-many junction) |

### Pricing & Promotions

| # | Table | Description |
| - | ----- | ----------- |
| 10 | `currencies` | Supported currencies with exchange rates |
| 11 | `prices` | Variant pricing with currency and sale price support |
| 12 | `tax_rates` | Tax rates by country/region |
| 13 | `discounts` | Promotional rules with optional coupon codes |
| 14 | `discount_usages` | Per-customer discount usage tracking |

### Customer

| # | Table | Description |
| - | ----- | ----------- |
| 15 | `addresses` | Customer shipping and billing addresses |
| 16 | `wishlists` | Named customer wishlists |
| 17 | `wishlist_items` | Items saved to wishlists |

### Cart & Checkout

| # | Table | Description |
| - | ----- | ----------- |
| 18 | `carts` | Persistent shopping carts (guest + authenticated) |
| 19 | `cart_items` | Line items in the cart |
| 20 | `payment_sessions` | Pre-payment checkout sessions (payment intent) |

### Orders

| # | Table | Description |
| - | ----- | ----------- |
| 21 | `orders` | Placed orders with totals and status |
| 22 | `order_items` | Line items with product/price snapshot |
| 23 | `order_status_history` | Append-only order status audit trail |

### Payments

| # | Table | Description |
| - | ----- | ----------- |
| 24 | `payment_methods` | Saved customer payment instruments (tokenized) |
| 25 | `payments` | Payment transactions against orders |
| 26 | `refunds` | Refund records linked to payments |

### Fulfillment

| # | Table | Description |
| - | ----- | ----------- |
| 27 | `shipping_profiles` | Product shipping requirement groups |
| 28 | `shipping_zones` | Geographic shipping zones with countries |
| 29 | `shipping_methods` | Shipping options per zone with pricing |
| 30 | `fulfillment_providers` | Configurable fulfillment provider integrations |
| 31 | `fulfillments` | Shipments created for orders |
| 32 | `fulfillment_items` | Which order items are in each shipment |

### Returns

| # | Table | Description |
| - | ----- | ----------- |
| 33 | `return_authorizations` | Return/exchange requests |
| 34 | `return_items` | Items in a return |

### Reviews

| # | Table | Description |
| - | ----- | ----------- |
| 35 | `product_reviews` | Customer ratings and text reviews |

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. categories

Hierarchical product categories with materialized path for efficient subtree queries. Uses parent_id for single-level listings and path for ancestor/descendant queries. Inspired by WooCommerce product categories, Saleor categories, and Medusa product categories.

```pseudo
table categories {
  id              uuid primary_key default auto_generate
  parent_id       uuid nullable references categories(id) on_delete cascade
                                               -- Parent category. Null = root-level category.
                                               -- Cascade: deleting a parent removes all children.
  name            string not_null              -- Display name (e.g., "Electronics", "Clothing").
  slug            string unique not_null       -- URL-friendly identifier (e.g., "electronics").
  description     string nullable              -- Category description for storefront display.
  path            string not_null              -- Materialized path using category IDs (e.g., "/abc/def/").
                                               -- Enables subtree queries: WHERE path LIKE '/abc/%'
  depth           integer not_null default 0   -- Hierarchy level. 0 = root, 1 = child of root, etc.
  sort_order      integer not_null default 0   -- Display ordering within the same parent.
  is_active       boolean not_null default true -- Whether the category is visible on the storefront.
  image_url       string nullable              -- Category image for storefront display.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(parent_id)
  index(path)
  index(is_active, sort_order)
}
```

**Design notes:**
- Materialized path uses UUIDs as segments so renaming a category doesn't cascade path updates.
- `slug` is unique globally — used for SEO-friendly URLs.
- `sort_order` enables manual category ordering within the same parent level.

### 2. brands

Brand or manufacturer entities. Separating brands into their own table (rather than a string field on products) enables brand pages, brand-based filtering, brand logos, and SEO-friendly URLs like `/brands/nike`. Inspired by BigCommerce brands and Spree/Solidus taxonomies.

```pseudo
table brands {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Brand display name (e.g., "Nike", "Apple", "Samsung").
  slug            string unique not_null       -- URL-friendly identifier (e.g., "nike").
  description     string nullable              -- Brand description for brand pages.
  logo_url        string nullable              -- Brand logo image URL.
  website_url     string nullable              -- Official brand website.
  is_active       boolean not_null default true -- Whether the brand is visible on the storefront.
  sort_order      integer not_null default 0   -- Display ordering in brand listings.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(is_active, sort_order)
}
```

### 3. products

Core product entity. Stores product-level data that applies to all variants: name, description, status, and option definitions. The actual purchasable units are `product_variants`. Inspired by Shopify's Product model with JSON-based option definitions.

```pseudo
table products {
  id              uuid primary_key default auto_generate
  category_id     uuid nullable references categories(id) on_delete set_null
                                               -- Primary category. Null = uncategorized.
                                               -- Set null: products survive category deletion.
  brand_id        uuid nullable references brands(id) on_delete set_null
                                               -- Product brand/manufacturer. Null = unbranded.
                                               -- Set null: products survive brand deletion.
  name            string not_null              -- Product name (e.g., "Classic T-Shirt").
  slug            string unique not_null       -- URL-friendly identifier.
  description     string nullable              -- Full product description (may contain HTML/markdown).
  status          enum(draft, active, archived) not_null default draft
                                               -- draft: not visible; active: on storefront; archived: hidden but preserved.
  product_type    string nullable              -- Freeform product type label (e.g., "Apparel", "Electronics").
  options         json nullable                -- Option definitions as JSON array.
                                               -- Format: [{"name": "Size", "values": ["S","M","L"]}, {"name": "Color", "values": ["Red","Blue"]}]
                                               -- Null for products with no options (single variant).
  metadata        json nullable default {}     -- Extensible key-value metadata.
  is_featured     boolean not_null default false -- Whether to highlight on storefront.
  deleted_at      timestamp nullable           -- Soft delete. Null = active. Products referenced by orders must not be hard-deleted.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(category_id)
  index(brand_id)
  index(status)
  index(is_featured)
  index(deleted_at)
  index(status, deleted_at)
}
```

**Design notes:**
- Options are stored as JSON (Shopify pattern) — simpler than relational option tables. Products define what options exist; variants define which values they have.
- Soft delete via `deleted_at` — products may be referenced by historical orders. Active products have `deleted_at IS NULL`.
- `brand_id` references the `brands` table for rich brand data (logos, slugs, pages).

### 4. product_variants

The actual purchasable unit (SKU). Every product has at least one variant (the "default" variant for simple products). Variants hold SKU, physical attributes, and which option values they represent. Inspired by Shopify ProductVariant and Medusa ProductVariant.

```pseudo
table product_variants {
  id              uuid primary_key default auto_generate
  product_id      uuid not_null references products(id) on_delete cascade
                                               -- Parent product. Cascade: deleting a product removes all variants.
  shipping_profile_id uuid nullable references shipping_profiles(id) on_delete set_null
                                               -- Shipping profile for this variant. Null = default shipping.
                                               -- Set null: variant uses default shipping if profile is deleted.
  sku             string nullable              -- Stock Keeping Unit. Unique when set. Null for products without SKU tracking.
  barcode         string nullable              -- UPC, EAN, ISBN, or other barcode. Null if not applicable.
  title           string not_null              -- Variant title (e.g., "Small / Red"). For single-variant products, matches product name.
  option_values   json nullable                -- Selected option values as JSON object.
                                               -- Format: {"Size": "M", "Color": "Red"}
                                               -- Null for single-variant products.
  weight_grams    integer nullable             -- Weight in grams for shipping calculations.
  height_mm       integer nullable             -- Height in millimeters.
  width_mm        integer nullable             -- Width in millimeters.
  length_mm       integer nullable             -- Length in millimeters.
  is_active       boolean not_null default true -- Whether this variant is available for purchase.
  sort_order      integer not_null default 0   -- Display ordering within the product.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(product_id)
  unique(sku)                                  -- SKU must be unique when set. Sparse: allows multiple NULLs.
  index(barcode)
  index(shipping_profile_id)
}
```

**Design notes:**
- `sku` is nullable with sparse unique — not all products use SKU tracking, but when set, it must be globally unique.
- `option_values` as JSON object — each key corresponds to an option name from the parent product's `options` array.
- Weight is in grams (integer) and dimensions in millimeters — avoids floating-point precision issues.
- No `price` field on variant — prices are in the separate `prices` table for multi-currency support.
- `shipping_profile_id` links to shipping profiles for variant-level shipping requirements (digital vs physical vs oversized).

### 5. product_images

Product and variant media. Images can be associated with a product (general gallery) or a specific variant (e.g., color-specific photo). Supports sort ordering for gallery display. Inspired by Shopify ProductImage.

```pseudo
table product_images {
  id              uuid primary_key default auto_generate
  product_id      uuid not_null references products(id) on_delete cascade
                                               -- Parent product. Cascade: deleting a product removes all images.
  variant_id      uuid nullable references product_variants(id) on_delete set_null
                                               -- Associated variant. Null = product-level image (applies to all variants).
                                               -- Set null: image moves to product level if variant is deleted.
  url             string not_null              -- Image URL (CDN or storage path).
  alt_text        string nullable              -- Accessibility alt text.
  sort_order      integer not_null default 0   -- Display ordering. 0 = primary image.
  created_at      timestamp default now
}

indexes {
  index(product_id, sort_order)
  index(variant_id)
}
```

### 6. product_collections

Curated product groupings that transcend the hierarchical category structure. Collections are flat lists like "Bestsellers", "Summer Sale", "New Arrivals", or "Staff Picks". Unlike categories (which are hierarchical and mutually exclusive), a product can belong to many collections simultaneously. Inspired by Shopify Collections, Saleor Collections, and Medusa ProductCollection.

```pseudo
table product_collections {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Display name (e.g., "Summer Sale", "Bestsellers").
  slug            string unique not_null       -- URL-friendly identifier.
  description     string nullable              -- Collection description for storefront display.
  image_url       string nullable              -- Collection banner/hero image.
  sort_order      integer not_null default 0   -- Display ordering among collections.
  is_active       boolean not_null default true -- Whether the collection is visible on the storefront.
  metadata        json nullable default {}     -- Extensible key-value metadata.
  published_at    timestamp nullable           -- When the collection was published. Null = draft.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(is_active, sort_order)
}
```

**Design notes:**
- Collections are separate from categories — categories are hierarchical (a product is in one category), while collections are flat and overlapping (a product can be in "Sale" and "Bestsellers" simultaneously).
- `published_at` enables scheduled collection launches.
- Automated/smart collections (rules-based) are handled in application logic — the schema stores the result (which products are in the collection), not the rules.

### 7. product_collection_items

Junction table linking products to collections. Supports ordering within a collection.

```pseudo
table product_collection_items {
  id              uuid primary_key default auto_generate
  collection_id   uuid not_null references product_collections(id) on_delete cascade
                                               -- Parent collection. Cascade: removing a collection removes all items.
  product_id      uuid not_null references products(id) on_delete cascade
                                               -- Product in the collection. Cascade: removing a product removes it from all collections.
  sort_order      integer not_null default 0   -- Display ordering within the collection.
  added_at        timestamp default now
}

indexes {
  composite_unique(collection_id, product_id)  -- A product can only appear once per collection.
  index(product_id)
}
```

### 8. product_tags

Tag entities with slugs for SEO-friendly filter URLs (e.g., `/products/tag/summer-collection`). Separating tags into their own table (rather than a text array on products) enables tag pages, tag descriptions, and consistent tag management. Inspired by Medusa ProductTag and WooCommerce product tags.

```pseudo
table product_tags {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Tag display name (e.g., "Summer", "Sale", "Eco-Friendly").
  slug            string unique not_null       -- URL-friendly identifier for filter URLs.
  description     string nullable              -- Tag description for tag landing pages.
  created_at      timestamp default now
}

indexes {
  -- unique(slug) is already created by the field constraint above.
}
```

### 9. product_tag_assignments

Junction table linking products to tags. A product can have many tags, and a tag can be applied to many products.

```pseudo
table product_tag_assignments {
  id              uuid primary_key default auto_generate
  product_id      uuid not_null references products(id) on_delete cascade
                                               -- Product being tagged. Cascade: removing a product removes all tag assignments.
  tag_id          uuid not_null references product_tags(id) on_delete cascade
                                               -- Tag being applied. Cascade: removing a tag removes all assignments.
  created_at      timestamp default now
}

indexes {
  composite_unique(product_id, tag_id)         -- A tag can only be applied once per product.
  index(tag_id)
}
```

### 10. currencies

Supported currencies with exchange rates and formatting metadata. Enables multi-currency storefronts where prices can be converted or displayed in the customer's preferred currency. Inspired by Medusa Currency and Stripe's multi-currency support.

```pseudo
table currencies {
  id              uuid primary_key default auto_generate
  code            string unique not_null       -- ISO 4217 currency code (e.g., "USD", "EUR", "GBP").
  name            string not_null              -- Display name (e.g., "US Dollar", "Euro", "British Pound").
  symbol          string not_null              -- Currency symbol (e.g., "$", "€", "£").
  decimal_places  integer not_null default 2   -- Number of decimal places (e.g., 2 for USD, 0 for JPY).
  exchange_rate   decimal not_null default 1.0 -- Exchange rate relative to base currency (e.g., 1.0 for USD if USD is base).
  is_base         boolean not_null default false -- Whether this is the store's base/default currency.
  is_active       boolean not_null default true -- Whether this currency is available for customers.
  updated_at      timestamp default now on_update
  created_at      timestamp default now
}

indexes {
  index(is_active)
}
```

**Design notes:**
- `exchange_rate` is relative to the base currency. Application logic multiplies base prices by this rate for conversion.
- `decimal_places` varies by currency — JPY and KRW use 0, most others use 2. Critical for correct price display.
- Only one currency should have `is_base = true` (enforced in application logic).

### 11. prices

Variant pricing with multi-currency support. Each variant can have multiple prices — one per currency. Supports sale pricing with date ranges. Inspired by Stripe's Price model and Medusa's MoneyAmount.

```pseudo
table prices {
  id              uuid primary_key default auto_generate
  variant_id      uuid not_null references product_variants(id) on_delete cascade
                                               -- Which variant this price applies to.
                                               -- Cascade: deleting a variant removes all its prices.
  currency        string not_null              -- ISO 4217 currency code (e.g., "USD", "EUR", "GBP").
  amount          integer not_null             -- Price in smallest currency unit (cents for USD).
                                               -- e.g., $19.99 = 1999. Avoids floating-point precision issues.
  compare_at_amount integer nullable           -- Original price for "was $X, now $Y" display. Null = no sale.
  min_quantity    integer nullable             -- Minimum quantity for this price to apply (bulk/wholesale pricing).
                                               -- Null = no minimum (default price).
  starts_at       timestamp nullable           -- When this price becomes active. Null = immediately active.
  ends_at         timestamp nullable           -- When this price expires. Null = no expiration.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(variant_id, currency)
  index(starts_at, ends_at)
}
```

**Design notes:**
- Prices stored as integers in smallest currency unit (cents) — this is the Stripe convention and prevents floating-point rounding errors.
- `compare_at_amount` is the "original price" for sale display — not a discount rule, just display metadata.
- `min_quantity` enables tiered/bulk pricing without a separate table.
- `starts_at`/`ends_at` enable scheduled price changes (flash sales, seasonal pricing).

### 12. tax_rates

Tax rate configuration by country and region. Inspired by WooCommerce tax rates and Spree tax rates. Application logic determines which rate to apply based on the customer's shipping address.

```pseudo
table tax_rates {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Display name (e.g., "US Sales Tax - CA", "VAT 20%").
  country         string not_null              -- ISO 3166-1 alpha-2 country code (e.g., "US", "GB", "DE").
  region          string nullable              -- State/province/region code (e.g., "CA", "NY"). Null = country-wide rate.
  rate            decimal not_null             -- Tax rate as a decimal percentage (e.g., 0.0825 for 8.25%).
  category        string nullable              -- Optional tax category (e.g., "clothing", "digital", "food").
                                               -- Null = applies to all product types. Enables reduced rates for specific categories.
  is_compound     boolean not_null default false -- Whether this tax is calculated on top of other taxes (compound tax).
  is_active       boolean not_null default true -- Whether this rate is currently applied.
  priority        integer not_null default 0   -- When multiple rates apply, priority determines calculation order.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(country, region)
  index(category)
  index(is_active)
}
```

### 13. discounts

Promotional rules with optional coupon codes. Supports percentage discounts, fixed amount off, and free shipping. Conditions (minimum spend, specific products, etc.) are stored as JSON for flexibility. Inspired by Stripe coupons and Shopify discount codes.

```pseudo
table discounts {
  id              uuid primary_key default auto_generate
  code            string nullable              -- Coupon code. Null = automatic discount (no code required).
  type            enum(percentage, fixed_amount, free_shipping) not_null
                                               -- percentage: e.g., 10% off. fixed_amount: e.g., $5 off. free_shipping: waives shipping.
  value           decimal not_null             -- Discount value. For percentage: 10.0 = 10%. For fixed_amount: amount in smallest currency unit.
  currency        string nullable              -- Required for fixed_amount discounts. ISO 4217 code. Null for percentage/free_shipping.
  conditions      json nullable                -- JSON conditions for applicability.
                                               -- Examples: {"min_subtotal": 5000, "product_ids": [...], "category_ids": [...], "first_order_only": true}
  usage_limit     integer nullable             -- Max total uses across all customers. Null = unlimited.
  usage_count     integer not_null default 0   -- Current number of uses. Incremented on order completion.
  per_customer_limit integer nullable          -- Max uses per customer. Null = unlimited.
  starts_at       timestamp nullable           -- When the discount becomes active. Null = immediately active.
  ends_at         timestamp nullable           -- When the discount expires. Null = no expiration.
  is_active       boolean not_null default true -- Master toggle for the discount.
  created_by      uuid not_null references users(id) on_delete restrict
                                               -- Admin who created this discount.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  unique(code)                                 -- Coupon codes must be unique. Sparse: allows multiple NULLs (automatic discounts).
  index(type)
  index(is_active, starts_at, ends_at)
}
```

**Design notes:**
- `code` is nullable — automatic discounts (applied by rules, not by code entry) don't need a code.
- `conditions` as JSON — extensible without schema changes. Application code evaluates conditions against the cart.
- `usage_count` is a counter cache updated atomically on order completion.
- `per_customer_limit` enables "one per customer" discounts common in e-commerce.

### 14. discount_usages

Per-customer discount usage tracking. Records each time a discount is applied to a completed order. Used to enforce `per_customer_limit` on the discounts table and for analytics on discount effectiveness.

```pseudo
table discount_usages {
  id              uuid primary_key default auto_generate
  discount_id     uuid not_null references discounts(id) on_delete cascade
                                               -- Which discount was used. Cascade: remove usage records with discount.
  order_id        uuid not_null references orders(id) on_delete cascade
                                               -- Which order used this discount. Cascade: remove if order is deleted.
  user_id         uuid nullable references users(id) on_delete set_null
                                               -- Customer who used the discount. Null = guest order.
  created_at      timestamp default now
}

indexes {
  index(discount_id, user_id)                  -- "How many times has this customer used this discount?"
  composite_unique(discount_id, order_id)      -- A discount can only be applied once per order.
}
```

### 15. addresses

Customer shipping and billing addresses. Shared across orders and stored persistently for reuse. Inspired by Shopify MailingAddress and Spree Address.

```pseudo
table addresses {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade
                                               -- Address owner. Cascade: deleting a user removes their addresses.
  label           string nullable              -- Friendly label (e.g., "Home", "Work", "Mom's house").
  first_name      string not_null
  last_name       string not_null
  company         string nullable              -- Company name for business addresses.
  address_line1   string not_null              -- Street address, P.O. box, etc.
  address_line2   string nullable              -- Apartment, suite, unit, building, floor, etc.
  city            string not_null
  region          string nullable              -- State, province, or region.
  postal_code     string nullable              -- ZIP or postal code. Nullable: some countries don't use postal codes.
  country         string not_null              -- ISO 3166-1 alpha-2 country code.
  phone           string nullable              -- Contact phone number for delivery.
  is_default_shipping boolean not_null default false -- Whether this is the default shipping address.
  is_default_billing  boolean not_null default false -- Whether this is the default billing address.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(user_id)
}
```

### 16. wishlists

Named customer wishlists. Customers can maintain multiple wishlists (e.g., "Birthday", "Home Office"). Inspired by Spree wishlists and BigCommerce wishlists.

```pseudo
table wishlists {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade
                                               -- Wishlist owner. Cascade: deleting a user removes their wishlists.
  name            string not_null default 'Default' -- Wishlist name (e.g., "Birthday Ideas", "Gift List").
  is_public       boolean not_null default false -- Whether the wishlist is shareable via public link.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(user_id)
}
```

### 17. wishlist_items

Items saved to a wishlist. References a product variant — the specific purchasable unit the customer wants.

```pseudo
table wishlist_items {
  id              uuid primary_key default auto_generate
  wishlist_id     uuid not_null references wishlists(id) on_delete cascade
                                               -- Parent wishlist. Cascade: deleting a wishlist removes all items.
  variant_id      uuid not_null references product_variants(id) on_delete cascade
                                               -- The variant the customer wants. Cascade: remove if variant is deleted.
  added_at        timestamp default now
}

indexes {
  composite_unique(wishlist_id, variant_id)    -- No duplicate items in the same wishlist.
}
```

### 18. carts

Persistent shopping carts. Supports both guest (session-based) and authenticated carts. Guest carts can be merged into an authenticated cart on login. Stores currency and shipping/billing address context for checkout.

```pseudo
table carts {
  id              uuid primary_key default auto_generate
  user_id         uuid nullable references users(id) on_delete set_null
                                               -- Null = guest cart (identified by session/cookie).
                                               -- Set null: cart persists if user is deleted (for analytics).
  session_id      string nullable              -- Session identifier for guest carts. Null for authenticated carts.
  currency        string not_null default 'USD' -- Cart currency (ISO 4217). All prices in the cart use this currency.
  shipping_address_id uuid nullable references addresses(id) on_delete set_null
  billing_address_id  uuid nullable references addresses(id) on_delete set_null
  discount_code   string nullable              -- Applied discount code (validated against discounts table).
  note            string nullable              -- Customer note for the order.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(user_id)
  index(session_id)
}
```

**Design notes:**
- `session_id` for guest carts enables cart persistence without requiring authentication.
- Currency is set at the cart level — all items in the cart use the same currency.
- Address references are nullable — set during checkout flow.

### 19. cart_items

Line items in a shopping cart. References a product variant with quantity. Prices are resolved at checkout from the `prices` table, not stored on the cart item.

```pseudo
table cart_items {
  id              uuid primary_key default auto_generate
  cart_id         uuid not_null references carts(id) on_delete cascade
                                               -- Parent cart. Cascade: deleting a cart removes all items.
  variant_id      uuid not_null references product_variants(id) on_delete cascade
                                               -- The variant being purchased. Cascade: remove item if variant is deleted.
  quantity        integer not_null default 1    -- Number of units. Must be > 0 (enforced in application logic).
  added_at        timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  composite_unique(cart_id, variant_id)        -- One line item per variant per cart. Update quantity, don't duplicate.
}
```

### 20. payment_sessions

Pre-payment checkout sessions representing a customer's payment intent before an order is finalized. Tracks the payment provider, status, and session data during the checkout flow. A cart can have multiple payment sessions (one per provider tried). Inspired by Medusa PaymentSession and Stripe CheckoutSession/PaymentIntent.

```pseudo
table payment_sessions {
  id              uuid primary_key default auto_generate
  cart_id         uuid not_null references carts(id) on_delete cascade
                                               -- Which cart this session is for. Cascade: remove sessions with cart.
  provider        string not_null              -- Payment provider (e.g., "stripe", "paypal", "braintree").
  provider_id     string nullable              -- Provider-side session/intent ID (e.g., Stripe pi_xxx or cs_xxx).
  status          enum(pending, authorized, requires_action, completed, canceled, error) not_null default pending
                                               -- pending: awaiting customer action.
                                               -- authorized: funds held but not captured.
                                               -- requires_action: 3D Secure or other verification needed.
                                               -- completed: payment succeeded — ready to create order.
                                               -- canceled: customer or system canceled.
                                               -- error: payment failed.
  amount          integer not_null             -- Amount in smallest currency unit.
  currency        string not_null              -- ISO 4217 currency code.
  data            json nullable                -- Provider-specific session data (client secret, redirect URLs, etc.).
  is_selected     boolean not_null default false -- Whether this is the currently selected payment method for checkout.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(cart_id)
  index(provider, provider_id)
  index(status)
}
```

**Design notes:**
- A cart can have multiple sessions (Stripe session + PayPal session) — only one is `is_selected = true` at a time.
- `data` stores provider-specific checkout data (Stripe client_secret, PayPal order ID, redirect URLs).
- On successful completion, the application creates an order from the cart and a payment from the session.

### 21. orders

Placed orders with complete totals, address snapshots, and status tracking. Orders are created from carts on checkout completion. Financial data (subtotal, discount, tax, shipping, total) is snapshotted — never recomputed from live data.

```pseudo
table orders {
  id              uuid primary_key default auto_generate
  order_number    string unique not_null       -- Human-readable order number (e.g., "ORD-20240315-A1B2").
  user_id         uuid nullable references users(id) on_delete set_null
                                               -- Customer. Null = guest order. Set null: order preserved if user is deleted.
  email           string not_null              -- Customer email at time of order (snapshot — not a live reference).
  status          enum(pending, confirmed, processing, shipped, delivered, canceled, refunded) not_null default pending
  currency        string not_null              -- ISO 4217 currency code.
  subtotal        integer not_null             -- Sum of all line item totals (in smallest currency unit).
  discount_total  integer not_null default 0   -- Total discount applied.
  tax_total       integer not_null default 0   -- Total tax charged.
  shipping_total  integer not_null default 0   -- Total shipping cost.
  grand_total     integer not_null             -- Final total: subtotal - discount + tax + shipping.
  payment_status  enum(unpaid, partially_paid, paid, partially_refunded, refunded) not_null default unpaid
  fulfillment_status enum(unfulfilled, partially_fulfilled, fulfilled) not_null default unfulfilled

  -- Address snapshots (denormalized — order records must be self-contained).
  shipping_name          string nullable
  shipping_address_line1 string nullable
  shipping_address_line2 string nullable
  shipping_city          string nullable
  shipping_region        string nullable
  shipping_postal_code   string nullable
  shipping_country       string nullable
  shipping_phone         string nullable
  billing_name           string nullable
  billing_address_line1  string nullable
  billing_address_line2  string nullable
  billing_city           string nullable
  billing_region         string nullable
  billing_postal_code    string nullable
  billing_country        string nullable

  discount_code   string nullable              -- Applied discount code (snapshot).
  note            string nullable              -- Customer note.
  canceled_at     timestamp nullable           -- When the order was canceled. Null = not canceled.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(user_id)
  index(status)
  index(payment_status)
  index(fulfillment_status)
  index(created_at)
}
```

**Design notes:**
- Addresses are denormalized onto the order — the order must be a self-contained historical record. The customer's address table may change, but the order's addresses are frozen at checkout.
- All money fields are integers in the smallest currency unit (cents for USD).
- `order_number` is a human-readable identifier separate from the UUID primary key.
- Three separate status fields: `status` (overall lifecycle), `payment_status`, and `fulfillment_status`.

### 22. order_items

Line items in a placed order. Every field is a snapshot of the product/variant/price at the time of purchase — even if the product is later changed or deleted, the order record remains accurate.

```pseudo
table order_items {
  id              uuid primary_key default auto_generate
  order_id        uuid not_null references orders(id) on_delete cascade
                                               -- Parent order. Cascade: deleting an order removes all items.
  variant_id      uuid nullable references product_variants(id) on_delete set_null
                                               -- Original variant reference. Set null: variant may be deleted after purchase.

  -- Product snapshot (frozen at time of purchase)
  product_name    string not_null              -- Product name at time of purchase.
  variant_title   string not_null              -- Variant title at time of purchase (e.g., "Small / Red").
  sku             string nullable              -- SKU at time of purchase.
  image_url       string nullable              -- Product image URL at time of purchase.

  -- Price snapshot
  unit_price      integer not_null             -- Price per unit in smallest currency unit.
  quantity        integer not_null             -- Number of units ordered.
  subtotal        integer not_null             -- unit_price × quantity.
  discount_total  integer not_null default 0   -- Discount applied to this line item.
  tax_total       integer not_null default 0   -- Tax on this line item.
  total           integer not_null             -- subtotal - discount + tax.

  -- Fulfillment tracking
  fulfilled_quantity integer not_null default 0 -- How many units have been shipped.

  created_at      timestamp default now
}

indexes {
  index(order_id)
  index(variant_id)
}
```

### 23. order_status_history

Append-only audit trail of every order status change. Captures who changed the status, when, and an optional note. Inspired by PrestaShop order_history and Magento sales_order_status_history.

```pseudo
table order_status_history {
  id              uuid primary_key default auto_generate
  order_id        uuid not_null references orders(id) on_delete cascade
                                               -- Which order. Cascade: history removed with order.
  from_status     string nullable              -- Previous status. Null for the initial status entry.
  to_status       string not_null              -- New status.
  changed_by      uuid nullable references users(id) on_delete set_null
                                               -- Who made the change. Null = system/automated change.
  note            string nullable              -- Optional note explaining the change (e.g., "Customer requested cancellation").
  created_at      timestamp default now
}

indexes {
  index(order_id, created_at)
}
```

### 24. payment_methods

Saved customer payment instruments (credit/debit cards, bank accounts, digital wallets). Stores only tokenized references — never raw card numbers (PCI DSS compliance). Inspired by Stripe PaymentMethod.

```pseudo
table payment_methods {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade
                                               -- Owner. Cascade: delete payment methods with user.
  type            enum(card, bank_account, paypal, apple_pay, google_pay) not_null
  provider        string not_null              -- Payment gateway (e.g., "stripe", "braintree", "square").
  provider_id     string not_null              -- Token/ID from the payment provider (e.g., Stripe pm_xxx).
  label           string nullable              -- Display label (e.g., "Visa ending in 4242").
  last_four       string nullable              -- Last 4 digits of card number (for display only).
  brand           string nullable              -- Card brand (e.g., "visa", "mastercard", "amex").
  exp_month       integer nullable             -- Card expiration month (1-12).
  exp_year        integer nullable             -- Card expiration year (e.g., 2026).
  is_default      boolean not_null default false -- Whether this is the default payment method.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(user_id)
  unique(provider, provider_id)                -- Same provider token can't be stored twice.
}
```

### 25. payments

Payment transactions against orders. Each payment represents a charge attempt or completed charge. An order can have multiple payments (split payment, retry after failure). Inspired by Stripe Charge and Shopify Transaction.

```pseudo
table payments {
  id              uuid primary_key default auto_generate
  order_id        uuid not_null references orders(id) on_delete restrict
                                               -- Which order this payment is for.
                                               -- Restrict: don't delete orders with payment records.
  payment_method_id uuid nullable references payment_methods(id) on_delete set_null
                                               -- Payment instrument used. Nullable: method may be deleted after payment.
  provider        string not_null              -- Payment gateway (e.g., "stripe", "braintree").
  provider_id     string nullable              -- Transaction ID from the payment provider.
  type            enum(authorization, capture, sale) not_null
                                               -- authorization: funds held. capture: authorized funds charged. sale: immediate charge.
  status          enum(pending, succeeded, failed, canceled) not_null default pending
  currency        string not_null              -- ISO 4217 currency code.
  amount          integer not_null             -- Amount in smallest currency unit.
  provider_fee    integer nullable             -- Transaction fee charged by the provider (if known).
  metadata        json nullable                -- Provider-specific response data.
  error_message   string nullable              -- Error message if status = failed.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(order_id)
  index(provider, provider_id)
  index(status)
}
```

### 26. refunds

Refund records linked to payments. Supports full and partial refunds with reason tracking. Inspired by Stripe Refund and Shopify Refund.

```pseudo
table refunds {
  id              uuid primary_key default auto_generate
  payment_id      uuid not_null references payments(id) on_delete restrict
                                               -- Which payment this refund is against.
                                               -- Restrict: don't delete payments that have refunds.
  order_id        uuid not_null references orders(id) on_delete restrict
                                               -- Denormalized order reference for efficient queries.
  provider_id     string nullable              -- Refund ID from the payment provider.
  amount          integer not_null             -- Refund amount in smallest currency unit.
  currency        string not_null              -- ISO 4217 currency code.
  reason          string nullable              -- Reason for the refund (e.g., "Customer request", "Defective product").
  status          enum(pending, succeeded, failed) not_null default pending
  note            string nullable              -- Internal note about the refund.
  refunded_by     uuid nullable references users(id) on_delete set_null
                                               -- Admin who processed the refund. Null = automated/system refund.
  created_at      timestamp default now
}

indexes {
  index(payment_id)
  index(order_id)
  index(status)
}
```

### 27. shipping_profiles

Product shipping requirement groups. Products are assigned to shipping profiles that define how they ship — digital products don't need shipping, oversized items use freight carriers, standard items use regular postal services. Shipping methods can be scoped to specific profiles. Inspired by Medusa ShippingProfile and Shopify shipping profiles.

```pseudo
table shipping_profiles {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Profile name (e.g., "Default", "Digital", "Oversized", "Fragile").
  type            enum(default, digital, custom) not_null default default
                                               -- default: standard physical goods.
                                               -- digital: no shipping needed (downloads, licenses, etc.).
                                               -- custom: special handling (oversized, fragile, hazardous, etc.).
  description     string nullable              -- Description for admin reference.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(type)
}
```

**Design notes:**
- The `default` profile is used for standard physical goods — most products belong here.
- `digital` products skip the fulfillment flow entirely (no shipping address needed, instant delivery).
- `custom` profiles enable special shipping rules (freight-only, signature required, etc.) in application logic.

### 28. shipping_zones

Geographic shipping zones that define where shipping methods are available. Each zone contains one or more countries or regions. Shipping methods are scoped to zones — a customer sees only the methods available in their delivery zone. Inspired by Saleor ShippingZone, WooCommerce shipping zones, and BigCommerce shipping zones.

```pseudo
table shipping_zones {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Display name (e.g., "Domestic US", "EU", "Rest of World").
  description     string nullable              -- Zone description for admin reference.
  countries       text[] not_null              -- List of ISO 3166-1 alpha-2 country codes in this zone (e.g., ["US","CA","MX"]).
  is_active       boolean not_null default true -- Whether this zone is currently active.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(is_active)
}
```

**Design notes:**
- Countries stored as text array — simple and efficient for zone matching by country code.
- A "Rest of World" zone can be implemented by including all countries not covered by other zones (application logic).
- Zones can overlap (a country in multiple zones) — application logic picks the most specific match.

### 29. shipping_methods

Available shipping options per zone with pricing and estimated delivery times. Each method belongs to a shipping zone and optionally a shipping profile, defining the shipping choices presented to customers at checkout. Inspired by Shopify ShippingLine, Medusa ShippingOption, and Saleor ShippingMethod.

```pseudo
table shipping_methods {
  id              uuid primary_key default auto_generate
  zone_id         uuid not_null references shipping_zones(id) on_delete cascade
                                               -- Which zone this method is available in.
                                               -- Cascade: removing a zone removes all its shipping methods.
  profile_id      uuid nullable references shipping_profiles(id) on_delete set_null
                                               -- Which shipping profile this method applies to. Null = all profiles.
                                               -- Set null: method becomes available to all profiles if profile is deleted.
  name            string not_null              -- Display name (e.g., "Standard Shipping", "Express 2-Day").
  description     string nullable              -- Detailed description of the shipping option.
  price           integer not_null             -- Base shipping price in smallest currency unit.
  currency        string not_null              -- ISO 4217 currency code.
  min_delivery_days integer nullable           -- Minimum estimated delivery days.
  max_delivery_days integer nullable           -- Maximum estimated delivery days.
  min_order_amount integer nullable            -- Minimum order subtotal for this method to be available. Null = no minimum.
  max_weight_grams integer nullable            -- Maximum total order weight in grams. Null = no limit.
  is_active       boolean not_null default true -- Whether this shipping method is available for selection.
  sort_order      integer not_null default 0   -- Display ordering at checkout.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(zone_id, is_active, sort_order)
  index(profile_id)
}
```

### 30. fulfillment_providers

Configurable fulfillment provider integrations. Defines the available fulfillment services (manual, FedEx, DHL, 3PL, etc.) and their configuration. Fulfillments reference a provider to indicate which service handles the shipment. Inspired by Medusa FulfillmentProvider and Spree stock locations.

```pseudo
table fulfillment_providers {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Provider display name (e.g., "Manual Fulfillment", "FedEx", "ShipBob").
  code            string unique not_null       -- Provider code for application logic (e.g., "manual", "fedex", "shipbob").
  type            enum(manual, flat_rate, carrier_calculated, third_party) not_null
                                               -- manual: staff handles fulfillment manually.
                                               -- flat_rate: fixed-price shipping.
                                               -- carrier_calculated: real-time rate from carrier API.
                                               -- third_party: external 3PL service.
  config          json nullable                -- Provider-specific configuration (API keys, warehouse addresses, etc.).
                                               -- Encrypted at the application level for sensitive data.
  is_active       boolean not_null default true -- Whether this provider is currently available.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(is_active)
}
```

### 31. fulfillments

Shipments created for orders. An order can have multiple fulfillments (partial shipments). Tracks shipping carrier, tracking information, and which provider handled the shipment. Inspired by Shopify Fulfillment and Saleor Fulfillment.

```pseudo
table fulfillments {
  id              uuid primary_key default auto_generate
  order_id        uuid not_null references orders(id) on_delete restrict
                                               -- Which order this fulfillment is for.
                                               -- Restrict: don't delete orders with fulfillment records.
  provider_id     uuid nullable references fulfillment_providers(id) on_delete set_null
                                               -- Which provider handled this fulfillment. Set null if provider is removed.
  shipping_method_id uuid nullable references shipping_methods(id) on_delete set_null
                                               -- Shipping method used. Set null: method may be deactivated.
  status          enum(pending, shipped, in_transit, delivered, failed, returned) not_null default pending
  tracking_number string nullable              -- Carrier tracking number.
  tracking_url    string nullable              -- Tracking URL for the customer.
  carrier         string nullable              -- Shipping carrier name (e.g., "UPS", "FedEx", "USPS").
  shipped_at      timestamp nullable           -- When the shipment was handed to the carrier.
  delivered_at    timestamp nullable           -- When delivery was confirmed.
  note            string nullable              -- Internal fulfillment note.
  created_by      uuid nullable references users(id) on_delete set_null
                                               -- Who created this fulfillment. Null = automated.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(order_id)
  index(provider_id)
  index(status)
  index(tracking_number)
}
```

### 32. fulfillment_items

Which order items are included in each fulfillment. Enables partial fulfillment — shipping some items now and the rest later. Inspired by Shopify FulfillmentLineItem and Saleor FulfillmentLine.

```pseudo
table fulfillment_items {
  id              uuid primary_key default auto_generate
  fulfillment_id  uuid not_null references fulfillments(id) on_delete cascade
                                               -- Parent fulfillment. Cascade: removing a fulfillment removes its items.
  order_item_id   uuid not_null references order_items(id) on_delete cascade
                                               -- Which order item is being fulfilled.
  quantity        integer not_null             -- Number of units of this item in this shipment.
  created_at      timestamp default now
}

indexes {
  composite_unique(fulfillment_id, order_item_id) -- Each order item appears once per fulfillment.
}
```

### 33. return_authorizations

Return/exchange requests for order items. A return authorization (RMA) must be approved before the customer can ship items back. Tracks the reason, status, and refund amount for the return. Inspired by Solidus ReturnAuthorization and Spree return_authorizations.

```pseudo
table return_authorizations {
  id              uuid primary_key default auto_generate
  order_id        uuid not_null references orders(id) on_delete restrict
                                               -- Which order this return is for.
                                               -- Restrict: don't delete orders with return records.
  rma_number      string unique not_null       -- Human-readable return authorization number (e.g., "RMA-20240315-X1Y2").
  status          enum(requested, approved, rejected, received, refunded, canceled) not_null default requested
                                               -- requested: customer submitted return request.
                                               -- approved: admin approved — customer can ship items back.
                                               -- rejected: admin denied the return.
                                               -- received: returned items received at warehouse.
                                               -- refunded: refund processed for the return.
                                               -- canceled: return canceled by customer or admin.
  reason          string nullable              -- Customer's reason for the return.
  note            string nullable              -- Internal admin note.
  refund_amount   integer nullable             -- Approved refund amount in smallest currency unit. Null until approved.
  currency        string not_null              -- ISO 4217 currency code.
  requested_by    uuid nullable references users(id) on_delete set_null
                                               -- Customer who requested the return. Null = admin-initiated.
  approved_by     uuid nullable references users(id) on_delete set_null
                                               -- Admin who approved/rejected. Null = pending or auto-approved.
  received_at     timestamp nullable           -- When returned items were received at warehouse.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(order_id)
  index(status)
  index(created_at)
}
```

**Design notes:**
- `rma_number` is a human-readable identifier separate from the UUID primary key.
- The refund associated with a return is processed via the `refunds` table — `refund_amount` here is the approved amount.
- Status tracks the full lifecycle: request → approval → receipt → refund.

### 34. return_items

Individual items in a return authorization. Each record specifies which order item is being returned and in what quantity. Inspired by Solidus ReturnItem and Spree return_items.

```pseudo
table return_items {
  id              uuid primary_key default auto_generate
  return_authorization_id uuid not_null references return_authorizations(id) on_delete cascade
                                               -- Parent return. Cascade: removing a return removes its items.
  order_item_id   uuid not_null references order_items(id) on_delete cascade
                                               -- Which order item is being returned.
  quantity        integer not_null             -- Number of units being returned.
  reason          string nullable              -- Item-specific return reason (may differ from the overall return reason).
  condition       enum(unopened, like_new, used, damaged, defective) nullable
                                               -- Condition of the returned item (set on receipt).
  received_quantity integer not_null default 0  -- How many units were actually received back.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  composite_unique(return_authorization_id, order_item_id) -- Each order item appears once per return.
}
```

### 35. product_reviews

Customer ratings and text reviews for products. Includes a moderation status to prevent spam and inappropriate content from being published. Inspired by BigCommerce ProductReview and PrestaShop product comments.

```pseudo
table product_reviews {
  id              uuid primary_key default auto_generate
  product_id      uuid not_null references products(id) on_delete cascade
                                               -- Which product is being reviewed.
                                               -- Cascade: deleting a product removes all its reviews.
  user_id         uuid not_null references users(id) on_delete cascade
                                               -- Review author. Cascade: deleting a user removes their reviews.
  rating          integer not_null             -- Rating from 1 to 5. Validated in application logic.
  title           string nullable              -- Review headline (e.g., "Great product!").
  body            string nullable              -- Full review text.
  status          enum(pending, approved, rejected) not_null default pending
                                               -- Moderation status. Only approved reviews are shown on storefront.
  verified_purchase boolean not_null default false
                                               -- Whether the reviewer actually purchased this product.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(product_id, status)
  composite_unique(product_id, user_id)        -- One review per user per product.
  index(status)
}
```

## Relationships

### One-to-Many

```
categories             1 ──── * categories              (parent → children, self-referential)
categories             1 ──── * products                (category → products)
brands                 1 ──── * products                (brand → products)
products               1 ──── * product_variants        (product → variants)
products               1 ──── * product_images          (product → images)
product_variants       1 ──── * product_images          (variant → images, optional)
product_collections    1 ──── * product_collection_items (collection → items)
product_tags           1 ──── * product_tag_assignments  (tag → assignments)
product_variants       1 ──── * prices                  (variant → prices)
shipping_profiles      1 ──── * product_variants        (profile → variants)
discounts              1 ──── * discount_usages         (discount → usages)
users                  1 ──── * addresses               (user → addresses)
users                  1 ──── * wishlists               (user → wishlists)
wishlists              1 ──── * wishlist_items           (wishlist → items)
users                  1 ──── * carts                   (user → carts)
carts                  1 ──── * cart_items              (cart → items)
carts                  1 ──── * payment_sessions        (cart → payment sessions)
users                  1 ──── * orders                  (user → orders)
orders                 1 ──── * order_items             (order → items)
orders                 1 ──── * order_status_history    (order → status history)
orders                 1 ──── * discount_usages         (order → discount usages)
users                  1 ──── * payment_methods         (user → payment methods)
orders                 1 ──── * payments                (order → payments)
payments               1 ──── * refunds                 (payment → refunds)
orders                 1 ──── * refunds                 (order → refunds, denormalized)
shipping_zones         1 ──── * shipping_methods        (zone → methods)
shipping_profiles      1 ──── * shipping_methods        (profile → methods, optional)
fulfillment_providers  1 ──── * fulfillments            (provider → fulfillments)
orders                 1 ──── * fulfillments            (order → fulfillments)
fulfillments           1 ──── * fulfillment_items       (fulfillment → items)
orders                 1 ──── * return_authorizations   (order → returns)
return_authorizations  1 ──── * return_items            (return → items)
products               1 ──── * product_reviews         (product → reviews)
users                  1 ──── * product_reviews         (user → reviews)
```

### Many-to-Many (via junction tables)

```
product_collections ←── product_collection_items ──→ products          (collections × products)
product_tags ←── product_tag_assignments ──→ products                  (tags × products)
wishlists ←──── wishlist_items ────→ product_variants                  (wishlists × variants)
fulfillments ←── fulfillment_items ──→ order_items                     (fulfillments × order items)
return_authorizations ←── return_items ──→ order_items                 (returns × order items)
```

## Best Practices

- **Prices as integers**: Store all monetary values as integers in the smallest currency unit (cents for USD, pence for GBP). This avoids floating-point rounding errors that plague e-commerce calculations.
- **Snapshot on order**: Order items must contain complete product/price data frozen at purchase time. Never rely on live product data for historical orders — products change, get deleted, and prices fluctuate.
- **Soft delete products only**: Products referenced by orders should be soft-deleted (via `deleted_at`), not hard-deleted. Orders, payments, and fulfillments should never be deleted — they're financial/audit records.
- **Idempotency**: Payment processing should use idempotency keys (at the application level) to prevent duplicate charges. The `provider_id` field on payments helps detect duplicates.
- **Cart expiry**: Implement cart cleanup via background jobs — delete abandoned guest carts older than a threshold (e.g., 30 days).
- **Address snapshots**: Always denormalize addresses onto orders. The customer's address record may change, but the order's shipping/billing addresses must remain as they were at checkout.
- **Multi-currency**: Use the `prices` and `currencies` tables for multi-currency support. Each variant can have prices in multiple currencies. The cart's `currency` field determines which prices to use.
- **Shipping profiles**: Assign products to shipping profiles to handle different shipping requirements (digital goods skip shipping entirely, oversized items use freight).
- **Return flow**: Use return authorizations to track the full lifecycle: request → approval → receipt → refund. The associated refund is processed through the `refunds` table.
- **Access control**: Use the Auth / RBAC domain for permission checks. Customers see their own orders/carts; admins manage products, discounts, and fulfillments.

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
