// leave_balances: Tracks employee leave accrual, usage, and carry-over per policy and year.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique: (employee_id, leave_policy_id, year) — enforce in reducer logic

#[spacetimedb::table(name = leave_balances, public)]
pub struct LeaveBalance {
    #[primary_key]
    pub id: String, // UUID auto-generated

    #[index(btree)]
    pub employee_id: String, // UUID — FK → employees.id (cascade delete)

    #[index(btree)]
    pub leave_policy_id: String, // UUID — FK → leave_policies.id (cascade delete)

    pub balance: f64,     // default 0
    pub accrued: f64,     // default 0
    pub used: f64,        // default 0
    pub carried_over: f64, // default 0

    pub year: i32,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
