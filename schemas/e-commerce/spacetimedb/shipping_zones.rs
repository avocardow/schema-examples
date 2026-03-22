// shipping_zones: Geographic shipping zones grouping countries for rate calculation.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = shipping_zones, public)]
pub struct ShippingZone {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    pub name: String,
    pub description: Option<String>,
    pub countries: Vec<String>, // text[]

    #[index(btree)]
    pub is_active: bool, // default: true

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
