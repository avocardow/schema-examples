// orders: Customer orders with status tracking, payment state, and shipping/billing details.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum OrderStatus {
    Pending, // type: String
    Confirmed,
    Processing,
    Shipped,
    Delivered,
    Canceled,
    Refunded,
}

#[derive(SpacetimeType, Clone)]
pub enum OrderPaymentStatus {
    Unpaid, // type: String
    PartiallyPaid,
    Paid,
    PartiallyRefunded,
    Refunded,
}

#[derive(SpacetimeType, Clone)]
pub enum OrderFulfillmentStatus {
    Unfulfilled, // type: String
    PartiallyFulfilled,
    Fulfilled,
}

#[spacetimedb::table(name = orders, public)]
pub struct Order {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[unique]
    pub order_number: String, // not null

    #[index(btree)]
    pub user_id: Option<String>, // FK → users.id (set null on delete)

    pub email: String, // not null

    #[index(btree)]
    pub status: OrderStatus, // not null, default: Pending

    pub currency: String, // not null
    pub subtotal: i32,    // not null
    pub discount_total: i32, // not null, default: 0
    pub tax_total: i32,      // not null, default: 0
    pub shipping_total: i32, // not null, default: 0
    pub grand_total: i32,    // not null

    #[index(btree)]
    pub payment_status: OrderPaymentStatus, // not null, default: Unpaid

    #[index(btree)]
    pub fulfillment_status: OrderFulfillmentStatus, // not null, default: Unfulfilled

    pub shipping_name: Option<String>,
    pub shipping_address_line1: Option<String>,
    pub shipping_address_line2: Option<String>,
    pub shipping_city: Option<String>,
    pub shipping_region: Option<String>,
    pub shipping_postal_code: Option<String>,
    pub shipping_country: Option<String>,
    pub shipping_phone: Option<String>,

    pub billing_name: Option<String>,
    pub billing_address_line1: Option<String>,
    pub billing_address_line2: Option<String>,
    pub billing_city: Option<String>,
    pub billing_region: Option<String>,
    pub billing_postal_code: Option<String>,
    pub billing_country: Option<String>,

    pub discount_code: Option<String>,
    pub note: Option<String>,
    pub canceled_at: Option<Timestamp>,

    #[index(btree)]
    pub created_at: Timestamp,

    pub updated_at: Timestamp,
}
