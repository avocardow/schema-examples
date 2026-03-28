// shows: Podcast or media shows with metadata and feed information.
// See README.md for full design rationale.

use spacetimedb::SpacetimeType;
use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum ShowType {
    Episodic, // type: String
    Serial,
}

#[derive(SpacetimeType, Clone)]
pub enum ShowMedium {
    Podcast, // type: String
    Music,
    Video,
    Audiobook,
    Newsletter,
}

#[spacetimedb::table(name = shows, public)]
pub struct Show {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub owner_id: String, // UUID — FK → users.id (cascade delete)
    #[index(btree)]
    pub network_id: Option<String>, // UUID — FK → networks.id (set null on delete)
    pub title: String,
    #[unique]
    pub slug: String,
    pub description: String,
    pub html_description: Option<String>,
    pub author: String,
    pub language: String,
    pub show_type: ShowType,
    pub explicit: bool,
    pub artwork_file_id: Option<String>, // UUID — FK → files.id (set null on delete)
    pub banner_file_id: Option<String>, // UUID — FK → files.id (set null on delete)
    pub feed_url: Option<String>,
    pub website: Option<String>,
    pub copyright: Option<String>,
    pub owner_name: Option<String>,
    pub owner_email: Option<String>,
    pub podcast_guid: Option<String>,
    pub medium: ShowMedium,
    pub is_complete: bool,
    pub episode_count: i32,
    #[index(btree)]
    pub subscriber_count: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
// Composite index: (language, show_type) — not supported, enforce in reducer logic
