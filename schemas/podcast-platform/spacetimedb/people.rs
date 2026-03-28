// people: Individuals who contribute to shows and episodes as hosts, guests, or crew.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = people, public)]
pub struct Person {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub name: String,
    #[unique]
    pub slug: String,
    pub bio: Option<String>,
    pub url: Option<String>,
    pub image_file_id: Option<String>, // UUID — FK → files.id (set null on delete)
    pub podcast_index_id: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
