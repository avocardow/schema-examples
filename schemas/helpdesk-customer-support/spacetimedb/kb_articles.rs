// kb_articles: Self-service knowledge base articles for customers and agents.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum KbArticleStatus {
    Draft, // type: String
    Published,
    Archived,
}

#[spacetimedb::table(name = kb_articles, public)]
pub struct KbArticle {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub category_id: Option<String>, // UUID — FK → kb_categories.id (set null)
    pub title: String,
    #[unique]
    pub slug: String,
    pub body: String,
    #[index(btree)]
    pub status: KbArticleStatus,
    #[index(btree)]
    pub author_id: String, // UUID — FK → users.id (restrict)
    pub view_count: i32,
    pub helpful_count: i32,
    pub not_helpful_count: i32,
    pub published_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
