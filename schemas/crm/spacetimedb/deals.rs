// deals: Sales opportunities tracked through pipeline stages.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum DealPriority {
    Low, // type: String
    Medium,
    High,
}

#[spacetimedb::table(name = deals, public)]
pub struct Deal {
    #[primary_key]
    pub id: String, // UUID
    pub name: String,
    #[index(btree)]
    pub pipeline_id: String, // UUID — FK → pipelines.id (restrict delete)
    #[index(btree)]
    pub stage_id: Option<String>, // UUID — FK → pipeline_stages.id
    pub value: Option<f64>,
    pub currency: String,
    #[index(btree)]
    pub expected_close_date: Option<String>, // YYYY-MM-DD
    #[index(btree)]
    pub closed_at: Option<Timestamp>,
    pub lost_reason: Option<String>,
    pub priority: DealPriority,
    #[index(btree)]
    pub owner_id: Option<String>, // UUID — FK → users.id (set null)
    #[index(btree)]
    pub company_id: Option<String>, // UUID — FK → companies.id (set null)
    #[index(btree)]
    pub contact_id: Option<String>, // UUID — FK → contacts.id (set null)
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
