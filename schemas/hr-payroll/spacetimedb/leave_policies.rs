// leave_policies: Leave/time-off policy definitions and accrual rules.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

/// Category of leave covered by this policy.
// leave_type: String
#[derive(SpacetimeType, Clone)]
pub enum LeaveType {
    Vacation,
    Sick,
    Personal,
    Parental,
    Bereavement,
    JuryDuty,
    Unpaid,
    Other,
}

/// How often leave hours accrue.
// accrual_frequency: String
#[derive(SpacetimeType, Clone)]
pub enum AccrualFrequency {
    PerPayPeriod,
    Monthly,
    Quarterly,
    Annually,
    /// Represents no accrual (`None` is a Rust keyword).
    NoAccrual,
}

#[spacetimedb::table(name = leave_policies, public)]
pub struct LeavePolicy {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,

    #[index(btree)]
    pub leave_type: LeaveType,

    pub accrual_rate: Option<f64>,
    pub accrual_frequency: AccrualFrequency, // default: NoAccrual

    pub max_balance: Option<f64>,
    pub max_carryover: Option<f64>,

    pub is_paid: bool,       // default: true
    pub requires_approval: bool, // default: true

    #[index(btree)]
    pub is_active: bool, // default: true

    pub description: Option<String>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
