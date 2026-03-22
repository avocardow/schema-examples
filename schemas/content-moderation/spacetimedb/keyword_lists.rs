// keyword_lists: Managed word/phrase lists for auto-moderation.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// blocklist = content matching these entries is blocked/flagged.
/// allowlist = entries that override blocklist matches.
/// watchlist = entries that flag content for review.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum KeywordListType {
    Blocklist,
    Allowlist,
    Watchlist,
}

/// global = applies platform-wide.
/// community = scoped to a specific community.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum KeywordListScope {
    Global,
    Community,
}

#[spacetimedb::table(name = keyword_lists, public)]
pub struct KeywordList {
    #[primary_key]
    pub id: String, // UUID

    pub name: String, // List name (e.g., "Profanity — English", "Competitor URLs").

    pub description: Option<String>, // What this list contains and how it's used.

    #[index(btree)]
    pub list_type: KeywordListType,

    #[index(btree)]
    pub scope: KeywordListScope,

    pub scope_id: Option<String>, // Community ID. Null when scope = global.

    #[index(btree)]
    pub is_enabled: bool,

    pub created_by: String, // FK → users.id (restrict delete)
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
