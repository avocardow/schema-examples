// providers: Service providers who can be booked for appointments.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = providers, public)]
pub struct Provider {
    #[primary_key]
    pub id: String, // UUID
    #[unique]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    pub display_name: String,
    pub bio: Option<String>,
    pub avatar_url: Option<String>,
    pub timezone: String,
    pub phone: Option<String>,
    pub email: Option<String>,
    #[index(btree)]
    pub is_active: bool,
    pub is_accepting: bool,
    pub position: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (is_active, is_accepting)
    // Composite index: (is_active, position)
}
