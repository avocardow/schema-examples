// compensation: Tracks employee pay rates, types, and frequency with effective dating.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum PayType {
    Salary,
    Hourly,
}

#[derive(SpacetimeType, Clone)]
pub enum PayFrequency {
    Weekly,
    Biweekly,
    Semimonthly,
    Monthly,
    Annually,
}

#[spacetimedb::table(name = compensation, public)]
pub struct Compensation {
    #[primary_key]
    pub id: String, // UUID auto-generated

    #[index(btree)]
    pub employee_id: String, // UUID — FK → employees.id (cascade delete)

    pub pay_type: PayType,

    pub amount: i64,

    pub currency: String, // default 'USD'

    pub pay_frequency: PayFrequency,

    #[index(btree)]
    pub effective_date: String,

    pub end_date: Option<String>,

    pub reason: Option<String>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
