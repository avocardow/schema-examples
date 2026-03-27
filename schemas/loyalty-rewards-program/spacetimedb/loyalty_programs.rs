// loyalty_programs: Top-level loyalty program configuration with currency, earning, and expiration settings.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum LoyaltyProgramStatus {
    Draft,    // type: String
    Active,
    Paused,
    Archived,
}

#[spacetimedb::table(name = loyalty_programs, public)]
pub struct LoyaltyProgram {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,
    #[unique]
    pub slug: String,
    pub description: Option<String>,
    #[index(btree)]
    pub status: LoyaltyProgramStatus,
    pub currency_name: String, // default "points"
    pub points_per_currency: f64, // default 1
    pub currency: Option<String>,
    pub points_expiry_days: Option<i32>,
    pub allow_negative: bool, // default false
    pub is_public: bool, // default true
    pub terms_url: Option<String>,
    pub metadata: Option<String>, // JSON stored as string
    #[index(btree)]
    pub created_by: String, // UUID, FK → users.id (restrict delete)
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
