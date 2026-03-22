// addresses: User shipping and billing addresses with default flags.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = addresses, public)]
pub struct Address {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub user_id: String, // FK → users.id (cascade on delete)

    pub label: Option<String>,
    pub first_name: String,
    pub last_name: String,
    pub company: Option<String>,
    pub address_line1: String,
    pub address_line2: Option<String>,
    pub city: String,
    pub region: Option<String>,
    pub postal_code: Option<String>,
    pub country: String,
    pub phone: Option<String>,
    pub is_default_shipping: bool, // default: false
    pub is_default_billing: bool,  // default: false
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
