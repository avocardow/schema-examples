// pay_stub_earnings: Individual earning line items on a pay stub (e.g. regular hours, overtime, bonus).
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = pay_stub_earnings, public)]
pub struct PayStubEarning {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub pay_stub_id: String, // FK → pay_stubs.id (cascade delete)

    #[index(btree)]
    pub earning_type_id: String, // FK → earning_types.id (restrict delete)

    pub hours: Option<f64>,

    pub rate: Option<i64>,

    pub amount: i64,

    pub created_at: Timestamp,
}
