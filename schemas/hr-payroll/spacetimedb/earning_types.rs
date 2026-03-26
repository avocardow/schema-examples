// earning_types: Catalog of earning categories (regular, overtime, bonus, etc.) used to classify payroll line items.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

// type: String
#[derive(SpacetimeType, Clone)]
pub enum EarningCategory {
    Regular,
    Overtime,
    Bonus,
    Commission,
    Reimbursement,
    Other,
}

#[spacetimedb::table(name = earning_types, public)]
pub struct EarningType {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,

    #[unique]
    pub code: String,

    #[index(btree)]
    pub category: EarningCategory,

    pub is_taxable: bool,   // default: true

    #[index(btree)]
    pub is_active: bool,    // default: true

    pub description: Option<String>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
