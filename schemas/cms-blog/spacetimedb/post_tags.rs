// post_tags: Many-to-many mapping between posts and tags with ordering.
// See README.md for full design rationale.

#[spacetimedb::table(name = post_tags, public)]
pub struct PostTag {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub post_id: String, // FK -> posts.id (cascade delete)
    #[index(btree)]
    pub tag_id: String, // FK -> tags.id (cascade delete)
    pub sort_order: i32,
    // Composite unique: (post_id, tag_id)
}
