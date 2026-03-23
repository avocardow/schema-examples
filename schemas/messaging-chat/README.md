# Messaging / Chat

> Real-time messaging with conversations, threads, reactions, attachments, read tracking, and presence.

## Overview

A complete messaging and chat schema supporting direct messages, group chats, and channels through a unified conversation model. Covers the full messaging lifecycle: conversation creation and membership, message sending with threading, rich content (attachments, reactions, mentions), read state tracking, user presence, and moderation. Designed after studying Discord, Slack, Telegram, Matrix, Stream Chat, Rocket.Chat, Zulip, SendBird, and WhatsApp.

The schema follows the modern consensus of a **unified conversation model** — DMs, group chats, and channels are all rows in a single `conversations` table distinguished by a `type` field. This simplifies queries, APIs, and membership management compared to maintaining separate tables for each conversation type. Threading uses the industry-standard **parent-ID model** (1-depth), where reply messages reference their parent via `parent_message_id`.

Key design decisions:
- **Unified conversation model** over separate DM/group/channel tables (Matrix, Rocket.Chat, Stream Chat pattern)
- **Per-conversation read state** on membership records with optional per-message receipts (Discord, Slack pattern)
- **1-depth threading** via parent_message_id (Slack, Discord, SendBird pattern)
- **Attachments as a separate entity** referencing the file-management domain
- **Presence as a lightweight table** — semi-persistent state that survives restarts
- **Typing indicators are NOT stored** — ephemeral state belongs in the real-time layer (WebSocket/Redis)

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (12 tables)</summary>

- [`conversations`](#1-conversations)
- [`conversation_participants`](#2-conversation_participants)
- [`messages`](#3-messages)
- [`message_attachments`](#4-message_attachments)
- [`message_reactions`](#5-message_reactions)
- [`message_mentions`](#6-message_mentions)
- [`pinned_messages`](#7-pinned_messages)
- [`bookmarked_messages`](#8-bookmarked_messages)
- [`conversation_invites`](#9-conversation_invites)
- [`message_read_receipts`](#10-message_read_receipts)
- [`user_presence`](#11-user_presence)
- [`message_reports`](#12-message_reports)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users` | User identity for message authorship, conversation membership, and presence |
| [File Management / Document Storage](../file-management-document-storage) | `files` | File references for message attachments |

## Tables

### Core Messaging
- `conversations` — Unified container for DMs, group chats, and channels
- `conversation_participants` — Membership, per-user read state, roles, and notification preferences
- `messages` — Individual messages with threading support

### Rich Content
- `message_attachments` — Files, images, videos attached to messages
- `message_reactions` — Emoji reactions on messages
- `message_mentions` — @mentions in messages for efficient querying

### Organization & Discovery
- `pinned_messages` — Messages pinned to a conversation for quick reference
- `bookmarked_messages` — Per-user saved/starred messages across conversations
- `conversation_invites` — Pending invitations to join private conversations

### Delivery & State
- `message_read_receipts` — Per-message delivery/read status for group conversations
- `user_presence` — Online/away/offline status and last-seen timestamps

### Moderation
- `message_reports` — User reports of inappropriate messages

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. conversations

The unified container for all messaging contexts — direct messages, group chats, and public/private channels. Inspired by Matrix rooms and Rocket.Chat's unified room model: DMs, groups, and channels are all conversations distinguished by a `type` field. This eliminates the need for separate tables and separate APIs for each conversation kind.

```pseudo
table conversations {
  id              uuid primary_key default auto_generate
  type            enum(direct, group, channel) not_null
                                               -- direct = 1:1 DM between two users.
                                               -- group = small group chat (named or unnamed).
                                               -- channel = large, discoverable channel (like Slack channels or Discord text channels).

  name            string nullable              -- Display name. Null for DMs (derive from participant names). Required for channels.
  description     string nullable              -- Channel/group description. Shown in channel info panels.
  slug            string unique nullable       -- URL-safe identifier for channels (e.g., "general", "engineering"). Null for DMs/groups.

  -- Visibility and access control.
  is_private      boolean not_null default false -- Private conversations are invite-only. Public ones are discoverable and joinable.
  is_archived     boolean not_null default false -- Archived conversations are read-only. Messages cannot be sent but history is preserved.

  -- Metadata for list/feed display.
  last_message_at timestamp nullable           -- When the most recent message was sent. Denormalized for efficient conversation list sorting.
  message_count   integer not_null default 0   -- Total messages in this conversation. Denormalized for display.

  created_by      uuid not_null references users(id) on_delete restrict  -- Who created this conversation. Restrict: don't orphan conversations.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(type)                                  -- "All channels" or "All DMs."
  index(is_private, type)                      -- "All public channels" (for channel discovery/browsing).
  index(created_by)                            -- "Conversations created by this user."
  index(last_message_at)                       -- "Most recently active conversations" (for sorting conversation lists).
  -- unique(slug) is already created by the field constraint above.
}
```

**Design notes:**
- `last_message_at` and `message_count` are denormalized for performance. The conversation list query ("show my conversations sorted by most recent activity") is the single most common query in any chat app. Without denormalization, this requires a join + aggregate on every load.
- `slug` is nullable because DMs and most group chats don't need a URL-safe name. Only channels use slugs for discoverability.
- `created_by` uses `on_delete restrict` rather than cascade — deleting a user shouldn't cascade-delete entire conversations with all their history.

### 2. conversation_participants

Per-user membership and state for each conversation. Combines the concepts of "channel member" (Slack), "subscription" (Rocket.Chat), and "room member" (Matrix) into one entity. Tracks role, read state, notification preferences, and mute status per user per conversation.

```pseudo
table conversation_participants {
  id              uuid primary_key default auto_generate
  conversation_id uuid not_null references conversations(id) on_delete cascade
  user_id         uuid not_null references users(id) on_delete cascade

  -- Role within this conversation.
  role            enum(owner, admin, moderator, member) not_null default member
                                               -- owner = creator, full control (transfer ownership, delete conversation).
                                               -- admin = can manage members, settings, pins.
                                               -- moderator = can delete messages, mute participants.
                                               -- member = can send messages and reactions.

  -- Read state: the primary mechanism for unread tracking.
  -- "Everything at or before this timestamp is read." Unread count = messages after this timestamp.
  -- Updated when the user opens the conversation or scrolls to the bottom.
  last_read_at    timestamp nullable           -- Null = never read (all messages are unread).

  -- Notification preferences for this specific conversation.
  -- Null = use account-level defaults.
  notification_level enum(all, mentions, none) nullable
                                               -- all = notify on every message.
                                               -- mentions = only when @mentioned.
                                               -- none = muted, no notifications.

  is_muted        boolean not_null default false -- Muted conversations don't generate notifications regardless of notification_level.
  muted_until     timestamp nullable           -- Temporary mute. Null = muted indefinitely (or not muted if is_muted is false).

  joined_at       timestamp not_null default now -- When the user joined this conversation.
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  composite_unique(conversation_id, user_id)   -- One membership record per user per conversation.
}

indexes {
  index(user_id)                               -- "All conversations this user is in" (the conversation list query).
  index(user_id, last_read_at)                 -- "Conversations with unread messages for this user."
  -- composite_unique(conversation_id, user_id) covers index(conversation_id) via leading column.
}
```

**Design notes:**
- `last_read_at` as a timestamp (not a message ID) avoids coupling to message IDs and works across message deletions. Discord, Slack, and Stream Chat all use this pattern.
- `notification_level` is nullable — null means "use defaults." This three-tier model (system default → user global preference → per-conversation override) matches Slack's and Discord's notification systems.
- `muted_until` supports Slack-style temporary mutes ("mute for 1 hour").

### 3. messages

Individual messages within a conversation. Supports text content, threading (1-depth via `parent_message_id`), editing, soft deletion, and expiring/disappearing messages. The message table is the highest-volume table in any chat system — Discord stores trillions of messages — so indexing is critical.

```pseudo
table messages {
  id              uuid primary_key default auto_generate
  conversation_id uuid not_null references conversations(id) on_delete cascade
  sender_id       uuid nullable references users(id) on_delete set_null
                                               -- Who sent this message. Null = system message (join/leave notifications, bot messages).
                                               -- Set null on user deletion: preserve message history without the sender reference.

  -- Message content.
  content         string nullable              -- The message text. Null for attachment-only messages (e.g., image with no caption).
  content_type    enum(text, system, deleted) not_null default text
                                               -- text = regular user message (may contain markdown/rich text).
                                               -- system = auto-generated event message ("Alice joined the channel").
                                               -- deleted = message was deleted but placeholder is preserved for thread continuity.

  -- Threading: 1-depth parent-child model (Slack, Discord, SendBird pattern).
  -- Top-level messages have null parent_message_id. Reply messages reference their parent.
  parent_message_id uuid nullable references messages(id) on_delete set_null
                                               -- Set null: if parent is deleted, replies become top-level messages.

  -- Thread metadata (denormalized on the parent message for efficient display).
  -- These are only meaningful on top-level messages (parent_message_id = null).
  reply_count     integer not_null default 0   -- Number of replies in this thread.
  last_reply_at   timestamp nullable           -- When the most recent reply was sent. For thread list sorting.

  -- Edit tracking.
  is_edited       boolean not_null default false -- Whether this message has been edited. Drives "edited" indicator in UI.
  edited_at       timestamp nullable           -- When the last edit occurred.

  -- Expiring/disappearing messages (WhatsApp, Telegram, Signal pattern).
  expires_at      timestamp nullable           -- After this time, the message should be hidden or deleted. Null = never expires.

  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(conversation_id, created_at)           -- "Messages in this conversation, ordered by time" — THE most common query.
  index(sender_id)                             -- "All messages by this user" (for moderation, user profile).
  index(parent_message_id)                     -- "All replies to this message" (thread view).
  index(conversation_id, parent_message_id)    -- "Top-level messages in this conversation" (where parent_message_id IS NULL).
  index(expires_at)                            -- Cleanup job: delete/hide expired messages.
}
```

**Design notes:**
- `content_type` includes `deleted` as a value rather than hard-deleting messages. This preserves thread structure — if a parent message is hard-deleted, orphaned replies lose context. The "deleted" type shows a "[message deleted]" placeholder.
- `reply_count` and `last_reply_at` are denormalized on the parent message. Without this, showing a thread preview ("3 replies, last reply 2 min ago") requires a COUNT + MAX subquery per message in the feed.
- `sender_id` uses `on_delete set_null` to preserve message history when users are deleted, following the "messages belong to the conversation, not the user" principle.

### 4. message_attachments

Files, images, videos, and other media attached to messages. Each attachment references a file in the file-management domain. A message can have zero or many attachments. Attachments are ordered via `position` for consistent display.

```pseudo
table message_attachments {
  id              uuid primary_key default auto_generate
  message_id      uuid not_null references messages(id) on_delete cascade
  file_id         uuid not_null references files(id) on_delete restrict  -- From File Management. Restrict: don't delete a file that's attached to a message.

  -- Display metadata.
  file_name       string not_null              -- Original filename at upload time. Stored here so the attachment is self-describing without joining files.
  file_size       bigint not_null              -- File size in bytes. Denormalized from files for display.
  mime_type       string not_null              -- MIME type (e.g., "image/png", "application/pdf"). Denormalized from files.

  -- Ordering within the message.
  position        integer not_null default 0   -- Display order when a message has multiple attachments.

  created_at      timestamp default now
}

indexes {
  index(message_id)                            -- "All attachments for this message."
  index(file_id)                               -- "Which messages use this file?" (for file deletion checks).
}
```

**Design notes:**
- `file_name`, `file_size`, and `mime_type` are denormalized from the `files` table. This avoids a join on every message render — attachments need to show filename and size without hitting the file-management domain.
- No `updated_at` — attachments are immutable once created. To replace an attachment, delete the old one and create a new one.

### 5. message_reactions

Emoji reactions on messages. One row per user per emoji per message. Supports any emoji string (Unicode emoji, custom emoji shortcodes, or emoji IDs). Follows the pattern used by Discord, Slack, Stream Chat, and SendBird.

```pseudo
table message_reactions {
  id              uuid primary_key default auto_generate
  message_id      uuid not_null references messages(id) on_delete cascade
  user_id         uuid not_null references users(id) on_delete cascade
  emoji           string not_null              -- The reaction. Unicode emoji (e.g., "👍", "❤️") or custom shortcode (e.g., ":thumbsup:", ":custom_emoji:").

  created_at      timestamp default now

  composite_unique(message_id, user_id, emoji) -- One reaction per user per emoji per message. A user can react with multiple different emoji.
}

indexes {
  index(message_id)                            -- "All reactions on this message" (for rendering reaction counts).
  index(user_id)                               -- "All reactions by this user" (for user cleanup on deletion).
  -- composite_unique(message_id, user_id, emoji) is already indexed.
}
```

**Design notes:**
- `emoji` is a string rather than an enum — emoji sets are unbounded (Unicode adds new emoji regularly, and apps support custom emoji). Using a string allows any emoji without schema changes.
- The composite unique constraint allows a user to react with multiple different emoji (👍 and ❤️) but prevents duplicate reactions of the same emoji.

### 6. message_mentions

Tracks @mentions in messages. When a message contains `@alice` or `@channel`, a row is created here for each mention target. Enables efficient querying: "show me messages where I was mentioned" without full-text search on message content.

```pseudo
table message_mentions {
  id              uuid primary_key default auto_generate
  message_id      uuid not_null references messages(id) on_delete cascade
  mentioned_user_id uuid nullable references users(id) on_delete cascade
                                               -- The user who was mentioned. Null for non-user mentions (@channel, @here, @all).

  mention_type    enum(user, channel, all) not_null default user
                                               -- user = specific user @mention.
                                               -- channel = @channel (notify all members with all notification level).
                                               -- all = @all / @here / @everyone (notify all active members).

  created_at      timestamp default now

  composite_unique(message_id, mentioned_user_id, mention_type) -- Prevent duplicate mentions of the same user in the same message.
}

indexes {
  index(mentioned_user_id)                     -- "Messages where this user was mentioned" — the key query.
  index(message_id)                            -- "All mentions in this message" (for rendering @mention highlights).
  -- composite_unique covers leading columns.
}
```

**Design notes:**
- `mentioned_user_id` is nullable because `@channel` and `@all` mentions target everyone in the conversation, not a specific user.
- Mentions are extracted from message content at send time (or edit time) and stored here. This is more efficient than parsing `@` symbols from message text on every query.

### 7. pinned_messages

Messages pinned to a conversation for quick reference. Pinning surfaces important messages (announcements, decisions, reference links) in a dedicated panel. Each conversation has its own set of pins. Follows the pattern from Discord, Slack, and Telegram.

```pseudo
table pinned_messages {
  id              uuid primary_key default auto_generate
  conversation_id uuid not_null references conversations(id) on_delete cascade
  message_id      uuid not_null references messages(id) on_delete cascade
  pinned_by       uuid not_null references users(id) on_delete cascade

  pinned_at       timestamp not_null default now

  composite_unique(conversation_id, message_id)  -- A message can only be pinned once per conversation.
}

indexes {
  index(conversation_id, pinned_at)            -- "Pinned messages in this conversation, ordered by pin time."
  -- composite_unique(conversation_id, message_id) covers index(conversation_id) via leading column.
}
```

### 8. bookmarked_messages

Per-user saved/starred messages. Unlike pins (which are per-conversation and visible to all), bookmarks are private — only the user who bookmarked can see their bookmarks. Equivalent to Slack's "Save for later" or Discord's bookmarks.

```pseudo
table bookmarked_messages {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade
  message_id      uuid not_null references messages(id) on_delete cascade

  note            string nullable              -- Optional private note about why this message was saved.

  created_at      timestamp default now

  composite_unique(user_id, message_id)        -- A user can bookmark a message only once.
}

indexes {
  index(user_id, created_at)                   -- "This user's bookmarks, newest first."
  -- composite_unique(user_id, message_id) covers index(user_id) via leading column.
}
```

### 9. conversation_invites

Pending invitations to join private conversations or channels. When a user is invited to a private conversation, a row is created here. The invitee can accept or decline. For public channels, users join directly without an invite.

```pseudo
table conversation_invites {
  id              uuid primary_key default auto_generate
  conversation_id uuid not_null references conversations(id) on_delete cascade
  inviter_id      uuid not_null references users(id) on_delete cascade   -- Who sent the invite.
  invitee_id      uuid not_null references users(id) on_delete cascade   -- Who is being invited.

  status          enum(pending, accepted, declined, expired) not_null default pending

  message         string nullable              -- Optional message from the inviter (e.g., "Join our engineering channel!").
  expires_at      timestamp nullable           -- Invite expiration. Null = never expires.
  responded_at    timestamp nullable           -- When the invitee accepted/declined.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  composite_unique(conversation_id, invitee_id, status)  -- One pending invite per user per conversation. Allows re-inviting after decline.
}

indexes {
  index(invitee_id, status)                    -- "Pending invites for this user" — the invitee's inbox.
  index(conversation_id, status)               -- "Pending invites for this conversation" — admin view.
  index(expires_at)                            -- Cleanup job: expire old invites.
  -- composite_unique covers leading columns.
}
```

### 10. message_read_receipts

Per-message delivery and read status. Provides granular tracking beyond `conversation_participants.last_read_at` — used for WhatsApp-style blue ticks or "seen by" indicators in group chats. Optional: many apps only use the `last_read_at` on `conversation_participants` and skip this table entirely.

```pseudo
table message_read_receipts {
  id              uuid primary_key default auto_generate
  message_id      uuid not_null references messages(id) on_delete cascade
  user_id         uuid not_null references users(id) on_delete cascade

  delivered_at    timestamp nullable           -- When the message was delivered to the user's device.
  read_at         timestamp nullable           -- When the user actually read/viewed the message.

  created_at      timestamp default now

  composite_unique(message_id, user_id)        -- One receipt per user per message.
}

indexes {
  index(message_id)                            -- "Who has read this message?" (for "seen by" UI).
  index(user_id, read_at)                      -- "Messages this user has read" (for sync/catch-up).
  -- composite_unique(message_id, user_id) covers leading columns.
}
```

**Design notes:**
- This table can grow very large in active group chats (messages × participants). Apps that don't need per-message receipts can omit this table and rely solely on `conversation_participants.last_read_at`.
- `delivered_at` and `read_at` are separate — a message can be delivered but not yet read. This matches WhatsApp's single-check (delivered) vs. double-check (read) pattern.

### 11. user_presence

Online/away/offline status and last-seen timestamps. Presence is semi-persistent — it survives server restarts (unlike typing indicators which are purely ephemeral). Updated frequently (on every user action) so the table should be lightweight.

```pseudo
table user_presence {
  id              uuid primary_key default auto_generate
  user_id         uuid unique not_null references users(id) on_delete cascade  -- One presence record per user.

  status          enum(online, away, busy, offline) not_null default offline
                                               -- online = actively using the app.
                                               -- away = idle / inactive for N minutes.
                                               -- busy = do not disturb (user-set).
                                               -- offline = disconnected.

  status_text     string nullable              -- Custom status message (e.g., "In a meeting", "On vacation 🏖️").
  status_emoji    string nullable              -- Custom status emoji (e.g., "🏖️", "🔴").

  last_active_at  timestamp nullable           -- When the user was last active (sent a message, clicked, typed).
  last_connected_at timestamp nullable         -- When the user last connected to the real-time service.

  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  -- unique(user_id) is already created by the field constraint above.
  index(status)                                -- "All online users" (for presence indicators in member lists).
  index(last_active_at)                        -- "Users active in the last 5 minutes" (for away detection).
}
```

**Design notes:**
- One row per user (enforced by unique constraint on `user_id`), upserted on every status change.
- `last_active_at` vs `last_connected_at`: active = user interaction (message, click), connected = WebSocket connection alive. A user can be connected but not active (idle tab).
- `status_text` and `status_emoji` support Slack-style custom statuses.

### 12. message_reports

User reports of inappropriate messages for moderation review. When a user reports a message, a row is created here with the reason and optional details. Moderation teams review reports and take action (warn, delete message, ban user). This table captures the report; the moderation workflow itself belongs to the content-moderation domain.

```pseudo
table message_reports {
  id              uuid primary_key default auto_generate
  message_id      uuid not_null references messages(id) on_delete cascade
  reporter_id     uuid not_null references users(id) on_delete cascade  -- Who filed the report.

  reason          enum(spam, harassment, hate_speech, violence, misinformation, nsfw, other) not_null
  description     string nullable              -- Free-text explanation from the reporter.

  status          enum(pending, reviewed, resolved, dismissed) not_null default pending
  reviewed_by     uuid nullable references users(id) on_delete set_null  -- The moderator who reviewed this report.
  reviewed_at     timestamp nullable

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  composite_unique(message_id, reporter_id)    -- One report per user per message.
}

indexes {
  index(status)                                -- "All pending reports" — the moderation queue.
  index(message_id)                            -- "All reports for this message" (check if multiply reported).
  index(reporter_id)                           -- "All reports by this user" (detect report abuse).
  index(reviewed_by)                           -- "Reports reviewed by this moderator."
  -- composite_unique(message_id, reporter_id) covers leading columns.
}
```

## Relationships

```
conversations          1 ──── * conversation_participants   (one conversation has many members)
conversations          1 ──── * messages                    (one conversation has many messages)
conversations          1 ──── * pinned_messages             (one conversation has many pinned messages)
conversations          1 ──── * conversation_invites        (one conversation has many invites)
users                  1 ──── * conversation_participants   (one user belongs to many conversations)
users                  1 ──── * messages                    (one user sends many messages)
users                  1 ──── * user_presence               (one user has one presence record)
messages               1 ──── * messages                    (one message has many replies — self-referencing via parent_message_id)
messages               1 ──── * message_attachments         (one message has many attachments)
messages               1 ──── * message_reactions           (one message has many reactions)
messages               1 ──── * message_mentions            (one message has many mentions)
messages               1 ──── * message_read_receipts       (one message has many read receipts)
messages               1 ──── * pinned_messages             (one message can be pinned in a conversation)
messages               1 ──── * bookmarked_messages         (one message can be bookmarked by many users)
messages               1 ──── * message_reports             (one message can be reported by many users)
files                  1 ──── * message_attachments         (one file can be attached to many messages)
```

## Best Practices

- **Conversation list performance**: The conversation list ("inbox") is the most common query. Use `last_message_at` on `conversations` and `last_read_at` on `conversation_participants` to sort and badge without joining `messages`.
- **Unread counts**: Calculate as `SELECT COUNT(*) FROM messages WHERE conversation_id = ? AND created_at > ?` using the participant's `last_read_at`. For scale, consider denormalizing an `unread_count` field on `conversation_participants`.
- **Thread display**: Use `reply_count` and `last_reply_at` on the parent message for thread previews. Fetch full thread replies only when the user opens a thread.
- **Message pagination**: Always paginate messages by `(conversation_id, created_at)` or `(conversation_id, id)` using cursor-based pagination. Never use OFFSET.
- **Soft deletes for messages**: Use `content_type = 'deleted'` and clear the `content` field rather than hard-deleting. This preserves thread structure and reaction context.
- **Presence updates**: Batch and debounce presence updates. Updating `user_presence` on every keystroke will overwhelm the database. Update at most every 30-60 seconds.
- **Read receipts at scale**: `message_read_receipts` grows as messages × participants. Consider only creating receipts for messages in small group chats, not large channels with hundreds of members.
- **File attachment references**: Always reference the `files` table from file-management rather than storing file URLs directly. This enables consistent access control, versioning, and CDN URL rotation.

## Formats

| Format      | Status |
| ----------- | ------ |
| SQL         | ✅ Done |
| Prisma      | ✅ Done |
| MongoDB     | ✅ Done |
| Drizzle     | ✅ Done |
| Convex      | ✅ Done |
| SpacetimeDB | ✅ Done |
| Firebase    | ✅ Done |
