// order_items: Individual line items within an order, capturing product snapshot and pricing at time of purchase.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = order_items, public)]
pub struct OrderItem {
    #[primary_key]
    pub id: String, // UUID auto-generated

    #[index(btree)]
    pub order_id: String, // FK → orders.id (cascade delete)

    #[index(btree)]
    pub variant_id: Option<String>, // FK → product_variants.id (set null on delete)

    pub product_name: String,
    pub variant_title: String,
    pub sku: Option<String>,
    pub image_url: Option<String>,

    pub unit_price: i64,
    pub quantity: i32,
    pub subtotal: i64,
    pub discount_total: i64, // default 0
    pub tax_total: i64,      // default 0
    pub total: i64,
    pub fulfilled_quantity: i32, // default 0

    pub created_at: Timestamp,
}
