// user_moderation_notes: Internal moderator notes on user accounts.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = user_moderation_notes, public)]
pub struct UserModerationNote {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)

    #[index(btree)]
    pub author_id: String, // UUID — FK → users.id (restrict delete)

    pub body: String, // The note text. Internal-only, never shown to the user.

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
