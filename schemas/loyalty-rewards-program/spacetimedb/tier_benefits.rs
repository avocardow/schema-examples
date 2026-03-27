// tier_benefits: Specific benefits unlocked at each tier (multipliers, perks, access).
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum BenefitType {
    PointsMultiplier,  // type: String
    FreeShipping,
    EarlyAccess,
    BirthdayBonus,
    ExclusiveRewards,
    PrioritySupport,
    Custom,
}

#[spacetimedb::table(name = tier_benefits, public)]
pub struct TierBenefit {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub tier_id: String, // UUID, FK → tiers.id (cascade delete)
    #[index(btree)]
    pub benefit_type: BenefitType,
    pub value: Option<String>,
    pub description: String,
    pub is_active: bool, // default true
    pub sort_order: i32, // default 0
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
