// ad_markers: Advertisement insertion points within episodes.
// See README.md for full design rationale.

use spacetimedb::SpacetimeType;
use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum MarkerType {
    Preroll, // type: String
    Midroll,
    Postroll,
}

#[spacetimedb::table(name = ad_markers, public)]
pub struct AdMarker {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub episode_id: String, // UUID — FK → episodes.id (cascade delete)
    pub marker_type: MarkerType,
    pub position_ms: Option<i32>,
    pub duration_ms: Option<i32>,
    pub created_at: Timestamp,
}
// Composite index: (episode_id, marker_type) — not supported, enforce in reducer logic
