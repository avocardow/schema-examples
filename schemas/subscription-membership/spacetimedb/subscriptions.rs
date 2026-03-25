// subscriptions: Active or historical subscription records for customers.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum SubscriptionStatus {
    Trialing,   // type: String
    Active,
    PastDue,
    Paused,
    Canceled,
    Expired,
    Incomplete,
}

#[spacetimedb::table(name = subscriptions, public)]
pub struct Subscription {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub customer_id: String, // UUID — FK → customers.id (cascade delete)
    #[index(btree)]
    pub status: SubscriptionStatus,
    pub current_period_start: Option<Timestamp>,
    pub current_period_end: Option<Timestamp>,
    pub trial_start: Option<Timestamp>,
    pub trial_end: Option<Timestamp>,
    pub canceled_at: Option<Timestamp>,
    pub ended_at: Option<Timestamp>,
    pub cancel_at_period_end: bool,
    pub paused_at: Option<Timestamp>,
    pub resumes_at: Option<Timestamp>,
    pub billing_cycle_anchor: Option<Timestamp>,
    pub coupon_id: Option<String>, // UUID — FK → coupons.id (set null)
    pub metadata: Option<String>, // JSON
    pub provider_type: Option<String>,
    pub provider_id: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
