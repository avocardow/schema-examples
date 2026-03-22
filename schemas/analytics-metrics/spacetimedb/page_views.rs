// page_views: Individual page view records with viewport, screen, and duration data.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = page_views, public)]
pub struct PageView {
    #[primary_key]
    pub id: String, // UUID

    pub event_id: Option<String>, // UUID, FK → events.id (set null)
    // Composite index: (user_id, timestamp) — enforce in reducer logic
    #[index(btree)]
    pub user_id: Option<String>, // UUID, FK → users.id (set null)

    #[index(btree)]
    pub anonymous_id: Option<String>,

    #[index(btree)]
    pub session_id: Option<String>, // UUID, FK → sessions.id (set null)

    pub url: String,

    #[index(btree)]
    pub path: String,

    pub title: Option<String>,
    pub referrer: Option<String>,
    // Composite index: (hostname, path) — enforce in reducer logic
    pub hostname: String,
    pub viewport_width: Option<i32>,
    pub viewport_height: Option<i32>,
    pub screen_width: Option<i32>,
    pub screen_height: Option<i32>,
    pub duration: Option<i32>,
    #[index(btree)]
    pub timestamp: Timestamp,
    pub created_at: Timestamp,
}
