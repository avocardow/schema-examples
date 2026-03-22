// sessions: User browsing sessions with duration, device, location, and engagement metrics.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = sessions, public)]
pub struct Session {
    #[primary_key]
    pub id: String, // UUID

    // Composite index: (user_id, started_at) — enforce in reducer logic
    #[index(btree)]
    pub user_id: Option<String>, // UUID, FK → users.id (set null)

    #[index(btree)]
    pub anonymous_id: Option<String>,

    #[index(btree)]
    pub started_at: Timestamp,
    pub ended_at: Option<Timestamp>,
    pub duration: Option<i32>,
    pub page_count: i32,
    pub event_count: i32,

    #[index(btree)]
    pub is_bounce: bool,

    pub entry_url: Option<String>,
    pub exit_url: Option<String>,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
    pub device_type: Option<String>,
    pub os: Option<String>,
    pub browser: Option<String>,

    #[index(btree)]
    pub country: Option<String>,

    pub region: Option<String>,
    pub city: Option<String>,
    pub locale: Option<String>,
    pub referrer: Option<String>,

    #[index(btree)]
    pub campaign_id: Option<String>, // UUID, FK → campaigns.id (set null)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
