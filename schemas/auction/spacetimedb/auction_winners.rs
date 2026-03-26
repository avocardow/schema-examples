// auction_winners: Records winning bids with settlement tracking and payment lifecycle.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum SettlementStatus {
    Pending,     // type: String
    Paid,
    Shipped,
    Completed,
    Disputed,
    Refunded,
}

#[spacetimedb::table(name = auction_winners, public)]
pub struct AuctionWinner {
    #[primary_key]
    pub id: String, // UUID
    #[unique]
    pub auction_id: String, // UUID, FK -> auctions.id (restrict delete)
    #[unique]
    pub winning_bid_id: String, // UUID, FK -> bids.id (restrict delete)
    #[index(btree)]
    pub winner_id: String, // UUID, FK -> users.id (restrict delete)
    #[index(btree)]
    pub seller_id: String, // UUID, FK -> users.id (restrict delete)
    pub hammer_price: f64,
    pub buyer_premium: f64,
    pub total_price: f64,
    #[index(btree)]
    pub settlement_status: SettlementStatus,
    pub paid_at: Option<Timestamp>,
    pub shipped_at: Option<Timestamp>,
    pub completed_at: Option<Timestamp>,
    pub notes: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
