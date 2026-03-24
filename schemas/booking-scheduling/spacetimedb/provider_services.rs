// provider_services: Junction table linking providers to the services they offer.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = provider_services, public)]
pub struct ProviderService {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub provider_id: String, // UUID — FK → providers.id (cascade delete)
    #[index(btree)]
    pub service_id: String, // UUID — FK → services.id (cascade delete)
    pub custom_price: Option<String>, // Decimal
    pub custom_duration: Option<i32>,
    pub is_active: bool,
    pub created_at: Timestamp,
    // Composite unique: (provider_id, service_id)
}
