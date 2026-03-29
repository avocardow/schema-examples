// recipe_activities: Audit log of actions performed on recipes.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum RecipeAction {
    Created,            // type: String
    Updated,
    Published,
    Archived,
    Rated,
    Favorited,
    AddedToCollection,
    AddedToMealPlan,
}

#[spacetimedb::table(name = recipe_activities, public)]
pub struct RecipeActivity {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub recipe_id: Option<String>, // FK → recipes.id (set_null)

    #[index(btree)]
    pub actor_id: String, // FK → users.id (restrict delete)

    #[index(btree)]
    pub action: RecipeAction,

    pub details: Option<String>, // serialized JSON

    #[index(btree)]
    pub occurred_at: Timestamp,
}
