// show_credits: Links people to shows with specific roles and credit groups.
// See README.md for full design rationale.
// Uses CreditRole and CreditGroup enums from episode_credits.rs

#[spacetimedb::table(name = show_credits, public)]
pub struct ShowCredit {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub show_id: String, // UUID — FK → shows.id (cascade delete)
    #[index(btree)]
    pub person_id: String, // UUID — FK → people.id (cascade delete)
    pub role: CreditRole,
    pub group: CreditGroup,
    pub position: i32,
}
// Composite unique: (show_id, person_id, role) — enforce in reducer logic
