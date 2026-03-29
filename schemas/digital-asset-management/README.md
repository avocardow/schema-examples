# Digital Asset Management

> Workspaces, assets with rich metadata, version history, renditions, collections, tagging, custom metadata schemas, licensing/rights management, collaboration, sharing, and download presets for creative and brand asset workflows.

## Overview

A complete digital asset management (DAM) schema covering the full lifecycle of creative and brand assets — from upload and organization through metadata enrichment, rights tracking, collaboration, and distribution. Designed after studying Cloudinary, Adobe Experience Manager, ResourceSpace, Canto, Bynder, Brandfolder, Frontify, Widen Collective, MediaValet, and Pimcore.

DAM extends beyond basic file storage by treating assets as first-class business objects with rich metadata, lifecycle state, rights management, and distribution semantics. The schema centers on **workspaces** as top-level containers for multi-team/brand isolation, with assets organized in folders (hierarchical) and collections (curated groupings). Every asset supports version history and auto-generated renditions (thumbnails, previews, web-optimized variants).

Key design decisions:
- **Custom metadata via EAV pattern** — `metadata_schemas` defines typed fields (text, number, date, enum) per workspace; `metadata_values` stores per-asset values. This is the defining DAM feature over generic file storage, enabling each workspace to configure asset-type-specific metadata without schema changes.
- **Renditions as a dedicated table** — generated derivatives (thumbnail, preview, different resolutions) are stored alongside the source asset with their own file properties, following the Cloudinary/AEM pattern. Renditions are auto-generated on upload or on-demand.
- **Licensing with expiry** — `licenses` defines reusable rights templates; `asset_licenses` assigns them to assets with effective/expiry dates and territory/channel restrictions. Prevents publishing expired-rights assets.
- **Collections independent of folders** — curated groupings that cross-cut the folder hierarchy, following Cloudinary and Bynder's proven pattern. An asset can appear in multiple collections while living in one folder.
- **Threaded comments** — self-referencing `parent_id` enables comment threads for asset review and feedback workflows.
- **Append-only activity log** — every significant asset event (upload, download, metadata change, share) is logged for compliance and analytics.

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (18 tables)</summary>

- [`workspaces`](#1-workspaces)
- [`folders`](#2-folders)
- [`assets`](#3-assets)
- [`asset_versions`](#4-asset_versions)
- [`renditions`](#5-renditions)
- [`collections`](#6-collections)
- [`collection_assets`](#7-collection_assets)
- [`tags`](#8-tags)
- [`asset_tags`](#9-asset_tags)
- [`metadata_schemas`](#10-metadata_schemas)
- [`metadata_values`](#11-metadata_values)
- [`licenses`](#12-licenses)
- [`asset_licenses`](#13-asset_licenses)
- [`comments`](#14-comments)
- [`download_presets`](#15-download_presets)
- [`share_links`](#16-share_links)
- [`asset_downloads`](#17-asset_downloads)
- [`asset_activities`](#18-asset_activities)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users` | User identity for ownership, uploads, comments, shares, and all actor references |

## Tables

### Organization
- `workspaces` — Top-level containers for multi-team/brand isolation with storage quotas
- `folders` — Hierarchical folder tree within workspaces using materialized path

### Core Assets
- `assets` — Central asset entity with file properties, lifecycle status, and ownership
- `asset_versions` — Version history tracking with storage references and changelogs
- `renditions` — Auto-generated derivatives (thumbnails, previews, web-optimized variants)

### Organization & Discovery
- `collections` — Curated non-hierarchical groupings of assets
- `collection_assets` — Junction table linking assets to collections with ordering
- `tags` — Workspace-scoped taxonomy terms for categorization
- `asset_tags` — Junction table linking tags to assets

### Metadata
- `metadata_schemas` — Configurable typed metadata field definitions per workspace
- `metadata_values` — Per-asset values for custom metadata fields (EAV pattern)

### Rights & Licensing
- `licenses` — Reusable license/rights template definitions
- `asset_licenses` — License assignments to assets with effective/expiry dates and restrictions

### Collaboration
- `comments` — Threaded comments on assets for review and feedback

### Distribution
- `download_presets` — Pre-configured export/transformation settings
- `share_links` — External sharing links with password, expiry, and permission controls
- `asset_downloads` — Download audit trail for compliance and analytics

### Operations
- `asset_activities` — Append-only activity log for all asset lifecycle events

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. workspaces

Top-level organizational containers for multi-team or multi-brand isolation. Every asset, folder, collection, tag, and metadata schema belongs to exactly one workspace. Inspired by Bynder's brand portals and Brandfolder's brandfolders.

```pseudo
table workspaces {
  id                uuid primary_key default auto_generate
  name              string not_null              -- Display name (e.g., "Marketing Team", "Brand Assets").
  slug              string unique not_null        -- URL-friendly identifier. Used in API paths.
  description       string nullable              -- Purpose or scope of this workspace.
  logo_url          string nullable              -- Workspace branding logo URL.
  storage_limit_bytes bigint nullable            -- Maximum storage allowed. Null = unlimited.
  storage_used_bytes bigint not_null default 0   -- Cached total storage consumed. Updated on upload/delete.
  created_by        uuid not_null references users(id) on_delete restrict
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  -- unique(slug) covered by field constraint.
}
```

**Design notes:**
- Storage tracking is cached — recompute periodically via background jobs.
- `restrict` on `created_by` prevents deleting users who own workspaces.

### 2. folders

Hierarchical folder tree within workspaces using parent_id plus materialized path for efficient subtree queries. Assets belong to exactly one folder (or workspace root if no folder). Path uses folder UUIDs as segments so renames don't cascade path updates.

```pseudo
table folders {
  id                uuid primary_key default auto_generate
  workspace_id      uuid not_null references workspaces(id) on_delete cascade
  parent_id         uuid nullable references folders(id) on_delete cascade
  name              string not_null              -- Display name (e.g., "Campaign Q4", "Logos").
  path              string not_null              -- Materialized path using folder UUIDs (e.g., "/abc/def/").
  depth             integer not_null default 0   -- Hierarchy level. 0 = root.
  description       string nullable
  created_by        uuid not_null references users(id) on_delete restrict
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  unique(workspace_id, path)                     -- Path unique within workspace.
  unique(workspace_id, parent_id, name)          -- Folder name unique within parent.
  index(parent_id)                               -- Children listing.
  index(workspace_id, depth)                     -- Root folders in workspace (depth=0).
}
```

### 3. assets

The core digital asset entity — metadata about a stored file treated as a first-class business object. Unlike generic file storage, assets carry lifecycle status, asset type classification, description, rating, and rich organizational context. Every asset belongs to one workspace and optionally one folder.

```pseudo
table assets {
  id                uuid primary_key default auto_generate
  workspace_id      uuid not_null references workspaces(id) on_delete cascade
  folder_id         uuid nullable references folders(id) on_delete set_null

  -- Identity
  name              string not_null              -- Display name. Can be renamed without affecting storage.
  original_filename string not_null              -- Filename at upload time. Preserved for audit.
  description       string nullable              -- Rich description for search and context.

  -- File properties
  storage_key       string unique not_null        -- Path/key to bytes in storage backend. Immutable.
  mime_type         string not_null              -- MIME type (e.g., "image/png", "video/mp4").
  file_size         bigint not_null              -- File size in bytes. BIGINT for files >2GB.
  file_extension    string not_null              -- Normalized extension (e.g., "png", "pdf").

  -- Classification
  asset_type        enum(image, video, audio, document, font, archive, other) not_null
  status            enum(draft, active, archived, expired) not_null default draft

  -- Versioning
  current_version_id uuid nullable references asset_versions(id) on_delete set_null
  version_count     integer not_null default 1

  -- Extracted metadata (auto-populated from file analysis)
  width             integer nullable             -- Image/video width in pixels.
  height            integer nullable             -- Image/video height in pixels.
  duration_seconds  decimal nullable             -- Audio/video duration.
  color_space       string nullable              -- e.g., "sRGB", "CMYK".
  dpi               integer nullable             -- Resolution for print assets.

  -- Ownership and audit
  uploaded_by       uuid not_null references users(id) on_delete restrict
  checksum_sha256   string nullable              -- Content hash for duplicate detection.

  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  index(workspace_id, folder_id)                 -- Directory listing within workspace.
  index(workspace_id, asset_type)                -- Filter by type within workspace.
  index(workspace_id, status)                    -- Filter by status within workspace.
  index(uploaded_by)                             -- "My uploads" query.
  index(mime_type)                               -- Type-based filtering.
  -- unique(storage_key) covered by field constraint.
}
```

**Design notes:**
- Extracted metadata fields (width, height, duration, color_space, dpi) are nullable because they only apply to certain asset types.
- `current_version_id` creates a circular reference with `asset_versions` — handle per format conventions.
- `checksum_sha256` enables duplicate detection across the workspace.

### 4. asset_versions

Version history for assets. Each new upload of an asset creates a version record preserving the previous file state. The parent asset's `current_version_id` points to the active version.

```pseudo
table asset_versions {
  id                uuid primary_key default auto_generate
  asset_id          uuid not_null references assets(id) on_delete cascade
  version_number    integer not_null             -- Sequential: 1, 2, 3, ...
  storage_key       string not_null              -- Path to this version's bytes. Immutable.
  mime_type         string not_null
  file_size         bigint not_null
  file_extension    string not_null
  checksum_sha256   string nullable
  change_summary    string nullable              -- What changed in this version.
  created_by        uuid not_null references users(id) on_delete restrict
  created_at        timestamp default now
}

indexes {
  unique(asset_id, version_number)               -- Version numbers unique per asset.
  -- composite_unique(asset_id, version_number) covers index(asset_id) via leading column.
}
```

**Design notes:**
- No `updated_at` — versions are immutable once created.
- `version_number` is sequential per asset, not global.

### 5. renditions

Auto-generated derivatives of assets — thumbnails, previews, web-optimized variants at different resolutions. Each rendition has its own file properties and storage location. Inspired by Cloudinary transformations and AEM rendition profiles.

```pseudo
table renditions {
  id                uuid primary_key default auto_generate
  asset_id          uuid not_null references assets(id) on_delete cascade
  preset_name       string not_null              -- Identifier for the rendition type (e.g., "thumbnail", "preview", "web_large").
  storage_key       string not_null              -- Path to rendition bytes.
  mime_type         string not_null
  file_size         bigint not_null
  width             integer nullable             -- Output width in pixels.
  height            integer nullable             -- Output height in pixels.
  format            string not_null              -- Output format (e.g., "webp", "jpg", "mp4").
  created_at        timestamp default now
}

indexes {
  unique(asset_id, preset_name)                  -- One rendition per preset per asset.
  -- composite_unique(asset_id, preset_name) covers index(asset_id) via leading column.
}
```

**Design notes:**
- No `updated_at` — renditions are regenerated (delete + insert), not updated in place.
- `preset_name` links to conceptual presets — the `download_presets` table defines user-facing presets, while rendition preset_name can also include system-generated types like "thumbnail".

### 6. collections

Curated non-hierarchical groupings of assets that cross-cut the folder structure. An asset can appear in multiple collections. Collections support ordering for editorial/presentation use cases. Inspired by Cloudinary collections and ResourceSpace collections.

```pseudo
table collections {
  id                uuid primary_key default auto_generate
  workspace_id      uuid not_null references workspaces(id) on_delete cascade
  name              string not_null
  description       string nullable
  cover_asset_id    uuid nullable references assets(id) on_delete set_null
  is_public         boolean not_null default false -- Whether the collection is visible to all workspace members.
  asset_count       integer not_null default 0   -- Cached count. Updated on add/remove.
  created_by        uuid not_null references users(id) on_delete restrict
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  index(workspace_id)
  index(created_by)
}
```

### 7. collection_assets

Junction table linking assets to collections with explicit ordering.

```pseudo
table collection_assets {
  id                uuid primary_key default auto_generate
  collection_id     uuid not_null references collections(id) on_delete cascade
  asset_id          uuid not_null references assets(id) on_delete cascade
  position          integer not_null default 0   -- Sort order within the collection.
  added_by          uuid not_null references users(id) on_delete restrict
  added_at          timestamp default now
}

indexes {
  unique(collection_id, asset_id)                -- Asset appears once per collection.
  -- composite_unique(collection_id, asset_id) covers index(collection_id) via leading column.
  index(asset_id)                                -- "Which collections is this asset in?"
}
```

**Design notes:**
- No `updated_at` — only `position` changes; the junction is effectively add/remove/reorder.

### 8. tags

Workspace-scoped taxonomy terms for flat categorization of assets. Tags are reusable within a workspace and assigned to assets via the `asset_tags` junction table.

```pseudo
table tags {
  id                uuid primary_key default auto_generate
  workspace_id      uuid not_null references workspaces(id) on_delete cascade
  name              string not_null              -- Tag display name (e.g., "summer-campaign", "approved").
  created_at        timestamp default now
}

indexes {
  unique(workspace_id, name)                     -- Tag names unique within workspace.
  -- composite_unique(workspace_id, name) covers index(workspace_id) via leading column.
}
```

### 9. asset_tags

Junction table linking tags to assets.

```pseudo
table asset_tags {
  id                uuid primary_key default auto_generate
  asset_id          uuid not_null references assets(id) on_delete cascade
  tag_id            uuid not_null references tags(id) on_delete cascade
  assigned_by       uuid not_null references users(id) on_delete restrict
  assigned_at       timestamp default now
}

indexes {
  unique(asset_id, tag_id)                       -- A tag applied once per asset.
  -- composite_unique(asset_id, tag_id) covers index(asset_id) via leading column.
  index(tag_id)                                  -- "All assets with this tag."
}
```

### 10. metadata_schemas

Configurable typed metadata field definitions per workspace. Each schema entry defines a custom field that can be filled per-asset. This EAV pattern enables workspace admins to configure asset-type-specific metadata without schema changes. Inspired by Cloudinary structured metadata, AEM metadata schemas, and ResourceSpace resource_type_fields.

```pseudo
table metadata_schemas {
  id                uuid primary_key default auto_generate
  workspace_id      uuid not_null references workspaces(id) on_delete cascade
  field_name        string not_null              -- Machine-readable name (e.g., "copyright_owner").
  field_label       string not_null              -- Human-readable label (e.g., "Copyright Owner").
  field_type        enum(text, number, date, boolean, single_select, multi_select) not_null
  options           json nullable                -- For single_select/multi_select: list of allowed values.
  is_required       boolean not_null default false
  display_order     integer not_null default 0   -- UI ordering.
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  unique(workspace_id, field_name)               -- Field names unique within workspace.
  -- composite_unique(workspace_id, field_name) covers index(workspace_id) via leading column.
}
```

**Design notes:**
- `options` is JSON for select fields — e.g., `["Red", "Blue", "Green"]`. Null for non-select types.
- `field_type` determines validation logic in the application layer.

### 11. metadata_values

Per-asset values for custom metadata fields. One row per asset-field combination (EAV value table). All values stored as strings — the application interprets based on the field's `field_type`.

```pseudo
table metadata_values {
  id                uuid primary_key default auto_generate
  asset_id          uuid not_null references assets(id) on_delete cascade
  schema_id         uuid not_null references metadata_schemas(id) on_delete cascade
  value             string not_null              -- Stored as string. App interprets per field_type.
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  unique(asset_id, schema_id)                    -- One value per field per asset.
  -- composite_unique(asset_id, schema_id) covers index(asset_id) via leading column.
  index(schema_id)                               -- "All values for this field across assets."
}
```

### 12. licenses

Reusable license/rights template definitions. A license describes usage terms that can be assigned to multiple assets. Inspired by Widen's usage rights and Bynder's rights management.

```pseudo
table licenses {
  id                uuid primary_key default auto_generate
  workspace_id      uuid not_null references workspaces(id) on_delete cascade
  name              string not_null              -- License name (e.g., "Getty Standard", "Internal Use Only").
  description       string nullable              -- Full license terms and conditions.
  license_type      enum(royalty_free, rights_managed, editorial, creative_commons, internal, custom) not_null
  territories       json nullable                -- Allowed territories (e.g., ["US", "EU"]). Null = worldwide.
  channels          json nullable                -- Allowed channels (e.g., ["web", "print", "social"]). Null = all.
  max_uses          integer nullable             -- Maximum usage count. Null = unlimited.
  created_by        uuid not_null references users(id) on_delete restrict
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  index(workspace_id)
  index(license_type)
}
```

### 13. asset_licenses

Assignment of licenses to assets with effective and expiry dates. An asset can have multiple licenses (e.g., different rights for different territories/time periods).

```pseudo
table asset_licenses {
  id                uuid primary_key default auto_generate
  asset_id          uuid not_null references assets(id) on_delete cascade
  license_id        uuid not_null references licenses(id) on_delete cascade
  effective_date    string not_null              -- When the license becomes active (YYYY-MM-DD). String because it's a calendar date, not a UTC moment.
  expiry_date       string nullable              -- When the license expires (YYYY-MM-DD). Null = perpetual.
  notes             string nullable              -- Additional context (e.g., "Photographer: Jane Doe, Invoice #12345").
  assigned_by       uuid not_null references users(id) on_delete restrict
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  index(asset_id)
  index(license_id)
  index(expiry_date)                             -- Find expiring/expired licenses.
}
```

**Design notes:**
- `effective_date` and `expiry_date` are `string` (not `timestamp`) because they represent calendar dates interpreted in business context, not UTC moments.

### 14. comments

Threaded comments on assets for review and feedback workflows. Self-referencing `parent_id` enables nested replies. Inspired by Frontify annotations and Brandfolder comments.

```pseudo
table comments {
  id                uuid primary_key default auto_generate
  asset_id          uuid not_null references assets(id) on_delete cascade
  parent_id         uuid nullable references comments(id) on_delete cascade
  body              string not_null              -- Comment text content.
  author_id         uuid not_null references users(id) on_delete cascade
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  index(asset_id)
  index(parent_id)                               -- Load replies for a comment.
}
```

### 15. download_presets

Pre-configured export/transformation settings that workspace admins define. Users select a preset when downloading an asset to get it in the desired format, size, and quality. Inspired by Widen conversion presets and Cloudinary named transformations.

```pseudo
table download_presets {
  id                uuid primary_key default auto_generate
  workspace_id      uuid not_null references workspaces(id) on_delete cascade
  name              string not_null              -- Preset display name (e.g., "Web Banner 1200x628", "Print CMYK High-Res").
  output_format     string nullable              -- Target format (e.g., "jpg", "png", "webp"). Null = keep original.
  max_width         integer nullable             -- Maximum output width. Null = no resize.
  max_height        integer nullable             -- Maximum output height. Null = no resize.
  quality           integer nullable             -- Output quality 1-100 (for lossy formats). Null = default.
  dpi               integer nullable             -- Output DPI for print (e.g., 300). Null = original.
  created_by        uuid not_null references users(id) on_delete restrict
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  index(workspace_id)
}
```

### 16. share_links

External sharing links for distributing assets or collections outside the workspace. Each link has its own access controls, password protection, and expiry. Inspired by Brandfolder share links and Bynder external sharing.

```pseudo
table share_links {
  id                uuid primary_key default auto_generate
  workspace_id      uuid not_null references workspaces(id) on_delete cascade
  asset_id          uuid nullable references assets(id) on_delete cascade
  collection_id     uuid nullable references collections(id) on_delete cascade
  token             string unique not_null        -- Unique URL token for the share link.
  password_hash     string nullable              -- Bcrypt hash. Null = no password required.
  allow_download    boolean not_null default true
  expires_at        timestamp nullable           -- Link expiry. Null = no expiry.
  view_count        integer not_null default 0   -- Cached view count.
  max_views         integer nullable             -- Maximum allowed views. Null = unlimited.
  created_by        uuid not_null references users(id) on_delete cascade
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  -- unique(token) covered by field constraint.
  index(workspace_id)
  index(asset_id)
  index(collection_id)
  index(expires_at)                              -- Find expired links for cleanup.
}
```

**Design notes:**
- Exactly one of `asset_id` or `collection_id` should be set — application-level validation. Both nullable to support either target type.

### 17. asset_downloads

Download audit trail tracking who downloaded which asset, when, and with what settings. Append-only for compliance and analytics. Inspired by Brandfolder analytics and MediaValet usage tracking.

```pseudo
table asset_downloads {
  id                uuid primary_key default auto_generate
  asset_id          uuid not_null references assets(id) on_delete cascade
  downloaded_by     uuid nullable references users(id) on_delete set_null -- Null = external/anonymous download via share link.
  share_link_id     uuid nullable references share_links(id) on_delete set_null
  preset_id         uuid nullable references download_presets(id) on_delete set_null
  format            string not_null              -- Format downloaded (e.g., "original", "jpg", "png").
  file_size         bigint not_null              -- Size of the downloaded file.
  ip_address        string nullable              -- Client IP for audit purposes.
  user_agent        string nullable              -- Browser/client info.
  downloaded_at     timestamp default now
}

indexes {
  index(asset_id)
  index(downloaded_by)
  index(downloaded_at)                           -- Time-range queries for analytics.
}
```

**Design notes:**
- No `updated_at` — download records are immutable (append-only).

### 18. asset_activities

Append-only activity log for all significant asset lifecycle events. Used for compliance auditing, change history, and analytics. One row per event.

```pseudo
table asset_activities {
  id                uuid primary_key default auto_generate
  workspace_id      uuid not_null references workspaces(id) on_delete cascade
  asset_id          uuid nullable references assets(id) on_delete set_null -- Null if asset was hard-deleted.
  actor_id          uuid not_null references users(id) on_delete restrict
  action            enum(uploaded, updated, downloaded, shared, commented, tagged, moved, versioned, archived, restored, deleted) not_null
  details           json nullable                -- Action-specific context (e.g., {"from_folder": "abc", "to_folder": "def"}).
  occurred_at       timestamp default now
}

indexes {
  index(workspace_id)
  index(asset_id)
  index(actor_id)
  index(action)
  index(occurred_at)                             -- Time-range queries.
}
```

**Design notes:**
- No `updated_at` — activities are immutable (append-only).
- `asset_id` is nullable with `set_null` so the activity log is preserved even if the asset is permanently deleted.

## Relationships

### One-to-Many
```
workspaces        1 ──── * folders              (workspace contains folders)
workspaces        1 ──── * assets               (workspace contains assets)
workspaces        1 ──── * collections          (workspace contains collections)
workspaces        1 ──── * tags                 (workspace contains tags)
workspaces        1 ──── * metadata_schemas     (workspace defines metadata fields)
workspaces        1 ──── * licenses             (workspace defines licenses)
workspaces        1 ──── * download_presets     (workspace defines download presets)
workspaces        1 ──── * share_links          (workspace contains share links)
workspaces        1 ──── * asset_activities     (workspace has activity log)
folders           1 ──── * folders              (folder contains subfolders — self-ref)
folders           1 ──── * assets               (folder contains assets)
assets            1 ──── * asset_versions       (asset has version history)
assets            1 ──── * renditions           (asset has renditions)
assets            1 ──── * collection_assets    (asset appears in collections)
assets            1 ──── * asset_tags           (asset has tags)
assets            1 ──── * metadata_values      (asset has custom metadata)
assets            1 ──── * asset_licenses       (asset has license assignments)
assets            1 ──── * comments             (asset has comments)
assets            1 ──── * asset_downloads      (asset has download records)
assets            1 ──── * asset_activities     (asset has activity records)
assets            1 ──── * share_links          (asset has share links)
collections       1 ──── * collection_assets    (collection contains assets)
collections       1 ──── * share_links          (collection has share links)
tags              1 ──── * asset_tags           (tag applied to assets)
metadata_schemas  1 ──── * metadata_values      (schema field has values)
licenses          1 ──── * asset_licenses       (license assigned to assets)
comments          1 ──── * comments             (comment has replies — self-ref)
download_presets  1 ──── * asset_downloads      (preset used in downloads)
share_links       1 ──── * asset_downloads      (share link tracks downloads)
users             1 ──── * assets               (user uploads assets)
users             1 ──── * comments             (user authors comments)
users             1 ──── * asset_activities     (user performs actions)
```

### Circular Reference
```
assets ←──→ asset_versions  (assets.current_version_id → asset_versions.id, asset_versions.asset_id → assets.id)
```

### Many-to-Many (via junction tables)
```
collections ←──→ assets   (via collection_assets)
tags        ←──→ assets   (via asset_tags)
licenses    ←──→ assets   (via asset_licenses)
```

## Best Practices

- **Custom metadata**: Use `metadata_schemas` + `metadata_values` for workspace-configurable fields. Keep extracted technical metadata (width, height, duration) on the `assets` table for performance.
- **Rendition management**: Generate renditions asynchronously on upload. Delete and regenerate when the source asset is re-uploaded.
- **License compliance**: Query `asset_licenses` for expired/expiring licenses proactively. Set asset status to `expired` when all licenses expire.
- **Activity log**: Insert activities asynchronously (queue) to avoid impacting write performance.
- **Storage accounting**: Update `workspaces.storage_used_bytes` on upload/delete. Periodically recompute from actual file sizes.
- **Soft delete pattern**: Use `assets.status = 'archived'` for soft delete. The activity log preserves the full history.

## Formats

| Format      | Status |
| ----------- | ------ |
| Convex      | ✅ Done |
| SQL         | ✅ Done |
| Prisma      | ✅ Done |
| MongoDB     | ✅ Done |
| Drizzle     | ✅ Done |
| SpacetimeDB | ✅ Done |
| Firebase    | ✅ Done |
