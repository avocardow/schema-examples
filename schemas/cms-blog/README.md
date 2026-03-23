# CMS / Blog

## Overview

Full-featured content management and blogging platform covering the complete publishing lifecycle: hierarchical categories and flat tags, posts and pages with draft/publish/schedule workflow, revision history, multi-author attribution, extensible key-value metadata, slug history for SEO redirects, content series, threaded comments with voting, post reactions, navigation menus with hierarchy, and URL redirect management. Designed from a study of 10 systems: WordPress, Ghost, Strapi, Contentful, Sanity, Directus, Medium, Substack, Hugo/Jekyll, Keystone.js, and Payload CMS.

Key design decisions: single `posts` table with type enum for both posts and pages (WordPress/Ghost pattern — 95%+ shared fields); separate `categories` (hierarchical with materialized path) and `tags` (flat) rather than unified taxonomy; multi-author support via junction table with sort ordering and roles (Ghost pattern); EAV `post_meta` table for extensible metadata without schema changes (WordPress pattern); dedicated `post_revisions` table for version history; `post_slug_history` for SEO-safe slug changes with automatic redirects; typed post reactions (like, love, bookmark) beyond binary likes; threaded comments with moderation and voting; database-backed navigation menus with hierarchical items.

Multi-site/multi-tenant support, newsletter/subscription management, content moderation workflows, file/media storage, and user authentication are separate domains.

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (18 tables)</summary>

- [`authors`](#1-authors)
- [`categories`](#2-categories)
- [`tags`](#3-tags)
- [`posts`](#4-posts)
- [`post_revisions`](#5-post_revisions)
- [`post_categories`](#6-post_categories)
- [`post_tags`](#7-post_tags)
- [`post_authors`](#8-post_authors)
- [`post_meta`](#9-post_meta)
- [`post_slug_history`](#10-post_slug_history)
- [`series`](#11-series)
- [`series_items`](#12-series_items)
- [`comments`](#13-comments)
- [`comment_votes`](#14-comment_votes)
- [`post_reactions`](#15-post_reactions)
- [`menus`](#16-menus)
- [`menu_items`](#17-menu_items)
- [`redirects`](#18-redirects)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users` | Author identity, comment authorship, reaction ownership, audit trails |
| [File Management](../file-management-document-storage) | `files` | Featured images on posts, author avatars |

## Tables

### Authors

| # | Table | Description |
| - | ----- | ----------- |
| 1 | `authors` | Author profiles with bio, avatar, social links |

### Taxonomy

| # | Table | Description |
| - | ----- | ----------- |
| 2 | `categories` | Hierarchical content categories with materialized path |
| 3 | `tags` | Flat content tags for flexible labeling |

### Content

| # | Table | Description |
| - | ----- | ----------- |
| 4 | `posts` | Core content entity with publishing lifecycle |
| 5 | `post_revisions` | Content version history with snapshots |
| 6 | `post_categories` | Posts to categories many-to-many junction |
| 7 | `post_tags` | Posts to tags many-to-many junction |
| 8 | `post_authors` | Posts to authors many-to-many with ordering |
| 9 | `post_meta` | Extensible key-value metadata on posts |
| 10 | `post_slug_history` | Slug change tracking for SEO redirects |

### Series

| # | Table | Description |
| - | ----- | ----------- |
| 11 | `series` | Blog post series or collections |
| 12 | `series_items` | Posts in a series with sort ordering |

### Engagement

| # | Table | Description |
| - | ----- | ----------- |
| 13 | `comments` | Threaded comments on posts with moderation |
| 14 | `comment_votes` | Comment upvotes and downvotes |
| 15 | `post_reactions` | Post-level reactions (like, love, bookmark) |

### Navigation

| # | Table | Description |
| - | ----- | ----------- |
| 16 | `menus` | Named navigation menus |
| 17 | `menu_items` | Hierarchical menu items with polymorphic targets |

### SEO

| # | Table | Description |
| - | ----- | ----------- |
| 18 | `redirects` | URL redirect rules for SEO preservation |

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. authors

Author profiles extending the user identity with publishing-specific information. Separating authors into their own table (rather than using users directly) allows for author-specific metadata like bio, avatar, social links, and SEO slugs. Inspired by Ghost's author model and WordPress's author pages.

```pseudo
table authors {
  id              uuid primary_key default auto_generate
  user_id         uuid unique not_null references users(id) on_delete cascade
                                               -- Links to the auth-rbac user account.
  display_name    string not_null              -- Public display name (may differ from user's account name).
  slug            string unique not_null       -- URL-friendly identifier for author pages (e.g., "jane-doe").
  bio             string nullable              -- Author biography for author pages and post bylines.
  avatar_url      string nullable              -- Author profile image URL.
  website_url     string nullable              -- Personal website or portfolio URL.
  social_links    json nullable default {}     -- Social media links (twitter, github, linkedin, etc.).
  is_active       boolean not_null default true -- Whether the author profile is visible on the site.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}
```

**Design notes:**
- One author profile per user (`user_id` is unique).
- `slug` is globally unique — used for author page URLs (e.g., `/authors/jane-doe`).
- `social_links` as JSON avoids a separate table for each social platform.

### 2. categories

Hierarchical content categories with materialized path for efficient subtree queries. Uses parent_id for single-level listings and path for ancestor/descendant queries. Inspired by WordPress product categories and Ghost's tag system (extended with hierarchy).

```pseudo
table categories {
  id              uuid primary_key default auto_generate
  parent_id       uuid nullable references categories(id) on_delete cascade
                                               -- Parent category. Null = root-level category.
  name            string not_null              -- Display name (e.g., "Technology", "Travel").
  slug            string unique not_null       -- URL-friendly identifier (e.g., "technology").
  description     string nullable              -- Category description for archive pages.
  path            string not_null              -- Materialized path using category IDs (e.g., "/abc/def/").
  depth           integer not_null default 0   -- Hierarchy level. 0 = root, 1 = child of root, etc.
  sort_order      integer not_null default 0   -- Display ordering within the same parent.
  is_active       boolean not_null default true -- Whether the category is visible on the site.
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(parent_id)
    index(path)
    index(is_active, sort_order)
  }
}
```

**Design notes:**
- Materialized path uses UUIDs as segments so renaming a category doesn't cascade path updates.
- `slug` is globally unique — used for category archive page URLs.
- `sort_order` enables manual ordering within the same parent level.

### 3. tags

Flat content tags for flexible labeling. Unlike categories, tags have no hierarchy — they're lightweight labels for cross-cutting concerns. Inspired by Ghost's tag model and WordPress's tag taxonomy.

```pseudo
table tags {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Display name (e.g., "JavaScript", "Tutorial").
  slug            string unique not_null       -- URL-friendly identifier (e.g., "javascript").
  description     string nullable              -- Tag description for tag archive pages.
  is_active       boolean not_null default true -- Whether the tag is visible on the site.
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(is_active)
  }
}
```

**Design notes:**
- Tags are intentionally flat — hierarchical organization is handled by categories.
- `slug` is globally unique for SEO-friendly tag archive URLs.

### 4. posts

Core content entity storing both blog posts and pages. Supports the full publishing lifecycle: draft → scheduled → published → archived. Inspired by WordPress's unified `wp_posts` table and Ghost's post model.

```pseudo
table posts {
  id              uuid primary_key default auto_generate
  type            enum(post, page) not_null default 'post'
                                               -- Content type. Posts appear in feeds; pages are standalone.
  title           string not_null              -- Post title / headline.
  slug            string unique not_null       -- URL-friendly identifier (e.g., "my-first-post").
  excerpt         string nullable              -- Short summary for feeds, SEO descriptions, and previews.
  content         string nullable              -- Full post content (HTML, Markdown, or structured format).
  featured_image_url string nullable           -- Hero/banner image URL for the post.
  status          enum(draft, scheduled, published, archived) not_null default 'draft'
                                               -- Publishing lifecycle status.
  visibility      enum(public, private, password_protected) not_null default 'public'
                                               -- Access control for the post.
  password        string nullable              -- Password for password-protected posts. Null if not password-protected.
  is_featured     boolean not_null default false -- Whether the post is pinned/featured on the site.
  allow_comments  boolean not_null default true -- Whether comments are enabled for this post.
  meta_title      string nullable              -- SEO title override (falls back to title if null).
  meta_description string nullable             -- SEO description override (falls back to excerpt if null).
  og_image_url    string nullable              -- Open Graph image URL for social sharing.
  published_at    timestamp nullable           -- When the post was/will be published. Null = not yet published.
  created_by      uuid not_null references users(id) on_delete restrict
                                               -- User who created the post (audit trail).
  updated_by      uuid nullable references users(id) on_delete set_null
                                               -- User who last updated the post.
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(status, published_at)
    index(type, status)
    index(created_by)
    index(is_featured)
  }
}
```

**Design notes:**
- `type` enum supports both posts and pages. Pages don't appear in chronological feeds but share all other fields.
- `status` captures the full lifecycle. `scheduled` posts have a future `published_at` that triggers auto-publishing.
- `visibility` separates access control from publishing status — a published post can be private.
- SEO fields (`meta_title`, `meta_description`, `og_image_url`) are inline rather than in a separate table for simpler queries.
- `content` stores the rendered/raw content. The storage format (HTML, Markdown, JSON blocks) is an application concern.

### 5. post_revisions

Content version history capturing snapshots of post content at each significant edit. Enables undo, diff viewing, and audit trails. Inspired by WordPress revisions and Ghost's mobiledoc_revisions.

```pseudo
table post_revisions {
  id              uuid primary_key default auto_generate
  post_id         uuid not_null references posts(id) on_delete cascade
                                               -- Post this revision belongs to.
  revision_number integer not_null              -- Sequential revision number (1, 2, 3, ...).
  title           string not_null              -- Snapshot of post title at this revision.
  content         string nullable              -- Snapshot of post content at this revision.
  excerpt         string nullable              -- Snapshot of post excerpt at this revision.
  created_by      uuid not_null references users(id) on_delete restrict
                                               -- User who made this revision.
  created_at      timestamp default now

  indexes {
    composite_unique(post_id, revision_number)
    index(post_id, created_at)
  }
}
```

**Design notes:**
- Each revision is an immutable snapshot — never updated after creation.
- `revision_number` enables ordering and "restore to revision N" UI.
- No `updated_at` — revisions are append-only.

### 6. post_categories

Many-to-many junction between posts and categories. A post can belong to multiple categories.

```pseudo
table post_categories {
  id              uuid primary_key default auto_generate
  post_id         uuid not_null references posts(id) on_delete cascade
  category_id     uuid not_null references categories(id) on_delete cascade

  indexes {
    composite_unique(post_id, category_id)
    index(category_id)
  }
}
```

### 7. post_tags

Many-to-many junction between posts and tags. A post can have multiple tags. Includes sort_order for tag display ordering (Ghost pattern).

```pseudo
table post_tags {
  id              uuid primary_key default auto_generate
  post_id         uuid not_null references posts(id) on_delete cascade
  tag_id          uuid not_null references tags(id) on_delete cascade
  sort_order      integer not_null default 0   -- Display ordering of tags on the post.

  indexes {
    composite_unique(post_id, tag_id)
    index(tag_id)
  }
}
```

### 8. post_authors

Many-to-many junction between posts and authors with ordering and role attribution. Supports multi-author posts with explicit author ordering. Inspired by Ghost's posts_authors table.

```pseudo
table post_authors {
  id              uuid primary_key default auto_generate
  post_id         uuid not_null references posts(id) on_delete cascade
  author_id       uuid not_null references authors(id) on_delete cascade
  sort_order      integer not_null default 0   -- Display ordering (0 = primary author).
  role            enum(author, contributor, editor, guest) not_null default 'author'
                                               -- Author's role for this specific post.

  indexes {
    composite_unique(post_id, author_id)
    index(author_id)
  }
}
```

**Design notes:**
- `sort_order` 0 is the primary/lead author, 1+ are co-authors.
- `role` captures the author's contribution type for this specific post (distinct from their site-level role).

### 9. post_meta

Extensible key-value metadata on posts. Enables custom fields, plugin data, and application-specific metadata without schema changes. Inspired by WordPress's wp_postmeta table.

```pseudo
table post_meta {
  id              uuid primary_key default auto_generate
  post_id         uuid not_null references posts(id) on_delete cascade
  meta_key        string not_null              -- Metadata key (e.g., "reading_time", "word_count", "custom_css").
  meta_value      string nullable              -- Metadata value. Stored as text; application interprets the type.

  indexes {
    composite_unique(post_id, meta_key)
    index(meta_key)
  }
}
```

**Design notes:**
- EAV pattern allows unlimited custom fields without migrations.
- `meta_key` + `post_id` composite unique prevents duplicate keys per post.
- Application layer handles type coercion (string → number, JSON parse, etc.).

### 10. post_slug_history

Tracks slug changes over time for SEO-safe URL redirects. When a post's slug changes, the old slug is recorded here so requests to the old URL can 301-redirect to the new one. Inspired by WordPress's permalink redirect plugins and Ghost's redirect system.

```pseudo
table post_slug_history {
  id              uuid primary_key default auto_generate
  post_id         uuid not_null references posts(id) on_delete cascade
  slug            string unique not_null       -- Previous slug that should redirect to the current post URL.
  changed_at      timestamp default now        -- When the slug was changed.

  indexes {
    index(post_id)
  }
}
```

**Design notes:**
- `slug` is globally unique — no two redirect sources can collide.
- On slug change: insert old slug here, update post's slug. Application middleware checks this table for 301 redirects.

### 11. series

Blog post series or collections for grouping related posts in a specific reading order. Inspired by Medium's series feature and Hugo's series taxonomy.

```pseudo
table series {
  id              uuid primary_key default auto_generate
  title           string not_null              -- Series title (e.g., "Building a REST API from Scratch").
  slug            string unique not_null       -- URL-friendly identifier for the series page.
  description     string nullable              -- Series description or introduction.
  cover_image_url string nullable              -- Cover image for the series landing page.
  is_active       boolean not_null default true -- Whether the series is visible on the site.
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(is_active)
  }
}
```

### 12. series_items

Posts within a series, with explicit ordering. A post can belong to multiple series (e.g., a post about "Authentication" could be in both a "Security" series and an "API Design" series).

```pseudo
table series_items {
  id              uuid primary_key default auto_generate
  series_id       uuid not_null references series(id) on_delete cascade
  post_id         uuid not_null references posts(id) on_delete cascade
  sort_order      integer not_null default 0   -- Reading order within the series (0 = first).

  indexes {
    composite_unique(series_id, post_id)
    index(post_id)
    index(series_id, sort_order)
  }
}
```

### 13. comments

Threaded comments on posts with moderation support. Supports nested replies via parent_id. Inspired by WordPress comments and Medium's responses.

```pseudo
table comments {
  id              uuid primary_key default auto_generate
  post_id         uuid not_null references posts(id) on_delete cascade
                                               -- Post this comment belongs to.
  parent_id       uuid nullable references comments(id) on_delete cascade
                                               -- Parent comment for threading. Null = top-level comment.
  author_id       uuid nullable references users(id) on_delete set_null
                                               -- Authenticated commenter. Null = guest comment.
  author_name     string not_null              -- Display name (from user profile or guest input).
  author_email    string nullable              -- Email (from user profile or guest input, for gravatar/notifications).
  content         string not_null              -- Comment text content.
  status          enum(pending, approved, rejected, spam) not_null default 'pending'
                                               -- Moderation status.
  ip_address      string nullable              -- Commenter's IP address (for spam detection).
  user_agent      string nullable              -- Browser user agent (for spam detection).
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(post_id, status, created_at)
    index(parent_id)
    index(author_id)
  }
}
```

**Design notes:**
- Guest comments are supported — `author_id` is nullable with `author_name` and `author_email` for guest info.
- `status` defaults to `pending` for moderation. Sites can configure auto-approval.
- `ip_address` and `user_agent` support spam detection (Akismet-style).

### 14. comment_votes

Upvotes and downvotes on comments. One vote per user per comment. Inspired by Reddit/StackOverflow voting patterns.

```pseudo
table comment_votes {
  id              uuid primary_key default auto_generate
  comment_id      uuid not_null references comments(id) on_delete cascade
  user_id         uuid not_null references users(id) on_delete cascade
  value           integer not_null             -- +1 for upvote, -1 for downvote.
  created_at      timestamp default now

  indexes {
    composite_unique(comment_id, user_id)
    index(user_id)
  }
}
```

**Design notes:**
- `value` as integer (+1/-1) rather than boolean enables score calculation via `SUM(value)`.
- Composite unique prevents duplicate votes — changing vote means updating the existing row.

### 15. post_reactions

Post-level reactions with typed reaction support. More expressive than binary likes. Inspired by Medium's claps, GitHub's reactions, and social media patterns.

```pseudo
table post_reactions {
  id              uuid primary_key default auto_generate
  post_id         uuid not_null references posts(id) on_delete cascade
  user_id         uuid not_null references users(id) on_delete cascade
  reaction_type   enum(like, love, clap, insightful, bookmark) not_null
                                               -- Type of reaction.
  created_at      timestamp default now

  indexes {
    composite_unique(post_id, user_id, reaction_type)
    index(user_id)
    index(post_id, reaction_type)
  }
}
```

**Design notes:**
- A user can have multiple reaction types on the same post (e.g., both "like" and "bookmark").
- `bookmark` is a reaction type rather than a separate table — keeps the schema simpler.

### 16. menus

Named navigation menus for different site locations (header, footer, sidebar). Inspired by WordPress's menu system and Hugo's menu configuration.

```pseudo
table menus {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Internal name (e.g., "Main Navigation").
  slug            string unique not_null       -- Identifier used in templates (e.g., "main-nav").
  description     string nullable              -- Description of the menu's purpose/location.
  is_active       boolean not_null default true -- Whether the menu is rendered on the site.
  created_at      timestamp default now
  updated_at      timestamp default now on_update
}
```

### 17. menu_items

Individual items within a navigation menu. Supports hierarchy (dropdowns) via parent_id and polymorphic targets (internal posts/pages, categories, custom URLs). Inspired by WordPress's nav menu items and Hugo's menu entries.

```pseudo
table menu_items {
  id              uuid primary_key default auto_generate
  menu_id         uuid not_null references menus(id) on_delete cascade
                                               -- Menu this item belongs to.
  parent_id       uuid nullable references menu_items(id) on_delete cascade
                                               -- Parent item for nested menus/dropdowns. Null = top-level.
  label           string not_null              -- Display text for the menu item.
  link_type       enum(post, category, custom) not_null
                                               -- What the menu item links to.
  link_post_id    uuid nullable references posts(id) on_delete cascade
                                               -- Target post/page (when link_type = 'post').
  link_category_id uuid nullable references categories(id) on_delete cascade
                                               -- Target category (when link_type = 'category').
  link_url        string nullable              -- Custom URL (when link_type = 'custom').
  open_in_new_tab boolean not_null default false -- Whether the link opens in a new browser tab.
  sort_order      integer not_null default 0   -- Display ordering within the parent level.
  is_active       boolean not_null default true -- Whether this item is visible in the menu.
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(menu_id, parent_id, sort_order)
    index(link_post_id)
    index(link_category_id)
  }
}
```

**Design notes:**
- Polymorphic linking via `link_type` + nullable target columns. Only one of `link_post_id`, `link_category_id`, or `link_url` is populated based on `link_type`.
- `sort_order` enables drag-and-drop reordering within each level.
- `parent_id` self-reference supports arbitrarily deep dropdown menus.

### 18. redirects

URL redirect rules for SEO preservation. Manages 301 (permanent) and 302 (temporary) redirects for changed URLs, removed pages, and vanity URLs. Inspired by Ghost's redirect management and Apache/Nginx rewrite rules.

```pseudo
table redirects {
  id              uuid primary_key default auto_generate
  source_path     string unique not_null       -- Incoming URL path to match (e.g., "/old-post").
  target_path     string not_null              -- Destination URL path (e.g., "/new-post") or full URL.
  status_code     integer not_null default 301  -- HTTP status code: 301 (permanent) or 302 (temporary).
  is_active       boolean not_null default true -- Whether the redirect is active.
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(is_active)
  }
}
```

**Design notes:**
- `source_path` is globally unique — only one redirect per source path.
- `target_path` can be a relative path or absolute URL for external redirects.
- Works alongside `post_slug_history` — slug history provides automatic post-specific redirects; this table handles general-purpose redirects.

## Relationships

```
users 1──* authors
users 1──* posts (created_by)
users ?──* posts (updated_by)
users 1──* post_revisions (created_by)
users ?──* comments (author_id)
users 1──* comment_votes
users 1──* post_reactions

authors 1──* post_authors

categories ?──* categories (parent_id)
categories 1──* post_categories
categories ?──* menu_items (link_category_id)

tags 1──* post_tags

posts 1──* post_revisions
posts 1──* post_categories
posts 1──* post_tags
posts 1──* post_authors
posts 1──* post_meta
posts 1──* post_slug_history
posts 1──* series_items
posts 1──* comments
posts 1──* post_reactions
posts ?──* menu_items (link_post_id)

series 1──* series_items

comments ?──* comments (parent_id)
comments 1──* comment_votes

menus 1──* menu_items
menu_items ?──* menu_items (parent_id)
```

## Best Practices

- **Soft publishes, not soft deletes**: Posts use `status` (draft/published/archived) rather than `deleted_at`. Archiving hides content without destroying it.
- **SEO-safe slug changes**: Always record old slugs in `post_slug_history` before updating a post's slug. Middleware checks this table for 301 redirects on 404s.
- **Multi-author attribution**: Use `post_authors` junction for all author assignments. `sort_order = 0` is always the primary author. Don't rely on `created_by` for authorship.
- **Comment moderation**: Default comment status to `pending` and implement moderation queue. Use `ip_address` and `user_agent` for spam detection integration.
- **Menu hierarchy**: Keep menu item nesting shallow (2-3 levels max) for usability. Validate in application logic.
- **Revision pruning**: Consider a retention policy for `post_revisions` (e.g., keep last 50 revisions). Implement as a background job, not a schema constraint.
- **Category depth**: Materialized path enables efficient subtree queries (`WHERE path LIKE '/abc/%'`). Rebuild paths when categories are moved.

## Formats

| Format | Status |
| ------ | ------ |
| [Convex](./convex) | ✅ Done |
| [SQL](./sql) | ✅ Done |
| [Prisma](./prisma) | ✅ Done |
| [MongoDB](./mongodb) | ✅ Done |
| [Drizzle](./drizzle) | ✅ Done |
| [SpacetimeDB](./spacetimedb) | ✅ Done |
| [Firebase](./firebase) | ✅ Done |
