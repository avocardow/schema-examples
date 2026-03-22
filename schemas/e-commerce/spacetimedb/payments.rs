// payments: Individual payment transactions recorded against an order.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum PaymentType {
    Authorization, // type: String
    Capture,
    Sale,
}

#[derive(SpacetimeType, Clone)]
pub enum PaymentTransactionStatus {
    Pending, // type: String
    Succeeded,
    Failed,
    Canceled,
}

// Composite index: (provider, provider_id) — enforce in reducer logic or query layer

#[spacetimedb::table(name = payments, public)]
pub struct Payment {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub order_id: String, // FK → orders.id (restrict delete)

    pub payment_method_id: Option<String>, // FK → payment_methods.id (set null on delete)

    pub provider: String,       // not null
    pub provider_id: Option<String>,

    pub r#type: PaymentType,                // not null

    #[index(btree)]
    pub status: PaymentTransactionStatus, // not null, default: Pending

    pub currency: String, // not null
    pub amount: i32,      // not null

    pub provider_fee: Option<i32>,
    pub metadata: Option<String>, // JSON
    pub error_message: Option<String>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
