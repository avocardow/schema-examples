// services: Bookable services with duration, pricing, and scheduling constraints.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = services, public)]
pub struct Service {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub category_id: Option<String>, // UUID — FK → service_categories.id (set null)
    pub name: String,
    #[unique]
    pub slug: String,
    pub description: Option<String>,
    pub duration: i32,
    pub buffer_before: i32,
    pub buffer_after: i32,
    pub price: Option<String>, // Decimal
    pub currency: Option<String>,
    pub max_attendees: i32,
    pub min_attendees: i32,
    pub min_notice: i32,
    pub max_advance: i32,
    pub slot_interval: Option<i32>,
    #[index(btree)]
    pub is_active: bool,
    pub is_private: bool,
    pub color: Option<String>,
    #[index(btree)]
    pub created_by: String, // UUID — FK → users.id (restrict delete)
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (is_active, is_private)
}
