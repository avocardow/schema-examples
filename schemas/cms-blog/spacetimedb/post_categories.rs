// post_categories: Many-to-many mapping between posts and categories.
// See README.md for full design rationale.

#[spacetimedb::table(name = post_categories, public)]
pub struct PostCategory {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub post_id: String, // FK -> posts.id (cascade delete)
    #[index(btree)]
    pub category_id: String, // FK -> categories.id (cascade delete)
    // Composite unique: (post_id, category_id)
}
