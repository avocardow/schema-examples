// notification_categories: Classification of notification types for user preferences and feed routing.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = notification_categories, public)]
pub struct NotificationCategory {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,

    #[unique]
    pub slug: String,

    pub description: Option<String>,
    pub color: Option<String>,       // Hex color for UI display (e.g., "#3B82F6").
    pub icon: Option<String>,        // Icon identifier or URL for UI display.

    // Critical/required notifications bypass user preferences entirely.
    // Users cannot opt out of required categories.
    #[index(btree)]
    pub is_required: bool,

    pub default_feed_id: Option<String>, // UUID — FK → notification_feeds.id (set null on delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
