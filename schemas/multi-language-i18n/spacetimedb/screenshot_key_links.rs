// screenshot_key_links: Links between screenshots and translation keys with optional coordinates.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique: (screenshot_id, translation_key_id) — enforce in reducer logic

#[spacetimedb::table(name = screenshot_key_links, public)]
pub struct ScreenshotKeyLink {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub screenshot_id: String, // FK → screenshots.id (cascade delete)

    #[index(btree)]
    pub translation_key_id: String, // FK → translation_keys.id (cascade delete)

    pub x: Option<i32>,
    pub y: Option<i32>,
    pub width: Option<i32>,
    pub height: Option<i32>,
    pub created_at: Timestamp,
}
