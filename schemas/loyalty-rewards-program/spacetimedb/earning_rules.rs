// earning_rules: Rules defining how members earn points (event type, amount, conditions).
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum EarningType {
    Fixed,       // type: String
    PerCurrency,
    Multiplier,
}

#[spacetimedb::table(name = earning_rules, public)]
pub struct EarningRule {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub program_id: String, // UUID, FK → loyalty_programs.id (cascade delete)
    // Composite index: (program_id, is_active) — enforce in reducer logic
    pub name: String,
    pub description: Option<String>,
    #[index(btree)]
    pub event_type: String,
    pub earning_type: EarningType,
    pub points_amount: Option<i32>,
    pub multiplier: Option<f64>,
    pub min_purchase_amount: Option<i32>,
    pub max_points_per_event: Option<i32>,
    pub conditions: Option<String>, // JSON stored as string
    pub is_active: bool, // default true
    pub sort_order: i32, // default 0
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
