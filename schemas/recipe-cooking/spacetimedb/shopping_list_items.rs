// shopping_list_items: Individual items on a shopping list.
// See README.md for full design rationale.

// Composite index(shopping_list_id, checked) — not supported inline, enforce in reducer logic

#[spacetimedb::table(name = shopping_list_items, public)]
pub struct ShoppingListItem {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub shopping_list_id: String, // FK → shopping_lists.id (cascade delete)

    #[index(btree)]
    pub food_id: Option<String>, // FK → foods.id (set_null)

    pub recipe_id: Option<String>, // FK → recipes.id (set_null)
    pub quantity: Option<f64>,
    pub unit_id: Option<String>, // FK → units.id (set_null)
    pub custom_label: Option<String>,
    pub checked: bool, // default false
    pub position: i32, // default 0
}
