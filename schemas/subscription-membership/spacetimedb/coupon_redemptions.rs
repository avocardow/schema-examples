// coupon_redemptions: Records of coupons applied to customer subscriptions.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = coupon_redemptions, public)]
pub struct CouponRedemption {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub coupon_id: String, // UUID — FK → coupons.id (cascade delete)
    #[index(btree)]
    pub customer_id: String, // UUID — FK → customers.id (cascade delete)
    pub subscription_id: Option<String>, // UUID — FK → subscriptions.id (set null)
    pub redeemed_at: Timestamp,
    pub provider_type: Option<String>,
    pub provider_id: Option<String>,
    pub created_at: Timestamp,
}
