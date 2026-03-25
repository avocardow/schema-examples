// invoice_items: Individual line items on an invoice.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = invoice_items, public)]
pub struct InvoiceItem {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub invoice_id: String, // UUID — FK → invoices.id (cascade delete)
    pub plan_price_id: Option<String>, // UUID — FK → plan_prices.id (set null)
    pub description: String,
    pub amount: i32,
    pub currency: String,
    pub quantity: i32,
    pub is_proration: bool,
    pub period_start: Option<Timestamp>,
    pub period_end: Option<Timestamp>,
    pub provider_type: Option<String>,
    pub provider_id: Option<String>,
    pub created_at: Timestamp,
}
