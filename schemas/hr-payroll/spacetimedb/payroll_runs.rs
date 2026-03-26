// payroll_runs: Tracks each payroll execution cycle with totals, status, and audit trail.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum PayrollRunStatus {
    Draft,      // Initial state; run created but not yet submitted.
    Processing, // Payroll calculations in progress.
    Completed,  // All payments finalized successfully.
    Failed,     // Processing encountered an unrecoverable error.
    Voided,     // Run canceled or reversed after completion.
}
// type: String

#[spacetimedb::table(name = payroll_runs, public)]
pub struct PayrollRun {
    #[primary_key]
    pub id: String, // UUID — auto-generated

    #[index(btree)]
    pub pay_schedule_id: String, // FK → pay_schedules.id (restrict delete)

    pub period_start: String, // ISO 8601 date
    pub period_end: String,   // ISO 8601 date

    #[index(btree)]
    pub pay_date: String, // ISO 8601 date

    #[index(btree)]
    pub status: PayrollRunStatus, // default: Draft

    pub total_gross: i64,      // default: 0
    pub total_deductions: i64, // default: 0
    pub total_net: i64,        // default: 0
    pub employee_count: i32,   // default: 0

    pub currency: String, // default: "USD"

    pub processed_at: Option<Timestamp>,
    pub processed_by: Option<String>, // UUID — FK → users.id (set_null delete)

    pub notes: Option<String>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
