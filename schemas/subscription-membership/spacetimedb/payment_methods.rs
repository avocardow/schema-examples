// payment_methods: Stored payment instruments for customers.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum PaymentMethodType {
    Card,         // type: String
    BankAccount,
    Paypal,
    SepaDebit,
    Ideal,
    Other,
}

#[spacetimedb::table(name = payment_methods, public)]
pub struct PaymentMethod {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub customer_id: String, // UUID — FK → customers.id (cascade delete)
    pub payment_method_type: PaymentMethodType,
    pub card_brand: Option<String>,
    pub card_last4: Option<String>,
    pub card_exp_month: Option<i32>,
    pub card_exp_year: Option<i32>,
    pub is_default: bool,
    pub provider_type: Option<String>,
    pub provider_id: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
