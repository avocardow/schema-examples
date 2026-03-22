// auto_detection_results: Automated content analysis results.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// Type of content that was analyzed.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum AutoDetectionContentType {
    Post,
    Comment,
    Message,
    User,
    Media,
}

/// Type of detection that produced this result.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum AutoDetectionMethod {
    MlClassifier,
    HashMatch,
    Keyword,
    Regex,
    Blocklist,
}

#[spacetimedb::table(name = auto_detection_results, public)]
pub struct AutoDetectionResult {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub content_type: AutoDetectionContentType,

    #[index(btree)]
    pub content_id: String, // What was analyzed.

    #[index(btree)]
    pub queue_item_id: Option<String>, // UUID — FK → moderation_queue_items.id (set null)

    #[index(btree)]
    pub detection_method: AutoDetectionMethod,

    #[index(btree)]
    pub detection_source: String, // Specific detector name (e.g., "perspective", "photodna").
                                  // String, not enum — new detectors added without schema changes.

    pub category: Option<String>, // Detected violation category (e.g., "toxicity", "hate_speech").
                                  // String to support detector-specific category names.

    pub confidence_score: Option<f64>, // Detection confidence, 0.00 to 1.00.
                                       // Nullable: some methods (keyword match) are binary, not scored.

    pub matched_value: Option<String>, // What triggered the match (keyword, regex pattern, hash ID).

    #[index(btree)]
    pub is_actionable: bool, // Whether this result met the threshold for automated action.

    pub metadata: Option<String>, // JSON stored as string

    pub rule_id: Option<String>, // UUID — FK → moderation_rules.id (set null)

    #[index(btree)]
    pub created_at: Timestamp, // Detections are immutable. No updated_at.
}
