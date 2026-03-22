// moderation_actions: Enforcement actions taken by moderators or automated systems.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// The type of enforcement action taken.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum ModerationActionType {
    Approve,
    Remove,
    Warn,
    Mute,
    Ban,
    Restrict,
    Escalate,
    Label,
}

/// What the action applies to.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum ModerationActionTargetType {
    Content,
    User,
    Account,
}

#[spacetimedb::table(name = moderation_actions, public)]
pub struct ModerationAction {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub queue_item_id: Option<String>, // UUID — FK → moderation_queue_items.id (set null)

    #[index(btree)]
    pub moderator_id: Option<String>, // UUID — FK → users.id (set null). None = automated action.

    #[index(btree)]
    pub action_type: ModerationActionType,

    // Composite index: (target_type, target_id) — enforce in reducer logic
    #[index(btree)]
    pub target_type: ModerationActionTargetType,

    pub target_id: String, // Polymorphic target ID (content, user, or account)

    pub reason: Option<String>,

    #[index(btree)]
    pub violation_category_id: Option<String>, // UUID — FK → violation_categories.id (set null)

    pub response_template_id: Option<String>, // UUID — FK → response_templates.id (set null)

    #[index(btree)]
    pub is_automated: bool,

    pub metadata: Option<String>, // JSON stored as string

    #[index(btree)]
    pub created_at: Timestamp,
}
