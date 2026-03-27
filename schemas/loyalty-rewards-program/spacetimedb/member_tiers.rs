// member_tiers: Assignment of members to tiers with temporal tracking and history.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = member_tiers, public)]
pub struct MemberTier {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub member_id: String, // UUID, FK → loyalty_members.id (cascade delete)
    // Composite index: (member_id, is_current) — enforce in reducer logic
    #[index(btree)]
    pub tier_id: String, // UUID, FK → tiers.id (cascade delete)
    pub is_current: bool, // default true
    pub started_at: Timestamp,
    #[index(btree)]
    pub ends_at: Option<Timestamp>,
    pub ended_at: Option<Timestamp>,
    pub qualification_snapshot: Option<String>, // JSON stored as string
    pub is_manual: bool, // default false
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
