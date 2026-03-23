// authors: Author profiles linked to user accounts.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = authors, public)]
pub struct Author {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub user_id: String, // FK -> users.id (cascade delete)
    pub display_name: String,
    pub slug: String, // Unique
    pub bio: Option<String>,
    pub avatar_url: Option<String>,
    pub website_url: Option<String>,
    pub social_links: Option<String>, // JSON
    pub is_active: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
