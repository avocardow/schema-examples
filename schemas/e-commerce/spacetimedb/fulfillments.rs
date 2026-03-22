// fulfillments: Tracks shipment lifecycle from dispatch through delivery for each order.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum FulfillmentShipmentStatus {
    Pending, // type: String
    Shipped,
    InTransit,
    Delivered,
    Failed,
    Returned,
}

#[spacetimedb::table(name = fulfillments, public)]
pub struct Fulfillment {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub order_id: String, // FK → orders.id (restrict delete)

    #[index(btree)]
    pub provider_id: Option<String>, // FK → fulfillment_providers.id (set null on delete)

    pub shipping_method_id: Option<String>, // FK → shipping_methods.id (set null on delete)

    #[index(btree)]
    pub status: FulfillmentShipmentStatus, // not null, default: Pending

    #[index(btree)]
    pub tracking_number: Option<String>,

    pub tracking_url: Option<String>,
    pub carrier: Option<String>,

    pub shipped_at: Option<Timestamp>,
    pub delivered_at: Option<Timestamp>,

    pub note: Option<String>,

    pub created_by: Option<String>, // FK → users.id (set null on delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
