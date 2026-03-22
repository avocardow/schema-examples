// translation_reviews: Append-only log of translation review actions.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// Approve = reviewer approves the translation.
/// Reject = reviewer rejects the translation.
/// RequestChanges = reviewer requests modifications.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum TranslationReviewAction {
    Approve,
    Reject,
    RequestChanges,
}

// Composite index: (translation_type, translation_id) — all reviews for a translation

#[spacetimedb::table(name = translation_reviews, public)]
pub struct TranslationReview {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub translation_type: String,

    pub translation_id: String,

    #[index(btree)]
    pub reviewer_id: String, // FK → users.id (cascade delete)

    pub action: TranslationReviewAction,
    pub comment: Option<String>,
    pub created_at: Timestamp,
}
