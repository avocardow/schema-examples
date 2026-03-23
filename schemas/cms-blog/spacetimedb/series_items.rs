// series_items: Ordered post assignments within a content series.
// See README.md for full design rationale.

#[spacetimedb::table(name = series_items, public)]
pub struct SeriesItem {
    #[primary_key]
    pub id: String, // UUID
    pub series_id: String, // FK -> series.id (cascade delete)
    #[index(btree)]
    pub post_id: String, // FK -> posts.id (cascade delete)
    pub sort_order: i32, // Composite index: (series_id, sort_order)
    // Composite unique: (series_id, post_id)
}
