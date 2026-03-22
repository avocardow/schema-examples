// moderation_policies: Community/platform rule definitions.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// Where this policy applies.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum ModerationScope {
    Global,
    Community,
    Channel,
}

#[spacetimedb::table(name = moderation_policies, public)]
pub struct ModerationPolicy {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub scope: ModerationScope,

    #[index(btree)]
    pub scope_id: Option<String>, // ID of the community/channel. None when scope = Global.

    pub title: String,
    pub description: String,

    #[index(btree)]
    pub violation_category_id: Option<String>, // UUID — FK → violation_categories.id (set null on delete)

    pub sort_order: i32,

    #[index(btree)]
    pub is_active: bool,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
