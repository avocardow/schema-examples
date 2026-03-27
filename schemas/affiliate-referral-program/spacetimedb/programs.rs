// programs: Affiliate/referral program definitions with commission rules.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum ProgramStatus {
    Draft,
    Active,
    Paused,
    Archived,
}

#[derive(SpacetimeType, Clone)]
pub enum CommissionType {
    Percentage,
    Flat,
    Hybrid,
}

#[derive(SpacetimeType, Clone)]
pub enum AttributionModel {
    FirstTouch,
    LastTouch,
}

#[spacetimedb::table(name = programs, public)]
pub struct Program {
    #[primary_key]
    pub id: String, // UUID
    pub name: String,
    #[unique]
    pub slug: String,
    pub description: Option<String>,
    #[index(btree)]
    pub status: ProgramStatus,
    pub commission_type: CommissionType,
    pub commission_percentage: Option<f64>,
    pub commission_flat: Option<i32>,
    pub currency: String,
    pub cookie_duration: i32, // default 30
    pub attribution_model: AttributionModel,
    pub min_payout: i32, // default 0
    pub auto_approve: bool, // default false
    pub is_public: bool, // default true
    pub terms_url: Option<String>,
    #[index(btree)]
    pub created_by: String, // UUID, FK -> users.id (restrict delete)
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
