// file_variants: Thumbnails, resized images, and transformed derivatives of a source file.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = file_variants, public)]
pub struct FileVariant {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub source_file_id: String, // UUID — FK → files.id (cascade delete)

    pub variant_key: String, // Variant identifier (e.g., "thumbnail", "small", "medium", "large", "webp").

    #[unique]
    pub storage_key: String, // Path to the variant's bytes.

    pub mime_type: String, // May differ from source (e.g., JPEG source → WebP variant).
    pub width: Option<i32>,  // Variant width in pixels. None for non-image variants.
    pub height: Option<i32>, // Variant height in pixels. None for non-image variants.
    pub size: i64,           // Variant file size in bytes.
    pub transform_params: Option<String>, // JSON — The transformation parameters that produced this variant.

    pub created_at: Timestamp,
    // No updated_at — variants are immutable.
}
