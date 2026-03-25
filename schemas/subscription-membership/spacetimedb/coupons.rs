// coupons: Discount codes and promotions applicable to subscriptions.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum DiscountType {
    Percentage,  // type: String
    FixedAmount,
}

#[derive(SpacetimeType, Clone)]
pub enum CouponDuration {
    Once,      // type: String
    Repeating,
    Forever,
}

#[spacetimedb::table(name = coupons, public)]
pub struct Coupon {
    #[primary_key]
    pub id: String, // UUID
    #[unique]
    pub code: Option<String>,
    pub name: String,
    pub discount_type: DiscountType,
    pub discount_value: i32,
    pub currency: Option<String>,
    pub duration: CouponDuration,
    pub duration_in_months: Option<i32>,
    pub max_redemptions: Option<i32>,
    pub times_redeemed: i32,
    #[index(btree)]
    pub is_active: bool,
    pub valid_from: Option<Timestamp>,
    pub valid_until: Option<Timestamp>,
    pub metadata: Option<String>, // JSON
    pub provider_type: Option<String>,
    pub provider_id: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
