// service_addons: Optional add-on items that extend a service with extra duration and cost.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = service_addons, public)]
pub struct ServiceAddon {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub service_id: String, // UUID — FK → services.id (cascade delete)
    pub name: String,
    pub description: Option<String>,
    pub duration: i32,
    pub price: String, // Decimal
    pub currency: Option<String>,
    pub position: i32,
    #[index(btree)]
    pub is_active: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (service_id, position)
}
