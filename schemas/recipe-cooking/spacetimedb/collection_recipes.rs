// collection_recipes: Links recipes into collections with ordering.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique(collection_id, recipe_id) — enforce in reducer logic

#[spacetimedb::table(name = collection_recipes, public)]
pub struct CollectionRecipe {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub collection_id: String, // FK → collections.id (cascade delete)

    #[index(btree)]
    pub recipe_id: String, // FK → recipes.id (cascade delete)

    pub position: i32, // default 0
    pub added_at: Timestamp,
}
