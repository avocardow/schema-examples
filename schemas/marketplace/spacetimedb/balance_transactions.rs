// balance_transactions: Ledger of all financial movements affecting vendor balances.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum BalanceTransactionType {
    Earning,
    Commission,
    Payout,
    Refund,
    Adjustment,
    Hold,
    Release,
}

// Composite index: (vendor_id, created_at)

#[spacetimedb::table(name = balance_transactions, public)]
pub struct BalanceTransaction {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub vendor_id: String, // UUID, FK -> vendors.id (restrict delete)

    pub transaction_type: BalanceTransactionType,
    pub amount: i32,
    pub currency: String,
    pub running_balance: i32,
    pub reference_type: Option<String>,
    pub reference_id: Option<String>,
    pub description: Option<String>,
    pub created_at: Timestamp,
}
