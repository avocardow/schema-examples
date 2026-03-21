// password_history: Previous password hashes for enterprise "cannot reuse last N passwords" policies.
// Only needed for regulated industries (finance, healthcare, government).
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = password_history, public)]
pub struct PasswordHistory {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub user_id: String, // FK → users.id (cascade delete)

    pub password_hash: String, // The previous password hash. Compared against new passwords to prevent reuse.

    pub created_at: Timestamp, // When this password was set (not when it was retired).
}
