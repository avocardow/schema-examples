// shipping_methods: Delivery options with pricing and constraints per shipping zone.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = shipping_methods, public)]
pub struct ShippingMethod {
    #[primary_key]
    pub id: String, // UUID auto-generated
    #[index(btree)]
    pub zone_id: String, // FK → shipping_zones.id (cascade delete)
    #[index(btree)]
    pub profile_id: Option<String>, // FK → shipping_profiles.id (set null on delete)
    pub name: String,
    pub description: Option<String>,
    pub price: i32,
    pub currency: String,
    pub min_delivery_days: Option<i32>,
    pub max_delivery_days: Option<i32>,
    pub min_order_amount: Option<i32>,
    pub max_weight_grams: Option<i32>,
    pub is_active: bool,   // default: true
    pub sort_order: i32,   // default: 0
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}

// Composite index: (zone_id, is_active, sort_order)
