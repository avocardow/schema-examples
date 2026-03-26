// orders: Ticket purchase transactions for an event.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum OrderStatus {
    Pending, // type: String
    Confirmed,
    Cancelled,
    Refunded,
}

#[derive(SpacetimeType, Clone)]
pub enum OrderPaymentStatus {
    NotRequired, // type: String
    Pending,
    Paid,
    Refunded,
    PartiallyRefunded,
    Failed,
}

#[spacetimedb::table(name = orders, public)]
pub struct Order {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub event_id: String, // UUID — FK → events.id (restrict delete)

    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (restrict delete)

    pub promo_code_id: Option<String>, // UUID — FK → promo_codes.id (set null)

    pub subtotal: i64, // stored in smallest currency unit (e.g. cents)
    pub discount_amount: i64, // stored in smallest currency unit (e.g. cents)
    pub total: i64, // stored in smallest currency unit (e.g. cents)
    pub currency: String,
    pub status: OrderStatus,
    pub payment_status: OrderPaymentStatus,
    pub payment_method: Option<String>,
    pub buyer_name: String,

    #[index(btree)]
    pub buyer_email: String,

    pub cancelled_at: Option<Timestamp>,
    pub refunded_at: Option<Timestamp>,
    pub confirmed_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (event_id, status)
}
