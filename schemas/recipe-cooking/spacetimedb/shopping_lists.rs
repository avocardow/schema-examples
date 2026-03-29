// shopping_lists: User-created lists for purchasing ingredients.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = shopping_lists, public)]
pub struct ShoppingList {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,

    #[index(btree)]
    pub meal_plan_id: Option<String>, // FK → meal_plans.id (set_null)

    #[index(btree)]
    pub created_by: String, // FK → users.id

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
