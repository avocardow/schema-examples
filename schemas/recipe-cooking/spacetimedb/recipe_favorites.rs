// recipe_favorites: Tracks which users have favorited which recipes.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique(recipe_id, user_id) — enforce in reducer logic

#[spacetimedb::table(name = recipe_favorites, public)]
pub struct RecipeFavorite {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub recipe_id: String, // FK → recipes.id (cascade delete)

    #[index(btree)]
    pub user_id: String, // FK → users.id (cascade delete)

    pub created_at: Timestamp,
}
