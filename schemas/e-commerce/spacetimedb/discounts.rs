// discounts: Discount codes and rules with usage limits and date-range validity.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum DiscountType {
    Percentage, // type: String
    FixedAmount,
    FreeShipping,
}

// Composite index: (is_active, starts_at, ends_at) — enforce in reducer logic or query layer

#[spacetimedb::table(name = discounts, public)]
pub struct Discount {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    // Unique: code — nullable, enforce in reducer logic
    pub code: Option<String>,

    #[index(btree)]
    pub r#type: DiscountType, // not null

    pub value: f64,             // not null
    pub currency: Option<String>,
    pub conditions: Option<String>, // JSON

    pub usage_limit: Option<i32>,
    pub usage_count: i32,           // default: 0
    pub per_customer_limit: Option<i32>,

    pub starts_at: Option<Timestamp>,
    pub ends_at: Option<Timestamp>,

    #[index(btree)]
    pub is_active: bool, // default: true

    pub created_by: String, // FK → users.id (restrict delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
