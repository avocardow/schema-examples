// vendor_balances: Current financial balance summary for each vendor.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = vendor_balances, public)]
pub struct VendorBalance {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub vendor_id: String, // UUID, FK -> vendors.id (cascade delete)

    pub currency: String,
    pub available: i32,
    pub pending: i32,
    pub total_earned: i32,
    pub total_paid_out: i32,
    pub updated_at: Timestamp,
}
