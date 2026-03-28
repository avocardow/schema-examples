// reviews: User ratings and written reviews for shows.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = reviews, public)]
pub struct Review {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    #[index(btree)]
    pub show_id: String, // UUID — FK → shows.id (cascade delete)
    pub rating: i32,
    pub title: Option<String>,
    pub body: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
// Composite unique: (user_id, show_id) — enforce in reducer logic
// Composite index: (show_id, created_at) — not supported, enforce in reducer logic
// Composite index: (show_id, rating) — not supported, enforce in reducer logic
