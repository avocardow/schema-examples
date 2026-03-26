// promo_codes: Discount codes applied to event ticket purchases.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum DiscountType {
    Percentage, // type: String
    Fixed,
}

#[spacetimedb::table(name = promo_codes, public)]
pub struct PromoCode {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub event_id: String, // UUID — FK → events.id (cascade delete)

    pub code: String,
    pub discount_type: DiscountType,
    pub discount_value: i64, // stored in smallest currency unit (e.g. cents) for Fixed type
    pub currency: Option<String>,
    pub max_uses: Option<i32>,
    pub times_used: i32,
    pub max_uses_per_order: i32,
    pub valid_from: Option<Timestamp>,
    pub valid_until: Option<Timestamp>,
    pub is_active: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite unique: (event_id, code)
}
