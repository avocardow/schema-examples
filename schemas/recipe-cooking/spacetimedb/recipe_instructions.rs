// recipe_instructions: Ordered preparation steps for a recipe.
// See README.md for full design rationale.

// Composite unique(recipe_id, step_number) — enforce in reducer logic

#[spacetimedb::table(name = recipe_instructions, public)]
pub struct RecipeInstruction {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub recipe_id: String, // FK → recipes.id (cascade delete)

    pub step_number: i32,
    pub instruction: String,
    pub section_label: Option<String>,
    pub time_minutes: Option<i32>,
}
