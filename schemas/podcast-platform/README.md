# Podcast Platform

> Shows, episodes with chapters and transcripts, person credits (hosts, guests, producers), categories, subscriptions, listen progress, playlists, reviews, RSS distribution, and offline downloads.

## Overview

A complete podcast platform schema covering the content catalog, people/credits, taxonomy and discovery, RSS distribution, user library management, listening engagement, monetization markers, and offline access. Designed after studying Buzzsprout, Transistor, Podbean, Spotify for Podcasters, Libsyn, Simplecast, Captivate, Apple Podcasts, Pocket Casts, Overcast, Castbox, Funkwhale, AntennaPod, and Podcast Index.

The schema follows the universal **show → episode** content hierarchy used by every podcast platform. Unlike the album → track model in music streaming, a show is an ongoing series with an RSS feed, and episodes are individual installments published over time. Junction tables (`show_categories`, `show_credits`, `episode_credits`) handle many-to-many relationships — a show can belong to multiple categories, and credits attribute multiple contributors per show and per episode with distinct roles.

Key design decisions:
- **Show → Episode hierarchy with optional seasons** — seasons are a separate table with optional metadata (name, description, artwork) following Podcast 2.0's `podcast:season` tag. Not all shows use seasons, so season_number on episodes remains nullable.
- **RSS feed centrality** — the `feed_url` and key RSS metadata live on the shows table. Shows both generate and consume RSS feeds. Episodes preserve the original RSS `guid` for cross-platform identity.
- **Separate people and credits tables** — `people` stores person profiles (hosts, guests, producers), with `show_credits` for regular contributors and `episode_credits` for per-episode appearances. Follows Podcast 2.0's `podcast:person` tag and the Podcast Taxonomy Project's standardized roles.
- **Listen progress as the primary user-state table** — podcast episodes are 30-90+ minutes, making resume position critical. `listen_progress` uses an upsert pattern (one row per user+episode), separate from the append-only `listen_history` event log.
- **Chapters and transcripts as separate tables** — chapters enable navigation within long episodes (Podcast 2.0 standard). Transcripts support multiple formats (SRT, VTT, JSON, plain text) for accessibility and search.
- **Apple-based category taxonomy** — self-referential `categories` table with parent_id for the two-level hierarchy. Shows can have up to two categories (primary + secondary) via `show_categories`.
- **Episode queue separate from playlists** — the queue has unique semantics (auto-populated, shifts on play, one per user) that differ from user-created playlists.

Also works for: podcast hosting (Buzzsprout, Transistor, Podbean), podcast listening apps (Pocket Casts, Overcast), audiobook platforms, educational series platforms, sermon/lecture archives, and any service with episodic audio/video content.

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (25 tables)</summary>

- [`shows`](#1-shows)
- [`seasons`](#2-seasons)
- [`episodes`](#3-episodes)
- [`chapters`](#4-chapters)
- [`transcripts`](#5-transcripts)
- [`clips`](#6-clips)
- [`people`](#7-people)
- [`show_credits`](#8-show_credits)
- [`episode_credits`](#9-episode_credits)
- [`categories`](#10-categories)
- [`show_categories`](#11-show_categories)
- [`show_tags`](#12-show_tags)
- [`networks`](#13-networks)
- [`distribution_targets`](#14-distribution_targets)
- [`subscriptions`](#15-subscriptions)
- [`listen_progress`](#16-listen_progress)
- [`listen_history`](#17-listen_history)
- [`episode_queue`](#18-episode_queue)
- [`saved_episodes`](#19-saved_episodes)
- [`playlists`](#20-playlists)
- [`playlist_episodes`](#21-playlist_episodes)
- [`reviews`](#22-reviews)
- [`ad_markers`](#23-ad_markers)
- [`funding_links`](#24-funding_links)
- [`episode_downloads`](#25-episode_downloads)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users` | User identity for show ownership, subscriptions, listen progress, playlists, reviews, and all user-attributed operations |
| [File Management / Document Storage](../file-management-document-storage) | `files` | File references for episode audio, show artwork, season artwork, network logos, and person images |

## Tables

### Core Content
- `shows` — Podcast show/series with title, description, author, language, show type (episodic/serial), RSS feed URL, artwork, and network association
- `seasons` — Optional season grouping with name, description, and artwork for shows that organize episodes by season
- `episodes` — Individual episodes with title, description, duration, episode type (full/trailer/bonus), season/episode numbering, audio file reference, and RSS guid
- `chapters` — Chapter markers within episodes for in-episode navigation with timestamps, titles, and optional links/images
- `transcripts` — Episode transcripts in multiple formats (SRT, VTT, JSON, plain text) for accessibility and search
- `clips` — Shareable soundbite/highlight segments from episodes with start time and duration

### People & Credits
- `people` — Person profiles for hosts, guests, producers, and other contributors with bio and image
- `show_credits` — Regular contributors to a show with role and group attribution (host, co-host, producer, etc.)
- `episode_credits` — Per-episode contributor appearances with role and group (guests, per-episode variations)

### Taxonomy & Discovery
- `categories` — Hierarchical category taxonomy based on Apple Podcasts categories with self-referential parent
- `show_categories` — Junction table linking shows to categories with primary/secondary designation
- `show_tags` — Freeform tags on shows for search and discovery beyond the category taxonomy

### Distribution & Feeds
- `networks` — Podcast network/publisher entities grouping multiple shows under one brand
- `distribution_targets` — Platform distribution records tracking where shows are submitted and their approval status

### User Library & Engagement
- `subscriptions` — User subscriptions to shows with per-show settings (auto-download, notifications, playback speed)
- `listen_progress` — Current playback position per user per episode for resume functionality
- `listen_history` — Append-only listening event log with duration and playback source
- `episode_queue` — User's up-next episode queue with ordering
- `saved_episodes` — Individually saved/bookmarked episodes independent of show subscription
- `playlists` — User-created episode collections with support for manual and smart (rule-based) playlists
- `playlist_episodes` — Ordered episodes within playlists
- `reviews` — User ratings and reviews for shows

### Monetization & Ads
- `ad_markers` — Dynamic ad insertion points within episodes (preroll, midroll, postroll)
- `funding_links` — Donation and support links for shows (Podcast 2.0 podcast:funding)

### Downloads & Offline
- `episode_downloads` — Offline download records with status, device association, and expiry

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. shows

Podcast show/series profiles. Each show has a title, description, author, language, RSS feed URL, and artwork. Shows have a type (episodic or serial) that determines default episode sort order. Linked to episodes, seasons, credits, categories, and subscriptions.

```pseudo
table shows {
  id              uuid primary_key default auto_generate
  owner_id        uuid not_null references users(id) on_delete cascade  -- From Auth / RBAC. Show owner/creator.
  network_id      uuid nullable references networks(id) on_delete set_null  -- Podcast network this show belongs to. Null for independent shows.
  title           string not_null              -- Show title.
  slug            string unique not_null       -- URL-friendly identifier (e.g., "the-daily").
  description     string not_null              -- Plain text description/summary.
  html_description string nullable             -- Rich HTML description for platforms that support it.
  author          string not_null              -- Author name displayed in podcast apps (e.g., "The New York Times").
  language        string not_null default 'en' -- ISO 639-1 language code (e.g., "en", "es", "ja").
  show_type       enum(episodic, serial) not_null default episodic  -- Episodic = newest first, Serial = oldest first.
  explicit        boolean not_null default false  -- Whether the show contains explicit content.
  artwork_file_id uuid nullable references files(id) on_delete set_null  -- From File Management. Show cover artwork.
  banner_file_id  uuid nullable references files(id) on_delete set_null  -- From File Management. Show banner/header image.
  feed_url        string nullable              -- RSS feed URL. Null if the show is draft/unpublished.
  website         string nullable              -- Show's official website URL.
  copyright       string nullable              -- Copyright notice (e.g., "© 2024 The New York Times").
  owner_name      string nullable              -- Podcast owner name (for RSS itunes:owner tag).
  owner_email     string nullable              -- Podcast owner email (for RSS itunes:owner tag, not public).
  podcast_guid    string nullable              -- Podcast 2.0 globally unique identifier (podcast:guid tag).
  medium          enum(podcast, music, video, audiobook, newsletter) not_null default podcast  -- Content medium type (Podcast 2.0 podcast:medium).
  is_complete     boolean not_null default false  -- Whether the show has ended and will not publish new episodes.
  episode_count   integer not_null default 0   -- Denormalized count of published episodes.
  subscriber_count integer not_null default 0  -- Denormalized count of active subscribers.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  -- unique(slug) is already created by the field constraint above.
  index(owner_id)                              -- "Shows owned by this user."
  index(network_id)                            -- "Shows in this network."
  index(language, show_type)                   -- "English episodic shows."
  index(subscriber_count)                      -- "Most popular shows" for discovery.
}
```

**Design notes:**
- `show_type` determines default episode ordering: `episodic` shows display newest-first (news, interviews), `serial` shows display oldest-first (narratives, audiobooks). This follows Apple Podcasts' `itunes:type` tag.
- `owner_id` is the platform user who created/owns the show. `owner_name` and `owner_email` are RSS metadata fields (for `itunes:owner`) which may differ from the platform user's name/email.
- `podcast_guid` is the Podcast 2.0 globally unique identifier — a permanent UUID that persists even if the show moves to a different host. Different from the database `id`.
- `medium` follows Podcast 2.0's `podcast:medium` tag — most content is `podcast`, but the schema supports music, video, audiobook, and newsletter feeds.
- `feed_url` is nullable for draft shows that haven't been published yet. Once published, the hosting platform generates the feed URL.
- Denormalized counters (`episode_count`, `subscriber_count`) enable fast profile rendering without counting joins.

### 2. seasons

Optional season grouping for shows. Seasons have a number, optional name, and optional artwork. Not all shows use seasons — many podcasts are unstructured. When present, seasons provide organizational context and can have their own metadata (Podcast 2.0 `podcast:season` supports a name attribute).

```pseudo
table seasons {
  id              uuid primary_key default auto_generate
  show_id         uuid not_null references shows(id) on_delete cascade
  season_number   integer not_null             -- Season number (1-based).
  name            string nullable              -- Optional season name (e.g., "Murder in the Bayou", "Season 2: Europe").
  description     string nullable              -- Optional season description.
  artwork_file_id uuid nullable references files(id) on_delete set_null  -- From File Management. Season-specific artwork.

  composite_unique(show_id, season_number)     -- One season per number per show.
}

indexes {
  -- composite_unique(show_id, season_number) covers index(show_id) via leading column.
}
```

**Design notes:**
- `season_number` is 1-based to match display conventions and RSS `itunes:season` values.
- `name` is nullable — many seasons are simply "Season 1", "Season 2" without a distinct name.
- A separate seasons table (rather than just a number on episodes) allows per-season metadata like artwork and descriptions, following Podcast 2.0 and Simplecast patterns.
- No timestamps — seasons are metadata, not temporal data.

### 3. episodes

Individual podcast episodes. Each episode has a title, description, duration, episode type (full/trailer/bonus), optional season/episode numbering, and an audio file reference. The RSS `guid` is preserved for cross-platform identity and deduplication.

```pseudo
table episodes {
  id              uuid primary_key default auto_generate
  show_id         uuid not_null references shows(id) on_delete cascade
  title           string not_null              -- Episode title.
  slug            string not_null              -- URL-friendly identifier (unique within show, not globally).
  description     string nullable              -- Plain text description/show notes.
  html_description string nullable             -- Rich HTML description with links, formatting.
  episode_type    enum(full, trailer, bonus) not_null default full  -- Apple's episode type standard.
  season_number   integer nullable             -- Season number (matches seasons.season_number). Null if show doesn't use seasons.
  episode_number  integer nullable             -- Episode number within the season or show. Null for unnumbered episodes.
  duration_ms     integer not_null default 0   -- Episode duration in milliseconds.
  explicit        boolean not_null default false  -- Whether this episode contains explicit content (overrides show-level).
  audio_file_id   uuid nullable references files(id) on_delete set_null  -- From File Management. Episode audio file.
  artwork_file_id uuid nullable references files(id) on_delete set_null  -- From File Management. Episode-specific artwork (overrides show artwork).
  enclosure_url   string nullable              -- RSS enclosure URL to audio/video file.
  enclosure_length integer nullable            -- RSS enclosure file size in bytes.
  enclosure_type  string nullable              -- RSS enclosure MIME type (e.g., "audio/mpeg", "audio/m4a", "video/mp4").
  guid            string nullable              -- RSS guid — immutable, globally unique episode identifier for feed readers.
  published_at    timestamp nullable           -- When the episode was/will be published. Null for drafts.
  is_blocked      boolean not_null default false  -- Whether this episode is excluded from public feeds/directories.
  play_count      integer not_null default 0   -- Denormalized total play count.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(show_id, published_at)                 -- "Episodes for this show, newest first."
  index(show_id, season_number, episode_number)  -- "Episodes by season and number for serial shows."
  index(published_at)                          -- "Recently published episodes across all shows."
  index(guid)                                  -- Look up episode by RSS guid for deduplication.
  composite_unique(show_id, slug)              -- Slugs are unique within a show.
}
```

**Design notes:**
- `episode_type` follows Apple's standard: `full` (regular episodes), `trailer` (preview/promotional), `bonus` (extra content). Trailers and bonus episodes are typically displayed separately in podcast apps.
- `season_number` and `episode_number` are both nullable — many podcasts don't use numbering at all. When present, they map directly to `itunes:season` and `itunes:episode` RSS tags.
- `guid` is the RSS `<guid>` element — once assigned, it must never change. Podcast apps use it to identify episodes across feed updates. Separate from the database `id`.
- `enclosure_url`, `enclosure_length`, and `enclosure_type` mirror the RSS `<enclosure>` element for feed generation. These may differ from the `audio_file_id` file's properties if the audio is hosted externally.
- `published_at` is nullable for draft episodes. Future dates enable scheduled publishing.
- `slug` is unique within a show (composite unique with `show_id`) but not globally — different shows can have the same episode slug.
- `duration_ms` is in milliseconds for precision in progress tracking and UI display, following the streaming industry convention.

### 4. chapters

Chapter markers within episodes. Chapters enable navigation within long episodes — listeners can jump to specific topics, sponsors, or segments. Follows Podcast 2.0's `podcast:chapters` JSON format.

```pseudo
table chapters {
  id              uuid primary_key default auto_generate
  episode_id      uuid not_null references episodes(id) on_delete cascade
  start_time_ms   integer not_null             -- Chapter start time in milliseconds from episode start.
  end_time_ms     integer nullable             -- Chapter end time in milliseconds. Null = extends to next chapter or episode end.
  title           string not_null              -- Chapter title (e.g., "Introduction", "Interview with Guest", "Sponsor: Squarespace").
  url             string nullable              -- Optional link associated with the chapter (e.g., article URL, sponsor link).
  image_url       string nullable              -- Optional chapter-specific image URL.
  is_hidden       boolean not_null default false  -- Whether the chapter is hidden/silent (e.g., ad insertion markers).
  position        integer not_null             -- Display order (for chapters with the same start_time_ms).
  created_at      timestamp default now
}

indexes {
  index(episode_id, start_time_ms)             -- "Chapters for this episode, in order."
}
```

**Design notes:**
- `start_time_ms` is required, `end_time_ms` is optional — when null, the chapter extends to the next chapter's start time or to the end of the episode.
- `is_hidden` supports silent chapters (Podcast 2.0 spec) — chapters that exist for metadata purposes (ad markers, internal segmentation) but shouldn't be displayed to listeners.
- `position` handles ordering when multiple chapters share the same start time (rare but possible in edge cases).
- `url` and `image_url` follow Podcast 2.0's chapter format which supports per-chapter links and artwork.
- No `updated_at` — chapters are typically replaced in bulk when updated (delete all + re-insert from feed).

### 5. transcripts

Episode transcripts for accessibility, search, and SEO. Supports multiple formats (SRT for timed captions, VTT for web display, JSON for structured data, plain text for search indexing). An episode can have multiple transcripts in different formats or languages.

```pseudo
table transcripts {
  id              uuid primary_key default auto_generate
  episode_id      uuid not_null references episodes(id) on_delete cascade
  format          enum(srt, vtt, json, text) not_null  -- Transcript format.
  content_url     string nullable              -- URL to the transcript file (for externally hosted transcripts).
  content         string nullable              -- Inline transcript content. Null when content_url is used.
  language        string not_null default 'en' -- ISO 639-1 language code.
  is_auto_generated boolean not_null default false  -- Whether the transcript was AI-generated vs manually created.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(episode_id, format, language)          -- "Transcripts for this episode in this format and language."
}
```

**Design notes:**
- Either `content_url` or `content` is populated — external URL for hosted transcripts (Podcast 2.0 pattern), inline content for platform-generated transcripts.
- `format` covers the major transcript standards: SRT (SubRip, timed captions), VTT (WebVTT, web-native captions), JSON (structured with timestamps), and plain text (full text for search indexing).
- `is_auto_generated` distinguishes AI/machine-generated transcripts from human-created ones — important for quality expectations.
- Multiple transcripts per episode are supported for different formats and languages.

### 6. clips

Shareable soundbite/highlight segments from episodes. Clips are short excerpts that can be shared on social media or used for promotional purposes. Follows Podcast 2.0's `podcast:soundbite` tag.

```pseudo
table clips {
  id              uuid primary_key default auto_generate
  episode_id      uuid not_null references episodes(id) on_delete cascade
  created_by      uuid not_null references users(id) on_delete cascade  -- From Auth / RBAC. User who created the clip.
  title           string not_null              -- Clip title/description.
  start_time_ms   integer not_null             -- Start time in milliseconds from episode start.
  duration_ms     integer not_null             -- Clip duration in milliseconds.
  created_at      timestamp default now
}

indexes {
  index(episode_id)                            -- "Clips from this episode."
  index(created_by)                            -- "Clips created by this user."
}
```

**Design notes:**
- Clips differ from chapters in purpose: chapters are navigational (table of contents), clips are shareable highlights.
- `duration_ms` is used instead of `end_time_ms` following Podcast 2.0's `podcast:soundbite` convention.
- No `updated_at` — clips are created and shared, not typically edited.

### 7. people

Person profiles for podcast contributors — hosts, guests, producers, editors, and other credited individuals. A person can appear across multiple shows and episodes with different roles. Follows Podcast 2.0's `podcast:person` tag.

```pseudo
table people {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Display name.
  slug            string unique not_null       -- URL-friendly identifier.
  bio             string nullable              -- Brief biography.
  url             string nullable              -- Personal website or profile link.
  image_file_id   uuid nullable references files(id) on_delete set_null  -- From File Management. Person profile image.
  podcast_index_id string nullable             -- Podcast Index person ID for cross-platform identity.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  -- unique(slug) is already created by the field constraint above.
  index(name)                                  -- Search by person name.
}
```

**Design notes:**
- `podcast_index_id` enables linking to the Podcast Index's person database for cross-platform identity.
- People are separate from `users` (auth-rbac) — a guest on a podcast doesn't need a platform account.
- `slug` enables clean person profile URLs (e.g., `/person/joe-rogan`).

### 8. show_credits

Regular contributors to a show — the recurring team. Each row represents one person's role on one show. Show-level credits establish the default team; episode-level credits override for specific episodes.

```pseudo
table show_credits {
  id              uuid primary_key default auto_generate
  show_id         uuid not_null references shows(id) on_delete cascade
  person_id       uuid not_null references people(id) on_delete cascade
  role            enum(host, co_host, guest, producer, editor, sound_designer, composer, narrator, researcher, writer) not_null
  group           enum(cast, crew, writing, audio_post_production, video_post_production) not_null default cast
  position        integer not_null default 0   -- Display ordering within the same role group.

  composite_unique(show_id, person_id, role)   -- One credit per person per role per show.
}

indexes {
  index(person_id)                             -- "All shows this person contributes to."
  -- composite_unique(show_id, person_id, role) covers index(show_id) via leading column.
}
```

**Design notes:**
- `role` covers the common podcast roles from the Podcast Taxonomy Project. A person can have multiple roles on the same show (e.g., host and producer) — each is a separate row.
- `group` categorizes roles by department following the Podcast Taxonomy Project: cast (on-air), crew (production), writing, audio post-production, video post-production.
- `position` controls display ordering within a role group (e.g., host #1, host #2).
- Show credits represent the regular team — for per-episode guest appearances, use `episode_credits`.

### 9. episode_credits

Per-episode contributor appearances. Used for guests, fill-in hosts, and any per-episode variations from the show's regular credits. Follows Podcast 2.0's item-level `podcast:person` tag.

```pseudo
table episode_credits {
  id              uuid primary_key default auto_generate
  episode_id      uuid not_null references episodes(id) on_delete cascade
  person_id       uuid not_null references people(id) on_delete cascade
  role            enum(host, co_host, guest, producer, editor, sound_designer, composer, narrator, researcher, writer) not_null
  group           enum(cast, crew, writing, audio_post_production, video_post_production) not_null default cast
  position        integer not_null default 0   -- Display ordering within the same role group.

  composite_unique(episode_id, person_id, role)  -- One credit per person per role per episode.
}

indexes {
  index(person_id)                             -- "All episodes this person appears on."
  -- composite_unique(episode_id, person_id, role) covers index(episode_id) via leading column.
}
```

**Design notes:**
- Episode credits use the same role and group enums as show credits for consistency.
- When episode-level credits exist for a given group, they can wholly replace show-level credits for that group (per Podcast 2.0 spec), or the application can merge them — this is an application-level decision.
- No timestamps — credits are metadata set at publish time.

### 10. categories

Hierarchical category taxonomy based on Apple Podcasts categories. Self-referential parent_id creates a two-level hierarchy (category → subcategory). The category set is platform-defined, not user-generated.

```pseudo
table categories {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Category name (e.g., "Technology", "Science", "Society & Culture").
  slug            string unique not_null       -- URL-friendly identifier (e.g., "society-and-culture").
  parent_id       uuid nullable references categories(id) on_delete cascade  -- Parent category for subcategories. Null for top-level categories.
  created_at      timestamp default now
}

indexes {
  -- unique(slug) is already created by the field constraint above.
  index(parent_id)                             -- "Subcategories of this category."
}
```

**Design notes:**
- Apple Podcasts defines 19 top-level categories with subcategories (100+ total). This is the de facto industry standard used by all platforms.
- `parent_id` is nullable — null means top-level category. Self-referential FK supports the two-level hierarchy.
- No `updated_at` — category definitions are stable and rarely change.

### 11. show_categories

Junction table linking shows to categories. A show can have up to two categories (primary and secondary), following Apple Podcasts' convention.

```pseudo
table show_categories {
  id              uuid primary_key default auto_generate
  show_id         uuid not_null references shows(id) on_delete cascade
  category_id     uuid not_null references categories(id) on_delete cascade
  is_primary      boolean not_null default false  -- Whether this is the show's primary category.

  composite_unique(show_id, category_id)       -- One category assignment per show per category.
}

indexes {
  index(category_id)                           -- "All shows in this category."
  -- composite_unique(show_id, category_id) covers index(show_id) via leading column.
}
```

**Design notes:**
- `is_primary` distinguishes the primary category from the secondary. Apple Podcasts requires exactly one primary category; a secondary is optional.
- The composite unique prevents duplicate category assignments. The application enforces the max-two-categories rule.
- No timestamps — category assignments are administrative metadata.

### 12. show_tags

Freeform tags on shows for search and discovery beyond the structured category taxonomy. Tags are user-generated and flexible, unlike the platform-defined categories.

```pseudo
table show_tags {
  id              uuid primary_key default auto_generate
  show_id         uuid not_null references shows(id) on_delete cascade
  tag             string not_null              -- Tag text (e.g., "true crime", "interviews", "startups").

  composite_unique(show_id, tag)               -- One tag per show (no duplicates).
}

indexes {
  index(tag)                                   -- "All shows with this tag."
  -- composite_unique(show_id, tag) covers index(show_id) via leading column.
}
```

**Design notes:**
- Tags complement categories — categories are the structured Apple taxonomy, tags are freeform keywords for discovery and search.
- Tag normalization (lowercase, trimming) should happen at write time in the application layer.
- No timestamps — tags are metadata, not temporal data.

### 13. networks

Podcast network/publisher entities. A network groups multiple shows under one publisher or brand (e.g., "Gimlet Media", "Wondery", "Relay FM"). Shows can optionally belong to a network.

```pseudo
table networks {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Network name (e.g., "Gimlet Media", "Wondery").
  slug            string unique not_null       -- URL-friendly identifier.
  description     string nullable              -- Network description.
  website         string nullable              -- Network's official website.
  logo_file_id    uuid nullable references files(id) on_delete set_null  -- From File Management. Network logo.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  -- unique(slug) is already created by the field constraint above.
  index(name)                                  -- Search by network name.
}
```

**Design notes:**
- Networks are optional — solo creators don't need them, but they're valuable for multi-show publishers.
- Follows the pattern from Captivate (Networks), Transistor (multi-show accounts), Apple Podcasts (Channels), and Podcast 2.0 (`podcast:publisher`).
- Network-level analytics can be computed by aggregating across the network's shows.

### 14. distribution_targets

Platform distribution records. Tracks where a show has been submitted for distribution and the status of each submission. Covers Apple Podcasts, Spotify, YouTube, Google Podcasts, and other directories.

```pseudo
table distribution_targets {
  id              uuid primary_key default auto_generate
  show_id         uuid not_null references shows(id) on_delete cascade
  platform        string not_null              -- Distribution platform (e.g., "apple_podcasts", "spotify", "youtube", "amazon_music").
  external_id     string nullable              -- Platform-specific show ID (e.g., Apple Podcasts ID, Spotify show URI).
  status          enum(pending, active, rejected, suspended) not_null default pending
  feed_url_override string nullable            -- Custom feed URL for this platform if different from show's feed_url.
  submitted_at    timestamp nullable           -- When the show was submitted to this platform.
  approved_at     timestamp nullable           -- When the platform approved the show.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(show_id, platform)                     -- "Distribution targets for this show."
  index(status)                                -- "All pending submissions."
}
```

**Design notes:**
- `platform` is a string rather than an enum because distribution platforms evolve — new directories appear and old ones shut down (e.g., Google Podcasts discontinued in 2024).
- `external_id` stores the platform-specific identifier for the show — needed for linking to the show's page on that platform and for API integrations.
- `feed_url_override` supports platforms that require a different feed URL (e.g., YouTube may need a video-specific feed).
- `status` tracks the submission lifecycle: pending → active (approved), or pending → rejected/suspended.

### 15. subscriptions

User subscriptions to shows. Subscribing adds the show's episodes to the user's feed/inbox. Per-subscription settings control auto-download behavior, notifications, and playback preferences.

```pseudo
table subscriptions {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade  -- From Auth / RBAC.
  show_id         uuid not_null references shows(id) on_delete cascade
  auto_download   boolean not_null default false  -- Whether new episodes are automatically downloaded.
  download_wifi_only boolean not_null default true  -- Whether auto-downloads are WiFi-only.
  notifications_enabled boolean not_null default true  -- Whether to notify on new episodes.
  custom_playback_speed decimal nullable       -- Per-show playback speed override (e.g., 1.5). Null = use default.
  new_episode_sort  enum(newest_first, oldest_first) not_null default newest_first  -- Override for episode sort order.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  composite_unique(user_id, show_id)           -- One subscription per user per show.
}

indexes {
  index(show_id)                               -- "All subscribers to this show" (for subscriber count).
  -- composite_unique(user_id, show_id) covers index(user_id) via leading column.
}
```

**Design notes:**
- Per-subscription settings follow Pocket Casts and Overcast patterns — each subscription can have its own auto-download, notification, and playback preferences.
- `custom_playback_speed` is nullable — null means use the app's global default speed. Common speeds: 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0.
- `new_episode_sort` allows overriding the show's default sort order per-subscription. A serial show can be viewed newest-first by a user who prefers that.
- This table models free subscriptions (follow/subscribe). Paid/premium subscriptions would be handled by a separate payments domain.

### 16. listen_progress

Current playback position per user per episode. This is the most important user-state table — podcast episodes are long-form content (30-90+ minutes), and resume position is critical. Uses an upsert pattern: one row per user+episode, updated on each play session.

```pseudo
table listen_progress {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade  -- From Auth / RBAC.
  episode_id      uuid not_null references episodes(id) on_delete cascade
  position_ms     integer not_null default 0   -- Current playback position in milliseconds.
  duration_ms     integer not_null default 0   -- Episode duration in milliseconds (cached for completion calculation).
  completed       boolean not_null default false  -- Whether the user has finished the episode.
  updated_at      timestamp default now on_update

  composite_unique(user_id, episode_id)        -- One progress record per user per episode.
}

indexes {
  index(user_id, completed, updated_at)        -- "This user's in-progress episodes, most recently played first."
  -- composite_unique(user_id, episode_id) covers index(user_id) via leading column.
}
```

**Design notes:**
- `position_ms` is updated via upsert on each play/pause event. This is the resume point shown in the UI.
- `completed` is set to true when the user reaches the end (or near-end) of the episode. The threshold (e.g., 95% completion) is an application-level decision.
- `duration_ms` is cached from the episode for fast completion percentage calculation without joining to episodes.
- No `created_at` — the row is created on first play. `updated_at` tracks the last interaction.
- Separate from `listen_history` — progress is "where am I?" (upsert), history is "what did I listen to?" (append-only).

### 17. listen_history

Append-only listening event log. Each row represents one listening session — a user played an episode. Records duration listened, start/end positions, and playback source. Used for analytics, recommendations, and "recently played" features.

```pseudo
table listen_history {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade  -- From Auth / RBAC.
  episode_id      uuid not_null references episodes(id) on_delete cascade
  started_at      timestamp not_null           -- When the listening session started.
  ended_at        timestamp nullable           -- When the session ended. Null if still playing.
  position_start_ms integer not_null           -- Playback position when session started (in ms).
  position_end_ms integer nullable             -- Playback position when session ended (in ms). Null if still playing.
  duration_listened_ms integer not_null default 0  -- Actual time spent listening (excluding pauses, skips).
  source          enum(app, web, car, smart_speaker, watch, unknown) not_null default unknown  -- Playback source/device type.
  created_at      timestamp default now
}

indexes {
  index(user_id, started_at)                   -- "This user's listening history, most recent first."
  index(episode_id, started_at)                -- "Listening events for this episode" (for analytics).
}
```

**Design notes:**
- `duration_listened_ms` is the actual listening time — accounts for pauses and skips. Different from `position_end_ms - position_start_ms` which includes paused time.
- `source` tracks the playback device/platform for analytics (mobile app, web player, CarPlay, smart speaker, Apple Watch, etc.).
- `ended_at` and `position_end_ms` are nullable for sessions still in progress.
- Append-only — each session creates a new row. No updates, no deletes. This preserves the full listening timeline.
- No `updated_at` — events are immutable once recorded.

### 18. episode_queue

User's up-next episode queue. The queue is the ordered list of episodes a user intends to listen to. Episodes are added manually or auto-populated from subscriptions. The queue shifts as episodes are played.

```pseudo
table episode_queue {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade  -- From Auth / RBAC.
  episode_id      uuid not_null references episodes(id) on_delete cascade
  position        integer not_null             -- Queue position (1-based). Lower = plays sooner.
  added_at        timestamp default now        -- When the episode was added to the queue.

  composite_unique(user_id, episode_id)        -- Each episode appears once in a user's queue.
}

indexes {
  index(user_id, position)                     -- "This user's queue in order."
  -- composite_unique(user_id, episode_id) covers index(user_id) via leading column.
}
```

**Design notes:**
- The queue is separate from playlists because it has unique semantics: typically one per user, auto-shifts when the current episode finishes, can be auto-populated from subscription preferences.
- `position` is 1-based. When an episode finishes playing, it's removed from the queue and all positions shift down. The application should use gap-based numbering (1, 100, 200...) to reduce updates on insertions.
- The composite unique prevents the same episode from appearing multiple times in a user's queue.

### 19. saved_episodes

Individually saved/bookmarked episodes. Users can save specific episodes without subscribing to the entire show — equivalent to bookmarking for later. Separate from subscriptions (show-level) and queue (play-next intent).

```pseudo
table saved_episodes {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade  -- From Auth / RBAC.
  episode_id      uuid not_null references episodes(id) on_delete cascade

  created_at      timestamp default now

  composite_unique(user_id, episode_id)        -- One save per user per episode.
}

indexes {
  index(user_id, created_at)                   -- "This user's saved episodes, newest first."
  -- composite_unique(user_id, episode_id) covers index(user_id) via leading column.
}
```

**Design notes:**
- Spotify separates "saved episodes" from "subscribed shows" — you might save a specific episode from a show you don't follow. This table models that pattern.
- No additional metadata — just the user-episode relationship with a timestamp.

### 20. playlists

User-created episode collections. Supports both manual playlists (user picks episodes) and smart playlists (auto-populated by rules). Smart playlists follow Pocket Casts' pattern with JSON-based filter criteria.

```pseudo
table playlists {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade  -- From Auth / RBAC. Playlist owner.
  name            string not_null              -- Playlist name.
  description     string nullable              -- Playlist description.
  playlist_type   enum(manual, smart) not_null default manual  -- Manual = user picks episodes, Smart = auto-populated by rules.
  smart_filters   json nullable                -- JSON object with filter rules for smart playlists. Null for manual playlists.
  is_public       boolean not_null default false  -- Whether the playlist is visible to other users.
  episode_count   integer not_null default 0   -- Denormalized count of episodes.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(user_id, created_at)                   -- "Playlists by this user, newest first."
}
```

**Design notes:**
- `playlist_type` distinguishes manual from smart playlists. Smart playlists auto-populate based on `smart_filters` (e.g., "unplayed episodes from subscribed shows, released in the last 7 days, longer than 20 minutes").
- `smart_filters` is a JSON object with filter criteria — flexible enough for various rule combinations without a complex normalized rules table. Example: `{"shows": ["id1", "id2"], "status": "unplayed", "min_duration_ms": 1200000, "max_age_days": 7}`.
- Playlists default to private (`is_public = false`) — podcast playlists are typically personal.
- `episode_count` is denormalized for fast listing display.

### 21. playlist_episodes

Ordered episodes within playlists. Each row represents one episode in one playlist at a specific position. For smart playlists, rows are auto-generated by the application based on filter rules.

```pseudo
table playlist_episodes {
  id              uuid primary_key default auto_generate
  playlist_id     uuid not_null references playlists(id) on_delete cascade
  episode_id      uuid not_null references episodes(id) on_delete cascade
  position        integer not_null             -- Display order within the playlist (1-based).
  added_at        timestamp default now        -- When the episode was added to the playlist.
}

indexes {
  index(playlist_id, position)                 -- "Episodes in this playlist, in order."
  index(episode_id)                            -- "Which playlists contain this episode?"
}
```

**Design notes:**
- `position` is 1-based for display consistency. Reordering updates position values.
- No unique constraint on `playlist_id + episode_id` — an episode could theoretically appear multiple times in a playlist (though unusual).
- `added_at` captures when the episode was added, separate from the row's creation time.

### 22. reviews

User ratings and reviews for shows. Each user can write one review per show with a 1-5 star rating and optional title and body text.

```pseudo
table reviews {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade  -- From Auth / RBAC.
  show_id         uuid not_null references shows(id) on_delete cascade
  rating          integer not_null             -- Star rating (1-5).
  title           string nullable              -- Review title/headline.
  body            string nullable              -- Review body text. Null for rating-only reviews.
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  composite_unique(user_id, show_id)           -- One review per user per show.
}

indexes {
  index(show_id, created_at)                   -- "Reviews for this show, newest first."
  index(show_id, rating)                       -- "Reviews for this show by rating."
  -- composite_unique(user_id, show_id) covers index(user_id) via leading column.
}
```

**Design notes:**
- Combined rating + review model — a rating without body text is a "rating-only review." No need for separate tables.
- `rating` is an integer (1-5) matching Apple Podcasts' star system.
- The composite unique ensures one review per user per show. Users can update their review (via `updated_at`).

### 23. ad_markers

Dynamic ad insertion points within episodes. Defines where ads can be inserted during playback — preroll (before episode), midroll (during episode), and postroll (after episode). Used by hosting platforms for programmatic ad insertion.

```pseudo
table ad_markers {
  id              uuid primary_key default auto_generate
  episode_id      uuid not_null references episodes(id) on_delete cascade
  marker_type     enum(preroll, midroll, postroll) not_null  -- Type of ad insertion point.
  position_ms     integer nullable             -- Position in milliseconds for midroll markers. Null for preroll/postroll.
  duration_ms     integer nullable             -- Expected ad duration in milliseconds. Null if unspecified.
  created_at      timestamp default now
}

indexes {
  index(episode_id, marker_type)               -- "Ad markers for this episode by type."
}
```

**Design notes:**
- `position_ms` is null for preroll (before episode) and postroll (after episode) — only midroll markers need a specific position.
- `duration_ms` is the expected/target ad duration, not a hard constraint — actual ad length may vary based on the ad network's available inventory.
- Ad markers define insertion points, not the ads themselves. Actual ad content and targeting are handled by external ad networks (not part of this schema).
- No `updated_at` — markers are set at episode creation and rarely change.

### 24. funding_links

Donation and support links for shows. Follows Podcast 2.0's `podcast:funding` tag — a simple URL + title for directing listeners to support the show financially (Patreon, Buy Me a Coffee, Ko-fi, etc.).

```pseudo
table funding_links {
  id              uuid primary_key default auto_generate
  show_id         uuid not_null references shows(id) on_delete cascade
  url             string not_null              -- Funding URL (e.g., "https://patreon.com/myshow").
  title           string not_null              -- Display text (e.g., "Support on Patreon", "Buy me a coffee").
  position        integer not_null default 0   -- Display ordering when multiple funding links exist.
  created_at      timestamp default now
}

indexes {
  index(show_id, position)                     -- "Funding links for this show, in order."
}
```

**Design notes:**
- Simple and focused — just URL + title, following the Podcast 2.0 `podcast:funding` tag specification.
- `position` allows ordering when a show has multiple funding options (e.g., Patreon, PayPal, merch store).
- No `updated_at` — funding links are relatively static metadata.

### 25. episode_downloads

Offline download records. When a user downloads an episode for offline listening, a row tracks the download status, device, file size, and optional expiry. Downloads may expire based on subscription status or storage management rules.

```pseudo
table episode_downloads {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade  -- From Auth / RBAC.
  episode_id      uuid not_null references episodes(id) on_delete cascade
  status          enum(queued, downloading, completed, failed, expired) not_null default queued
  device_id       string nullable              -- Device identifier for multi-device download management.
  file_size_bytes integer nullable             -- Downloaded file size in bytes. Null until download completes.
  downloaded_at   timestamp nullable           -- When the download completed. Null if not yet completed.
  expires_at      timestamp nullable           -- When this download expires. Null = no expiry.
  created_at      timestamp default now

  composite_unique(user_id, episode_id, device_id)  -- One download per user per episode per device.
}

indexes {
  index(user_id, status)                       -- "This user's active downloads."
  index(expires_at)                            -- Cleanup job: remove expired downloads.
  -- composite_unique(user_id, episode_id, device_id) covers index(user_id) via leading column.
}
```

**Design notes:**
- `status` tracks the download lifecycle: queued → downloading → completed. Can transition to failed (retry) or expired (cleanup).
- `device_id` enables multi-device download tracking — a user may download the same episode on their phone and tablet.
- `expires_at` supports automatic cleanup policies (e.g., "auto-delete downloaded episodes after 30 days" or "expire when subscription lapses").
- `file_size_bytes` is nullable until the download completes — useful for storage management and quota tracking.
- The composite unique allows the same episode to be downloaded on multiple devices but prevents duplicate downloads on the same device.

## Relationships

```
shows              1 ──── * seasons                            (one show has many seasons)
shows              1 ──── * episodes                           (one show has many episodes)
shows              1 ──── * show_credits                       (one show has many credits)
shows              1 ──── * show_categories                    (one show has many categories)
shows              1 ──── * show_tags                          (one show has many tags)
shows              1 ──── * distribution_targets               (one show has many distribution targets)
shows              1 ──── * subscriptions                      (one show has many subscribers)
shows              1 ──── * reviews                            (one show has many reviews)
shows              1 ──── * funding_links                      (one show has many funding links)
episodes           1 ──── * chapters                           (one episode has many chapters)
episodes           1 ──── * transcripts                        (one episode has many transcripts)
episodes           1 ──── * clips                              (one episode has many clips)
episodes           1 ──── * episode_credits                    (one episode has many credits)
episodes           1 ──── * listen_progress                    (one episode has many progress records)
episodes           1 ──── * listen_history                     (one episode has many history events)
episodes           1 ──── * episode_queue                      (one episode appears in many queues)
episodes           1 ──── * saved_episodes                     (one episode is saved by many users)
episodes           1 ──── * playlist_episodes                  (one episode appears in many playlists)
episodes           1 ──── * ad_markers                         (one episode has many ad markers)
episodes           1 ──── * episode_downloads                  (one episode is downloaded by many users)
people             1 ──── * show_credits                       (one person has many show credits)
people             1 ──── * episode_credits                    (one person has many episode credits)
categories         1 ──── * categories (parent)                (one category has many subcategories)
categories         1 ──── * show_categories                    (one category applies to many shows)
networks           1 ──── * shows                              (one network has many shows)
playlists          1 ──── * playlist_episodes                  (one playlist has many episodes)
users              1 ──── * shows (owner)                      (one user owns many shows)
users              1 ──── * clips (created_by)                 (one user creates many clips)
users              1 ──── * subscriptions                      (one user subscribes to many shows)
users              1 ──── * listen_progress                    (one user has many progress records)
users              1 ──── * listen_history                     (one user has many history events)
users              1 ──── * episode_queue                      (one user has one queue)
users              1 ──── * saved_episodes                     (one user saves many episodes)
users              1 ──── * playlists                          (one user owns many playlists)
users              1 ──── * reviews                            (one user writes many reviews)
users              1 ──── * episode_downloads                  (one user downloads many episodes)
files              1 ──── * shows (artwork)                    (one file is used as many show artworks)
files              1 ──── * shows (banner)                     (one file is used as many show banners)
files              1 ──── * seasons (artwork)                  (one file is used as many season artworks)
files              1 ──── * episodes (audio)                   (one file is used as many episode audio)
files              1 ──── * episodes (artwork)                 (one file is used as many episode artworks)
files              1 ──── * people (image)                     (one file is used as many person images)
files              1 ──── * networks (logo)                    (one file is used as many network logos)
```

## Best Practices

- **Resume position**: Save `listen_progress.position_ms` on every pause, seek, or app background event. Restore on the next play. This is the most critical UX feature for podcasts.
- **Episode completion**: Mark `listen_progress.completed = true` when position reaches ~95% of duration. The exact threshold is application-specific — some apps use 90%, others 99%.
- **Play counting**: Increment `episodes.play_count` when a listening session exceeds a minimum threshold (e.g., 60 seconds). The threshold prevents counting accidental plays.
- **RSS feed generation**: Generate the show's RSS feed from the database: `shows` → `<channel>`, `episodes` → `<item>`, `chapters` → `<podcast:chapters>`, `show_credits` + `episode_credits` → `<podcast:person>`, `transcripts` → `<podcast:transcript>`.
- **Queue management**: Remove episodes from `episode_queue` when they finish playing. Auto-add new episodes from subscribed shows with `auto_download = true`. Use gap-based position numbering (100, 200, 300...) to reduce position update cascades.
- **Smart playlists**: Re-evaluate smart playlist rules on a schedule (e.g., when the user opens the playlist) or when new episodes are published. Cache the results in `playlist_episodes`.
- **Subscription counts**: Update `shows.subscriber_count` via atomic increment/decrement on subscribe/unsubscribe. Accept eventual consistency.
- **Category seeding**: Seed the `categories` table with Apple's 19 top-level categories and their subcategories on initial setup. Keep the taxonomy up-to-date as Apple revises it.
- **Transcript search**: Index `transcripts.content` for full-text search to enable "search within episode" functionality. Consider a dedicated search index for production.
- **Download cleanup**: Run a periodic job checking `episode_downloads.expires_at` to clean up expired downloads and free device storage.
- **Credit display**: Show regular contributors from `show_credits` on the show page. For individual episodes, display `episode_credits` (which may include guests not in the regular credits).
- **Distribution management**: After creating/updating a show, check `distribution_targets.status` and prompt the creator to submit to platforms where status is null or rejected.

## Formats

| Format      | Status |
| ----------- | ------ |
| Convex      | ✅      |
| SQL         | ✅      |
| Prisma      | ✅      |
| MongoDB     | ✅      |
| Drizzle     | ✅      |
| SpacetimeDB | ✅      |
| Firebase    | ✅      |
