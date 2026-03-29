// ratings: User scores and optional reviews for recipes.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique(recipe_id, user_id) — enforce in reducer logic

#[spacetimedb::table(name = ratings, public)]
pub struct Rating {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub recipe_id: String, // FK → recipes.id (cascade delete)

    #[index(btree)]
    pub user_id: String, // FK → users.id (cascade delete)

    pub score: i32,
    pub review: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
