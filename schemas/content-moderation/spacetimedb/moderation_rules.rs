// moderation_rules: Configurable auto-moderation rules.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// Where this rule applies.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum ModerationRuleScope {
    Global,
    Community,
    Channel,
}

/// What type of content analysis triggers this rule.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum ModerationRuleTriggerType {
    Keyword,
    Regex,
    MlScore,
    HashMatch,
    MentionSpam,
    UserAttribute,
}

/// What happens when the rule triggers.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum ModerationRuleActionType {
    Block,
    Flag,
    Hold,
    Timeout,
    Notify,
}

#[spacetimedb::table(name = moderation_rules, public)]
pub struct ModerationRule {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,
    pub description: Option<String>,

    #[index(btree)]
    pub scope: ModerationRuleScope,

    #[index(btree)]
    pub scope_id: Option<String>, // Community/channel ID. None when scope = Global.

    #[index(btree)]
    pub trigger_type: ModerationRuleTriggerType,

    pub trigger_config: String, // JSON stored as string

    pub action_type: ModerationRuleActionType,
    pub action_config: Option<String>, // JSON stored as string

    pub priority: i32,

    #[index(btree)]
    pub is_enabled: bool,

    #[index(btree)]
    pub created_by: String, // UUID — FK → users.id (restrict delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
