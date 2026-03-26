// vendor_addresses: Physical addresses associated with vendor operations.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum VendorAddressType {
    Business,
    Warehouse,
    Return,
}

#[spacetimedb::table(name = vendor_addresses, public)]
pub struct VendorAddress {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub vendor_id: String, // UUID, FK -> vendors.id (cascade delete)

    pub address_type: VendorAddressType,
    pub label: Option<String>,
    pub address_line1: String,
    pub address_line2: Option<String>,
    pub city: String,
    pub region: Option<String>,
    pub postal_code: Option<String>,
    pub country: String,
    pub phone: Option<String>,
    pub is_default: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
