// screenshots: Uploaded screenshots providing visual context for translations.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = screenshots, public)]
pub struct Screenshot {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,
    pub file_path: String,
    pub file_size: Option<i32>,
    pub mime_type: Option<String>,
    pub width: Option<i32>,
    pub height: Option<i32>,
    pub uploaded_by: Option<String>, // FK → users.id (set null)
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
