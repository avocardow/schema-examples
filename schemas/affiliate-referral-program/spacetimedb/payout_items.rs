// payout_items: Line items linking a payout to the commissions it covers.
// Composite unique: (payout_id, commission_id) — enforce in reducer logic

use spacetimedb::Timestamp;

#[spacetimedb::table(name = payout_items, public)]
pub struct PayoutItem {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub payout_id: String, // UUID, FK -> payouts.id (cascade delete)

    #[index(btree)]
    pub commission_id: String, // UUID, FK -> commissions.id (restrict delete)

    pub amount: i32,

    pub created_at: Timestamp,
}
