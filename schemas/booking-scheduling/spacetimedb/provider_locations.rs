// provider_locations: Junction table linking providers to their available locations.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = provider_locations, public)]
pub struct ProviderLocation {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub provider_id: String, // UUID — FK → providers.id (cascade delete)
    #[index(btree)]
    pub location_id: String, // UUID — FK → locations.id (cascade delete)
    pub is_primary: bool,
    pub created_at: Timestamp,
    // Composite unique: (provider_id, location_id)
}
