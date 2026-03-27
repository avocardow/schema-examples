# Video Conferencing

> Real-time video meetings with rooms, participants, recordings, transcripts, breakout rooms, polls, and quality monitoring.

## Overview

A complete video conferencing schema supporting persistent rooms, scheduled and instant meetings, participant tracking, recordings with access control, live transcription, breakout sessions, waiting rooms, in-meeting polls, reactions, chat, and connection quality monitoring. Designed after studying Zoom, Daily.co, Twilio Video, LiveKit, Agora, Microsoft Teams, Google Meet, and Jitsi Meet.

The schema follows a **two-level room/meeting model** — rooms are persistent configurations (like a "Daily Standup" room or a personal meeting room), and meetings are individual sessions that occur within rooms. This supports both the room-first pattern (Daily.co, Twilio, LiveKit) where rooms exist permanently and meetings happen within them, and the meeting-first pattern (Zoom, Teams) where scheduling a meeting auto-creates the room.

Key design decisions:
- **Two-level room/meeting model** over a single meeting entity (Daily.co, Twilio, LiveKit pattern) — enables persistent rooms with recurring meetings
- **Per-session participant tracking** with join/leave timestamps and roles (universal pattern across all platforms)
- **Recording metadata with access grants** — actual files stored via file-management domain, access controlled per-user (Zoom, Teams pattern)
- **Transcript segments** as separate rows for search and playback sync (Teams, Zoom pattern)
- **Breakout rooms** as meeting sub-groups with participant assignment (Zoom, Teams, Google Meet pattern)
- **Waiting room / lobby** as an admission queue with explicit admit/reject (Zoom pattern)
- **In-meeting polls** with typed responses (Zoom, Teams pattern)
- **Quality logs** per participant for WebRTC monitoring (LiveKit, Daily.co pattern)

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (15 tables)</summary>

- [`rooms`](#1-rooms)
- [`meetings`](#2-meetings)
- [`meeting_participants`](#3-meeting_participants)
- [`meeting_invitations`](#4-meeting_invitations)
- [`recordings`](#5-recordings)
- [`recording_access_grants`](#6-recording_access_grants)
- [`meeting_chat_messages`](#7-meeting_chat_messages)
- [`breakout_rooms`](#8-breakout_rooms)
- [`waiting_room_entries`](#9-waiting_room_entries)
- [`meeting_polls`](#10-meeting_polls)
- [`poll_responses`](#11-poll_responses)
- [`meeting_reactions`](#12-meeting_reactions)
- [`transcripts`](#13-transcripts)
- [`transcript_segments`](#14-transcript_segments)
- [`quality_logs`](#15-quality_logs)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users` | User identity for room ownership, meeting hosting, participant tracking, and access control |
| [File Management / Document Storage](../file-management-document-storage) | `files` | File references for recordings and chat message attachments |

## Tables

### Core
- `rooms` — Persistent video room configurations with settings and access control
- `meetings` — Individual meeting sessions within rooms
- `meeting_participants` — Participant join/leave records with roles and media state

### Scheduling
- `meeting_invitations` — Invitations to scheduled meetings with RSVP tracking

### Recordings & Transcription
- `recordings` — Meeting recording metadata and processing status
- `recording_access_grants` — Per-user access control for recordings
- `transcripts` — Meeting transcription metadata and processing status
- `transcript_segments` — Individual speaker utterances within transcripts

### In-Meeting Features
- `meeting_chat_messages` — Text messages sent during meetings
- `breakout_rooms` — Sub-rooms for breakout sessions within meetings
- `waiting_room_entries` — Lobby/admission queue for meetings with waiting rooms enabled
- `meeting_polls` — Polls created by hosts during meetings
- `poll_responses` — Participant responses to meeting polls
- `meeting_reactions` — Emoji reactions during meetings

### Monitoring
- `quality_logs` — Per-participant connection quality metrics

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. rooms

Persistent video room configuration. A room is a reusable space where meetings happen — like a "Daily Standup" room or a personal meeting room. Rooms can be permanent (always available) or temporary (auto-deleted after the last meeting ends). Inspired by Daily.co's room model and Zoom's Personal Meeting Rooms.

```pseudo
table rooms {
  id              uuid primary_key default auto_generate
  name            string not_null                -- Display name (e.g., "Engineering Standup", "Interview Room 3").
  slug            string unique not_null         -- URL-safe identifier for the room. Used in join URLs: /room/{slug}.
  description     string nullable                -- Optional description shown in room info.

  -- Room configuration.
  type            enum(permanent, temporary) not_null default permanent
                                                 -- permanent = always available, reusable.
                                                 -- temporary = auto-deleted after last meeting ends or after max_duration.

  max_participants integer nullable              -- Maximum concurrent participants. Null = platform default (e.g., 100).
  enable_waiting_room boolean not_null default false -- Whether participants must be admitted from a waiting room.
  enable_recording boolean not_null default false -- Whether recording is allowed in this room.
  enable_chat     boolean not_null default true  -- Whether in-meeting chat is enabled.
  enable_transcription boolean not_null default false -- Whether live transcription is enabled.
  enable_breakout_rooms boolean not_null default false -- Whether breakout rooms can be created.

  -- Access control.
  is_private      boolean not_null default false -- Private rooms require an invitation or password to join.
  password_hash   string nullable                -- Hashed room password. Null = no password required.
  -- Security: Store only hashed passwords, never plaintext.

  created_by      uuid not_null references users(id) on_delete restrict
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  -- unique(slug) is already created by the field constraint above.
  index(created_by)                              -- "Rooms created by this user."
  index(type)                                    -- "All permanent rooms" or "All temporary rooms."
  index(is_private)                              -- "All public rooms" for room discovery.
}
```

**Design notes:**
- `slug` is the unique, URL-safe room identifier. Join links look like `/room/{slug}` (similar to Daily.co room URLs).
- `type` distinguishes persistent rooms from ephemeral ones. Temporary rooms are cleaned up when no longer in use.
- Room settings (`enable_*`) configure what features are available. These are room-level defaults; individual meetings can override some settings.
- `password_hash` enables password-protected rooms (Zoom pattern). Never store plaintext passwords.

### 2. meetings

An individual meeting session within a room. A room can have many meetings over time (like a recurring standup). Meetings track schedule, duration, and lifecycle status. Inspired by Zoom's meeting model and Daily.co's meeting sessions.

```pseudo
table meetings {
  id              uuid primary_key default auto_generate
  room_id         uuid not_null references rooms(id) on_delete cascade
  title           string nullable                -- Optional meeting title (e.g., "Sprint Planning #42"). Null = use room name.

  -- Scheduling.
  status          enum(scheduled, live, ended, cancelled) not_null default scheduled
                                                 -- scheduled = upcoming meeting.
                                                 -- live = currently in progress.
                                                 -- ended = completed normally.
                                                 -- cancelled = cancelled before it started.

  scheduled_start timestamp nullable             -- Planned start time. Null = instant meeting (no schedule).
  scheduled_end   timestamp nullable             -- Planned end time. Null = no fixed end time.
  actual_start    timestamp nullable             -- When the meeting actually started (first participant joined or host started).
  actual_end      timestamp nullable             -- When the meeting actually ended (host ended or last participant left).

  -- Meeting configuration (overrides room defaults for this session).
  max_participants integer nullable              -- Override room max. Null = use room setting.
  enable_waiting_room boolean nullable           -- Override room setting. Null = use room setting.

  -- Metadata.
  host_id         uuid not_null references users(id) on_delete restrict  -- The meeting host. Restrict: don't orphan meetings.
  participant_count integer not_null default 0   -- Denormalized: total unique participants who joined.

  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(room_id, scheduled_start)                -- "Meetings in this room, ordered by schedule."
  index(host_id)                                 -- "Meetings hosted by this user."
  index(status)                                  -- "All live meetings" or "All scheduled meetings."
  index(scheduled_start)                         -- "Upcoming meetings across all rooms."
  index(actual_start)                            -- "Recent meetings" for history views.
}
```

**Design notes:**
- `status` tracks the meeting lifecycle. Transitions: scheduled → live → ended, or scheduled → cancelled.
- `scheduled_start`/`scheduled_end` are for planned time; `actual_start`/`actual_end` capture what really happened. Instant meetings have null scheduled times.
- `enable_waiting_room` is nullable — null means "inherit from room settings." Explicit true/false overrides the room default.
- `participant_count` is denormalized for display efficiency (avoid COUNT on every meeting list render).

### 3. meeting_participants

Tracks who joined each meeting, when, and in what role. One row per user per meeting (updated on rejoin). Records join/leave times, role, and last-known media state. Essential for attendance tracking, billing, and analytics.

```pseudo
table meeting_participants {
  id              uuid primary_key default auto_generate
  meeting_id      uuid not_null references meetings(id) on_delete cascade
  user_id         uuid nullable references users(id) on_delete set_null
                                                 -- Null = anonymous/guest participant (joined without account).
  display_name    string not_null                -- Participant's display name at join time. Stored here for history even if user is deleted.

  -- Role within the meeting.
  role            enum(host, co_host, moderator, attendee, viewer) not_null default attendee
                                                 -- host = meeting organizer, full control.
                                                 -- co_host = delegated host privileges.
                                                 -- moderator = can mute/remove participants.
                                                 -- attendee = full audio/video participation.
                                                 -- viewer = view-only (webinar-style).

  -- Attendance tracking.
  joined_at       timestamp not_null default now -- When the participant first joined.
  left_at         timestamp nullable             -- When the participant left. Null = still in the meeting.
  duration_seconds integer nullable              -- Total time in meeting (seconds). Calculated on leave. Null = still in meeting.

  -- Last-known media state (updated periodically, not real-time).
  is_camera_on    boolean not_null default false
  is_mic_on       boolean not_null default false
  is_screen_sharing boolean not_null default false

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  composite_unique(meeting_id, user_id)          -- One record per user per meeting. Updated on rejoin.
}

indexes {
  index(user_id)                                 -- "All meetings this user attended."
  index(meeting_id, joined_at)                   -- "Participants in this meeting, ordered by join time."
  -- composite_unique(meeting_id, user_id) covers index(meeting_id) via leading column.
}
```

**Design notes:**
- `user_id` is nullable to support anonymous/guest participants who join without an account (common in video conferencing).
- `display_name` is stored on the participant record (not derived from user) to preserve history even after user deletion.
- `composite_unique(meeting_id, user_id)` means one record per user per meeting. If a user leaves and rejoins, the same record is updated (left_at cleared, duration recalculated).
- Media state fields (`is_camera_on`, etc.) store the last-known state. Real-time state belongs in the signaling layer, not the database.

### 4. meeting_invitations

Invitations to scheduled meetings. When a host schedules a meeting, invitations are sent to participants. Invitees can accept, decline, or remain tentative. Follows the calendar invitation pattern (Zoom, Teams, Google Meet).

```pseudo
table meeting_invitations {
  id              uuid primary_key default auto_generate
  meeting_id      uuid not_null references meetings(id) on_delete cascade
  inviter_id      uuid not_null references users(id) on_delete cascade
  invitee_id      uuid not_null references users(id) on_delete cascade

  status          enum(pending, accepted, declined, tentative) not_null default pending
  responded_at    timestamp nullable             -- When the invitee responded.
  message         string nullable                -- Optional message from the inviter.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  composite_unique(meeting_id, invitee_id)       -- One invitation per user per meeting.
}

indexes {
  index(invitee_id, status)                      -- "Pending invitations for this user."
  index(meeting_id, status)                      -- "Accepted invitees for this meeting."
  -- composite_unique(meeting_id, invitee_id) covers index(meeting_id) via leading column.
}
```

### 5. recordings

Meeting recording metadata. Actual media files are stored via the file-management domain. A meeting can have multiple recordings (e.g., separate audio/video tracks, or multiple recording sessions within one meeting). Inspired by Twilio's recording model and Zoom's cloud recordings.

```pseudo
table recordings {
  id              uuid primary_key default auto_generate
  meeting_id      uuid not_null references meetings(id) on_delete cascade
  file_id         uuid nullable references files(id) on_delete set_null  -- From File Management. Null while recording is processing.

  -- Recording metadata.
  type            enum(composite, audio_only, video_only, screen_share) not_null default composite
                                                 -- composite = mixed audio + video of all participants.
                                                 -- audio_only = audio track only.
                                                 -- video_only = video without audio.
                                                 -- screen_share = screen share recording.

  status          enum(recording, processing, ready, failed, deleted) not_null default recording
                                                 -- recording = currently being recorded.
                                                 -- processing = recording stopped, file being processed/encoded.
                                                 -- ready = file available for playback/download.
                                                 -- failed = processing failed.
                                                 -- deleted = soft-deleted (file may still exist for retention).

  duration_seconds integer nullable              -- Recording duration in seconds. Null while recording or processing.
  file_size       bigint nullable                -- File size in bytes. Null while recording or processing.

  started_at      timestamp not_null default now -- When recording started.
  ended_at        timestamp nullable             -- When recording stopped.
  started_by      uuid nullable references users(id) on_delete set_null  -- Who started the recording.

  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(meeting_id)                              -- "All recordings for this meeting."
  index(status)                                  -- "All processing recordings" (for async pipeline monitoring).
  index(started_by)                              -- "Recordings started by this user."
}
```

**Design notes:**
- `file_id` is nullable because the file doesn't exist until processing completes. The recording is created when recording starts (status=recording), and `file_id` is set when processing finishes (status=ready).
- `type` supports Twilio's model of separate tracks. Most apps will use `composite` for a single mixed recording.
- `status` tracks the async pipeline: recording → processing → ready. This is a common pattern across Zoom, Twilio, and Agora.

### 6. recording_access_grants

Per-user access control for recordings. By default, only the meeting host and recording creator can access recordings. This table grants access to additional users. Supports both explicit user grants and link-based sharing.

```pseudo
table recording_access_grants {
  id              uuid primary_key default auto_generate
  recording_id    uuid not_null references recordings(id) on_delete cascade
  granted_to      uuid not_null references users(id) on_delete cascade  -- The user being granted access.
  granted_by      uuid not_null references users(id) on_delete cascade  -- Who granted the access.

  permission      enum(view, download) not_null default view
                                                 -- view = can watch the recording in-app.
                                                 -- download = can download the recording file.

  expires_at      timestamp nullable             -- Access expiration. Null = never expires.

  created_at      timestamp default now

  composite_unique(recording_id, granted_to)     -- One grant per user per recording.
}

indexes {
  index(granted_to)                              -- "All recordings this user has access to."
  -- composite_unique(recording_id, granted_to) covers index(recording_id) via leading column.
}
```

### 7. meeting_chat_messages

Text messages sent during a meeting. In-meeting chat is contextual to the meeting session (different from general messaging/chat domain). Messages can be sent to everyone or to a specific participant (private message).

```pseudo
table meeting_chat_messages {
  id              uuid primary_key default auto_generate
  meeting_id      uuid not_null references meetings(id) on_delete cascade
  sender_id       uuid nullable references users(id) on_delete set_null  -- Null = system message.
  recipient_id    uuid nullable references users(id) on_delete set_null  -- Null = sent to everyone. Non-null = private message.

  content         string not_null                -- Message text.

  created_at      timestamp default now
}

indexes {
  index(meeting_id, created_at)                  -- "Chat messages in this meeting, ordered by time."
  index(sender_id)                               -- "Messages sent by this user."
}
```

**Design notes:**
- `recipient_id` enables private messages within a meeting. Null = public message visible to all participants.
- No `updated_at` — in-meeting chat messages are typically immutable (no editing).
- This is intentionally separate from the messaging-chat domain. In-meeting chat is ephemeral, contextual to a meeting session, and has different access patterns.

### 8. breakout_rooms

Sub-rooms within a meeting for smaller group discussions. The host creates breakout rooms and assigns participants. Inspired by Zoom (up to 50 breakout rooms) and Google Meet (up to 100).

```pseudo
table breakout_rooms {
  id              uuid primary_key default auto_generate
  meeting_id      uuid not_null references meetings(id) on_delete cascade
  name            string not_null                -- Breakout room name (e.g., "Group 1", "Design Team").
  position        integer not_null default 0     -- Display order among breakout rooms.

  status          enum(pending, open, closed) not_null default pending
                                                 -- pending = created but not yet opened.
                                                 -- open = participants can join.
                                                 -- closed = session ended, participants returned to main room.

  opened_at       timestamp nullable             -- When the breakout room was opened.
  closed_at       timestamp nullable             -- When the breakout room was closed.

  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(meeting_id, position)                    -- "Breakout rooms in this meeting, in order."
  index(meeting_id, status)                      -- "Open breakout rooms in this meeting."
}
```

**Design notes:**
- Breakout rooms are linked to the meeting, not the room. Each meeting creates its own set of breakout rooms.
- `position` controls display order so hosts can organize breakout rooms logically.
- Participant assignment to breakout rooms is tracked by updating `meeting_participants` or through a join table. For simplicity, this schema assumes participants are moved between the main room and breakout rooms via the real-time signaling layer, with the breakout room as a logical grouping.

### 9. waiting_room_entries

Lobby/admission queue for meetings with waiting rooms enabled. When a participant tries to join a meeting with `enable_waiting_room = true`, they're placed in the waiting room until the host admits or rejects them. Inspired by Zoom's waiting room feature.

```pseudo
table waiting_room_entries {
  id              uuid primary_key default auto_generate
  meeting_id      uuid not_null references meetings(id) on_delete cascade
  user_id         uuid nullable references users(id) on_delete cascade  -- Null = anonymous guest.
  display_name    string not_null                -- Name shown in the waiting room list.

  status          enum(waiting, admitted, rejected) not_null default waiting
                                                 -- waiting = in the lobby, not yet admitted.
                                                 -- admitted = host allowed entry.
                                                 -- rejected = host denied entry.

  admitted_by     uuid nullable references users(id) on_delete set_null  -- Host/co-host who admitted or rejected.
  responded_at    timestamp nullable             -- When the host responded (admitted or rejected).

  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(meeting_id, status)                      -- "Waiting participants for this meeting" — the host's queue.
  index(meeting_id, created_at)                  -- "Waiting room entries ordered by arrival time."
}
```

### 10. meeting_polls

Polls created by hosts during meetings. A poll has a question and a set of options. Supports single-choice and multiple-choice polls. Inspired by Zoom's polling feature and Microsoft Teams polls.

```pseudo
table meeting_polls {
  id              uuid primary_key default auto_generate
  meeting_id      uuid not_null references meetings(id) on_delete cascade
  created_by      uuid not_null references users(id) on_delete cascade

  question        string not_null                -- The poll question.
  options         json not_null                  -- Array of option strings, e.g., ["Option A", "Option B", "Option C"].
  poll_type       enum(single_choice, multiple_choice) not_null default single_choice

  status          enum(draft, active, closed) not_null default draft
                                                 -- draft = created but not yet launched.
                                                 -- active = participants can vote.
                                                 -- closed = voting ended, results available.

  launched_at     timestamp nullable             -- When the poll was opened for voting.
  closed_at       timestamp nullable             -- When the poll was closed.

  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(meeting_id, status)                      -- "Active polls in this meeting."
  index(meeting_id, created_at)                  -- "All polls in this meeting, ordered by creation."
}
```

**Design notes:**
- `options` is stored as JSON (an array of strings). This is simpler than a separate options table for the typical 2-6 options per poll.
- Poll results are derived from `poll_responses`, not stored on the poll itself.

### 11. poll_responses

Participant responses to meeting polls. One row per user per poll. For multiple-choice polls, `selected_options` contains multiple indices.

```pseudo
table poll_responses {
  id              uuid primary_key default auto_generate
  poll_id         uuid not_null references meeting_polls(id) on_delete cascade
  user_id         uuid not_null references users(id) on_delete cascade

  selected_options json not_null                 -- Array of selected option indices, e.g., [0] or [0, 2] for multiple choice.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  composite_unique(poll_id, user_id)             -- One response per user per poll.
}

indexes {
  -- composite_unique(poll_id, user_id) covers index(poll_id) via leading column.
  index(user_id)                                 -- "All poll responses by this user."
}
```

### 12. meeting_reactions

Emoji reactions sent during meetings (thumbs up, clap, laugh, etc.). Reactions are transient in the UI but stored for engagement analytics. One row per reaction event (a user can react multiple times).

```pseudo
table meeting_reactions {
  id              uuid primary_key default auto_generate
  meeting_id      uuid not_null references meetings(id) on_delete cascade
  user_id         uuid not_null references users(id) on_delete cascade

  emoji           string not_null                -- The reaction emoji (e.g., "👍", "👏", "😂", "❤️", "🎉").

  created_at      timestamp default now
}

indexes {
  index(meeting_id, created_at)                  -- "Reactions in this meeting, ordered by time" (for timeline/analytics).
  index(meeting_id, emoji)                       -- "Reaction counts by emoji for this meeting."
}
```

**Design notes:**
- Unlike message reactions (one per user per emoji per message), meeting reactions are event-based — a user can send the same emoji multiple times during a meeting.
- No composite unique constraint: reactions are append-only events, not toggles.

### 13. transcripts

Meeting transcription metadata. Each meeting can have one or more transcripts (e.g., different languages, or re-transcriptions). The actual transcript content is stored as segments in `transcript_segments`. Inspired by Microsoft Teams' transcript API.

```pseudo
table transcripts {
  id              uuid primary_key default auto_generate
  meeting_id      uuid not_null references meetings(id) on_delete cascade

  language        string not_null default 'en'   -- BCP 47 language tag (e.g., "en", "es", "fr").
  status          enum(processing, ready, failed) not_null default processing
                                                 -- processing = transcription in progress.
                                                 -- ready = transcript available.
                                                 -- failed = transcription failed.

  started_by      uuid nullable references users(id) on_delete set_null  -- Who requested the transcription.
  segment_count   integer not_null default 0     -- Denormalized: number of transcript segments.

  started_at      timestamp not_null default now
  completed_at    timestamp nullable             -- When transcription finished processing.

  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(meeting_id)                              -- "Transcripts for this meeting."
  index(status)                                  -- "All processing transcripts" (pipeline monitoring).
}
```

### 14. transcript_segments

Individual utterances within a transcript. Each segment represents one speaker's continuous speech with start/end timestamps. Enables search, speaker attribution, and synchronized playback with recordings.

```pseudo
table transcript_segments {
  id              uuid primary_key default auto_generate
  transcript_id   uuid not_null references transcripts(id) on_delete cascade
  speaker_id      uuid nullable references users(id) on_delete set_null  -- Who spoke. Null = unidentified speaker.

  content         string not_null                -- The transcribed text for this segment.
  speaker_name    string nullable                -- Speaker display name at transcription time. Preserved even if user is deleted.

  start_ms        integer not_null               -- Start time in milliseconds from meeting start.
  end_ms          integer not_null               -- End time in milliseconds from meeting start.
  position        integer not_null               -- Ordering position within the transcript (sequential segment number).

  confidence      decimal nullable               -- Transcription confidence score (0.00-1.00). Null if not available.

  created_at      timestamp default now
}

indexes {
  index(transcript_id, position)                 -- "Segments in this transcript, in order" — the primary read query.
  index(transcript_id, start_ms)                 -- "Segments in this transcript, by timestamp" — for playback sync.
  index(speaker_id)                              -- "All segments by this speaker" (for speaker stats).
}
```

**Design notes:**
- `start_ms` and `end_ms` are milliseconds from meeting start (not absolute timestamps). This allows synchronization with recording playback regardless of when the recording started.
- `speaker_name` is denormalized — preserved even if the user is deleted, similar to `meeting_participants.display_name`.
- `confidence` supports quality indicators in the UI (e.g., dimming low-confidence text).

### 15. quality_logs

Per-participant connection quality metrics. Logged periodically during meetings (e.g., every 30 seconds) for monitoring and post-meeting analysis. Captures WebRTC-standard metrics: bitrate, packet loss, jitter, latency, and resolution.

```pseudo
table quality_logs {
  id              uuid primary_key default auto_generate
  meeting_id      uuid not_null references meetings(id) on_delete cascade
  participant_id  uuid not_null references meeting_participants(id) on_delete cascade

  -- Network metrics.
  bitrate_kbps    integer nullable               -- Current bitrate in kbps.
  packet_loss_pct decimal nullable               -- Packet loss percentage (0.00-100.00).
  jitter_ms       integer nullable               -- Jitter in milliseconds.
  round_trip_ms   integer nullable               -- Round-trip time in milliseconds.

  -- Media metrics.
  video_width     integer nullable               -- Video resolution width in pixels.
  video_height    integer nullable               -- Video resolution height in pixels.
  framerate       integer nullable               -- Video framerate (fps).

  -- Subjective quality.
  quality_score   decimal nullable               -- Composite quality score (1.00-5.00, MOS scale). Null if not computed.

  logged_at       timestamp not_null default now -- When this sample was taken.

  created_at      timestamp default now
}

indexes {
  index(meeting_id, logged_at)                   -- "Quality logs for this meeting over time."
  index(participant_id, logged_at)               -- "Quality logs for this participant over time."
}
```

**Design notes:**
- Metrics are all nullable because not every metric is available in every sample (e.g., no video metrics when camera is off).
- `quality_score` uses the Mean Opinion Score (MOS) scale (1-5), a standard measure in telecommunications.
- High-volume table. Consider TTL/archival policies for old quality logs (e.g., retain detailed logs for 30 days, aggregate to hourly summaries after that).

## Relationships

```
rooms                    1 ──── * meetings                  (one room hosts many meetings)
meetings                 1 ──── * meeting_participants       (one meeting has many participants)
meetings                 1 ──── * meeting_invitations        (one meeting has many invitations)
meetings                 1 ──── * recordings                 (one meeting has many recordings)
meetings                 1 ──── * meeting_chat_messages      (one meeting has many chat messages)
meetings                 1 ──── * breakout_rooms             (one meeting has many breakout rooms)
meetings                 1 ──── * waiting_room_entries       (one meeting has many waiting room entries)
meetings                 1 ──── * meeting_polls              (one meeting has many polls)
meetings                 1 ──── * meeting_reactions          (one meeting has many reactions)
meetings                 1 ──── * transcripts                (one meeting has many transcripts)
meetings                 1 ──── * quality_logs               (one meeting has many quality logs)
meeting_participants     1 ──── * quality_logs               (one participant has many quality samples)
meeting_polls            1 ──── * poll_responses             (one poll has many responses)
transcripts              1 ──── * transcript_segments        (one transcript has many segments)
recordings               1 ──── * recording_access_grants    (one recording has many access grants)
users                    1 ──── * rooms                      (one user creates many rooms)
users                    1 ──── * meetings                   (one user hosts many meetings)
users                    1 ──── * meeting_participants       (one user joins many meetings)
files                    1 ──── * recordings                 (one file is one recording)
```

## Best Practices

- **Room reuse**: Create rooms once and reuse them for recurring meetings. Avoid creating a new room for every meeting — the room/meeting separation exists specifically for this.
- **Participant deduplication**: Use the `composite_unique(meeting_id, user_id)` constraint on `meeting_participants`. When a user leaves and rejoins, update the existing record rather than creating a new one.
- **Recording pipeline**: Use the `status` field on recordings to track the async pipeline (recording → processing → ready). Don't expose recordings to users until status = ready.
- **Transcript synchronization**: Use `start_ms`/`end_ms` on transcript segments (relative to meeting start) for playback sync, not absolute timestamps.
- **Quality log volume**: Quality logs can grow large (samples every 30s × participants × meetings). Implement TTL policies or archival to manage storage.
- **Waiting room UX**: Query `waiting_room_entries` with `status = 'waiting'` and `meeting_id` to show the host's admission queue. Notify the host in real-time when new entries arrive.
- **Poll results**: Compute poll results by aggregating `poll_responses` for a given poll. Don't denormalize results on the poll itself — the source of truth is the individual responses.
- **Access control for recordings**: Default to host-only access. Use `recording_access_grants` for explicit sharing. Consider organization-wide policies (e.g., all meeting participants automatically get view access).

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
