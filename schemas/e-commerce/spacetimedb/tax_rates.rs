// tax_rates: Tax rate definitions by country/region with compound and priority support.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite index: (country, region) — enforce in reducer logic or query layer

#[spacetimedb::table(name = tax_rates, public)]
pub struct TaxRate {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    pub name: String,

    pub country: String,

    pub region: Option<String>,
    pub rate: f64,

    #[index(btree)]
    pub category: Option<String>,

    pub is_compound: bool, // default: false

    #[index(btree)]
    pub is_active: bool, // default: true

    pub priority: i32, // default: 0

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
