// shipping_profiles: Reusable shipping configuration templates for product fulfillment strategies.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum ShippingProfileType {
    Default, // type: String
    Digital,
    Custom,
}

#[spacetimedb::table(name = shipping_profiles, public)]
pub struct ShippingProfile {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    pub name: String, // not null

    #[index(btree)]
    pub r#type: ShippingProfileType, // not null, default: Default

    pub description: Option<String>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
