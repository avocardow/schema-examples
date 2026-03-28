// show_tags: Freeform tags applied to shows for discovery and search.
// See README.md for full design rationale.

#[spacetimedb::table(name = show_tags, public)]
pub struct ShowTag {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub show_id: String, // UUID — FK → shows.id (cascade delete)
    #[index(btree)]
    pub tag: String,
}
// Composite unique: (show_id, tag) — enforce in reducer logic
