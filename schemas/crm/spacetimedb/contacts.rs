// contacts: People tracked in the CRM with lifecycle and source info.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum ContactLifecycleStage {
    Subscriber, // type: String
    Lead,
    Qualified,
    Opportunity,
    Customer,
    Evangelist,
    Other,
}

#[derive(SpacetimeType, Clone)]
pub enum LeadSource {
    Web, // type: String
    Referral,
    Organic,
    Paid,
    Social,
    Event,
    ColdOutreach,
    Other,
}

#[spacetimedb::table(name = contacts, public)]
pub struct Contact {
    #[primary_key]
    pub id: String, // UUID
    pub first_name: String,
    pub last_name: String,
    #[unique]
    pub email: String,
    pub phone: Option<String>,
    pub title: Option<String>,
    #[index(btree)]
    pub lifecycle_stage: ContactLifecycleStage,
    pub source: Option<LeadSource>,
    #[index(btree)]
    pub owner_id: Option<String>, // UUID — FK → users.id (set null)
    pub avatar_url: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
