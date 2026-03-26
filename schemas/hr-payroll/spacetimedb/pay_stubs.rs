// pay_stubs: Records individual employee pay details for each payroll run.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = pay_stubs, public)]
pub struct PayStub {
    #[primary_key]
    pub id: String, // UUID auto-generated

    #[index(btree)]
    pub payroll_run_id: String, // UUID — FK → payroll_runs.id (cascade delete)

    #[index(btree)]
    pub employee_id: String, // UUID — FK → employees.id (cascade delete)

    pub gross_pay: i64, // default 0

    pub total_deductions: i64, // default 0

    pub net_pay: i64, // default 0

    pub currency: String, // default 'USD'

    #[index(btree)]
    pub pay_date: String,

    pub period_start: String,

    pub period_end: String,

    pub created_at: Timestamp,
}

// Composite unique: (payroll_run_id, employee_id) — enforce in reducer logic
