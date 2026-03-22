// user_restrictions: Active restrictions on user accounts.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// The type of restriction imposed on the user.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum UserRestrictionType {
    Ban,             // Full access revocation.
    Mute,            // Cannot post/comment.
    PostRestriction, // Limited posting frequency or features.
    ShadowBan,       // Content hidden from others without notifying user.
    Warning,         // Formal warning on record.
    Probation,       // Enhanced monitoring, lower trust.
}

/// Where the restriction applies.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum UserRestrictionScope {
    Global,
    Community,
    Channel,
}

#[spacetimedb::table(name = user_restrictions, public)]
pub struct UserRestriction {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub user_id: String, // FK -> users.id (cascade delete) — The restricted user.

    pub restriction_type: UserRestrictionType,

    pub scope: UserRestrictionScope,
    pub scope_id: Option<String>, // Community/channel ID. None when scope = Global.

    pub reason: Option<String>,

    #[index(btree)]
    pub moderation_action_id: Option<String>, // UUID — FK -> moderation_actions.id (set null)

    #[index(btree)]
    pub imposed_by: String, // FK -> users.id (restrict delete) — Moderator who imposed the restriction.

    pub imposed_at: Timestamp,

    #[index(btree)]
    pub expires_at: Option<Timestamp>, // None = permanent.

    #[index(btree)]
    pub is_active: bool,

    pub lifted_by: Option<String>, // FK -> users.id (set null) — Moderator who lifted the restriction early.
    pub lifted_at: Option<Timestamp>, // None = still active or expired.

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
