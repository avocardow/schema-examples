// feedback: Buyer/seller ratings and comments for completed auction transactions.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum FeedbackDirection {
    BuyerToSeller, // type: String
    SellerToBuyer,
}

// Composite unique: (auction_winner_id, direction) — enforce in reducer logic

#[spacetimedb::table(name = feedback, public)]
pub struct Feedback {
    #[primary_key]
    pub id: String, // UUID
    pub auction_winner_id: String, // UUID, FK -> auction_winners.id (on_delete: cascade)
    #[index(btree)]
    pub author_id: String, // UUID, FK -> users.id (on_delete: cascade)
    #[index(btree)]
    pub recipient_id: String, // UUID, FK -> users.id (on_delete: cascade)
    pub direction: FeedbackDirection,
    pub rating: i32,
    pub comment: Option<String>,
    pub created_at: Timestamp,
}
