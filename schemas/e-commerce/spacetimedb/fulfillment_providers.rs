// fulfillment_providers: Shipping and fulfillment provider configurations with type-based routing.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum FulfillmentProviderType {
    Manual, // type: String
    FlatRate,
    CarrierCalculated,
    ThirdParty,
}

#[spacetimedb::table(name = fulfillment_providers, public)]
pub struct FulfillmentProvider {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    pub name: String, // not null

    #[unique]
    pub code: String, // not null

    #[index(btree)]
    pub r#type: FulfillmentProviderType, // not null

    pub config: Option<String>, // JSON

    #[index(btree)]
    pub is_active: bool, // default: true

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
