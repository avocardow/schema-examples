// promo_code_ticket_types: Links promo codes to specific ticket types they apply to.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = promo_code_ticket_types, public)]
pub struct PromoCodeTicketType {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub promo_code_id: String, // UUID — FK → promo_codes.id (cascade delete)

    #[index(btree)]
    pub ticket_type_id: String, // UUID — FK → ticket_types.id (cascade delete)

    pub created_at: Timestamp,
    // Composite unique: (promo_code_id, ticket_type_id)
}
