// import_export_jobs: Bulk import/export job tracking.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// Import = importing translations into the system.
/// Export = exporting translations from the system.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum ImportExportType {
    Import,
    Export,
}

/// Pending = job is queued.
/// Processing = job is currently running.
/// Completed = job finished successfully.
/// Failed = job encountered an error.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum ImportExportStatus {
    Pending,
    Processing,
    Completed,
    Failed,
}

// Composite index: (job_type, status) — all running import/export jobs by type

#[spacetimedb::table(name = import_export_jobs, public)]
pub struct ImportExportJob {
    #[primary_key]
    pub id: String, // UUID

    pub job_type: ImportExportType,
    pub format: String,

    #[index(btree)]
    pub status: ImportExportStatus,

    pub locale_id: Option<String>, // FK → locales.id (set null)
    pub namespace_id: Option<String>, // FK → namespaces.id (set null)
    pub file_path: Option<String>,
    pub total_count: i32,
    pub processed_count: i32,
    pub error_message: Option<String>,
    pub options: Option<String>, // JSON

    #[index(btree)]
    pub created_by: Option<String>, // FK → users.id (set null)

    pub started_at: Option<Timestamp>,
    pub completed_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
