// ticket_categories: Hierarchical classification for tickets.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = ticket_categories, public)]
pub struct TicketCategory {
    #[primary_key]
    pub id: String, // UUID
    pub name: String,
    #[unique]
    pub slug: String,
    pub description: Option<String>,
    #[index(btree)]
    pub parent_id: Option<String>, // UUID — FK → ticket_categories.id (set null)
    pub sort_order: i32,
    // Composite index: (parent_id, sort_order) — not supported inline, enforce in application
    pub is_active: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
