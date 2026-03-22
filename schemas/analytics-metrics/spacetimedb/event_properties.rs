// event_properties: Key-value property pairs attached to individual events.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique constraint (not expressible inline):
// - unique(event_id, key)

#[spacetimedb::table(name = event_properties, public)]
pub struct EventProperty {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub event_id: String, // UUID, FK → events.id (cascade delete)

    // Composite index: (key, value) — enforce in reducer logic
    pub key: String,
    pub value: String,
    pub created_at: Timestamp,
}
