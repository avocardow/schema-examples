// points_transactions: Immutable ledger of every point movement (earn, redeem, expire, adjust).
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum PointsTransactionType {
    Earn,    // type: String
    Redeem,
    Expire,
    Adjust,
    Bonus,
}

#[spacetimedb::table(name = points_transactions, public)]
pub struct PointsTransaction {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub member_id: String, // UUID, FK → loyalty_members.id (restrict delete)
    // Composite index: (member_id, created_at) — enforce in reducer logic
    #[index(btree)]
    pub r#type: PointsTransactionType,
    pub points: i32,
    pub balance_after: i32,
    pub description: Option<String>,
    #[index(btree)]
    pub source_reference_type: Option<String>,
    // Composite index: (source_reference_type, source_reference_id) — enforce in reducer logic
    pub source_reference_id: Option<String>,
    pub earning_rule_id: Option<String>, // UUID, FK → earning_rules.id (set null)
    pub promotion_id: Option<String>, // UUID, FK → promotions.id (set null)
    pub redemption_id: Option<String>, // UUID, FK → reward_redemptions.id (set null)
    #[index(btree)]
    pub expires_at: Option<Timestamp>,
    #[index(btree)]
    pub is_pending: bool, // default false
    pub confirmed_at: Option<Timestamp>,
    pub created_at: Timestamp,
}
