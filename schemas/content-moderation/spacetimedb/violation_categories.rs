// violation_categories: Hierarchical taxonomy of content violation types.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// info = informational/advisory.
/// low = minor policy violation.
/// medium = standard violation.
/// high = serious violation requiring prompt action.
/// critical = illegal content, imminent harm — highest priority.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum ViolationCategorySeverity {
    Info,
    Low,
    Medium,
    High,
    Critical,
}

#[spacetimedb::table(name = violation_categories, public)]
pub struct ViolationCategory {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub name: String, // Machine-readable identifier (e.g., "hate_speech", "csam").

    pub display_name: String, // Human-readable label (e.g., "Hate Speech", "Child Sexual Abuse Material").

    pub description: Option<String>, // Detailed explanation of what this category covers.

    #[index(btree)]
    pub parent_id: Option<String>, // UUID — FK → violation_categories.id (restrict delete)
    // Null = top-level category.

    pub severity: ViolationCategorySeverity, // Default severity when this category is cited in an action.

    #[index(btree)]
    pub is_active: bool, // Soft-disable without deleting. Inactive categories cannot be selected for new violations but remain for history.

    pub sort_order: i32, // Display ordering within the parent group.
    // Composite index: (is_active, sort_order) — enforce in reducer logic

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
