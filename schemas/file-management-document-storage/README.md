# File Management / Document Storage

## Overview

File storage, folder hierarchy, versioning, sharing, tagging, custom metadata, polymorphic attachments, resumable uploads, and collaboration features. Covers the full lifecycle of files from upload through organization, sharing, and soft delete with restore. This is a foundational domain — other domains reference it via the `file_attachments` polymorphic table to attach files to any entity (products, posts, tickets, etc.) without schema changes.

Designed from a study of 24 systems: cloud storage (S3, GCS, Azure, Supabase, MinIO), enterprise DMS (Alfresco, Nuxeo, Mayan EDMS, Paperless-ngx), SaaS platforms (Box, Dropbox, Google Drive, OneDrive/SharePoint), self-hosted (Nextcloud, Seafile), framework libraries (Rails ActiveStorage, Laravel Media Library, Django Filer, Strapi), and upload/processing services (tus, Cloudinary, Uploadcare, Transloadit).

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (20 tables)</summary>

- [File Management / Document Storage](#file-management--document-storage)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Dependencies](#dependencies)
  - [Tables](#tables)
    - [Storage \& Containers](#storage--containers)
    - [Hierarchy](#hierarchy)
    - [Core Files](#core-files)
    - [Derivatives](#derivatives)
    - [Organization](#organization)
    - [Sharing](#sharing)
    - [Uploads](#uploads)
    - [Collaboration](#collaboration)
    - [Operations](#operations)
  - [Schema](#schema)
    - [`storage_buckets`](#storage_buckets)
    - [`storage_quotas`](#storage_quotas)
    - [`folders`](#folders)
    - [`file_shortcuts`](#file_shortcuts)
    - [`files`](#files)
    - [`file_versions`](#file_versions)
    - [`file_attachments`](#file_attachments)
    - [`file_variants`](#file_variants)
    - [`file_tags`](#file_tags)
    - [`file_tag_assignments`](#file_tag_assignments)
    - [`file_metadata_fields`](#file_metadata_fields)
    - [`file_metadata_values`](#file_metadata_values)
    - [`file_shares`](#file_shares)
    - [`file_share_links`](#file_share_links)
    - [`multipart_uploads`](#multipart_uploads)
    - [`multipart_upload_parts`](#multipart_upload_parts)
    - [`file_comments`](#file_comments)
    - [`file_locks`](#file_locks)
    - [`file_activities`](#file_activities)
    - [`file_favorites`](#file_favorites)
  - [Relationships](#relationships)
    - [One-to-Many](#one-to-many)
    - [One-to-One](#one-to-one)
    - [Many-to-Many (via junction tables)](#many-to-many-via-junction-tables)
  - [Best Practices](#best-practices)
  - [Formats](#formats)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

- [Auth / RBAC](../auth-rbac) — `users` table for all ownership and actor references (`created_by`, `uploaded_by`, `shared_by`, `locked_by`, `actor_id`, etc.).

## Tables

### Storage & Containers

- `storage_buckets`
- `storage_quotas`

### Hierarchy

- `folders`
- `file_shortcuts`

### Core Files

- `files`
- `file_versions`
- `file_attachments`

### Derivatives

- `file_variants`

### Organization

- `file_tags`
- `file_tag_assignments`
- `file_metadata_fields`
- `file_metadata_values`

### Sharing

- `file_shares`
- `file_share_links`

### Uploads

- `multipart_uploads`
- `multipart_upload_parts`

### Collaboration

- `file_comments`
- `file_locks`

### Operations

- `file_activities`
- `file_favorites`

## Schema

### `storage_buckets`

Logical containers for files with per-bucket configuration. Buckets isolate file namespaces and
enforce upload constraints (allowed MIME types, max file size). Inspired by S3 buckets and Supabase
Storage buckets. Every file belongs to exactly one bucket.

```pseudo
table storage_buckets {
  id                uuid primary_key default auto_generate
  name              string unique not_null       -- Human-readable bucket name. Used in API paths (e.g., /storage/avatars/).
                                                 -- Unique constraint prevents duplicate namespaces.
  description       string nullable              -- Explain what this bucket is for (e.g., "User profile pictures").
  is_public         boolean not_null default false
                                                 -- Controls anonymous read access to files in this bucket.
                                                 -- false = all access requires authentication.
                                                 -- true = files are publicly readable (e.g., CDN-served assets).
                                                 -- Individual files can override via files.is_public.
  allowed_mime_types text[] nullable             -- Whitelist of accepted MIME types (e.g., ["image/png", "image/jpeg"]).
                                                 -- Null = all types allowed. Validated on upload, not on read.
  max_file_size     bigint nullable              -- Maximum file size in bytes. Null = no limit.
                                                 -- Enforced at upload time. BIGINT supports files >2GB.
  versioning_enabled boolean not_null default false
                                                 -- Whether files in this bucket track version history.
                                                 -- When true, uploading a new version creates a file_versions record
                                                 -- instead of replacing the file. Inspired by S3 bucket versioning.
  created_by        uuid not_null references users(id) on_delete restrict
                                                 -- Who created this bucket. Restrict: don't delete users who own buckets.
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  -- unique(name) is already created by the field constraint above.
}
```

### `storage_quotas`

Per-entity storage limits and usage tracking. Supports quotas on users, organizations, or
individual buckets. Usage fields (`used_bytes`, `file_count`) are cached values — recompute
periodically via background jobs and record when in `last_computed_at`. Inspired by Seafile's
UserQuota/OrgQuota/RepoQuotaUsage tables.

```pseudo
table storage_quotas {
  id                uuid primary_key default auto_generate

  -- Polymorphic entity: what the quota applies to.
  -- The entity_id references different tables depending on entity_type:
  --   user → users.id (from auth-rbac)
  --   organization → organizations.id (from auth-rbac)
  --   bucket → storage_buckets.id
  entity_type       enum(user, organization, bucket) not_null
  entity_id         uuid not_null                -- Not a FK — target depends on entity_type.

  quota_bytes       bigint not_null              -- Storage limit in bytes. Enforced at upload time.
  used_bytes        bigint not_null default 0    -- Cached: total bytes consumed. Updated on upload/delete.
  file_count        integer not_null default 0   -- Cached: total file count. Updated on upload/delete.
  last_computed_at  timestamp nullable           -- When usage was last recomputed by a background job.
                                                 -- Null = never recomputed (only incremental updates so far).
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  unique(entity_type, entity_id)                 -- One quota per entity. Prevents duplicate quota records.
  index(entity_type)                             -- "All user quotas" or "all bucket quotas."
}
```

### `folders`

Folder tree with materialized path for efficient subtree queries. Uses the Nextcloud + Strapi
hybrid approach: materialized path (for prefix queries like "all descendants of folder X") plus
parent_id (for single-level directory listings). Path segments use folder UUIDs, not names —
so renaming a folder updates only the `name` column, not every descendant's path.

```pseudo
table folders {
  id                uuid primary_key default auto_generate
  bucket_id         uuid not_null references storage_buckets(id) on_delete cascade
                                                 -- Which bucket this folder belongs to.
                                                 -- Cascade: deleting a bucket removes all its folders.
  parent_id         uuid nullable references folders(id) on_delete cascade
                                                 -- Parent folder. Null = root-level folder within the bucket.
                                                 -- Cascade: deleting a parent deletes all children recursively.
  name              string not_null              -- Display name (e.g., "Documents", "Photos 2024").
                                                 -- Not unique globally — only unique within a parent (enforced by unique index below).
  path              string not_null              -- Materialized path using folder IDs as segments.
                                                 -- Format: /{parent_uuid}/{this_uuid}/ (e.g., "/abc123/def456/").
                                                 -- Root folders: /{this_uuid}/
                                                 -- Enables subtree queries: WHERE path LIKE '/abc123/%'
                                                 -- Uses UUIDs (not names) so folder renames don't cascade path updates.
  depth             integer not_null default 0   -- Hierarchy level. 0 = root, 1 = child of root, etc.
                                                 -- Denormalized from path for efficient level-based queries.
  description       string nullable              -- Optional folder description.
  created_by        uuid not_null references users(id) on_delete restrict
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  unique(bucket_id, path)                        -- Path must be unique within a bucket.
  unique(bucket_id, parent_id, name)             -- Folder name must be unique within a parent. Prevents "Photos" appearing twice in the same directory.
                                                 -- ⚠️  parent_id is nullable. In SQL, NULL != NULL, so this constraint
                                                 --     does NOT prevent duplicate root folder names within a bucket.
                                                 --     SQL implementations need a partial unique index:
                                                 --     CREATE UNIQUE INDEX ... ON folders(bucket_id, name) WHERE parent_id IS NULL;
                                                 --     or use COALESCE(parent_id, '00000000-...'::uuid).
  index(parent_id)                               -- "All children of this folder" (single-level listing).
  index(bucket_id, depth)                        -- "All root folders in this bucket" (depth = 0).
}
```

### `file_shortcuts`

Cross-folder references without file duplication. A shortcut points to a file or folder in
another location — similar to Google Drive shortcuts or Windows .lnk files. The target continues
to exist independently; deleting a shortcut does not affect the target. Deleting the target
cascade-deletes the shortcut — no dangling references.

```pseudo
table file_shortcuts {
  id                uuid primary_key default auto_generate
  folder_id         uuid not_null references folders(id) on_delete cascade
                                                 -- The folder where this shortcut lives.
                                                 -- Cascade: deleting the containing folder removes its shortcuts.

  -- What the shortcut points to. Exactly one of target_file_id or target_folder_id must be set.
  target_type       enum(file, folder) not_null  -- Discriminator for which FK is populated.
  target_file_id    uuid nullable references files(id) on_delete cascade
                                                 -- Populated when target_type = 'file'.
                                                 -- Cascade: shortcut removed when target file is deleted.
  target_folder_id  uuid nullable references folders(id) on_delete cascade
                                                 -- Populated when target_type = 'folder'.
                                                 -- Cascade: shortcut removed when target folder is deleted.

  name              string nullable              -- Override display name. Null = use the target's name.
  created_by        uuid not_null references users(id) on_delete restrict
  created_at        timestamp default now
}

indexes {
  index(folder_id)                               -- "All shortcuts in this folder."
  index(target_file_id)                          -- "All shortcuts pointing to this file."
  index(target_folder_id)                        -- "All shortcuts pointing to this folder."
}
```

### `files`

The core file entity — metadata about stored bytes. This is the "blob" in the blob + attachment
split (inspired by Rails ActiveStorage). The file record describes what the file IS (name, size,
type, storage location). Where the file is USED is tracked separately in `file_attachments`.
This separation enables file reuse across entities and clean storage accounting.

Soft delete uses `deleted_at` + `deleted_by` + `original_folder_id` — the three fields needed
to implement a full trash/restore UX. Files with `deleted_at` set are excluded from normal queries
but remain restorable until permanently purged.

```pseudo
table files {
  id                uuid primary_key default auto_generate
  bucket_id         uuid not_null references storage_buckets(id) on_delete cascade
                                                 -- Which bucket this file belongs to.
                                                 -- Cascade: deleting a bucket removes all its files.
  folder_id         uuid nullable references folders(id) on_delete set_null
                                                 -- Current folder. Null = bucket root (no folder).
                                                 -- Set null: if the folder is deleted, files move to bucket root
                                                 -- rather than being cascade-deleted.

  -- Identity and display
  name              string not_null              -- Current display filename (e.g., "Q4 Report.pdf").
                                                 -- Can be renamed without affecting storage.
  original_filename string not_null              -- Filename at upload time. Preserved for audit/history.
                                                 -- Never changes after upload.
  storage_key       string unique not_null       -- Path to bytes in the storage backend (e.g., "uploads/abc123/file.pdf").
                                                 -- Immutable after upload — decoupled from display name.
                                                 -- Unique constraint prevents two files from pointing to the same bytes.

  -- File properties
  mime_type         string not_null              -- MIME type (e.g., "application/pdf", "image/png").
                                                 -- String, not enum — MIME registry has 2000+ entries.
  size              bigint not_null              -- File size in bytes. BIGINT supports files >2GB.
  checksum_sha256   string nullable              -- SHA-256 hash of file contents. Enables:
                                                 -- duplicate detection, integrity verification, content-addressable dedup.
                                                 -- Nullable: computed asynchronously for large files.
  etag              string nullable              -- HTTP ETag for cache validation. Typically the checksum or a version hash.
                                                 -- Returned in API responses for conditional requests (If-None-Match).

  -- Versioning: pointer to the current active version.
  -- Null until the first version is explicitly created (versioning may be off for the bucket).
  current_version_id uuid nullable references file_versions(id) on_delete set_null

  -- Metadata: two JSON columns (Supabase pattern).
  -- System metadata = auto-extracted (dimensions, duration, pages, EXIF).
  -- User metadata = custom key-value pairs set by the user/application.
  metadata          json nullable default {}     -- System-extracted metadata.
  user_metadata     json nullable default {}     -- User-defined key-value pairs.

  -- Ownership
  uploaded_by       uuid not_null references users(id) on_delete restrict
                                                 -- Who uploaded the file. Restrict: don't delete users who own files.
  is_public         boolean not_null default false
                                                 -- Per-file public access override. When true, the file is publicly
                                                 -- readable regardless of bucket setting.

  -- Soft delete: three fields for full trash/restore support.
  deleted_at        timestamp nullable           -- When the file was trashed. Null = not deleted.
                                                 -- Filter with WHERE deleted_at IS NULL for normal queries.
  deleted_by        uuid nullable references users(id) on_delete set_null
                                                 -- Who trashed the file. Set null if the user is later deleted.
  original_folder_id uuid nullable references folders(id) on_delete set_null
                                                 -- Folder the file was in before deletion.
                                                 -- Enables "Restore to original location" UX.
                                                 -- Set null if the original folder is deleted while file is in trash.

  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  -- unique(storage_key) is already created by the field constraint above.
  index(bucket_id, folder_id)                    -- "All files in this folder" — the directory listing query.
  index(uploaded_by)                             -- "My files" — files uploaded by a specific user.
  index(mime_type)                               -- "All PDFs" or "All images" — type-based filtering.
  index(deleted_at)                              -- Efficiently exclude trashed files (WHERE deleted_at IS NULL).
  index(checksum_sha256)                         -- Duplicate detection: find files with the same content hash.
  index(bucket_id, deleted_at)                   -- "All active files in this bucket" (combined filter).
}
```

### `file_versions`

Version history for files. Each row represents a point-in-time snapshot with its own storage key,
size, checksum, and creator. Uses a monotonic version counter (Box/Google Drive pattern) — human-
friendly ("Version 3 of report.pdf") and simple to increment atomically. The parent file record
points to the active version via `current_version_id`.

Version records are only created when the bucket has `versioning_enabled = true`. Without
versioning, uploading a new file simply updates the file record in place.

```pseudo
table file_versions {
  id                uuid primary_key default auto_generate
  file_id           uuid not_null references files(id) on_delete cascade
                                                 -- Which file this version belongs to.
                                                 -- Cascade: deleting a file removes all its versions.
  version_number    integer not_null             -- Monotonic counter. 1, 2, 3, ... per file.
                                                 -- Increment atomically on each new version upload.
  storage_key       string unique not_null       -- Path to this version's bytes. Each version has its own storage location.
                                                 -- Unique: no two versions share storage.
  size              bigint not_null              -- This version's file size in bytes.
  checksum_sha256   string nullable              -- This version's content hash. Independent of the parent file's checksum.
  mime_type         string not_null              -- This version's MIME type. May differ between versions
                                                 -- (e.g., converting a .doc to .pdf creates a new version with a different type).
  change_summary    string nullable              -- Human-readable description of what changed in this version.
                                                 -- e.g., "Updated financial projections for Q4".
  is_current        boolean not_null default false
                                                 -- Denormalized flag: true for the active version.
                                                 -- Kept in sync with files.current_version_id.
                                                 -- Enables queries like "find all current versions" without joining files.
  created_by        uuid not_null references users(id) on_delete restrict
                                                 -- Who uploaded this version.
  created_at        timestamp default now        -- Versions are immutable (append-only). No updated_at.
}

indexes {
  unique(file_id, version_number)                -- Version numbers are unique per file.
  index(file_id, is_current)                     -- "Current version of this file" — fast lookup.
  -- unique(storage_key) is already created by the field constraint above.
}
```

### `file_attachments`

Polymorphic join table: attach files to any entity in any domain. This is the primary integration
point for other domains — a product can have images, a ticket can have screenshots, a user can have
an avatar, all through this one table. Inspired by Rails ActiveStorage's Attachment model.

The `record_type`/`record_id`/`name` triple identifies the attachment slot: what entity, which
instance, and what purpose (e.g., record_type="products", record_id=<uuid>, name="cover_image").
The `name` field is what most other systems lack — it's not just "file belongs to entity" but
"file serves this specific purpose for entity".

```pseudo
table file_attachments {
  id                uuid primary_key default auto_generate
  file_id           uuid not_null references files(id) on_delete cascade
                                                 -- The attached file.
                                                 -- Cascade: deleting a file removes all its attachment records.

  -- Polymorphic target: what entity this file is attached to.
  -- Not FKs — the target table depends on the consuming domain.
  record_type       string not_null              -- Entity type (e.g., "products", "users", "posts", "tickets").
  record_id         uuid not_null               -- Entity primary key.

  name              string not_null              -- Attachment slot/purpose (e.g., "avatar", "cover_image", "documents").
                                                 -- An entity can have multiple named slots, each with multiple files.
  position          integer not_null default 0   -- Ordering within a slot. Allows drag-and-drop reordering of
                                                 -- attachments in the same slot (e.g., product gallery order).
  created_at        timestamp default now        -- Attachments are immutable links. No updated_at —
                                                 -- to change an attachment, delete and recreate.
}

indexes {
  unique(record_type, record_id, name, file_id)  -- Prevent duplicate attachments of the same file in the same slot.
  index(file_id)                                 -- "Where is this file used?" — orphan detection.
  index(record_type, record_id, name)            -- "All files in this slot for this entity" — the primary lookup.
  index(record_type, record_id)                  -- "All attachments for this entity" (across all slots).
}
```

### `file_variants`

Thumbnails, resized images, and transformed derivatives of a source file. Each variant is a
first-class record with its own storage key, dimensions, and size — not a JSON blob on the file
record. Inspired by Rails ActiveStorage's VariantRecord and Strapi's `formats` (but normalized
into rows instead of a JSON column).

This enables queries like "find all files missing thumbnails", "sum total storage including
variants", and "delete all variants when the source is deleted".

```pseudo
table file_variants {
  id                uuid primary_key default auto_generate
  source_file_id    uuid not_null references files(id) on_delete cascade
                                                 -- The original file this variant was generated from.
                                                 -- Cascade: deleting the source removes all its variants.
  variant_key       string not_null              -- Variant identifier (e.g., "thumbnail", "small", "medium", "large", "webp").
                                                 -- String, not enum — variant requirements differ by consuming domain
                                                 -- (e-commerce needs different sizes than a CMS).
  storage_key       string unique not_null       -- Path to the variant's bytes. Separate from the source's storage key.
  mime_type         string not_null              -- May differ from source (e.g., JPEG source → WebP variant).
  width             integer nullable             -- Variant width in pixels. Null for non-image variants.
  height            integer nullable             -- Variant height in pixels. Null for non-image variants.
  size              bigint not_null              -- Variant file size in bytes.
  transform_params  json nullable               -- The transformation parameters that produced this variant.
                                                 -- e.g., {"width": 200, "height": 200, "format": "webp", "quality": 80}
                                                 -- Enables re-generation if the variant is lost.
  created_at        timestamp default now        -- Variants are immutable. No updated_at —
                                                 -- to update a variant, delete and regenerate.
}

indexes {
  unique(source_file_id, variant_key)            -- One variant per key per source file.
  -- unique(storage_key) is already created by the field constraint above.
}
```

### `file_tags`

Tag definitions for organizing files. Tags have a visibility level (public, private, system)
inspired by Nextcloud's system tags. Public tags are visible to all users. Private tags are
visible only to the creator. System tags are admin-managed and used for internal classification
(e.g., "sensitive", "archived", "auto-classified").

```pseudo
table file_tags {
  id                uuid primary_key default auto_generate
  name              string unique not_null       -- Tag name (e.g., "important", "reviewed", "needs-update").
                                                 -- Unique: prevents duplicate tag names.
  color             string nullable              -- Hex color for UI display (e.g., "#ff5733").
  visibility        enum(public, private, system) not_null default public
                                                 -- public = visible to all users.
                                                 -- private = visible only to the creator.
                                                 -- system = admin-managed, visible to all but only admins can assign.
  description       string nullable              -- Explain what this tag means or when to use it.
  created_by        uuid not_null references users(id) on_delete restrict
  created_at        timestamp default now        -- Tags are rarely updated. No updated_at.
}

indexes {
  -- unique(name) is already created by the field constraint above.
  index(visibility)                              -- "All public tags" or "all system tags."
}
```

### `file_tag_assignments`

Many-to-many join between files and tags. Tracks who applied the tag (`tagged_by`) for audit
purposes. A file can have many tags; a tag can be applied to many files.

```pseudo
table file_tag_assignments {
  id                uuid primary_key default auto_generate
  file_id           uuid not_null references files(id) on_delete cascade
                                                 -- The tagged file.
                                                 -- Cascade: deleting a file removes all its tag assignments.
  tag_id            uuid not_null references file_tags(id) on_delete cascade
                                                 -- The applied tag.
                                                 -- Cascade: deleting a tag removes all its assignments.
  tagged_by         uuid not_null references users(id) on_delete restrict
                                                 -- Who applied this tag to this file.
  created_at        timestamp default now
}

indexes {
  unique(file_id, tag_id)                        -- A tag can only be applied once per file.
  index(tag_id)                                  -- "All files with this tag."
  index(tagged_by)                               -- "All tags applied by this user."
}
```

### `file_metadata_fields`

Custom metadata field definitions with type information. Inspired by Mayan EDMS's MetadataType
and Box's metadata templates. Each field defines a key, a display label, a type (for application-
level validation), and optional constraints. Values are stored in `file_metadata_values` as text —
the `field_type` guides validation, not storage.

This approach is the most portable across all 7 schema formats. SpacetimeDB and Convex lack the
column-per-type flexibility of PostgreSQL, so storing all values as text with type metadata
alongside is the pragmatic choice.

```pseudo
table file_metadata_fields {
  id                uuid primary_key default auto_generate
  name              string unique not_null       -- Machine-readable key (e.g., "invoice_number", "project_code").
                                                 -- Used in API requests and code.
  label             string not_null              -- Human-readable display name (e.g., "Invoice Number", "Project Code").
                                                 -- Shown in UI forms and metadata panels.
  field_type        enum(string, integer, float, boolean, date, url, select) not_null
                                                 -- Determines validation rules applied at the application layer.
                                                 -- string = free text. integer/float = numeric validation.
                                                 -- boolean = true/false. date = ISO 8601 date string.
                                                 -- url = URL format validation. select = must match an options[] value.
  description       string nullable              -- Explain what this field is for or how to fill it in.
  is_required       boolean not_null default false
                                                 -- If true, every file must have a value for this field.
                                                 -- Enforced at the application layer, not as a DB constraint.
  default_value     string nullable              -- Default value for new files. Stored as text, same as values.
  options           json nullable                -- For select-type fields: array of valid values.
                                                 -- e.g., ["low", "medium", "high"] or ["draft", "final", "archived"].
                                                 -- Null for non-select types.
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  -- unique(name) is already created by the field constraint above.
}
```

### `file_metadata_values`

Custom metadata values per file. Each row stores one field's value for one file. All values
are stored as text — the corresponding `file_metadata_fields.field_type` determines how the
application validates and displays the value. Inspired by Mayan EDMS's DocumentMetadata model.

```pseudo
table file_metadata_values {
  id                uuid primary_key default auto_generate
  file_id           uuid not_null references files(id) on_delete cascade
                                                 -- The file this metadata belongs to.
                                                 -- Cascade: deleting a file removes all its metadata values.
  field_id          uuid not_null references file_metadata_fields(id) on_delete cascade
                                                 -- Which metadata field this value is for.
                                                 -- Cascade: deleting a field definition removes all its values.
  value             string nullable              -- The actual value, stored as text regardless of field_type.
                                                 -- Application validates against field_type before saving.
                                                 -- Nullable: a value row with null means "explicitly empty".
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  unique(file_id, field_id)                      -- One value per field per file.
  index(field_id, value)                         -- "All files where invoice_number = 'INV-2024-001'."
}
```

### `file_shares`

Direct access grants to specific users, groups, or organizations. One row per share. The
`target_type` discriminator determines whether a file or folder is being shared. Roles follow a
simplified version of Google Drive's permission model (6 roles → 4). Supports expiration, optional
reshare permission, and an acceptance workflow (`accepted_at`).

Inspired by Nextcloud's unified `oc_share` table (for the target/recipient polymorphism) and
Google Drive's permissions API (for the role model).

```pseudo
table file_shares {
  id                uuid primary_key default auto_generate

  -- What is being shared. Exactly one of target_file_id or target_folder_id must be set.
  target_type       enum(file, folder) not_null  -- Discriminator for which FK is populated.
  target_file_id    uuid nullable references files(id) on_delete cascade
                                                 -- Populated when target_type = 'file'.
                                                 -- Cascade: deleting the file removes all its shares.
  target_folder_id  uuid nullable references folders(id) on_delete cascade
                                                 -- Populated when target_type = 'folder'.
                                                 -- Cascade: deleting the folder removes all its shares.

  shared_by         uuid not_null references users(id) on_delete restrict
                                                 -- Who created this share. Not necessarily the file owner —
                                                 -- could be someone with reshare permission.
                                                 -- Restrict: don't delete users who have active shares.

  -- Who the share is granted to. The shared_with_id references different tables depending on type:
  --   user → users.id, group → teams.id (from auth-rbac), organization → organizations.id
  shared_with_type  enum(user, group, organization) not_null
  shared_with_id    uuid not_null                -- Not a FK — target depends on shared_with_type.

  role              enum(viewer, commenter, editor, co_owner) not_null
                                                 -- viewer = read-only access.
                                                 -- commenter = read + comment.
                                                 -- editor = read + write + comment.
                                                 -- co_owner = full control (manage shares, delete, etc.).
  allow_reshare     boolean not_null default false
                                                 -- Whether the recipient can share this item with others.
                                                 -- Inspired by Nextcloud's share permission bit.
  expires_at        timestamp nullable           -- When this share expires. Null = never expires.
  accepted_at       timestamp nullable           -- When the recipient accepted the share. Null = pending.
                                                 -- Enables a "Shared with you" inbox with accept/decline.
  message           string nullable              -- Optional message to the recipient (e.g., "Please review this doc").
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  index(target_type, target_file_id)             -- "All shares for this file."
  index(target_type, target_folder_id)           -- "All shares for this folder."
  index(shared_with_type, shared_with_id)        -- "All items shared with this user/group."
  index(shared_by)                               -- "All shares created by this user."
  index(expires_at)                              -- Cleanup job: find and revoke expired shares.
}
```

### `file_share_links`

URL-based sharing with optional password protection, expiry, and download tracking. Link shares are
distinct from direct shares — they use a token for access instead of a user identity, and they
track download counts. A single file or folder can have multiple active links with different
permissions and scopes.

Inspired by Nextcloud (token-based share links), Microsoft OneDrive (scope: anonymous/organization/
specific_users), and Box (password + download_count).

```pseudo
table file_share_links {
  id                uuid primary_key default auto_generate

  -- What the link accesses. Same pattern as file_shares.
  target_type       enum(file, folder) not_null
  target_file_id    uuid nullable references files(id) on_delete cascade
  target_folder_id  uuid nullable references folders(id) on_delete cascade

  created_by        uuid not_null references users(id) on_delete restrict
                                                 -- Who created this link.

  token             string unique not_null       -- URL-safe token for the share link (e.g., "abc123xyz").
                                                 -- Used in share URLs: /s/{token}
                                                 -- Generate with a cryptographically secure random string.
  scope             enum(anyone, organization, specific_users) not_null default anyone
                                                 -- anyone = anyone with the link can access (anonymous).
                                                 -- organization = only members of the creator's org can access.
                                                 -- specific_users = only pre-approved users can access.
  permission        enum(view, download, edit, upload) not_null default view
                                                 -- view = preview only, no download.
                                                 -- download = preview + download.
                                                 -- edit = preview + download + modify.
                                                 -- upload = for folders: recipients can add files (like Seafile upload links).
  password_hash     string nullable              -- Hashed password for password-protected links.
                                                 -- Null = no password required.
                                                 -- Hash with bcrypt/argon2, same as user passwords.
  expires_at        timestamp nullable           -- When the link expires. Null = never expires.
  max_downloads     integer nullable             -- Maximum number of downloads allowed. Null = unlimited.
  download_count    integer not_null default 0   -- How many times the link has been used to download.
                                                 -- Increment atomically on each download.
  name              string nullable              -- Human-readable name for the link (e.g., "Client review link").
                                                 -- Helps manage multiple links for the same file.
  is_active         boolean not_null default true -- Disable a link without deleting it. Useful for temporary suspension.
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  -- unique(token) is already created by the field constraint above.
  index(target_type, target_file_id)             -- "All share links for this file."
  index(target_type, target_folder_id)           -- "All share links for this folder."
  index(created_by)                              -- "All share links created by this user."
  index(expires_at)                              -- Cleanup job: find and deactivate expired links.
}
```

### `multipart_uploads`

Resumable upload session tracking. Models the lifecycle of a file upload from initiation to
completion or expiry. Supports single-part, multipart (S3-style), and resumable (tus protocol)
uploads. This is a relational approach to upload tracking — inspired by Supabase Storage's
`s3_multipart_uploads` table, which is the only production system we found that models upload
state in SQL rather than in memory or object storage.

Benefits of relational upload tracking: query stale uploads for cleanup, track progress in SQL,
apply RLS/permission checks, and account for in-progress quota usage.

```pseudo
table multipart_uploads {
  id                uuid primary_key default auto_generate
  bucket_id         uuid not_null references storage_buckets(id) on_delete cascade
                                                 -- Target bucket for the upload.
                                                 -- Cascade: deleting a bucket cancels all its pending uploads.
  storage_key       string not_null              -- Intended storage path for the completed file.
                                                 -- Becomes the file's storage_key on completion.
  filename          string not_null              -- Intended filename for the completed file.
  mime_type         string nullable              -- Expected MIME type. Nullable: may not be known at initiation.
  total_size        bigint nullable              -- Expected total size in bytes. Nullable: tus supports
                                                 -- Upload-Defer-Length where size is unknown at start.
  uploaded_size     bigint not_null default 0    -- Bytes received so far. Updated as parts arrive.
                                                 -- Progress = uploaded_size / total_size.
  part_count        integer not_null default 0   -- Number of parts received so far.

  status            enum(in_progress, completing, completed, aborted, expired) not_null default in_progress
                                                 -- in_progress = actively receiving parts.
                                                 -- completing = all parts received, assembling final file.
                                                 -- completed = file assembled and file record created.
                                                 -- aborted = explicitly canceled by user or system.
                                                 -- expired = server-side timeout reached.
  upload_type       enum(single, multipart, resumable) not_null default single
                                                 -- single = standard single-request upload.
                                                 -- multipart = S3-style multipart (parts uploaded in parallel).
                                                 -- resumable = tus-style resumable (sequential with offset tracking).
  metadata          json nullable default {}     -- Upload metadata key-value pairs from the client.
                                                 -- tus: Upload-Metadata header. S3: x-amz-meta-* headers.
  initiated_by      uuid not_null references users(id) on_delete restrict
                                                 -- Who started the upload.
  expires_at        timestamp not_null           -- Server-set expiry for cleanup. Uploads not completed by this time
                                                 -- are marked as expired and their parts are cleaned up.
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  index(bucket_id, status)                       -- "All in-progress uploads in this bucket."
  index(initiated_by)                            -- "All uploads by this user."
  index(expires_at, status)                      -- Cleanup job: "expired uploads still marked in_progress."
  index(status)                                  -- "All uploads in a given state" (monitoring dashboard).
}
```

### `multipart_upload_parts`

Individual parts of a multipart or resumable upload. Each part is a chunk of bytes with its own
checksum and storage location. Parts are assembled into the final file when the upload completes.
Cascade-deleted when the parent upload is removed.

Inspired by Supabase Storage's `s3_multipart_uploads_parts` table and S3's ListParts API.

```pseudo
table multipart_upload_parts {
  id                uuid primary_key default auto_generate
  upload_id         uuid not_null references multipart_uploads(id) on_delete cascade
                                                 -- The upload session this part belongs to.
                                                 -- Cascade: aborting/deleting an upload removes all its parts.
  part_number       integer not_null             -- 1-based ordering. Parts are assembled in part_number order.
  size              bigint not_null              -- This part's size in bytes.
  checksum          string nullable              -- Per-part integrity hash (e.g., MD5, CRC32).
                                                 -- Used to verify each part independently.
                                                 -- S3 returns this as the part's ETag.
  storage_key       string not_null              -- Temporary storage location for this part.
                                                 -- Cleaned up after assembly into the final file.
  created_at        timestamp default now
}

indexes {
  unique(upload_id, part_number)                 -- Part numbers are unique within an upload.
}
```

### `file_comments`

Threaded comments on files. Supports nested replies via `parent_id` self-reference. Comments can
be marked as resolved (for review workflows). Inspired by Google Drive comments/replies and
Nextcloud's comment system. Only files can be commented on — folder-level discussions are out of
scope.

```pseudo
table file_comments {
  id                uuid primary_key default auto_generate
  file_id           uuid not_null references files(id) on_delete cascade
                                                 -- The file being commented on.
                                                 -- Cascade: deleting a file removes all its comments.
  parent_id         uuid nullable references file_comments(id) on_delete cascade
                                                 -- Parent comment for threaded replies. Null = top-level comment.
                                                 -- Cascade: deleting a parent removes all its replies.
  author_id         uuid not_null references users(id) on_delete restrict
                                                 -- Who wrote this comment.
  body              string not_null              -- Comment text. Supports plain text or markdown
                                                 -- depending on the application.
  is_resolved       boolean not_null default false
                                                 -- Whether this comment thread is resolved.
                                                 -- Typically set on top-level comments; replies inherit.
  created_at        timestamp default now
  updated_at        timestamp default now on_update
                                                 -- Comments can be edited. updated_at tracks the last edit time.
}

indexes {
  index(file_id, created_at)                     -- "All comments on this file, chronological."
  index(parent_id)                               -- "All replies to this comment."
  index(author_id)                               -- "All comments by this user."
}
```

### `file_locks`

Collaborative file locking to prevent concurrent edits. At most one lock per file (enforced by
unique constraint on `file_id`). The `lock_type` indicates the lock's mode: exclusive (only the
lock holder can edit) or shared (cooperative read-only — signals that the file should not be
modified). Only one lock record exists per file regardless of type; the lock_type is a mode
indicator, not a multi-holder mechanism. Locks can expire automatically or be held until manually
released.

Inspired by Seafile's file locking, Box's lock API, and Nextcloud's lock levels.

```pseudo
table file_locks {
  id                uuid primary_key default auto_generate
  file_id           uuid unique not_null references files(id) on_delete cascade
                                                 -- The locked file. UNIQUE: only one lock per file at a time.
                                                 -- Cascade: deleting a file releases its lock.
  locked_by         uuid not_null references users(id) on_delete cascade
                                                 -- Who holds the lock.
                                                 -- Cascade: deleting a user releases their locks.
  lock_type         enum(exclusive, shared) not_null default exclusive
                                                 -- exclusive = only the lock holder can edit. Others are blocked.
                                                 -- shared = cooperative read-only mode. Signals "do not modify"
                                                 --          (e.g., file under review). One record per file either way.
  reason            string nullable              -- Why the file is locked (e.g., "Editing in Word", "Under review").
  expires_at        timestamp nullable           -- When the lock automatically expires. Null = indefinite
                                                 -- (until manually unlocked). Use expiry to prevent abandoned locks.
  created_at        timestamp default now        -- Locks are short-lived. No updated_at — to extend a lock,
                                                 -- release and re-acquire.
}

indexes {
  -- unique(file_id) is already created by the field constraint above.
  index(locked_by)                               -- "All files locked by this user."
  index(expires_at)                              -- Cleanup job: find and release expired locks.
}
```

### `file_activities`

Audit trail for file and folder operations. Append-only log — rows are never updated or deleted.
Each record captures who did what, to which file/folder, and contextual details. The `target_name`
is denormalized so the audit trail remains readable even after the target file is permanently
deleted.

Scoped exclusively to file/folder operations. For notifications triggered by file activities,
see the [Notifications System](../notifications-system) domain.

```pseudo
table file_activities {
  id                uuid primary_key default auto_generate
  actor_id          uuid not_null references users(id) on_delete restrict
                                                 -- Who performed the action.
                                                 -- Restrict: don't delete users who have audit trail entries.
  action            enum(created, uploaded, updated, renamed, moved, copied, deleted, restored,
                         shared, unshared, downloaded, locked, unlocked, commented, version_created) not_null
                                                 -- created = new file or folder created.
                                                 -- uploaded = file bytes uploaded (initial upload).
                                                 -- updated = file content replaced (new version or overwrite).
                                                 -- renamed = name changed.
                                                 -- moved = moved to a different folder.
                                                 -- copied = duplicated to a new location.
                                                 -- deleted = moved to trash (soft delete).
                                                 -- restored = restored from trash.
                                                 -- shared/unshared = share created or revoked.
                                                 -- downloaded = file downloaded by a user.
                                                 -- locked/unlocked = file lock acquired or released.
                                                 -- commented = comment added to file.
                                                 -- version_created = new version uploaded.

  target_type       enum(file, folder) not_null  -- Whether the action was on a file or folder.
  target_id         uuid not_null                -- The file or folder ID. Not a FK — target may be permanently deleted.
  target_name       string not_null              -- Denormalized: file/folder name at the time of the action.
                                                 -- Preserved after deletion so the audit trail is always readable.

  details           json nullable                -- Action-specific context. Examples:
                                                 -- moved: {"from_folder_id": "...", "to_folder_id": "...", "from_path": "...", "to_path": "..."}
                                                 -- renamed: {"old_name": "...", "new_name": "..."}
                                                 -- shared: {"shared_with": "user@example.com", "role": "editor"}
                                                 -- version_created: {"version_number": 3, "size": 1048576}
  ip_address        string nullable              -- Client IP address for security audit.
  created_at        timestamp default now        -- Activities are immutable (append-only). No updated_at.
}

indexes {
  index(actor_id)                                -- "All actions by this user."
  index(target_type, target_id)                  -- "All activity for this file/folder."
  index(action)                                  -- "All download events" or "all share events."
  index(created_at)                              -- Time-range queries and retention cleanup.
}
```

### `file_favorites`

Per-user file bookmarks (stars). A simple join table that enables "starred files" UIs. Each user
can favorite any file exactly once. Inspired by Google Drive's starred feature.

```pseudo
table file_favorites {
  id                uuid primary_key default auto_generate
  user_id           uuid not_null references users(id) on_delete cascade
                                                 -- Who favorited the file.
                                                 -- Cascade: deleting a user removes all their favorites.
  file_id           uuid not_null references files(id) on_delete cascade
                                                 -- The favorited file.
                                                 -- Cascade: deleting a file removes all its favorites.
  created_at        timestamp default now
}

indexes {
  unique(user_id, file_id)                       -- A user can favorite a file only once.
  index(file_id)                                 -- "How many users favorited this file?"
}
```

## Relationships

### One-to-Many

- `storage_buckets` → `folders` (a bucket contains many folders)
- `storage_buckets` → `files` (a bucket contains many files)
- `storage_buckets` → `multipart_uploads` (a bucket has many pending uploads)
- `folders` → `folders` (a folder has many child folders, via `parent_id`)
- `folders` → `files` (a folder contains many files)
- `folders` → `file_shortcuts` (a folder contains many shortcuts, via `folder_id`)
- `files` → `file_shortcuts` (a file is the target of many shortcuts, via `target_file_id`)
- `folders` → `file_shortcuts` (a folder is the target of many shortcuts, via `target_folder_id`)
- `files` → `file_versions` (a file has many versions)
- `files` → `file_attachments` (a file has many attachment records across entities)
- `files` → `file_variants` (a file has many derived variants)
- `files` → `file_tag_assignments` (a file has many tag assignments)
- `files` → `file_metadata_values` (a file has many custom metadata values)
- `files` → `file_shares` (a file has many direct shares)
- `files` → `file_share_links` (a file has many share links)
- `files` → `file_comments` (a file has many comments)
- `files` → `file_favorites` (a file is favorited by many users)
- `folders` → `file_shares` (a folder has many direct shares)
- `folders` → `file_share_links` (a folder has many share links)
- `file_comments` → `file_comments` (a comment has many replies, via `parent_id`)
- `file_tags` → `file_tag_assignments` (a tag is applied to many files)
- `file_metadata_fields` → `file_metadata_values` (a field has many values across files)
- `multipart_uploads` → `multipart_upload_parts` (an upload has many parts)
- `users` → `storage_buckets` (a user creates many buckets, via `created_by`)
- `users` → `folders` (a user creates many folders, via `created_by`)
- `users` → `files` (a user uploads many files, via `uploaded_by`)
- `users` → `file_versions` (a user creates many versions, via `created_by`)
- `users` → `file_shortcuts` (a user creates many shortcuts, via `created_by`)
- `users` → `file_tags` (a user creates many tags, via `created_by`)
- `users` → `file_tag_assignments` (a user tags many files, via `tagged_by`)
- `users` → `file_shares` (a user creates many shares, via `shared_by`)
- `users` → `file_share_links` (a user creates many share links, via `created_by`)
- `users` → `file_comments` (a user writes many comments, via `author_id`)
- `users` → `file_locks` (a user holds many locks, via `locked_by`)
- `users` → `file_activities` (a user performs many actions, via `actor_id`)
- `users` → `file_favorites` (a user has many favorites)
- `users` → `multipart_uploads` (a user initiates many uploads, via `initiated_by`)

### One-to-One

- `files` → `file_locks` (a file has at most one active lock)
- `files` → `file_versions` (a file has one current version, via `current_version_id`)

### Many-to-Many (via junction tables)

- `files` ↔ `file_tags` (through `file_tag_assignments`)
- `files` ↔ `file_metadata_fields` (through `file_metadata_values`)

## Best Practices

- **Separate storage key from display name** — The path to bytes in the storage backend (`storage_key`) must be distinct from the user-facing filename (`name`). Users rename files constantly; the storage key should be immutable (UUID-based). Every production system (S3, ActiveStorage, Supabase, Cloudinary) does this.
- **Store checksums on upload** — SHA-256 is the modern standard (Google Drive, Dropbox). Checksums enable: duplicate detection, integrity verification, resume-after-failure, and content-addressable deduplication.
- **Never store file bytes in the database** — The database stores metadata; an object store (S3, GCS, local filesystem) stores bytes. The `storage_key` column bridges them.
- **Always support trash before permanent delete** — No production file system hard-deletes immediately. Soft delete with `deleted_at` + `original_folder_id` is the minimum for a restorable trash UX.
- **Use materialized path for folder hierarchy** — Three independent systems (Nextcloud, Strapi, Supabase) converged on this approach. Use folder IDs as path segments (not names) so folder renames don't cascade path updates.
- **Make file attachments polymorphic** — The `file_attachments` table with `record_type`/`record_id`/`name` lets any domain attach files without schema changes. This is the primary integration point for consuming domains.
- **Track upload progress relationally** — Supabase is the only system that models multipart uploads as SQL tables. This enables querying stale uploads for cleanup, quota accounting during upload, and permission checks on in-progress uploads.
- **Separate direct shares from link shares** — They have fundamentally different fields (user/role vs token/password/download_count). Two tables with clean semantics beats one table with conditional NULLs.
- **Index for common access patterns** — `(bucket_id, folder_id)` for directory listing, `(uploaded_by)` for "my files", `(deleted_at)` for excluding trashed files, `(checksum_sha256)` for dedup, `(record_type, record_id, name)` for attachment lookups.
- **Cascade deletes from containers** — Deleting a bucket cascades to its files and folders. Deleting a folder cascades to child folders. But user deletes use restrict — don't destroy file metadata when an admin account is removed.
- **Denormalize target_name in activities** — When a file is permanently deleted, the activity record loses its join target. Store `target_name` so the audit trail remains readable.

## Formats

Each table is a separate file within each format folder:

| Format      | Directory                        | Status  |
| ----------- | -------------------------------- | ------- |
| Convex      | [`convex/`](./convex/)           | ✅      |
| SQL         | [`sql/`](./sql/)                 | ✅      |
| Prisma      | [`prisma/`](./prisma/)           | ✅      |
| MongoDB     | [`mongodb/`](./mongodb/)         | ✅      |
| Drizzle     | [`drizzle/`](./drizzle/)         | ✅      |
| SpacetimeDB | [`spacetimedb/`](./spacetimedb/) | ✅      |
| Firebase    | [`firebase/`](./firebase/)       | ✅      |
