// locations: Physical or virtual venues where services are offered.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum LocationType {
    Physical, // type: String
    Virtual,
}

#[spacetimedb::table(name = locations, public)]
pub struct Location {
    #[primary_key]
    pub id: String, // UUID
    pub name: String,
    #[unique]
    pub slug: String,
    #[index(btree)]
    pub location_type: LocationType,
    pub description: Option<String>,
    pub address_line1: Option<String>,
    pub address_line2: Option<String>,
    pub city: Option<String>,
    pub state: Option<String>,
    pub postal_code: Option<String>,
    pub country: Option<String>,
    pub virtual_url: Option<String>,
    pub timezone: String,
    pub phone: Option<String>,
    pub email: Option<String>,
    #[index(btree)]
    pub is_active: bool,
    pub position: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (is_active, position)
}
