// subscriptions: User subscription preferences for individual shows.
// See README.md for full design rationale.

use spacetimedb::SpacetimeType;
use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum NewEpisodeSort {
    NewestFirst, // type: String
    OldestFirst,
}

#[spacetimedb::table(name = subscriptions, public)]
pub struct Subscription {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    #[index(btree)]
    pub show_id: String, // UUID — FK → shows.id (cascade delete)
    pub auto_download: bool,
    pub download_wifi_only: bool,
    pub notifications_enabled: bool,
    pub custom_playback_speed: Option<f64>,
    pub new_episode_sort: NewEpisodeSort,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
// Composite unique: (user_id, show_id) — enforce in reducer logic
