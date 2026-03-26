// benefit_plans: Employer-sponsored benefit plan catalog with contribution amounts and plan year dates.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum BenefitPlanType {
    Health,
    Dental,
    Vision,
    Retirement401k,
    LifeInsurance,
    Disability,
    Hsa,
    Fsa,
    Other,
}

#[spacetimedb::table(name = benefit_plans, public)]
pub struct BenefitPlan {
    #[primary_key]
    pub id: String, // UUID auto-generated

    pub name: String,

    #[index(btree)]
    pub plan_type: BenefitPlanType,

    pub description: Option<String>,

    pub employer_contribution: Option<i64>,  // cents
    pub employee_contribution: Option<i64>,  // cents

    pub currency: String, // default 'USD'

    #[index(btree)]
    pub is_active: bool, // default true

    pub plan_year_start: Option<String>,
    pub plan_year_end: Option<String>,

    pub metadata: Option<String>, // JSON

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
