// reward_redemptions: Records of members redeeming points for rewards with fulfillment lifecycle.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum RedemptionStatus {
    Pending,   // type: String
    Fulfilled,
    Canceled,
    Expired,
}

#[spacetimedb::table(name = reward_redemptions, public)]
pub struct RewardRedemption {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub member_id: String, // UUID, FK → loyalty_members.id (restrict delete)
    // Composite index: (member_id, created_at) — enforce in reducer logic
    #[index(btree)]
    pub reward_id: String, // UUID, FK → rewards.id (restrict delete)
    pub points_spent: i32,
    #[index(btree)]
    pub status: RedemptionStatus,
    pub coupon_code: Option<String>,
    pub fulfilled_at: Option<Timestamp>,
    pub canceled_at: Option<Timestamp>,
    pub expires_at: Option<Timestamp>,
    pub metadata: Option<String>, // JSON stored as string
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
