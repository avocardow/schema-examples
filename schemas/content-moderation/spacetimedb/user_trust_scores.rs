// user_trust_scores: User reputation tracking in the moderation system.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// new = new account, highest scrutiny.
/// basic = verified email, some activity.
/// member = established user, good standing.
/// trusted = long history of compliance.
/// veteran = exemplary record, may assist in moderation.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum TrustLevel {
    New,
    Basic,
    Member,
    Trusted,
    Veteran,
}

#[spacetimedb::table(name = user_trust_scores, public)]
pub struct UserTrustScore {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub user_id: String, // FK → users.id (cascade delete)

    #[index(btree)]
    pub trust_level: TrustLevel, // Discrete trust tier for access control decisions.

    #[index(btree)]
    pub trust_score: f64, // Continuous score 0.00–1.00. Updated algorithmically based on behavior signals.

    pub total_reports_filed: i32, // Total reports this user has submitted.
    pub reports_upheld: i32, // Reports that led to enforcement action.
    pub reports_dismissed: i32, // Reports that were dismissed.
    pub flag_accuracy: f64, // reports_upheld / total_reports_filed (cached). Weights future reports.

    pub content_violations: i32, // Total times this user's content was actioned.

    pub last_violation_at: Option<Timestamp>, // When the user's most recent violation occurred.

    pub updated_at: Timestamp,
}
