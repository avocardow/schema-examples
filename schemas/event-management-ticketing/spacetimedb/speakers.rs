// speakers: Individuals who present or participate in event sessions.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = speakers, public)]
pub struct Speaker {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub user_id: Option<String>, // UUID — FK → users.id (set null)

    pub name: String,
    pub email: Option<String>,
    pub bio: Option<String>,
    pub title: Option<String>,
    pub company: Option<String>,
    pub avatar_url: Option<String>,
    pub website_url: Option<String>,
    pub twitter_handle: Option<String>,
    pub linkedin_url: Option<String>,
    pub is_active: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Index: is_active
}
