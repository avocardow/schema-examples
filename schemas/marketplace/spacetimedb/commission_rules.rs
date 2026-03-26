// commission_rules: Configurable commission rates applied to vendor sales.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum CommissionScope {
    Global,
    Vendor,
    Category,
}

#[derive(SpacetimeType, Clone)]
pub enum CommissionRateType {
    Percentage,
    Flat,
    Hybrid,
}

// Composite index: (scope, is_active)

#[spacetimedb::table(name = commission_rules, public)]
pub struct CommissionRule {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,
    pub scope: CommissionScope,

    #[index(btree)]
    pub vendor_id: Option<String>, // UUID, FK -> vendors.id (cascade delete)

    #[index(btree)]
    pub category_id: Option<String>, // UUID, FK -> categories.id (cascade delete)

    pub rate_type: CommissionRateType,
    pub percentage_rate: Option<f64>,
    pub flat_rate: Option<i32>,
    pub currency: Option<String>,
    pub min_commission: Option<i32>,
    pub max_commission: Option<i32>,
    pub is_active: bool,
    pub priority: i32,
    pub effective_from: Option<Timestamp>,
    pub effective_to: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
