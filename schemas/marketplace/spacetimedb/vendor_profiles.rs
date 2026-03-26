// vendor_profiles: Extended profile information for vendor storefronts.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = vendor_profiles, public)]
pub struct VendorProfile {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub vendor_id: String, // UUID, FK -> vendors.id (cascade delete)

    pub display_name: String,
    pub tagline: Option<String>,
    pub description: Option<String>,
    pub logo_url: Option<String>,
    pub banner_url: Option<String>,
    pub website_url: Option<String>,
    pub social_links: Option<String>, // JSON
    pub return_policy: Option<String>,
    pub shipping_policy: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
