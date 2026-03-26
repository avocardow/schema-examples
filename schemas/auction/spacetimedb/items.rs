// items: Auction items listed by sellers with condition and category classification.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum ItemCondition {
    New,           // type: String
    LikeNew,
    Excellent,
    Good,
    Fair,
    Poor,
}

#[spacetimedb::table(name = items, public)]
pub struct Item {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub seller_id: String, // UUID, FK -> users.id (on_delete: restrict)
    #[index(btree)]
    pub category_id: Option<String>, // UUID, FK -> categories.id (on_delete: set_null)
    pub title: String,
    pub description: Option<String>,
    #[index(btree)]
    pub condition: ItemCondition,
    pub condition_notes: Option<String>,
    pub metadata: Option<String>, // JSON
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
