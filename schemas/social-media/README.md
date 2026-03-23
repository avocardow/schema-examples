# Social Media

> User profiles, posts with threading and visibility, reactions, follows, hashtags, reposts, polls, bookmarks, lists, and moderation.

## Overview

A complete social media schema covering user profiles, content creation and discovery, social graph management, engagement, and safety controls. Designed after studying Mastodon, Bluesky, Lemmy, Misskey, Pixelfed, Twitter/X, Reddit, Instagram, LinkedIn, and TikTok-style platforms.

The schema follows the modern **unified post model** — original posts, replies, and quote reposts are all rows in the `posts` table, distinguished by `reply_to_id` and `quote_of_id` fields. This is the consensus pattern used by Twitter, Mastodon, Bluesky, and Misskey: replies appear in feeds, APIs are consistent, and threading is handled via self-referencing. A separate `conversation_id` groups all posts in a thread for efficient conversation-level queries (Twitter, Misskey pattern).

Key design decisions:
- **Unified post model** over separate posts/comments tables (Twitter, Mastodon, Bluesky consensus)
- **Unidirectional follows** over bidirectional connections (most flexible; mutual follows derivable)
- **Multi-type reactions** over single like (LinkedIn/Facebook pattern: like, love, celebrate, insightful, funny)
- **Denormalized counters on posts** over separate stats tables (simpler; accept eventual consistency)
- **Hashtag junction table** over array columns (efficient discovery queries, trending analytics)
- **Separate blocks and mutes** — different semantics (block = bidirectional hide, mute = one-way silence with optional expiry)
- **Polls as a separate entity** — not all posts have polls; clean separation

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (18 tables)</summary>

- [`profiles`](#1-profiles)
- [`posts`](#2-posts)
- [`post_media`](#3-post_media)
- [`follows`](#4-follows)
- [`follow_requests`](#5-follow_requests)
- [`reactions`](#6-reactions)
- [`reposts`](#7-reposts)
- [`bookmarks`](#8-bookmarks)
- [`hashtags`](#9-hashtags)
- [`post_hashtags`](#10-post_hashtags)
- [`mentions`](#11-mentions)
- [`blocks`](#12-blocks)
- [`mutes`](#13-mutes)
- [`post_reports`](#14-post_reports)
- [`polls`](#15-polls)
- [`poll_votes`](#16-poll_votes)
- [`lists`](#17-lists)
- [`list_members`](#18-list_members)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users` | User identity for post authorship, follows, reactions, and all user-attributed actions |
| [File Management / Document Storage](../file-management-document-storage) | `files` | File references for post media attachments and profile images |

## Tables

### Core Content
- `profiles` — Extended user profile data (display name, bio, avatar, banner, website, location, privacy, counters)
- `posts` — Core content entity with threading, visibility, edit tracking, and denormalized counters
- `post_media` — Ordered media attachments on posts (photos, videos)

### Social Graph
- `follows` — Follower/following relationships with notification preferences
- `follow_requests` — Pending follow requests for private/locked accounts

### Engagement
- `reactions` — Multi-type reactions on posts (like, love, celebrate, insightful, funny)
- `reposts` — Reshares/boosts with optional quote text
- `bookmarks` — Private saved posts per user

### Discovery & Organization
- `hashtags` — Hashtag registry with usage tracking
- `post_hashtags` — Junction table linking posts to hashtags
- `mentions` — @mentions in posts for efficient querying

### Safety & Control
- `blocks` — User blocks (bidirectional visibility restriction)
- `mutes` — User mutes with optional expiry
- `post_reports` — User reports of posts for moderation review

### Interactive Content
- `polls` — Polls attached to posts
- `poll_votes` — Individual poll votes

### Curation
- `lists` — User-curated lists of accounts for custom feeds
- `list_members` — Members of user-curated lists

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. profiles

Extended user profile data beyond what the auth-rbac domain stores. Every user has one profile. Contains display information (name, bio, avatar, banner), social metadata (website, location), privacy settings, and denormalized follower/following/post counters for efficient feed display.

```pseudo
table profiles {
  id              uuid primary_key default auto_generate
  user_id         uuid unique not_null references users(id) on_delete cascade  -- From Auth / RBAC. One profile per user.

  -- Display information.
  display_name    string nullable              -- Display name shown on profile and posts. Null = use username from auth.
  bio             string nullable              -- Profile biography / "about me" text.
  avatar_file_id  uuid nullable references files(id) on_delete set_null  -- From File Management. Profile picture.
  banner_file_id  uuid nullable references files(id) on_delete set_null  -- From File Management. Profile banner/header image.
  website         string nullable              -- Personal website URL.
  location        string nullable              -- Free-text location (e.g., "San Francisco, CA").

  -- Privacy settings.
  is_private      boolean not_null default false  -- Private accounts require follow approval. Posts are only visible to followers.

  -- Denormalized counters for profile display.
  follower_count  integer not_null default 0   -- Number of users following this profile.
  following_count integer not_null default 0   -- Number of users this profile follows.
  post_count      integer not_null default 0   -- Number of posts by this user.

  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  -- unique(user_id) is already created by the field constraint above.
  index(is_private)                            -- "All private profiles" (for follow-request logic).
}
```

**Design notes:**
- `display_name` is nullable — when null, the UI should fall back to the username from auth-rbac.
- `is_private` controls the entire account visibility model: private accounts require follow requests (see `follow_requests` table), and their posts are hidden from non-followers.
- Counters (`follower_count`, `following_count`, `post_count`) are denormalized for fast profile rendering. The profile card is the second most common view after the feed — without denormalization, every profile render requires COUNT queries on follows and posts.

### 2. posts

The core content entity. Supports text posts, replies (via `reply_to_id`), quote reposts (via `quote_of_id`), edit tracking, expiring posts, visibility control, and denormalized engagement counters. Following the unified model used by Twitter, Mastodon, and Bluesky: original posts, replies, and quotes are all rows in this table.

```pseudo
table posts {
  id              uuid primary_key default auto_generate
  author_id       uuid not_null references users(id) on_delete cascade  -- From Auth / RBAC. Who created this post.

  -- Content.
  content         string nullable              -- Post text. Null for media-only posts (e.g., image with no caption).
  content_type    enum(text, system, deleted) not_null default text
                                               -- text = regular user post (may contain markdown/rich text).
                                               -- system = auto-generated event post (e.g., "joined the platform").
                                               -- deleted = post was deleted but placeholder preserved for thread continuity.

  -- Threading: unified model. Replies and quotes are posts.
  reply_to_id     uuid nullable references posts(id) on_delete set_null  -- Parent post for replies. Null = top-level post.
  conversation_id uuid nullable references posts(id) on_delete set_null  -- Root post of the conversation thread. Null for standalone posts.
  quote_of_id     uuid nullable references posts(id) on_delete set_null  -- Post being quoted. Null = not a quote repost.

  -- Visibility.
  visibility      enum(public, unlisted, followers_only, mentioned_only) not_null default public
                                               -- public = visible on public feeds and search.
                                               -- unlisted = visible on profile but not in public feeds.
                                               -- followers_only = visible only to followers.
                                               -- mentioned_only = visible only to mentioned users (direct message via post).

  -- Edit tracking.
  is_edited       boolean not_null default false
  edited_at       timestamp nullable           -- When the last edit occurred.

  -- Expiring posts (stories-like functionality).
  expires_at      timestamp nullable           -- After this time, the post should be hidden. Null = never expires.

  -- Engagement counters (denormalized for feed display).
  reply_count     integer not_null default 0
  reaction_count  integer not_null default 0
  repost_count    integer not_null default 0

  -- Poll association.
  poll_id         uuid nullable references polls(id) on_delete set_null  -- Attached poll. Null = no poll.

  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(author_id, created_at)                 -- "Posts by this user, newest first" — profile feed.
  index(reply_to_id)                           -- "All replies to this post" — thread view.
  index(conversation_id, created_at)           -- "All posts in this conversation thread, ordered by time."
  index(visibility, created_at)                -- "Public posts, newest first" — public timeline.
  index(expires_at)                            -- Cleanup job: hide/delete expired posts.
  index(quote_of_id)                           -- "All quotes of this post."
}
```

**Design notes:**
- `conversation_id` points to the root post of a thread. All replies in the same thread share the same `conversation_id`, enabling efficient thread retrieval without recursive queries.
- `content_type = 'deleted'` preserves thread structure — if a mid-thread post is hard-deleted, child replies lose context. The "deleted" placeholder shows "[post deleted]".
- `visibility` follows Mastodon's proven four-tier model. `unlisted` is the key differentiator from `public`: the post is accessible via direct link and appears on the user's profile but is excluded from public feeds and search.
- Denormalized counters (`reply_count`, `reaction_count`, `repost_count`) avoid COUNT queries on every feed item render. These are the three metrics shown on every post in every social media app.
- `poll_id` uses forward reference to polls table. A post can optionally have one poll.

### 3. post_media

Ordered media attachments (photos, videos, GIFs) on posts. Each attachment references a file in the file-management domain. A post can have zero or many media items. Supports carousel/album display via the `position` field.

```pseudo
table post_media {
  id              uuid primary_key default auto_generate
  post_id         uuid not_null references posts(id) on_delete cascade
  file_id         uuid not_null references files(id) on_delete restrict  -- From File Management. Restrict: don't delete a file attached to a post.

  -- Display metadata (denormalized from files for feed rendering).
  media_type      enum(image, video, gif) not_null
  width           integer nullable             -- Media width in pixels. Null if unknown.
  height          integer nullable             -- Media height in pixels. Null if unknown.
  alt_text        string nullable              -- Accessibility description of the media.

  -- Ordering within the post.
  position        integer not_null default 0   -- Display order for carousel/album posts.

  created_at      timestamp default now
}

indexes {
  index(post_id, position)                     -- "Media for this post, in order."
  index(file_id)                               -- "Which posts use this file?" (for file deletion checks).
}
```

**Design notes:**
- `alt_text` is a first-class field — Mastodon popularized mandatory alt text for images, and it's critical for accessibility.
- `media_type` is an enum for common types, not a MIME string. The underlying file details are in the file-management domain.
- No `updated_at` — media attachments are immutable. To update media, delete and recreate.

### 4. follows

Unidirectional follow relationships between users. Follower sees followee's posts in their feed. Includes notification preferences per follow (e.g., "notify me when this user posts"). Follows the pattern from Twitter, Instagram, Mastodon, and Bluesky.

```pseudo
table follows {
  id              uuid primary_key default auto_generate
  follower_id     uuid not_null references users(id) on_delete cascade  -- Who is following.
  following_id    uuid not_null references users(id) on_delete cascade  -- Who is being followed.

  -- Per-follow notification preferences.
  notify          boolean not_null default false  -- Notify follower when followee posts (Twitter's "bell" feature).
  show_reposts    boolean not_null default true   -- Show followee's reposts in follower's feed.

  created_at      timestamp default now

  composite_unique(follower_id, following_id)  -- One follow per user pair.
}

indexes {
  index(following_id)                          -- "Who follows this user?" (follower list).
  -- composite_unique(follower_id, following_id) covers index(follower_id) via leading column.
}
```

**Design notes:**
- `notify` implements the "bell" / "get notifications" toggle that Twitter, Instagram, and Mastodon all support per follow.
- `show_reposts` implements Mastodon's `show_reblogs` — some users want to follow someone but not see their reposts.
- Mutual follows (friends/connections) can be derived: `SELECT * FROM follows f1 JOIN follows f2 ON f1.follower_id = f2.following_id AND f1.following_id = f2.follower_id`.

### 5. follow_requests

Pending follow requests for private/locked accounts. When a user follows a private account, a row is created here. The target user can approve or reject. On approval, a row is created in `follows` and this row is updated.

```pseudo
table follow_requests {
  id              uuid primary_key default auto_generate
  requester_id    uuid not_null references users(id) on_delete cascade  -- Who wants to follow.
  target_id       uuid not_null references users(id) on_delete cascade  -- Who is being requested to follow.

  status          enum(pending, approved, rejected) not_null default pending

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  composite_unique(requester_id, target_id)    -- One pending request per user pair.
}

indexes {
  index(target_id, status)                     -- "Pending follow requests for this user" — the approval inbox.
  -- composite_unique(requester_id, target_id) covers index(requester_id) via leading column.
}
```

**Design notes:**
- Follow requests only exist for private accounts (check `profiles.is_private` before creating).
- On approval, application logic creates a `follows` row and updates this row's `status` to `approved`.
- Rejected requests can be re-submitted (the composite unique prevents duplicate *active* requests; rejected rows should be cleaned up or the constraint should be on pending-only via partial unique).

### 6. reactions

Multi-type reactions on posts. One row per user per reaction type per post. Supports LinkedIn/Facebook-style reaction types (like, love, celebrate, insightful, funny) rather than a single "like" button. A user can only react once per type but can react with multiple types on the same post.

```pseudo
table reactions {
  id              uuid primary_key default auto_generate
  post_id         uuid not_null references posts(id) on_delete cascade
  user_id         uuid not_null references users(id) on_delete cascade
  type            enum(like, love, celebrate, insightful, funny) not_null

  created_at      timestamp default now

  composite_unique(post_id, user_id, type)     -- One reaction per type per user per post.
}

indexes {
  index(user_id)                               -- "All reactions by this user."
  -- index(post_id) is covered by composite_unique(post_id, user_id, type) via leading column.
}
```

**Design notes:**
- Five reaction types balances expressiveness with simplicity. LinkedIn uses 6, Facebook uses 6. This avoids the complexity of unlimited custom emoji while being richer than a binary like.
- The composite unique allows a user to react with multiple different types (like + love) but prevents duplicate reactions of the same type.

### 7. reposts

Reshares/retweets/boosts of existing posts. A repost surfaces the original post in the reposter's followers' feeds. Supports optional quote text for "quote repost" functionality (Twitter quote tweets, Bluesky quote posts).

```pseudo
table reposts {
  id              uuid primary_key default auto_generate
  post_id         uuid not_null references posts(id) on_delete cascade    -- The original post being reposted.
  user_id         uuid not_null references users(id) on_delete cascade    -- Who reposted.

  created_at      timestamp default now

  composite_unique(post_id, user_id)           -- One repost per user per post (re-reposting requires undo + redo).
}

indexes {
  index(user_id, created_at)                   -- "Reposts by this user, newest first."
  -- index(post_id) is covered by composite_unique(post_id, user_id) via leading column.
}
```

**Design notes:**
- Simple reposts (no added text) are rows in this table. Quote reposts (with commentary) are rows in `posts` with `quote_of_id` set — they are full posts that reference the original.
- This separation follows the Twitter/Mastodon pattern: a repost ("retweet"/"boost") is a signal that surfaces content, while a quote is a new post with embedded reference.
- The composite unique prevents double-reposting. To re-repost, the user must first undo the original repost.

### 8. bookmarks

Private saved posts. Unlike reactions (which are visible to the post author), bookmarks are completely private — only the user who bookmarked can see their bookmarks. Equivalent to Twitter's bookmarks, Instagram's "Saved", or Mastodon's bookmarks.

```pseudo
table bookmarks {
  id              uuid primary_key default auto_generate
  user_id         uuid not_null references users(id) on_delete cascade
  post_id         uuid not_null references posts(id) on_delete cascade

  created_at      timestamp default now

  composite_unique(user_id, post_id)           -- One bookmark per user per post.
}

indexes {
  index(user_id, created_at)                   -- "This user's bookmarks, newest first."
  -- composite_unique(user_id, post_id) covers index(user_id) via leading column.
}
```

### 9. hashtags

Registry of hashtags with usage tracking. Each unique hashtag has one row. Denormalized `post_count` enables trending calculations and discovery features without counting join table rows.

```pseudo
table hashtags {
  id              uuid primary_key default auto_generate
  name            string unique not_null       -- Lowercase hashtag name without the # prefix (e.g., "programming", "news").
  post_count      integer not_null default 0   -- Denormalized count of posts using this hashtag.

  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  -- unique(name) is already created by the field constraint above.
  index(post_count)                            -- "Most popular hashtags" (for trending/discovery).
}
```

**Design notes:**
- `name` is stored lowercase and without the `#` prefix. Normalization happens at write time.
- `post_count` is denormalized for trending displays. Incremented/decremented when posts are created/deleted with this hashtag.

### 10. post_hashtags

Junction table linking posts to hashtags. Created when a post is published (or edited) containing hashtag references. Enables efficient "all posts with this hashtag" queries.

```pseudo
table post_hashtags {
  id              uuid primary_key default auto_generate
  post_id         uuid not_null references posts(id) on_delete cascade
  hashtag_id      uuid not_null references hashtags(id) on_delete cascade

  created_at      timestamp default now

  composite_unique(post_id, hashtag_id)        -- One link per post per hashtag.
}

indexes {
  index(hashtag_id, created_at)                -- "Posts with this hashtag, newest first" — the hashtag feed.
  -- composite_unique(post_id, hashtag_id) covers index(post_id) via leading column.
}
```

### 11. mentions

Tracks @mentions in posts. When a post contains `@username`, a row is created here for each mentioned user. Enables efficient "posts where I was mentioned" queries without full-text search on post content. Same pattern as the messaging-chat domain's `message_mentions`.

```pseudo
table mentions {
  id              uuid primary_key default auto_generate
  post_id         uuid not_null references posts(id) on_delete cascade
  mentioned_user_id uuid not_null references users(id) on_delete cascade  -- The user who was mentioned.

  created_at      timestamp default now

  composite_unique(post_id, mentioned_user_id) -- Prevent duplicate mentions of the same user in the same post.
}

indexes {
  index(mentioned_user_id, created_at)         -- "Posts where this user was mentioned, newest first."
  -- composite_unique(post_id, mentioned_user_id) covers index(post_id) via leading column.
}
```

### 12. blocks

User blocks. When user A blocks user B: A cannot see B's content, B cannot see A's content, B cannot follow A, and B cannot interact with A's posts. Blocks are bidirectional in effect (both users are hidden from each other) but unidirectional in creation (only the blocker initiated it).

```pseudo
table blocks {
  id              uuid primary_key default auto_generate
  blocker_id      uuid not_null references users(id) on_delete cascade  -- Who created the block.
  blocked_id      uuid not_null references users(id) on_delete cascade  -- Who is blocked.

  created_at      timestamp default now

  composite_unique(blocker_id, blocked_id)     -- One block per user pair per direction.
}

indexes {
  index(blocked_id)                            -- "Who blocked this user?" (for visibility filtering).
  -- composite_unique(blocker_id, blocked_id) covers index(blocker_id) via leading column.
}
```

**Design notes:**
- Blocking automatically unfollows in both directions (application logic removes any existing `follows` rows).
- The bidirectional visibility effect is enforced at query time: content queries should filter out both `blocker_id` and `blocked_id` matches.

### 13. mutes

User mutes. When user A mutes user B: A does not see B's posts in their feed and does not receive notifications from B. Unlike blocks, B can still see A's content and doesn't know they're muted. Supports temporary mutes with `expires_at`.

```pseudo
table mutes {
  id              uuid primary_key default auto_generate
  muter_id        uuid not_null references users(id) on_delete cascade  -- Who created the mute.
  muted_id        uuid not_null references users(id) on_delete cascade  -- Who is muted.

  expires_at      timestamp nullable           -- Temporary mute expiration. Null = muted indefinitely.

  created_at      timestamp default now

  composite_unique(muter_id, muted_id)         -- One mute per user pair.
}

indexes {
  index(muted_id)                              -- "Who muted this user?" (for feed filtering).
  index(expires_at)                            -- Cleanup job: remove expired mutes.
  -- composite_unique(muter_id, muted_id) covers index(muter_id) via leading column.
}
```

**Design notes:**
- `expires_at` supports Slack/Mastodon-style temporary mutes ("mute for 24 hours", "mute for 7 days").
- Unlike blocks, mutes are one-directional: the muted user's experience is unaffected.

### 14. post_reports

User reports of posts for moderation review. When a user reports a post, a row is created here with the reason and optional details. This table captures the report — the moderation workflow itself belongs to the content-moderation domain.

```pseudo
table post_reports {
  id              uuid primary_key default auto_generate
  post_id         uuid not_null references posts(id) on_delete cascade
  reporter_id     uuid not_null references users(id) on_delete cascade  -- Who filed the report.

  reason          enum(spam, harassment, hate_speech, violence, misinformation, nsfw, other) not_null
  description     string nullable              -- Free-text explanation from the reporter.

  status          enum(pending, reviewed, resolved, dismissed) not_null default pending
  reviewed_by     uuid nullable references users(id) on_delete set_null  -- The moderator who reviewed this report.
  reviewed_at     timestamp nullable

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  composite_unique(post_id, reporter_id)       -- One report per user per post.
}

indexes {
  index(status)                                -- "All pending reports" — the moderation queue.
  index(reporter_id)                           -- "All reports by this user" (detect report abuse).
  index(reviewed_by)                           -- "Reports reviewed by this moderator."
  -- index(post_id) is covered by composite_unique(post_id, reporter_id) via leading column.
}
```

### 15. polls

Polls attached to posts. A poll has a question (the post's content serves as the question), multiple options, and an expiration time. Supports single-choice and multiple-choice modes.

```pseudo
table polls {
  id              uuid primary_key default auto_generate
  author_id       uuid not_null references users(id) on_delete cascade  -- From Auth / RBAC. Who created the poll.

  allows_multiple boolean not_null default false  -- Whether users can vote for multiple options.
  options         json not_null                -- Array of option strings (e.g., ["Option A", "Option B", "Option C"]).
  vote_count      integer not_null default 0   -- Total votes cast (denormalized).
  voter_count     integer not_null default 0   -- Unique voters (denormalized). Differs from vote_count when allows_multiple is true.

  closes_at       timestamp nullable           -- When voting closes. Null = never closes.
  is_closed       boolean not_null default false  -- Whether the poll is closed (manually or by expiration).

  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(author_id)                             -- "Polls by this user."
  index(closes_at)                             -- Cleanup job: close expired polls.
}
```

**Design notes:**
- `options` is stored as JSON array rather than a separate `poll_options` table. Polls have a small, fixed set of options (typically 2-6). A separate table adds complexity without benefit at this cardinality.
- `vote_count` vs `voter_count`: when `allows_multiple` is true, a single voter may cast multiple votes, so these diverge.
- The post's `content` field serves as the poll question text — no separate question field needed.

### 16. poll_votes

Individual poll votes. One row per user per option. The `option_index` references the position in the poll's `options` JSON array.

```pseudo
table poll_votes {
  id              uuid primary_key default auto_generate
  poll_id         uuid not_null references polls(id) on_delete cascade
  user_id         uuid not_null references users(id) on_delete cascade

  option_index    integer not_null             -- Index into the poll's options array (0-based).

  created_at      timestamp default now

  composite_unique(poll_id, user_id, option_index)  -- One vote per user per option.
}

indexes {
  index(user_id)                               -- "All votes by this user."
  -- index(poll_id) is covered by composite_unique(poll_id, user_id, option_index) via leading column.
}
```

**Design notes:**
- `option_index` references the zero-based position in the parent poll's `options` JSON array.
- For single-choice polls (`allows_multiple = false`), application logic enforces at most one vote per user. For multiple-choice, the composite unique allows voting on multiple options but prevents duplicate votes on the same option.

### 17. lists

User-curated lists of accounts for creating custom timeline feeds. Equivalent to Twitter Lists, Mastodon Lists, or Reddit Multireddits. Lists are either public (visible to anyone) or private (visible only to the list creator).

```pseudo
table lists {
  id              uuid primary_key default auto_generate
  owner_id        uuid not_null references users(id) on_delete cascade  -- Who created the list.

  name            string not_null              -- Display name of the list.
  description     string nullable              -- Optional description of the list's purpose.
  is_private      boolean not_null default true -- Private lists are visible only to the owner.

  member_count    integer not_null default 0   -- Denormalized count of list members.

  created_at      timestamp default now
  updated_at      timestamp default now on_update
}

indexes {
  index(owner_id)                              -- "Lists owned by this user."
}
```

### 18. list_members

Members of user-curated lists. Adding a user to a list does not require their permission (following Twitter/Mastodon behavior).

```pseudo
table list_members {
  id              uuid primary_key default auto_generate
  list_id         uuid not_null references lists(id) on_delete cascade
  user_id         uuid not_null references users(id) on_delete cascade  -- The user being listed.

  created_at      timestamp default now

  composite_unique(list_id, user_id)           -- One membership per user per list.
}

indexes {
  index(user_id)                               -- "Lists this user appears in."
  -- composite_unique(list_id, user_id) covers index(list_id) via leading column.
}
```

## Relationships

```
users              1 ──── 1 profiles                (one user has one profile)
users              1 ──── * posts                   (one user authors many posts)
users              1 ──── * follows (as follower)   (one user follows many users)
users              1 ──── * follows (as following)   (one user is followed by many)
users              1 ──── * reactions               (one user reacts to many posts)
users              1 ──── * reposts                 (one user reposts many posts)
users              1 ──── * bookmarks               (one user bookmarks many posts)
users              1 ──── * lists                   (one user owns many lists)
posts              1 ──── * posts (reply_to_id)      (one post has many replies — self-referencing)
posts              1 ──── * posts (conversation_id)  (one root post groups many thread posts)
posts              1 ──── * posts (quote_of_id)      (one post is quoted by many posts)
posts              1 ──── * post_media              (one post has many media attachments)
posts              1 ──── * reactions               (one post has many reactions)
posts              1 ──── * reposts                 (one post has many reposts)
posts              1 ──── * bookmarks               (one post has many bookmarks)
posts              1 ──── * post_hashtags           (one post has many hashtags)
posts              1 ──── * mentions                (one post has many mentions)
posts              1 ──── * post_reports            (one post has many reports)
polls              1 ──── 1 posts                   (one poll belongs to one post)
polls              1 ──── * poll_votes              (one poll has many votes)
hashtags           1 ──── * post_hashtags           (one hashtag applies to many posts)
lists              1 ──── * list_members            (one list has many members)
files              1 ──── * post_media              (one file is attached to many posts)
files              1 ──── * profiles (avatar)        (one file is used as many avatars)
files              1 ──── * profiles (banner)        (one file is used as many banners)
```

## Best Practices

- **Feed performance**: Use `posts.author_id + created_at` index with cursor-based pagination for user profile feeds. For home timelines, consider materialized views or fan-out strategies at the application layer.
- **Thread retrieval**: Use `conversation_id` to fetch all posts in a thread in a single query rather than traversing `reply_to_id` chains recursively.
- **Counter accuracy**: Denormalized counters (`reply_count`, `reaction_count`, `repost_count`, `follower_count`, etc.) should be updated via atomic increment/decrement operations. Accept eventual consistency for display — exact counts are not critical for UX.
- **Visibility enforcement**: Every content query must filter by `posts.visibility` and check blocks/mutes. Visibility is not just a display concern — it's a data access concern.
- **Soft deletes for posts**: Use `content_type = 'deleted'` and clear the `content` field rather than hard-deleting. This preserves thread structure and engagement context.
- **Block cascading**: When a block is created, application logic should remove any existing follows (both directions), cancel pending follow requests, and remove reactions/reposts.
- **Hashtag normalization**: Store hashtag names as lowercase, stripped of the `#` prefix. Normalize at write time.
- **Media ordering**: Always use `post_media.position` for display order. Don't rely on insertion order or ID sorting.
- **Poll voting**: Check `polls.is_closed` and `polls.closes_at` before accepting votes. For single-choice polls, check existing votes before inserting.

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
