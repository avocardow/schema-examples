// seasons: Grouping of episodes into numbered seasons within a show.
// See README.md for full design rationale.

#[spacetimedb::table(name = seasons, public)]
pub struct Season {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub show_id: String, // UUID — FK → shows.id (cascade delete)
    pub season_number: i32,
    pub name: Option<String>,
    pub description: Option<String>,
    pub artwork_file_id: Option<String>, // UUID — FK → files.id (set null on delete)
}
// Composite unique: (show_id, season_number) — enforce in reducer logic
