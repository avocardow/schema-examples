// member_activities: Log of member actions that may trigger earning rules.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = member_activities, public)]
pub struct MemberActivity {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub member_id: String, // UUID, FK → loyalty_members.id (cascade delete)
    // Composite index: (member_id, created_at) — enforce in reducer logic
    #[index(btree)]
    pub activity_type: String,
    pub description: Option<String>,
    pub source: Option<String>,
    #[index(btree)]
    pub reference_type: Option<String>,
    // Composite index: (reference_type, reference_id) — enforce in reducer logic
    pub reference_id: Option<String>,
    pub monetary_value: Option<i32>,
    pub currency: Option<String>,
    pub points_awarded: Option<i32>,
    #[index(btree)]
    pub transaction_id: Option<String>, // UUID, FK → points_transactions.id (set null)
    pub metadata: Option<String>, // JSON stored as string
    pub created_at: Timestamp,
}
