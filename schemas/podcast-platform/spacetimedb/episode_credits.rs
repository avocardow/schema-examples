// episode_credits: Links people to episodes with specific roles and credit groups.
// See README.md for full design rationale.

use spacetimedb::SpacetimeType;

#[derive(SpacetimeType, Clone)]
pub enum CreditRole {
    Host, // type: String
    CoHost,
    Guest,
    Producer,
    Editor,
    SoundDesigner,
    Composer,
    Narrator,
    Researcher,
    Writer,
}

#[derive(SpacetimeType, Clone)]
pub enum CreditGroup {
    Cast, // type: String
    Crew,
    Writing,
    AudioPostProduction,
    VideoPostProduction,
}

#[spacetimedb::table(name = episode_credits, public)]
pub struct EpisodeCredit {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub episode_id: String, // UUID — FK → episodes.id (cascade delete)
    #[index(btree)]
    pub person_id: String, // UUID — FK → people.id (cascade delete)
    pub role: CreditRole,
    pub group: CreditGroup,
    pub position: i32,
}
// Composite unique: (episode_id, person_id, role) — enforce in reducer logic
