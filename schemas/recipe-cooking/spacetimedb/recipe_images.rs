// recipe_images: Photos and images associated with a recipe.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = recipe_images, public)]
pub struct RecipeImage {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub recipe_id: String, // FK → recipes.id (cascade delete)

    pub image_url: String,
    pub caption: Option<String>,
    pub is_primary: bool, // default false
    pub position: i32, // default 0
    pub created_at: Timestamp,
}
