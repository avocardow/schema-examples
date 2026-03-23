// posts: Core content entries supporting posts and pages with versioned slugs.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum PostType {
    Post,  // type: String
    Page,
}

#[derive(SpacetimeType, Clone)]
pub enum PostStatus {
    Draft,  // type: String
    Scheduled,
    Published,
    Archived,
}

#[derive(SpacetimeType, Clone)]
pub enum PostVisibility {
    Public,  // type: String
    Private,
    PasswordProtected,
}

#[spacetimedb::table(name = posts, public)]
pub struct Post {
    #[primary_key]
    pub id: String, // UUID
    pub r#type: PostType,
    pub title: String,
    pub slug: String, // Unique
    pub excerpt: Option<String>,
    pub content: Option<String>,
    pub featured_image_url: Option<String>,
    pub status: PostStatus, // Composite index: (status, published_at), (type, status)
    pub visibility: PostVisibility,
    pub password: Option<String>,
    #[index(btree)]
    pub is_featured: bool,
    pub allow_comments: bool,
    pub meta_title: Option<String>,
    pub meta_description: Option<String>,
    pub og_image_url: Option<String>,
    pub published_at: Option<Timestamp>,
    #[index(btree)]
    pub created_by: String, // FK → users.id (restrict delete)
    pub updated_by: Option<String>, // FK → users.id (set null on delete)
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
