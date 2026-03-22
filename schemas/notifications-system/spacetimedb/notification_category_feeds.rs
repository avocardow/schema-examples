// notification_category_feeds: Many-to-many junction between categories and feeds.
// Determines which notification types appear in which UI surfaces.
// See README.md for full design rationale.

#[spacetimedb::table(name = notification_category_feeds, public)]
pub struct NotificationCategoryFeed {
    // SpacetimeDB does not support composite PKs natively.
    // Surrogate key; composite uniqueness on (category_id, feed_id) enforced at the application layer.
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub category_id: String, // FK → notification_categories.id (cascade delete)

    #[index(btree)]
    pub feed_id: String, // FK → notification_feeds.id (cascade delete). Index for reverse lookup: "Which categories appear in this feed?"
}

// Unique constraint on (category_id, feed_id) enforced at the application layer.
// SpacetimeDB supports unique on single columns; composite uniqueness requires app-level enforcement.
