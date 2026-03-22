// strikes: Accumulated violations with configurable expiry.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// Strike weight — severe strikes may count as 2 or 3 toward the threshold.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum StrikeSeverity {
    Minor,
    Moderate,
    Severe,
}

/// Current disposition of the strike.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum StrikeResolution {
    Active,
    Expired,
    AppealedOverturned,
}

#[spacetimedb::table(name = strikes, public)]
pub struct Strike {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub user_id: String, // FK → users.id (cascade delete)

    #[index(btree)]
    pub moderation_action_id: String, // FK → moderation_actions.id (restrict delete)

    #[index(btree)]
    pub violation_category_id: Option<String>, // UUID — FK → violation_categories.id (set null on delete)

    pub severity: StrikeSeverity,

    pub issued_at: Timestamp,

    #[index(btree)]
    pub expires_at: Option<Timestamp>, // None = never expires.

    #[index(btree)]
    pub is_active: bool,

    #[index(btree)]
    pub resolution: StrikeResolution,

    pub created_at: Timestamp,
}
