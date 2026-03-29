// recipes: Core recipe definitions with metadata and authorship.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum RecipeDifficulty {
    Easy,   // type: String
    Medium,
    Hard,
}

#[derive(SpacetimeType, Clone)]
pub enum RecipeStatus {
    Draft,     // type: String
    Published,
    Archived,
}

#[spacetimedb::table(name = recipes, public)]
pub struct Recipe {
    #[primary_key]
    pub id: String, // UUID

    pub title: String,

    #[unique]
    pub slug: String,

    pub description: Option<String>,
    pub source_url: Option<String>,
    pub source_name: Option<String>,
    pub servings: Option<String>,
    pub prep_time_minutes: Option<i32>,
    pub cook_time_minutes: Option<i32>,
    pub total_time_minutes: Option<i32>,

    #[index(btree)]
    pub difficulty: Option<RecipeDifficulty>,

    #[index(btree)]
    pub status: RecipeStatus, // default Draft

    pub language: Option<String>,

    #[index(btree)]
    pub created_by: String, // FK → users.id

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
