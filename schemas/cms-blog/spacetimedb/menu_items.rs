// menu_items: Individual navigation links within a menu hierarchy.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum MenuLinkType {
    Post,     // type: String
    Category,
    Custom,
}

#[spacetimedb::table(name = menu_items, public)]
pub struct MenuItem {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub menu_id: String, // FK -> menus.id (cascade delete)
    pub parent_id: Option<String>, // FK -> menu_items.id (cascade delete)
    pub label: String,
    pub link_type: MenuLinkType,
    #[index(btree)]
    pub link_post_id: Option<String>, // FK -> posts.id (cascade delete)
    #[index(btree)]
    pub link_category_id: Option<String>, // FK -> categories.id (cascade delete)
    pub link_url: Option<String>,
    pub open_in_new_tab: bool,
    pub sort_order: i32, // Composite index: (menu_id, parent_id, sort_order)
    pub is_active: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
