// promotions: Time-limited bonus earning campaigns (multipliers, fixed bonuses).
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum PromotionType {
    Multiplier,  // type: String
    FixedBonus,
}

#[derive(SpacetimeType, Clone)]
pub enum PromotionStatus {
    Scheduled,   // type: String
    Active,
    Ended,
    Canceled,
}

#[spacetimedb::table(name = promotions, public)]
pub struct Promotion {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub program_id: String, // UUID, FK → loyalty_programs.id (cascade delete)
    // Composite index: (program_id, status) — enforce in reducer logic
    pub name: String,
    pub description: Option<String>,
    pub promotion_type: PromotionType,
    pub multiplier: Option<f64>,
    pub bonus_points: Option<i32>,
    pub event_type: Option<String>,
    pub conditions: Option<String>, // JSON stored as string
    #[index(btree)]
    pub status: PromotionStatus,
    #[index(btree)]
    pub starts_at: Timestamp,
    // Composite index: (starts_at, ends_at) — enforce in reducer logic
    pub ends_at: Timestamp,
    pub max_points_per_member: Option<i32>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
