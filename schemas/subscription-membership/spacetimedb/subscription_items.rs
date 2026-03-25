// subscription_items: Line items linking subscriptions to specific plan prices.
// See README.md for full design rationale.
// Composite unique: (subscription_id, plan_price_id) — enforce in reducer logic

use spacetimedb::Timestamp;

#[spacetimedb::table(name = subscription_items, public)]
pub struct SubscriptionItem {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub subscription_id: String, // UUID — FK → subscriptions.id (cascade delete)
    #[index(btree)]
    pub plan_price_id: String, // UUID — FK → plan_prices.id (restrict delete)
    pub quantity: i32,
    pub metadata: Option<String>, // JSON
    pub provider_type: Option<String>,
    pub provider_id: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
