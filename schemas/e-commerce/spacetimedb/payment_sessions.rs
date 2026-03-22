// payment_sessions: Tracks payment attempts and provider state for each cart checkout.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum PaymentSessionStatus {
    Pending, // type: String
    Authorized,
    RequiresAction,
    Completed,
    Canceled,
    Error,
}

// Composite index: (provider, provider_id) — enforce in reducer logic or query layer

#[spacetimedb::table(name = payment_sessions, public)]
pub struct PaymentSession {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub cart_id: String, // FK → carts.id (cascade delete)

    pub provider: String,    // not null
    pub provider_id: Option<String>,

    #[index(btree)]
    pub status: PaymentSessionStatus, // default: Pending

    pub amount: i32,      // not null
    pub currency: String, // not null

    pub data: Option<String>, // JSON

    pub is_selected: bool, // default: false

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
