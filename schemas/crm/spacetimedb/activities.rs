// activities: Logged interactions such as calls, emails, meetings, and leads.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum ActivityType {
    Call, // type: String
    Email,
    Meeting,
}

#[spacetimedb::table(name = activities, public)]
pub struct Activity {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub activity_type: ActivityType,
    pub subject: String,
    pub description: Option<String>,
    pub occurred_at: Timestamp,
    pub duration: Option<i32>,
    #[index(btree)]
    pub contact_id: Option<String>, // UUID — FK → contacts.id (set null)
    #[index(btree)]
    pub company_id: Option<String>, // UUID — FK → companies.id (set null)
    #[index(btree)]
    pub deal_id: Option<String>, // UUID — FK → deals.id (set null)
    #[index(btree)]
    pub lead_id: Option<String>, // UUID — FK → leads.id (set null)
    #[index(btree)]
    pub owner_id: String, // UUID — FK → users.id (cascade delete)
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
