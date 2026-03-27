// balance_transactions: Ledger of all balance changes for an affiliate account.
// Composite index: (affiliate_id, created_at) — not supported; indexed separately
// Composite index: (reference_type, reference_id) — not supported; indexed separately

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum BalanceTransactionType {
    Commission,
    Payout,
    Reversal,
    Adjustment,
}

#[spacetimedb::table(name = balance_transactions, public)]
pub struct BalanceTransaction {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub affiliate_id: String, // UUID, FK -> affiliates.id (restrict delete)

    #[index(btree)]
    pub transaction_type: BalanceTransactionType,

    pub amount: i32,
    pub currency: String,
    pub running_balance: i32,

    #[index(btree)]
    pub reference_type: Option<String>,
    pub reference_id: Option<String>,
    pub description: Option<String>,

    pub created_at: Timestamp,
}
