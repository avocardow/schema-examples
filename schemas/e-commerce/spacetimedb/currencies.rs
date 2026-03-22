// currencies: Supported currencies with exchange rates and display formatting.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = currencies, public)]
pub struct Currency {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub code: String,

    pub name: String,
    pub symbol: String,
    pub decimal_places: i32,
    pub exchange_rate: f64,
    pub is_base: bool,

    #[index(btree)]
    pub is_active: bool,

    pub updated_at: Timestamp,
    pub created_at: Timestamp,
}
