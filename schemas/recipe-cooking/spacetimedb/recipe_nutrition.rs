// recipe_nutrition: Nutritional information per recipe serving.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = recipe_nutrition, public)]
pub struct RecipeNutrition {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub recipe_id: String, // FK → recipes.id (cascade delete)

    pub calories: Option<f64>,
    pub total_fat_grams: Option<f64>,
    pub saturated_fat_grams: Option<f64>,
    pub carbohydrates_grams: Option<f64>,
    pub fiber_grams: Option<f64>,
    pub sugar_grams: Option<f64>,
    pub protein_grams: Option<f64>,
    pub sodium_mg: Option<f64>,
    pub cholesterol_mg: Option<f64>,
    pub updated_at: Timestamp,
}
