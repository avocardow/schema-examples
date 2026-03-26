// bids: Individual bid records with proxy bidding support and status tracking.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum BidStatus {
    Active,    // type: String
    Outbid,
    Winning,
    Won,
    Cancelled,
}

// Composite unique: (auction_id, amount) — enforce in reducer logic

#[spacetimedb::table(name = bids, public)]
pub struct Bid {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub auction_id: String, // UUID, FK -> auctions.id (restrict delete)

    #[index(btree)]
    pub bidder_id: String, // UUID, FK -> users.id (restrict delete)

    pub amount: f64,
    pub max_amount: Option<f64>,

    #[index(btree)]
    pub status: BidStatus, // default: Active

    pub is_proxy: bool, // default: false
    pub ip_address: Option<String>,

    pub created_at: Timestamp,
}
