// payment_methods: Stored payment instruments linked to a user for checkout and reuse.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum PaymentMethodType {
    Card, // type: String
    BankAccount,
    Paypal,
    ApplePay,
    GooglePay,
}

// Composite unique: (provider, provider_id) — enforce in reducer logic or query layer

#[spacetimedb::table(name = payment_methods, public)]
pub struct PaymentMethod {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub user_id: String, // FK → users.id (cascade delete)

    pub r#type: PaymentMethodType, // not null
    pub provider: String,          // not null
    pub provider_id: String,       // not null

    pub label: Option<String>,
    pub last_four: Option<String>,
    pub brand: Option<String>,
    pub exp_month: Option<i32>,
    pub exp_year: Option<i32>,

    pub is_default: bool, // default: false

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
