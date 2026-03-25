// plans: Product plans available for subscription.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = plans, public)]
pub struct Plan {
    #[primary_key]
    pub id: String, // UUID
    pub name: String,
    pub description: Option<String>,
    #[index(btree)]
    pub is_active: bool,
    pub sort_order: i32,
    pub metadata: Option<String>, // JSON
    pub provider_type: Option<String>,
    pub provider_id: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
