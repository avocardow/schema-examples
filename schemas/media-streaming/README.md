# Media Streaming

> Artists, albums, tracks with multi-quality files, playlists, user library (saved tracks/albums, followed artists), play history, lyrics, credits, charts, and offline downloads.

## Overview

A complete media streaming schema covering the core content catalog, user library management, listening history, playlists, discovery, and offline access. Designed after studying Spotify, Apple Music, YouTube Music, Tidal, SoundCloud, Deezer, Navidrome, Funkwhale, Jellyfin, and MusicBrainz.

The schema follows the standard **artist → album → track** content hierarchy used universally across streaming platforms. Junction tables (`album_tracks`, `artist_genres`, `track_credits`) handle many-to-many relationships — an album contains many tracks, a track can appear on multiple albums (singles, compilations, deluxe editions), and credits attribute multiple contributors per track with distinct roles.

Key design decisions:
- **Multi-quality file variants** via `track_files` — each track has multiple audio/video files at different bitrates and codecs (128kbps AAC, 320kbps OGG, FLAC lossless), enabling adaptive streaming and user quality preferences
- **Unified credits system** — `track_credits` uses a role enum to cover both performing artists (primary, featured) and production credits (writer, producer, composer), following Tidal's best-in-class pattern
- **Separate user library tables** over a polymorphic design — `saved_tracks`, `saved_albums`, and `followed_artists` are distinct tables for type safety, efficient indexing, and clear semantics
- **Append-only play history** — each stream is a separate row preserving full listening data, rather than upsert-per-track which loses temporal context
- **Charts as dedicated tables** — charts have ranking semantics (position, previous position, peak, weeks on chart) that don't fit the playlist model
- **Lyrics in a separate table** — not all tracks have lyrics, and synced/timed lyrics require structured data that would bloat the tracks table

Also works for: music streaming (Spotify, Apple Music, Tidal), video streaming (YouTube, Netflix-style catalogs), audiobook platforms (Audible), and any service with a content catalog, user library, and streaming playback.

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (20 tables)</summary>

- [`artists`](#1-artists)
- [`albums`](#2-albums)
- [`tracks`](#3-tracks)
- [`track_files`](#4-track_files)
- [`genres`](#5-genres)
- [`artist_genres`](#6-artist_genres)
- [`album_tracks`](#7-album_tracks)
- [`track_credits`](#8-track_credits)
- [`labels`](#9-labels)
- [`lyrics`](#10-lyrics)
- [`playlists`](#11-playlists)
- [`playlist_tracks`](#12-playlist_tracks)
- [`playlist_followers`](#13-playlist_followers)
- [`saved_tracks`](#14-saved_tracks)
- [`saved_albums`](#15-saved_albums)
- [`followed_artists`](#16-followed_artists)
- [`play_history`](#17-play_history)
- [`downloads`](#18-downloads)
- [`charts`](#19-charts)
- [`chart_entries`](#20-chart_entries)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users` | User identity for library actions, play history, playlist ownership, and all user-attributed operations |
| [File Management / Document Storage](../file-management-document-storage) | `files` | File references for track audio/video files, album cover art, and artist images |

## Tables

### Core Content
- `artists` — Artist/creator profiles with bio, images, verification status, follower count, and popularity score
- `albums` — Album/release metadata with type (album, single, EP, compilation), release date, cover art, and label association
- `tracks` — Individual playable media items with duration, explicit flag, popularity, and ISRC identifier
- `track_files` — Quality/format variants of tracks (bitrate, codec, file size) for adaptive streaming
- `genres` — Genre/category taxonomy for content organization and discovery
- `artist_genres` — Junction table linking artists to their genres
- `album_tracks` — Junction table linking albums to tracks with disc number and position ordering
- `track_credits` — Credits and contributors on tracks with role-based attribution (primary artist, featured, writer, producer, composer, mixer, engineer)
- `labels` — Record labels and publishers
- `lyrics` — Song lyrics with optional line-by-line sync timestamps

### Playlists
- `playlists` — User-created and editorial/curated playlists with visibility controls
- `playlist_tracks` — Ordered tracks within playlists with add metadata
- `playlist_followers` — Users who follow/save playlists they don't own

### User Library
- `saved_tracks` — User's liked/hearted tracks (Spotify's "Liked Songs" equivalent)
- `saved_albums` — User's saved albums in their library
- `followed_artists` — Users following artists for updates and recommendations

### Listening & Engagement
- `play_history` — Streaming history with duration played, completion percentage, and playback context
- `downloads` — Offline download records with status, expiry, quality selection, and device association

### Discovery
- `charts` — Chart/ranking definitions (e.g., "Top 50 — USA", "Viral 50 — Global", "New Releases")
- `chart_entries` — Individual ranked entries with position, movement tracking, and chart tenure

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. artists

Artist and creator profiles for the streaming catalog. Each artist has a display name, optional biography, images, verification status, and denormalized follower/monthly listener counts for profile display. Linked to genres via `artist_genres` and to tracks via `track_credits`.

```pseudo
table artists {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Display name of the artist.
  slug            string unique not_null       -- URL-friendly identifier (e.g., "taylor-swift").
  bio             string nullable              -- Artist biography / about text.
  image_file_id   uuid nullable references files(id) on_delete set_null  -- From File Management. Artist profile image.
  banner_file_id  uuid nullable references files(id) on_delete set_null  -- From File Management. Artist banner/header image.
  is_verified     boolean not_null default false  -- Whether the artist is verified (blue checkmark equivalent).
  follower_count  integer not_null default 0   -- Denormalized count of users following this artist.
  monthly_listeners integer not_null default 0 -- Denormalized count of unique listeners in the current period.
  popularity      integer not_null default 0   -- Popularity score (0-100), calculated from recent streams.
  external_url    string nullable              -- Official website or external link.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  -- unique(slug) is already created by the field constraint above.
  index(popularity)                            -- "Most popular artists" for discovery and charts.
  index(name)                                  -- Search and alphabetical browsing.
}
```

**Design notes:**
- `slug` enables clean URLs (`/artist/taylor-swift`) and is unique. Normalization (lowercase, hyphenated) happens at write time.
- `monthly_listeners` follows Spotify's pattern — a rolling count of unique listeners, updated periodically. This is the primary metric shown on artist profiles.
- `popularity` is a derived score (0-100) based on recent stream counts, similar to Spotify's popularity index. Useful for sorting and recommendations.
- `follower_count` is denormalized from `followed_artists` for fast profile rendering.

### 2. albums

Album and release metadata. An album has a type (album, single, EP, compilation), a primary artist, a release date, cover art, and an optional label association. Tracks are linked via the `album_tracks` junction table with disc and position ordering.

```pseudo
table albums {
  id              uuid primary_key default auto_generate
  title           string not_null              -- Album title.
  slug            string unique not_null       -- URL-friendly identifier.
  artist_id       uuid not_null references artists(id) on_delete cascade  -- Primary / album artist.
  label_id        uuid nullable references labels(id) on_delete set_null  -- Record label. Null for independent releases.
  album_type      enum(album, single, ep, compilation) not_null default album
  cover_file_id   uuid nullable references files(id) on_delete set_null  -- From File Management. Album cover artwork.
  release_date    string nullable              -- Release date as "YYYY-MM-DD" string. Nullable for unreleased/unknown.
  total_tracks    integer not_null default 0   -- Denormalized track count.
  total_duration_ms integer not_null default 0 -- Denormalized total duration in milliseconds.
  upc             string nullable              -- Universal Product Code for distribution identification.
  copyright       string nullable              -- Copyright notice text (e.g., "© 2024 Republic Records").
  popularity      integer not_null default 0   -- Popularity score (0-100).
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  -- unique(slug) is already created by the field constraint above.
  index(artist_id, release_date)               -- "Albums by this artist, sorted by release date."
  index(label_id)                              -- "Albums on this label."
  index(album_type, release_date)              -- "All singles released this week."
  index(popularity)                            -- "Most popular albums."
  index(release_date)                          -- "New releases."
}
```

**Design notes:**
- `artist_id` is the primary/album artist. For compilations or collaborations, the primary artist may be "Various Artists" or either collaborator. Per-track artist attribution is handled by `track_credits`.
- `release_date` is stored as a string (`"2024-03-15"`) rather than a timestamp because it represents a calendar date without a specific moment in time. Some releases only have year or year-month precision.
- `album_type` distinguishes full albums from singles, EPs, and compilations — a critical distinction for catalog browsing (Spotify, Apple Music, Tidal all surface this).
- `upc` (Universal Product Code) uniquely identifies the release for distribution and rights management.
- `total_tracks` and `total_duration_ms` are denormalized for list display without counting/summing `album_tracks`.

### 3. tracks

Individual playable media items — songs, videos, audiobook chapters, etc. Each track has a title, duration, explicit content flag, popularity score, and optional ISRC code. Linked to albums via `album_tracks`, to artists/contributors via `track_credits`, and to quality variants via `track_files`.

```pseudo
table tracks {
  id              uuid primary_key default auto_generate
  title           string not_null              -- Track title.
  duration_ms     integer not_null             -- Track duration in milliseconds.
  explicit        boolean not_null default false  -- Whether the track contains explicit content.
  isrc            string nullable              -- International Standard Recording Code (unique per recording).
  popularity      integer not_null default 0   -- Popularity score (0-100), based on recent streams.
  preview_url     string nullable              -- URL to a 30-second preview clip (for non-subscribers).
  play_count      integer not_null default 0   -- Denormalized total stream count.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(popularity)                            -- "Most popular tracks" for charts and discovery.
  index(play_count)                            -- "Most played tracks."
  index(isrc)                                  -- Look up track by ISRC code.
  index(title)                                 -- Search by track title.
}
```

**Design notes:**
- `duration_ms` is in milliseconds (not seconds) following Spotify/Tidal convention. More precise for progress tracking and UI display.
- `isrc` (International Standard Recording Code) uniquely identifies a sound recording globally. Format: CC-XXX-YY-NNNNN. Used for royalty tracking and deduplication across platforms.
- `popularity` is recalculated periodically from recent stream data — a track with 1M streams last month ranks higher than one with 10M streams 5 years ago.
- `play_count` is the all-time total stream count, denormalized from `play_history` for display on track pages.
- `explicit` flag enables parental controls and content filtering (required by all major platforms).
- No `artist_id` FK on tracks — artist attribution is handled entirely through `track_credits`, which supports multi-artist tracks and distinguishes primary from featured artists.

### 4. track_files

Quality and format variants of a track. Each track can have multiple files at different bitrates and codecs (e.g., AAC 128kbps, OGG 320kbps, FLAC lossless). Enables adaptive streaming based on network conditions and user quality preferences.

```pseudo
table track_files {
  id              uuid primary_key default auto_generate
  track_id        uuid not_null references tracks(id) on_delete cascade
  file_id         uuid not_null references files(id) on_delete restrict  -- From File Management. Restrict: don't delete a file attached to a track.
  quality         enum(low, normal, high, lossless) not_null
  codec           string not_null              -- Audio/video codec (e.g., "aac", "ogg", "flac", "mp3", "opus").
  bitrate_kbps    integer nullable             -- Bitrate in kilobits per second. Null for VBR or lossless.
  sample_rate_hz  integer nullable             -- Sample rate in Hz (e.g., 44100, 48000, 96000).
  file_size_bytes integer not_null             -- File size in bytes.
  created_at      timestamp default now
}

indexes {
  index(track_id, quality)                     -- "Files for this track at this quality level."
  index(file_id)                               -- "Which track uses this file?"
}
```

**Design notes:**
- `quality` is an enum representing the quality tier, not the exact bitrate. This maps to user preferences ("play in high quality") and platform tiers (free users get `low`/`normal`, premium gets `high`/`lossless`).
- `codec` is stored as a string rather than an enum because codec options evolve (Opus, Dolby Atmos, Sony 360 Reality Audio).
- `bitrate_kbps` is nullable for variable bitrate (VBR) and lossless formats where bitrate isn't a fixed value.
- No `updated_at` — track files are immutable. To update a file, replace it (delete + create).

### 5. genres

Genre and category taxonomy for organizing content. Genres are assigned to artists (via `artist_genres`) and used for discovery, filtering, and recommendations.

```pseudo
table genres {
  id              uuid primary_key default auto_generate
  name            string unique not_null       -- Genre name (e.g., "Pop", "Hip-Hop", "Classical", "Rock").
  slug            string unique not_null       -- URL-friendly identifier (e.g., "hip-hop").
  created_at      timestamp default now
}

indexes {
  -- unique(name) is already created by the field constraint above.
  -- unique(slug) is already created by the field constraint above.
}
```

**Design notes:**
- Genres are a flat list rather than a hierarchy. Spotify uses flat genres, and most streaming services avoid deep hierarchies. Sub-genres can be distinct entries (e.g., "Indie Rock" alongside "Rock").
- No `updated_at` — genre definitions are stable. Genre names don't change.
- The set of genres is platform-defined, not user-generated.

### 6. artist_genres

Junction table linking artists to their genres. An artist can belong to multiple genres (e.g., an artist can be both "Pop" and "R&B"). This is the primary genre assignment in the system — albums and tracks inherit genre context from their artists.

```pseudo
table artist_genres {
  id              uuid primary_key default auto_generate
  artist_id       uuid not_null references artists(id) on_delete cascade
  genre_id        uuid not_null references genres(id) on_delete cascade

  composite_unique(artist_id, genre_id)        -- One genre assignment per artist per genre.
}

indexes {
  index(genre_id)                              -- "All artists in this genre."
  -- composite_unique(artist_id, genre_id) covers index(artist_id) via leading column.
}
```

**Design notes:**
- Following Spotify's pattern, genres are assigned at the artist level. This avoids redundant genre tagging on every album and track.
- No timestamps — genre assignments are administrative metadata, not user-generated content.

### 7. album_tracks

Junction table linking albums to tracks with disc and position ordering. A track can appear on multiple albums (original album, greatest hits, deluxe edition, soundtrack compilation).

```pseudo
table album_tracks {
  id              uuid primary_key default auto_generate
  album_id        uuid not_null references albums(id) on_delete cascade
  track_id        uuid not_null references tracks(id) on_delete cascade
  disc_number     integer not_null default 1   -- Disc number for multi-disc releases.
  position        integer not_null             -- Track position within the disc (1-based).

  composite_unique(album_id, disc_number, position)  -- No duplicate positions within an album disc.
}

indexes {
  index(track_id)                              -- "Which albums contain this track?"
  -- composite_unique(album_id, disc_number, position) covers index(album_id) via leading column.
}
```

**Design notes:**
- `disc_number` supports multi-disc releases (double albums, box sets). Default 1 for single-disc releases.
- `position` is 1-based to match user expectations and ID3 tag conventions.
- The composite unique on `(album_id, disc_number, position)` prevents duplicate track positions within the same disc.
- A track appearing on multiple albums (e.g., a hit single on both the original album and a compilation) has multiple rows in this table.

### 8. track_credits

Credits and contributors on tracks. Each row represents one contributor's role on one track. Covers both performing artists (primary, featured) and production credits (writer, producer, composer, mixer, engineer). Follows Tidal's comprehensive credits model.

```pseudo
table track_credits {
  id              uuid primary_key default auto_generate
  track_id        uuid not_null references tracks(id) on_delete cascade
  artist_id       uuid not_null references artists(id) on_delete cascade
  role            enum(primary_artist, featured_artist, writer, producer, composer, mixer, engineer) not_null

  composite_unique(track_id, artist_id, role)  -- One credit per artist per role per track.
}

indexes {
  index(artist_id, role)                       -- "All tracks where this artist is a writer."
  -- composite_unique(track_id, artist_id, role) covers index(track_id) via leading column.
}
```

**Design notes:**
- `primary_artist` is the main performing artist displayed in the UI (e.g., "Drake"). A track typically has one primary artist but can have multiple.
- `featured_artist` is a secondary performer credited on the track (e.g., "feat. 21 Savage").
- Production roles (writer, producer, composer, mixer, engineer) follow Tidal's credits system — the most comprehensive in the industry.
- The composite unique allows an artist to have multiple roles on the same track (e.g., an artist who is both primary_artist and writer).
- No timestamps — credits are metadata, not temporal data.

### 9. labels

Record labels and publishers. Albums reference labels via FK. A label has a name and optional metadata.

```pseudo
table labels {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Label name (e.g., "Republic Records", "XL Recordings").
  slug            string unique not_null       -- URL-friendly identifier.
  website         string nullable              -- Label's official website.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  -- unique(slug) is already created by the field constraint above.
  index(name)                                  -- Search by label name.
}
```

**Design notes:**
- Labels are entities rather than a string field on albums because multiple albums share the same label, and labels may have their own profile pages.
- Minimal metadata — labels are reference data, not a primary user-facing entity. The schema can be extended with description, logo, etc. if needed.

### 10. lyrics

Lyrics for tracks. Supports both plain text lyrics and synced (line-by-line timed) lyrics. Not all tracks have lyrics — this separate table keeps the tracks table lean.

```pseudo
table lyrics {
  id              uuid primary_key default auto_generate
  track_id        uuid unique not_null references tracks(id) on_delete cascade  -- One lyrics entry per track.
  plain_text      string nullable              -- Full lyrics as plain text. Null if only synced lyrics are available.
  synced_text     json nullable                -- Synced lyrics as JSON array of {time_ms, line} objects for karaoke-style display.
  language        string nullable              -- ISO 639-1 language code (e.g., "en", "es", "ja").
  source          string nullable              -- Attribution for lyrics source (e.g., "Musixmatch", "Genius", "Artist-provided").
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  -- unique(track_id) is already created by the field constraint above.
  index(language)                              -- "All tracks with lyrics in this language."
}
```

**Design notes:**
- `plain_text` is the full lyrics as a single text block for display and search.
- `synced_text` is a JSON array of `{time_ms: number, line: string}` objects enabling real-time lyric highlighting (Spotify, Apple Music, YouTube Music all support this).
- Both fields are nullable — a track may have only plain text, only synced, both, or neither (though if neither, no row should exist).
- One lyrics entry per track (enforced by unique on `track_id`). Translations would be separate rows in an i18n system.

### 11. playlists

User-created and editorial playlists. A playlist has an owner, a name, visibility settings, and denormalized counters. Supports user playlists, collaborative playlists, and platform-curated editorial playlists.

```pseudo
table playlists {
  id              uuid primary_key default auto_generate
  owner_id        uuid not_null references users(id) on_delete cascade  -- From Auth / RBAC. Playlist creator.
  name            string not_null              -- Playlist name.
  description     string nullable              -- Playlist description.
  cover_file_id   uuid nullable references files(id) on_delete set_null  -- From File Management. Custom playlist cover image.
  is_public       boolean not_null default true -- Whether the playlist is visible to other users.
  is_collaborative boolean not_null default false  -- Whether other users can add/remove tracks.
  track_count     integer not_null default 0   -- Denormalized count of tracks.
  follower_count  integer not_null default 0   -- Denormalized count of followers.
  total_duration_ms integer not_null default 0 -- Denormalized total duration in milliseconds.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(owner_id, created_at)                  -- "Playlists by this user, newest first."
  index(is_public, follower_count)             -- "Popular public playlists."
}
```

**Design notes:**
- `is_collaborative` enables Spotify-style collaborative playlists where multiple users can add tracks.
- `is_public` controls visibility — private playlists are only visible to the owner (and collaborators).
- Denormalized counters (`track_count`, `follower_count`, `total_duration_ms`) enable fast playlist listing without counting joins.
- Editorial/curated playlists (e.g., Spotify's "Today's Top Hits") are regular playlists owned by a platform admin user.

### 12. playlist_tracks

Ordered tracks within playlists. Each row represents one track in one playlist at a specific position. Tracks can appear in multiple playlists. The `added_by` field supports collaborative playlists.

```pseudo
table playlist_tracks {
  id              uuid primary_key default auto_generate
  playlist_id     uuid not_null references playlists(id) on_delete cascade
  track_id        uuid not_null references tracks(id) on_delete cascade
  added_by        uuid not_null references users(id) on_delete cascade  -- Who added this track (relevant for collaborative playlists).
  position        integer not_null             -- Display order within the playlist (0-based).
  added_at        timestamp default now        -- When the track was added.
}

indexes {
  index(playlist_id, position)                 -- "Tracks in this playlist, in order."
  index(track_id)                              -- "Which playlists contain this track?"
}
```

**Design notes:**
- `position` is 0-based for consistency with array indexing in application code. Reordering updates position values.
- `added_by` tracks who added each track — essential for collaborative playlists where multiple users contribute.
- `added_at` is separate from `created_at` to explicitly capture when the track was added to the playlist.
- A track can appear multiple times in the same playlist (no unique constraint on playlist_id + track_id). Some users intentionally repeat tracks in playlists.

### 13. playlist_followers

Users who follow/save playlists they don't own. Following a playlist adds it to the user's library and subscribes them to updates. The playlist owner automatically "follows" their own playlists (handled in application logic, not this table).

```pseudo
table playlist_followers {
  id              uuid primary_key default auto_generate
  playlist_id     uuid not_null references playlists(id) on_delete cascade
  user_id         uuid not_null references users(id) on_delete cascade

  created_at      timestamp default now

  composite_unique(playlist_id, user_id)       -- One follow per user per playlist.
}

indexes {
  index(user_id, created_at)                   -- "Playlists this user follows, newest first."
  -- composite_unique(playlist_id, user_id) covers index(playlist_id) via leading column.
}
```

### 14. saved_tracks

User's liked/hearted tracks. Equivalent to Spotify's "Liked Songs" — pressing the heart button on a track creates a row here. Separate from playlist tracks to keep the "Liked Songs" collection fast and clean.

```pseudo
table saved_tracks {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade
  track_id        uuid not_null references tracks(id) on_delete cascade

  created_at      timestamp default now

  composite_unique(user_id, track_id)          -- One save per user per track.
}

indexes {
  index(user_id, created_at)                   -- "This user's liked songs, newest first."
  -- composite_unique(user_id, track_id) covers index(user_id) via leading column.
}
```

### 15. saved_albums

User's saved albums. Saving an album adds it to the user's library for quick access. Separate from `saved_tracks` because saving an album is a distinct action from liking individual tracks.

```pseudo
table saved_albums {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade
  album_id        uuid not_null references albums(id) on_delete cascade

  created_at      timestamp default now

  composite_unique(user_id, album_id)          -- One save per user per album.
}

indexes {
  index(user_id, created_at)                   -- "This user's saved albums, newest first."
  -- composite_unique(user_id, album_id) covers index(user_id) via leading column.
}
```

### 16. followed_artists

Users following artists. Following an artist adds their releases to the user's home feed, enables notifications for new releases, and contributes to the artist's `follower_count`. Separate from social-media follows — this is about content discovery, not social connections.

```pseudo
table followed_artists {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade
  artist_id       uuid not_null references artists(id) on_delete cascade

  created_at      timestamp default now

  composite_unique(user_id, artist_id)         -- One follow per user per artist.
}

indexes {
  index(artist_id)                             -- "Who follows this artist?" (for follower count and notifications).
  -- composite_unique(user_id, artist_id) covers index(user_id) via leading column.
}
```

### 17. play_history

Streaming history. Each row represents one play event — a user listened to a track. Records duration played, completion percentage, and the context in which the track was played (playlist, album, radio, etc.). Append-only log for analytics and "recently played" features.

```pseudo
table play_history {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade
  track_id        uuid not_null references tracks(id) on_delete cascade
  duration_ms     integer not_null             -- How long the user actually listened, in milliseconds.
  completed       boolean not_null default false  -- Whether the track was played to completion (or near-completion).
  context_type    enum(album, playlist, artist, chart, search, queue, unknown) not_null default unknown
                                               -- What the user was browsing when they played this track.
  context_id      string nullable              -- ID of the context entity (album ID, playlist ID, etc.). String to accommodate any ID format.
  played_at       timestamp default now        -- When playback started.
}

indexes {
  index(user_id, played_at)                    -- "This user's listening history, most recent first."
  index(track_id, played_at)                   -- "Play history for this track" (for analytics and play count).
}
```

**Design notes:**
- `duration_ms` tracks actual listening time. A "stream" typically counts when the user listens for ≥30 seconds (Spotify/Apple Music threshold). The application layer applies this rule.
- `completed` indicates whether the user heard the full track (or close to it). Useful for skip-rate analytics and recommendation quality signals.
- `context_type` + `context_id` record where the user was when they started playback. This is critical for playlist and album analytics (e.g., "80% of streams for this track come from Discover Weekly").
- No `updated_at` — play history is append-only. Each play event is immutable.

### 18. downloads

Offline download records. When a user downloads a track for offline playback, a row is created here tracking the download status, the quality variant selected, and an optional expiry date. Downloads may expire based on subscription status or licensing terms.

```pseudo
table downloads {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade
  track_id        uuid not_null references tracks(id) on_delete cascade
  track_file_id   uuid not_null references track_files(id) on_delete cascade  -- The specific quality variant downloaded.
  status          enum(pending, downloading, completed, expired, failed) not_null default pending
  expires_at      timestamp nullable           -- When this download expires. Null = no expiry.
  downloaded_at   timestamp nullable           -- When the download completed. Null if not yet completed.
  created_at      timestamp default now

  composite_unique(user_id, track_file_id)     -- One download per user per file variant.
}

indexes {
  index(user_id, status)                       -- "This user's active downloads."
  index(expires_at)                            -- Cleanup job: remove expired downloads.
  -- composite_unique(user_id, track_file_id) covers index(user_id) via leading column.
}
```

**Design notes:**
- `track_file_id` references the specific quality variant the user downloaded (e.g., high quality OGG vs lossless FLAC).
- `status` tracks the download lifecycle: pending → downloading → completed → expired.
- `expires_at` supports DRM-style expiry (e.g., "downloads expire 30 days after subscription lapses").
- The composite unique prevents duplicate downloads of the same file variant. A user can download the same track at different quality levels.

### 19. charts

Chart and ranking definitions. Each chart has a name, type, and optional regional scope. Charts are updated periodically (daily, weekly) by platform analytics. Examples: "Top 50 — USA", "Viral 50 — Global", "New Releases — UK".

```pseudo
table charts {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Chart name (e.g., "Top 50", "Viral 50", "New Releases").
  slug            string unique not_null       -- URL-friendly identifier (e.g., "top-50-usa").
  description     string nullable              -- Brief description of the chart's methodology.
  chart_type      enum(top, viral, new_releases, trending) not_null
  region          string nullable              -- ISO 3166-1 alpha-2 country code (e.g., "US", "GB"). Null = global.
  is_active       boolean not_null default true -- Whether this chart is currently being updated.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  -- unique(slug) is already created by the field constraint above.
  index(chart_type, region)                    -- "All top charts for this region."
  index(is_active)                             -- "Active charts."
}
```

**Design notes:**
- `chart_type` categorizes charts by their methodology: `top` (most-streamed), `viral` (fastest-growing), `new_releases` (recently released), `trending` (gaining momentum).
- `region` is nullable — null means global. Regional charts use ISO country codes.
- Charts are platform-managed entities, not user-created. The `is_active` flag allows retiring charts without deleting historical data.

### 20. chart_entries

Individual ranked entries in a chart. Each row represents one track's position on one chart at a specific snapshot date. Historical entries are preserved for trend tracking ("this track debuted at #5 and peaked at #1").

```pseudo
table chart_entries {
  id              uuid primary_key default auto_generate
  chart_id        uuid not_null references charts(id) on_delete cascade
  track_id        uuid not_null references tracks(id) on_delete cascade
  position        integer not_null             -- Current chart position (1-based).
  previous_position integer nullable           -- Position on the previous chart update. Null for new entries.
  peak_position   integer not_null             -- Highest (lowest number) position achieved.
  weeks_on_chart  integer not_null default 1   -- Total weeks this track has appeared on this chart.
  chart_date      string not_null              -- Chart period date as "YYYY-MM-DD" (the date this chart snapshot applies to).
  created_at      timestamp default now
}

indexes {
  index(chart_id, chart_date, position)        -- "Chart rankings for this date, in order."
  index(track_id, chart_date)                  -- "This track's chart history."
}
```

**Design notes:**
- `position` is 1-based (position 1 = #1 on the chart).
- `previous_position` enables movement indicators (↑ up, ↓ down, ● new entry).
- `peak_position` tracks the track's best-ever performance on this chart.
- `weeks_on_chart` is cumulative — a track that leaves and re-enters the chart continues counting.
- `chart_date` is a string (`"2024-03-15"`) representing the chart period, not a timestamp. Charts are published for a specific date/week.
- Historical entries are preserved. To get the current chart, query the latest `chart_date` for a given `chart_id`.

## Relationships

```
artists            1 ──── * albums (as primary artist)      (one artist has many albums)
artists            1 ──── * artist_genres                   (one artist has many genres)
artists            1 ──── * track_credits                   (one artist has many credits)
artists            1 ──── * followed_artists                (one artist has many followers)
albums             1 ──── * album_tracks                    (one album has many tracks)
albums             1 ──── * saved_albums                    (one album is saved by many users)
tracks             1 ──── * album_tracks                    (one track appears on many albums)
tracks             1 ──── * track_files                     (one track has many quality variants)
tracks             1 ──── * track_credits                   (one track has many credits)
tracks             1 ──── 1 lyrics                          (one track has one lyrics entry)
tracks             1 ──── * playlist_tracks                 (one track appears in many playlists)
tracks             1 ──── * saved_tracks                    (one track is saved by many users)
tracks             1 ──── * play_history                    (one track has many play events)
tracks             1 ──── * downloads                       (one track is downloaded by many users)
tracks             1 ──── * chart_entries                   (one track appears on many charts)
track_files        1 ──── * downloads                       (one file variant has many downloads)
genres             1 ──── * artist_genres                   (one genre applies to many artists)
labels             1 ──── * albums                          (one label has many albums)
playlists          1 ──── * playlist_tracks                 (one playlist has many tracks)
playlists          1 ──── * playlist_followers              (one playlist has many followers)
charts             1 ──── * chart_entries                   (one chart has many entries)
users              1 ──── * playlists                       (one user owns many playlists)
users              1 ──── * saved_tracks                    (one user saves many tracks)
users              1 ──── * saved_albums                    (one user saves many albums)
users              1 ──── * followed_artists                (one user follows many artists)
users              1 ──── * play_history                    (one user has many play events)
users              1 ──── * downloads                       (one user has many downloads)
users              1 ──── * playlist_followers              (one user follows many playlists)
users              1 ──── * playlist_tracks (added_by)      (one user adds many tracks to playlists)
files              1 ──── * artists (image)                 (one file is used as many artist images)
files              1 ──── * artists (banner)                (one file is used as many artist banners)
files              1 ──── * albums (cover)                  (one file is used as many album covers)
files              1 ──── * playlists (cover)               (one file is used as many playlist covers)
files              1 ──── * track_files                     (one file backs many track file variants)
```

## Best Practices

- **Stream counting**: A play event counts as a "stream" when the user listens for ≥30 seconds (industry standard threshold). Apply this rule in the application layer when incrementing `tracks.play_count` from `play_history` rows.
- **Popularity calculation**: Recalculate `popularity` scores periodically (daily/weekly) using a time-decayed formula that weights recent streams more heavily. Do not update on every play event — batch processing is more efficient.
- **Playlist ordering**: Use `playlist_tracks.position` for display order. When reordering, update positions in a transaction. Consider a gap-based numbering scheme (positions 0, 100, 200...) to reduce updates on insertions.
- **Denormalized counter accuracy**: Update `follower_count`, `play_count`, `track_count`, etc. via atomic increment/decrement operations. Accept eventual consistency — exact counts are not critical for UX.
- **Chart generation**: Generate chart snapshots as batch jobs (daily or weekly). Insert all entries for the new period as new rows in `chart_entries` rather than updating existing rows. This preserves full history.
- **Offline downloads**: Check `downloads.expires_at` at app startup and during playback. Remove expired downloads from the device and update status to `expired`.
- **Credit display**: Display `primary_artist` and `featured_artist` credits as the track's artist line (e.g., "Drake feat. 21 Savage"). Show production credits (writer, producer, etc.) in a separate "Credits" section on the track detail page.
- **Album browsing**: Use `album_tracks.disc_number` and `album_tracks.position` for track listing order. Always sort by disc number first, then position.
- **Search**: Index `artists.name`, `albums.title`, `tracks.title`, and `playlists.name` for full-text search. Consider a dedicated search index (Elasticsearch, Meilisearch) for production use.
- **Lyrics sync**: For synced lyrics display, binary search `synced_text` by `time_ms` during playback to highlight the current line. Pre-load lyrics when playback starts to avoid latency.

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
