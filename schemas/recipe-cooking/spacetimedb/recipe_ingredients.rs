// recipe_ingredients: Links recipes to foods with quantities and units.
// See README.md for full design rationale.

// Composite unique(recipe_id, position) — enforce in reducer logic

#[spacetimedb::table(name = recipe_ingredients, public)]
pub struct RecipeIngredient {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub recipe_id: String, // FK → recipes.id (cascade delete)

    #[index(btree)]
    pub food_id: String, // FK → foods.id (restrict delete)

    pub unit_id: Option<String>, // FK → units.id (set_null)
    pub quantity: Option<f64>,
    pub note: Option<String>,
    pub section_label: Option<String>,
    pub position: i32, // default 0
    pub optional: bool, // default false
}
