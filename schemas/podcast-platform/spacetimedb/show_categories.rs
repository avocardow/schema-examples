// show_categories: Many-to-many relationship between shows and categories.
// See README.md for full design rationale.

#[spacetimedb::table(name = show_categories, public)]
pub struct ShowCategory {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub show_id: String, // UUID — FK → shows.id (cascade delete)
    #[index(btree)]
    pub category_id: String, // UUID — FK → categories.id (cascade delete)
    pub is_primary: bool,
}
// Composite unique: (show_id, category_id) — enforce in reducer logic
