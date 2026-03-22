// storage_quotas: Per-entity storage limits and usage tracking for users, organizations, or buckets.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// type: String
#[derive(SpacetimeType, Clone)]
pub enum StorageQuotaEntityType {
    User,
    Organization,
    Bucket,
}

#[spacetimedb::table(name = storage_quotas, public)]
pub struct StorageQuota {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub entity_type: StorageQuotaEntityType,

    pub entity_id: String, // Polymorphic — references users, organizations, or storage_buckets depending on entity_type.
    // App-level: unique(entity_type, entity_id)

    pub quota_bytes: i64,           // Storage limit in bytes. Enforced at upload time.
    pub used_bytes: i64,            // Cached: total bytes consumed. Updated on upload/delete.
    pub file_count: i32,            // Cached: total file count. Updated on upload/delete.
    pub last_computed_at: Option<Timestamp>, // When usage was last recomputed. Null = never recomputed.

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
