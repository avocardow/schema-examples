// invoices: Billing documents generated for customers per billing cycle.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum InvoiceStatus {
    Draft,          // type: String
    Open,
    Paid,
    Void,
    Uncollectible,
}

#[spacetimedb::table(name = invoices, public)]
pub struct Invoice {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub customer_id: String, // UUID — FK → customers.id (cascade delete)
    pub subscription_id: Option<String>, // UUID — FK → subscriptions.id (set null)
    #[index(btree)]
    pub status: InvoiceStatus,
    pub currency: String,
    pub subtotal: i32,
    pub tax: i32,
    pub total: i32,
    pub amount_paid: i32,
    pub amount_due: i32,
    pub period_start: Option<Timestamp>,
    pub period_end: Option<Timestamp>,
    pub due_date: Option<Timestamp>,
    pub paid_at: Option<Timestamp>,
    pub hosted_invoice_url: Option<String>,
    pub invoice_pdf_url: Option<String>,
    pub metadata: Option<String>, // JSON
    pub provider_type: Option<String>,
    pub provider_id: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
