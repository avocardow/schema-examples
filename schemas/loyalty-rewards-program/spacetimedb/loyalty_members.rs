// loyalty_members: Enrollment of a user in a loyalty program with cached point balances.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum LoyaltyMemberStatus {
    Active,    // type: String
    Suspended,
    Banned,
}

#[spacetimedb::table(name = loyalty_members, public)]
pub struct LoyaltyMember {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub program_id: String, // UUID, FK → loyalty_programs.id (cascade delete)
    #[index(btree)]
    pub user_id: String, // UUID, FK → users.id (cascade delete)
    // Composite unique: (program_id, user_id) — enforce in reducer logic
    #[unique]
    pub member_number: String,
    #[index(btree)]
    pub status: LoyaltyMemberStatus,
    #[index(btree)]
    pub points_balance: i32, // default 0
    pub points_pending: i32, // default 0
    pub lifetime_points: i32, // default 0
    pub points_redeemed: i32, // default 0
    pub points_expired: i32, // default 0
    pub enrolled_at: Timestamp,
    pub suspended_at: Option<Timestamp>,
    pub metadata: Option<String>, // JSON stored as string
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
