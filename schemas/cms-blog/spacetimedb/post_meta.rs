// post_meta: Extensible key-value metadata for posts.
// See README.md for full design rationale.

#[spacetimedb::table(name = post_meta, public)]
pub struct PostMeta {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub post_id: String, // FK -> posts.id (cascade delete)
    #[index(btree)]
    pub meta_key: String, // Composite unique: (post_id, meta_key)
    pub meta_value: Option<String>,
}
