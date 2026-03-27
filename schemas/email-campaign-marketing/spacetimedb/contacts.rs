// contacts: Stores contact records with email, name, status, and metadata.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum ContactStatus {
    // type: String
    Active,
    Unsubscribed,
    Bounced,
    Complained,
}

#[spacetimedb::table(name = contacts, public)]
pub struct Contact {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub email: String,

    pub first_name: Option<String>,
    pub last_name: Option<String>,

    #[index(btree)]
    pub status: String, // ContactStatus enum

    pub metadata: Option<String>, // JSON

    pub created_by: Option<String>, // UUID, FK → users.id (set null)

    #[index(btree)]
    pub created_at: Timestamp,

    pub updated_at: Timestamp,
}
