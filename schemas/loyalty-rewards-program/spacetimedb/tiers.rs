// tiers: Tier/VIP level definitions with qualification thresholds and ordering.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum TierQualificationType {
    PointsEarned,      // type: String
    AmountSpent,
    TransactionCount,
}

#[spacetimedb::table(name = tiers, public)]
pub struct Tier {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub program_id: String, // UUID, FK → loyalty_programs.id (cascade delete)
    // Composite unique: (program_id, slug) — enforce in reducer logic
    // Composite unique: (program_id, position) — enforce in reducer logic
    pub name: String,
    pub slug: String,
    pub description: Option<String>,
    pub position: i32,
    pub qualification_type: TierQualificationType,
    pub qualification_value: i32,
    pub qualification_period_days: Option<i32>,
    pub retain_days: Option<i32>,
    pub icon_url: Option<String>,
    pub color: Option<String>,
    #[index(btree)]
    pub is_default: bool, // default false
    pub metadata: Option<String>, // JSON stored as string
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
