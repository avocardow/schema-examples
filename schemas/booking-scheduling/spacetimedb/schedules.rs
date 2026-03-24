// schedules: Named availability schedules assigned to providers.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = schedules, public)]
pub struct Schedule {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub provider_id: String, // UUID — FK → providers.id (cascade delete)
    pub name: String,
    pub timezone: String,
    pub is_default: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (provider_id, is_default)
}
