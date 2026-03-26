// vendor_orders: Sub-orders split by vendor from a parent marketplace order.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum VendorOrderStatus {
    Pending,
    Confirmed,
    Processing,
    Shipped,
    Delivered,
    Canceled,
    Refunded,
}

// Composite index: (vendor_id, status)

#[spacetimedb::table(name = vendor_orders, public)]
pub struct VendorOrder {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub order_id: String, // UUID, FK -> orders.id (restrict delete)

    #[index(btree)]
    pub vendor_id: String, // UUID, FK -> vendors.id (restrict delete)

    #[unique]
    pub vendor_order_number: String,

    #[index(btree)]
    pub status: VendorOrderStatus,
    pub currency: String,
    pub subtotal: i32,
    pub shipping_total: i32,
    pub tax_total: i32,
    pub discount_total: i32,
    pub total: i32,
    pub commission_amount: i32,
    pub vendor_earning: i32,
    pub note: Option<String>,
    pub shipped_at: Option<Timestamp>,
    pub delivered_at: Option<Timestamp>,
    #[index(btree)]
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
