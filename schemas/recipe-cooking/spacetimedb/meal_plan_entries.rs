// meal_plan_entries: Individual meal slots within a meal plan.
// See README.md for full design rationale.

// Composite index(meal_plan_id, plan_date) — not supported inline, enforce in reducer logic

#[derive(SpacetimeType, Clone)]
pub enum MealType {
    Breakfast, // type: String
    Lunch,
    Dinner,
    Snack,
}

#[spacetimedb::table(name = meal_plan_entries, public)]
pub struct MealPlanEntry {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub meal_plan_id: String, // FK → meal_plans.id (cascade delete)

    #[index(btree)]
    pub recipe_id: String, // FK → recipes.id (cascade delete)

    pub plan_date: String, // YYYY-MM-DD
    pub meal_type: MealType,
    pub servings: Option<i32>,
    pub note: Option<String>,
}
