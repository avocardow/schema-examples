// meal_plans: Named date-range plans for organizing meals.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = meal_plans, public)]
pub struct MealPlan {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,
    pub start_date: String, // YYYY-MM-DD
    pub end_date: String, // YYYY-MM-DD

    #[index(btree)]
    pub created_by: String, // FK → users.id

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
