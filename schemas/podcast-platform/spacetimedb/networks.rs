// networks: Groups of shows under a shared brand or publisher.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = networks, public)]
pub struct Network {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub name: String,
    #[unique]
    pub slug: String,
    pub description: Option<String>,
    pub website: Option<String>,
    pub logo_file_id: Option<String>, // UUID — FK → files.id (set null on delete)
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
