// post_authors: Many-to-many mapping between posts and authors with roles.
// See README.md for full design rationale.

#[derive(SpacetimeType, Clone)]
pub enum PostAuthorRole {
    Author,      // type: String
    Contributor,
    Editor,
    Guest,
}

#[spacetimedb::table(name = post_authors, public)]
pub struct PostAuthor {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub post_id: String, // FK -> posts.id (cascade delete)
    #[index(btree)]
    pub author_id: String, // FK -> authors.id (cascade delete)
    pub sort_order: i32,
    pub role: PostAuthorRole,
    // Composite unique: (post_id, author_id)
}
