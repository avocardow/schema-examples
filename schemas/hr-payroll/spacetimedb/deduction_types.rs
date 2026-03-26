// deduction_types: Catalog of payroll deduction types with pre-tax classification and category grouping.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum DeductionCategory {
    Tax,
    Retirement,
    Insurance,
    Garnishment,
    Other,
}

#[spacetimedb::table(name = deduction_types, public)]
pub struct DeductionType {
    #[primary_key]
    pub id: String, // UUID auto-generated

    pub name: String,

    #[unique]
    pub code: String,

    #[index(btree)]
    pub category: DeductionCategory,

    pub is_pretax: bool,  // default false

    #[index(btree)]
    pub is_active: bool,  // default true

    pub description: Option<String>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
