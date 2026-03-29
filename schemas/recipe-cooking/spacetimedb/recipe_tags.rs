// recipe_tags: Many-to-many association between recipes and tags.
// See README.md for full design rationale.

// Composite unique(recipe_id, tag_id) — enforce in reducer logic

#[spacetimedb::table(name = recipe_tags, public)]
pub struct RecipeTag {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub recipe_id: String, // FK → recipes.id (cascade delete)

    #[index(btree)]
    pub tag_id: String, // FK → tags.id (cascade delete)
}
