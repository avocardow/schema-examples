// track_credits: Artist credits and roles for individual tracks.
// See README.md for full design rationale.

use spacetimedb::SpacetimeType;

#[derive(SpacetimeType, Clone)]
pub enum CreditRole {
    PrimaryArtist, // type: String
    FeaturedArtist,
    Writer,
    Producer,
    Composer,
    Mixer,
    Engineer,
}

#[spacetimedb::table(name = track_credits, public)]
pub struct TrackCredit {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub track_id: String, // UUID — FK → tracks.id (cascade delete)
    #[index(btree)]
    pub artist_id: String, // UUID — FK → artists.id (cascade delete)
    pub role: CreditRole,
}
// Composite unique: (track_id, artist_id, role) — enforce in reducer logic
// Composite index: (artist_id, role) — not supported; btree on artist_id covers leading column.
