// carts: Shopping carts supporting both authenticated users and anonymous sessions.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = carts, public)]
pub struct Cart {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub user_id: Option<String>, // FK → users.id (set null on delete)

    #[index(btree)]
    pub session_id: Option<String>,

    pub currency: String, // default: 'USD'
    pub shipping_address_id: Option<String>, // FK → addresses.id (set null on delete)
    pub billing_address_id: Option<String>,  // FK → addresses.id (set null on delete)
    pub discount_code: Option<String>,
    pub note: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
