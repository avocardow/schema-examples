// auctions: Auction listings with type, pricing, timing, and anti-sniping controls.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum AuctionType {
    English,     // type: String
    Dutch,
    SealedBid,
    BuyNowOnly,
}

#[derive(SpacetimeType, Clone)]
pub enum AuctionStatus {
    Draft,       // type: String
    Scheduled,
    Active,
    Closing,
    Closed,
    Cancelled,
}

#[spacetimedb::table(name = auctions, public)]
pub struct Auction {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub item_id: String, // UUID, FK -> items.id (restrict delete)
    #[index(btree)]
    pub seller_id: String, // UUID, FK -> users.id (restrict delete)
    #[index(btree)]
    pub auction_type: AuctionType,
    #[index(btree)]
    pub status: AuctionStatus,
    pub title: String,
    pub description: Option<String>,
    pub starting_price: f64,
    pub reserve_price: Option<f64>,
    pub buy_now_price: Option<f64>,
    pub current_price: f64,
    pub bid_count: i32,
    pub highest_bidder_id: Option<String>, // UUID, FK -> users.id (set null on delete)
    pub buyer_premium_pct: Option<f64>,
    pub start_time: Option<Timestamp>,
    pub end_time: Option<Timestamp>,
    #[index(btree)]
    pub effective_end_time: Option<Timestamp>,
    pub extension_seconds: i32,
    pub extension_window_seconds: i32,
    pub currency: String,
    pub closed_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
