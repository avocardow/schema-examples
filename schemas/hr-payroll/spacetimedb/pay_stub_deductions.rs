// pay_stub_deductions: Individual deduction line items on a pay stub (e.g. tax, retirement, insurance).
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = pay_stub_deductions, public)]
pub struct PayStubDeduction {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub pay_stub_id: String, // FK → pay_stubs.id (cascade delete)

    #[index(btree)]
    pub deduction_type_id: String, // FK → deduction_types.id (restrict delete)

    pub employee_amount: i64, // default: 0
    pub employer_amount: i64, // default: 0

    pub created_at: Timestamp,
}
