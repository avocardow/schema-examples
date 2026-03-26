// bid_increment_rules: Price-range rules that determine the minimum bid increment for an auction.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = bid_increment_rules, public)]
pub struct BidIncrementRule {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub auction_id: Option<String>, // UUID. FK → auctions.id (cascade delete). Null = global default rule.

    #[index(btree)]
    pub min_price: f64, // Lower bound of the price range (inclusive).

    pub max_price: Option<f64>, // Upper bound of the price range. Null = no upper limit.

    pub increment: f64, // Minimum bid increment required within this price range.

    pub created_at: Timestamp,
}
