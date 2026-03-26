// venues: Physical, virtual, or hybrid locations where events take place.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum VenueType {
    Physical, // type: String
    Virtual,
    Hybrid,
}

#[spacetimedb::table(name = venues, public)]
pub struct Venue {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,

    #[unique]
    pub slug: String,

    pub description: Option<String>,

    #[index(btree)]
    pub venue_type: VenueType,

    pub address_line1: Option<String>,
    pub address_line2: Option<String>,
    pub city: Option<String>,
    pub state: Option<String>,
    pub postal_code: Option<String>,
    pub country: Option<String>,
    pub latitude: Option<f64>,
    pub longitude: Option<f64>,
    pub virtual_url: Option<String>,
    pub virtual_platform: Option<String>,
    pub capacity: Option<i32>,
    pub timezone: String,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub website_url: Option<String>,
    pub is_active: bool,

    #[index(btree)]
    pub created_by: String, // UUID — FK → users.id (restrict delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (city, state)
}
