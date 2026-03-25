// plan_prices: Pricing options attached to plans with billing intervals.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum PriceType {
    Recurring,  // type: String
    OneTime,
    UsageBased,
}

#[derive(SpacetimeType, Clone)]
pub enum PriceInterval {
    Day,   // type: String
    Week,
    Month,
    Year,
}

#[spacetimedb::table(name = plan_prices, public)]
pub struct PlanPrice {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub plan_id: String, // UUID — FK → plans.id (cascade delete)
    pub nickname: Option<String>,
    pub price_type: PriceType,
    pub amount: i32,
    pub currency: String,
    pub interval: Option<PriceInterval>,
    pub interval_count: i32,
    pub trial_period_days: Option<i32>,
    pub is_active: bool,
    pub metadata: Option<String>, // JSON
    pub provider_type: Option<String>,
    pub provider_id: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
