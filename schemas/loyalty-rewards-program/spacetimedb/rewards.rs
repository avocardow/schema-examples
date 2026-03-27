// rewards: Catalog of available rewards with points cost and inventory tracking.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum RewardType {
    DiscountPercentage, // type: String
    DiscountFixed,
    FreeProduct,
    FreeShipping,
    GiftCard,
    Experience,
    Custom,
}

#[spacetimedb::table(name = rewards, public)]
pub struct Reward {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub program_id: String, // UUID, FK → loyalty_programs.id (cascade delete)
    // Composite index: (program_id, is_active) — enforce in reducer logic
    pub name: String,
    pub description: Option<String>,
    #[index(btree)]
    pub reward_type: RewardType,
    pub points_cost: i32,
    pub reward_value: Option<i32>,
    pub currency: Option<String>,
    pub image_url: Option<String>,
    pub inventory: Option<i32>,
    pub max_redemptions_per_member: Option<i32>,
    pub is_active: bool, // default true
    #[index(btree)]
    pub min_tier_id: Option<String>, // UUID, FK → tiers.id (set null)
    pub metadata: Option<String>, // JSON stored as string
    pub sort_order: i32, // default 0
    pub valid_from: Option<Timestamp>,
    pub valid_until: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
