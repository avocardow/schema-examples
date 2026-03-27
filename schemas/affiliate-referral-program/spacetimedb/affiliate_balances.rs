// affiliate_balances: Tracks the financial balance for each affiliate.
// One balance record per affiliate per currency.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = affiliate_balances, public)]
pub struct AffiliateBalance {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[unique]
    pub affiliate_id: String, // UUID, FK -> affiliates.id (cascade delete)

    pub currency: String,

    pub available: i32,   // default: 0
    pub pending: i32,     // default: 0
    pub total_earned: i32,   // default: 0
    pub total_paid_out: i32, // default: 0

    pub updated_at: Timestamp,
}
