// benefit_enrollments: Links employees to benefit plans with coverage level, contribution amounts, and enrollment status.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum CoverageLevel {
    EmployeeOnly,
    EmployeeSpouse,
    EmployeeChildren,
    Family,
}

#[derive(SpacetimeType, Clone)]
pub enum BenefitEnrollmentStatus {
    Active,
    Pending,
    Terminated,
    Waived,
}

#[spacetimedb::table(name = benefit_enrollments, public)]
pub struct BenefitEnrollment {
    #[primary_key]
    pub id: String, // UUID auto-generated

    #[index(btree)]
    pub employee_id: String, // UUID — FK → employees.id (cascade delete)

    #[index(btree)]
    pub benefit_plan_id: String, // UUID — FK → benefit_plans.id (restrict delete)

    pub coverage_level: CoverageLevel, // default EmployeeOnly

    pub employee_contribution: i64, // default 0

    pub employer_contribution: i64, // default 0

    pub currency: String, // default 'USD'

    #[index(btree)]
    pub effective_date: String,

    pub end_date: Option<String>,

    #[index(btree)]
    pub status: BenefitEnrollmentStatus, // default Pending

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
