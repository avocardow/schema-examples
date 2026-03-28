// artist_genres: Many-to-many association between artists and genres.
// See README.md for full design rationale.

#[spacetimedb::table(name = artist_genres, public)]
pub struct ArtistGenre {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub artist_id: String, // UUID — FK → artists.id (cascade delete)
    #[index(btree)]
    pub genre_id: String, // UUID — FK → genres.id (cascade delete)
}
// Composite unique: (artist_id, genre_id) — enforce in reducer logic
