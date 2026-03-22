// response_templates: Pre-written response messages for moderator actions.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// Which moderation action this template is for.
/// Null action_type = usable with any action type.
// Uses ModerationActionType from moderation_actions.rs
// type: String
#[derive(SpacetimeType, Clone)]
pub enum ResponseTemplateActionType {
    Approve,
    Remove,
    Warn,
    Mute,
    Ban,
    Restrict,
    Escalate,
    Label,
}

/// Whether the template is available globally or scoped to a community.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum ResponseTemplateScope {
    Global,
    Community,
}

#[spacetimedb::table(name = response_templates, public)]
pub struct ResponseTemplate {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,

    #[index(btree)]
    pub action_type: Option<ResponseTemplateActionType>, // None = usable with any action type.

    pub content: String, // May include placeholders like {{username}}, {{rule}}, {{appeal_url}}.

    #[index(btree)]
    pub violation_category_id: Option<String>, // UUID — FK → violation_categories.id (set null on delete)

    #[index(btree)]
    pub scope: ResponseTemplateScope,

    pub scope_id: Option<String>, // Community ID. None when scope = Global.
    // Composite index: (scope, scope_id) — enforce in reducer logic

    #[index(btree)]
    pub is_active: bool,

    pub created_by: String, // UUID — FK → users.id (restrict delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
