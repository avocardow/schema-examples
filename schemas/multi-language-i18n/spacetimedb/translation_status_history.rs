// translation_status_history: Append-only log of translation status changes.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite index: (translation_type, translation_id) — full status history for a translation

#[spacetimedb::table(name = translation_status_history, public)]
pub struct TranslationStatusHistory {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub translation_type: String,

    pub translation_id: String,
    pub from_status: Option<String>,
    pub to_status: String,

    #[index(btree)]
    pub changed_by: Option<String>, // FK → users.id (set null)

    pub comment: Option<String>,
    pub created_at: Timestamp,
}
