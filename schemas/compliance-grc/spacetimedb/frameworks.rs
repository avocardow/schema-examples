// frameworks: Compliance frameworks (e.g., SOC 2, ISO 27001) adopted by organizations.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = frameworks, public)]
pub struct Framework {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub organization_id: Option<String>, // UUID — FK → organizations.id (cascade delete)

    pub name: String,

    pub version: Option<String>,

    pub authority: Option<String>,

    pub description: Option<String>,

    pub website_url: Option<String>,

    #[index(btree)]
    pub is_active: bool, // Defaults to true.

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
