// notification_feeds: Named UI surfaces where notifications can appear (e.g., bell icon, activity tab, announcements banner).
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = notification_feeds, public)]
pub struct NotificationFeed {
    #[primary_key]
    pub id: String, // UUID

    pub name: String, // Display name (e.g., "General", "Activity", "Announcements").

    #[unique]
    pub slug: String, // URL-safe identifier (e.g., "general", "activity"). Used in API calls: GET /feeds/general.

    pub description: Option<String>, // Explain what this feed is for. Shown in admin UI.

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
