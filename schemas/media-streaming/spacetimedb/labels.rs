// labels: Record labels that publish and distribute music albums.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = labels, public)]
pub struct Label {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub name: String,
    #[unique]
    pub slug: String,
    pub website: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
