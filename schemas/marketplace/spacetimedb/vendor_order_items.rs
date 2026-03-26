// vendor_order_items: Individual line items within a vendor sub-order.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = vendor_order_items, public)]
pub struct VendorOrderItem {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub vendor_order_id: String, // UUID, FK -> vendor_orders.id (cascade delete)

    #[index(btree)]
    pub order_item_id: String, // UUID, FK -> order_items.id (cascade delete)

    pub listing_variant_id: Option<String>, // UUID, FK -> listing_variants.id (set null)
    pub product_name: String,
    pub variant_title: String,
    pub sku: Option<String>,
    pub unit_price: i32,
    pub quantity: i32,
    pub subtotal: i32,
    pub commission_amount: i32,
    pub vendor_earning: i32,
    pub created_at: Timestamp,
}
