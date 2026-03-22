# Content Moderation

## Overview

Content moderation infrastructure for detecting, reviewing, and enforcing platform content policies. Covers the full lifecycle from automated detection and user reporting through moderator review, enforcement actions, user appeals, and audit logging. Supports configurable auto-moderation rules (keyword, regex, ML score thresholds), hierarchical violation taxonomies, graduated enforcement (warn → restrict → ban), moderator workload management, and DSA-compliant transparency reporting.

Designed from a study of 10 systems: federated social networks (Mastodon, Lemmy), community platforms (Discourse, Reddit), real-time chat (Discord AutoMod, Twitch), video platforms (YouTube strikes), SaaS moderation services (Stream/GetStream), ML-assisted moderation (Google/Jigsaw Conversation AI Moderator), and crowd-sourced moderation (X/Twitter Community Notes). Also informed by industry standards: EU Digital Services Act transparency requirements, TSPA abuse taxonomy, PhotoDNA perceptual hashing, OpenAI Moderation API categories, and Perspective API toxicity scoring.

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (21 tables)</summary>

- [Content Moderation](#content-moderation)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Dependencies](#dependencies)
  - [Tables](#tables)
    - [Content Classification](#content-classification)
    - [Community Rules & Policies](#community-rules--policies)
    - [Auto-Moderation & Detection](#auto-moderation--detection)
    - [Moderation Queue & Intake](#moderation-queue--intake)
    - [Moderation Actions & Enforcement](#moderation-actions--enforcement)
    - [Appeals & Disputes](#appeals--disputes)
    - [User Trust & Reputation](#user-trust--reputation)
    - [Moderator Management](#moderator-management)
    - [Domain & IP Blocking](#domain--ip-blocking)
  - [Schema](#schema)
    - [`violation_categories`](#violation_categories)
    - [`moderation_policies`](#moderation_policies)
    - [`response_templates`](#response_templates)
    - [`moderation_rules`](#moderation_rules)
    - [`keyword_lists`](#keyword_lists)
    - [`keyword_list_entries`](#keyword_list_entries)
    - [`moderation_queue_items`](#moderation_queue_items)
    - [`reports`](#reports)
    - [`report_notes`](#report_notes)
    - [`auto_detection_results`](#auto_detection_results)
    - [`moderation_actions`](#moderation_actions)
    - [`appeals`](#appeals)
    - [`user_restrictions`](#user_restrictions)
    - [`strikes`](#strikes)
    - [`user_trust_scores`](#user_trust_scores)
    - [`moderator_assignments`](#moderator_assignments)
    - [`moderator_performance`](#moderator_performance)
    - [`moderation_action_log`](#moderation_action_log)
    - [`user_moderation_notes`](#user_moderation_notes)
    - [`blocked_domains`](#blocked_domains)
    - [`blocked_ips`](#blocked_ips)
  - [Relationships](#relationships)
    - [One-to-Many](#one-to-many)
    - [Many-to-Many (via junction tables)](#many-to-many-via-junction-tables)
  - [Best Practices](#best-practices)
  - [Formats](#formats)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users` | User identity for reporters, moderators, action targets, and audit trails |

## Tables

### Content Classification

- `violation_categories`
- `moderation_policies`
- `response_templates`

### Auto-Moderation & Detection

- `moderation_rules`
- `keyword_lists`
- `keyword_list_entries`

### Moderation Queue & Intake

- `moderation_queue_items`
- `reports`
- `report_notes`
- `auto_detection_results`

### Moderation Actions & Enforcement

- `moderation_actions`
- `appeals`
- `user_restrictions`
- `strikes`

### User Trust & Reputation

- `user_trust_scores`

### Moderator Management

- `moderator_assignments`
- `moderator_performance`
- `moderation_action_log`
- `user_moderation_notes`

### Domain & IP Blocking

- `blocked_domains`
- `blocked_ips`

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### `violation_categories`

Hierarchical taxonomy of content violation types. Supports multi-level categorization aligned
with industry standards (TSPA abuse taxonomy, DSA 19-category list, OpenAI harm categories).
Self-referencing `parent_id` enables roll-up reporting — e.g., "Hate Speech" parent with
"Racial Hatred", "Religious Hatred", "Gender-Based Hatred" children. Configurable per-platform,
not hardcoded.

```pseudo
table violation_categories {
  id                uuid primary_key default auto_generate
  name              string unique not_null             -- Machine-readable identifier (e.g., "hate_speech", "csam").
                                                       -- Unique constraint prevents duplicate categories.
  display_name      string not_null                    -- Human-readable label (e.g., "Hate Speech", "Child Sexual Abuse Material").
  description       string nullable                    -- Detailed explanation of what this category covers.
  parent_id         uuid nullable references violation_categories(id) on_delete restrict
                                                       -- Parent category for hierarchical taxonomy.
                                                       -- Null = top-level category.
                                                       -- Restrict: cannot delete a parent that has children.
  severity          enum(info, low, medium, high, critical) not_null default medium
                                                       -- Default severity when this category is cited in an action.
                                                       -- info = informational/advisory.
                                                       -- low = minor policy violation.
                                                       -- medium = standard violation.
                                                       -- high = serious violation requiring prompt action.
                                                       -- critical = illegal content, imminent harm — highest priority.
  is_active         boolean not_null default true       -- Soft-disable without deleting. Inactive categories
                                                       -- cannot be selected for new violations but remain for history.
  sort_order        integer not_null default 0          -- Display ordering within the parent group.
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  -- unique(name) is already created by the field constraint above.
  index(parent_id)                                     -- "All children of this category."
  index(is_active, sort_order)                         -- Active categories in display order.
}
```

**Design notes:**
- Hierarchical structure follows TSPA's six top-level groups with sub-categories and aligns with the DSA's 19-category taxonomy.
- `severity` provides a default for the category — individual moderation actions can override.
- Machine-readable `name` enables code references; `display_name` is for UI rendering.

### `moderation_policies`

Community or platform-level rule definitions. Each policy describes a specific rule that users
must follow (e.g., "No spam", "Be respectful"). Policies are scoped — global policies apply
everywhere, while community/channel-scoped policies apply only within their scope. Linked to
violation categories for classification when rules are violated. Inspired by Reddit's subreddit
rules and Mastodon's server rules.

```pseudo
table moderation_policies {
  id                uuid primary_key default auto_generate
  scope             enum(global, community, channel) not_null default global
                                                       -- Where this policy applies.
                                                       -- global = platform-wide.
                                                       -- community = specific community/subreddit/server.
                                                       -- channel = specific channel/room.
  scope_id          string nullable                    -- ID of the community/channel. Null when scope = global.
                                                       -- String, not UUID — supports external ID formats.
  title             string not_null                    -- Short policy title (e.g., "No Hate Speech").
  description       string not_null                    -- Full policy text explaining what's prohibited and why.
  violation_category_id uuid nullable references violation_categories(id) on_delete set_null
                                                       -- Which violation category this policy maps to.
                                                       -- Set null: if category is deleted, policy remains but loses classification.
  sort_order        integer not_null default 0          -- Display ordering within the scope.
  is_active         boolean not_null default true       -- Soft-disable without deleting.
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  index(scope, scope_id)                               -- "All policies for this community."
  index(violation_category_id)                         -- "All policies linked to this violation category."
  index(is_active)                                     -- "All active policies."
}
```

### `response_templates`

Pre-written response messages for moderators to use when taking enforcement actions. Templates
ensure consistent, professional communication and reduce moderator fatigue. Supports action-
specific templates (different messages for warnings vs removals) and scope-based customization
(global defaults with community overrides). Inspired by Reddit's removal reasons and Mastodon's
warning messages.

```pseudo
table response_templates {
  id                uuid primary_key default auto_generate
  name              string not_null                    -- Internal template name (e.g., "Spam Removal — First Offense").
  action_type       enum(approve, remove, warn, mute, ban, restrict, escalate, label) nullable
                                                       -- Which moderation action this template is for.
                                                       -- Null = usable with any action type.
  content           string not_null                    -- Template text. May include placeholders like
                                                       -- {{username}}, {{rule}}, {{appeal_url}}.
  violation_category_id uuid nullable references violation_categories(id) on_delete set_null
                                                       -- Suggested violation category for this template.
                                                       -- Set null: if category is deleted, template remains.
  scope             enum(global, community) not_null default global
                                                       -- global = available everywhere.
                                                       -- community = specific to one community.
  scope_id          string nullable                    -- Community ID. Null when scope = global.
  is_active         boolean not_null default true
  created_by        uuid not_null references users(id) on_delete restrict
                                                       -- Who created this template.
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  index(scope, scope_id)                               -- "All templates for this community."
  index(action_type)                                   -- "All templates for removal actions."
  index(violation_category_id)                         -- "All templates for hate speech violations."
  index(is_active)                                     -- "All active templates."
}
```

### `moderation_rules`

Configurable auto-moderation rules. Each rule defines a trigger condition and the action to take
when triggered. Conditions and action parameters are stored as JSON for flexibility — a keyword
rule stores word lists, an ML rule stores score thresholds, a regex rule stores patterns.
Inspired by Discord's AutoModeration rules (trigger_type + trigger_metadata + actions) and
Conversation AI Moderator's ModerationRules (tag thresholds + actions).

```pseudo
table moderation_rules {
  id                uuid primary_key default auto_generate
  name              string not_null                    -- Human-readable rule name (e.g., "Block Profanity", "Flag Toxicity > 0.8").
  description       string nullable                    -- What this rule does and why it exists.
  scope             enum(global, community, channel) not_null default global
                                                       -- Where this rule applies.
  scope_id          string nullable                    -- Community/channel ID. Null when scope = global.
  trigger_type      enum(keyword, regex, ml_score, hash_match, mention_spam, user_attribute) not_null
                                                       -- What type of content analysis triggers this rule.
                                                       -- keyword = matches words/phrases from a keyword_list.
                                                       -- regex = matches a regex pattern.
                                                       -- ml_score = ML model confidence exceeds threshold.
                                                       -- hash_match = perceptual hash match (PhotoDNA, etc.).
                                                       -- mention_spam = excessive @mentions.
                                                       -- user_attribute = checks user properties (age, karma, etc.).
  trigger_config    json not_null                      -- Trigger-specific configuration. Examples:
                                                       -- keyword: {"keyword_list_id": "uuid", "match_type": "contains"}
                                                       -- regex: {"patterns": ["spam\\d+", "buy now"], "case_sensitive": false}
                                                       -- ml_score: {"model": "perspective", "attribute": "toxicity", "threshold": 0.8}
                                                       -- hash_match: {"database": "photodna", "threshold": 0.95}
                                                       -- mention_spam: {"max_mentions": 10, "window_seconds": 60}
                                                       -- user_attribute: {"min_account_age_days": 7, "min_karma": 10}
  action_type       enum(block, flag, hold, timeout, notify) not_null
                                                       -- What happens when the rule triggers.
                                                       -- block = prevent content from being posted.
                                                       -- flag = post the content but add to moderation queue.
                                                       -- hold = hold for moderator approval before posting.
                                                       -- timeout = temporarily restrict the user.
                                                       -- notify = alert moderators without affecting content.
  action_config     json nullable default {}           -- Action-specific parameters. Examples:
                                                       -- timeout: {"duration_minutes": 60}
                                                       -- notify: {"channel_id": "mod-alerts"}
                                                       -- block: {"custom_message": "Your message was blocked."}
  priority          integer not_null default 0          -- Rule evaluation order. Higher = evaluated first.
                                                       -- First matching rule wins (no further evaluation).
  is_enabled        boolean not_null default true       -- Disable without deleting.
  created_by        uuid not_null references users(id) on_delete restrict
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  index(scope, scope_id, is_enabled)                   -- "All enabled rules for this community."
  index(trigger_type)                                  -- "All keyword-based rules."
  index(is_enabled, priority)                          -- Active rules in evaluation order.
}
```

**Design notes:**
- JSON for trigger_config/action_config follows Discord's trigger_metadata pattern — conditions vary too widely for normalized columns.
- Priority-based evaluation with first-match semantics prevents conflicting rule outcomes.
- Separate from keyword_lists — rules reference lists, enabling list reuse across rules.

### `keyword_lists`

Managed collections of words, phrases, and patterns for auto-moderation rules. A list can be a
blocklist (block matching content), allowlist (override blocks), or watchlist (flag for review
without blocking). Lists can be shared across multiple rules and managed independently. Inspired
by Discord's preset keyword lists and Twitch's blocked/permitted terms.

```pseudo
table keyword_lists {
  id                uuid primary_key default auto_generate
  name              string not_null                    -- List name (e.g., "Profanity — English", "Competitor URLs").
  description       string nullable                    -- What this list contains and how it's used.
  list_type         enum(blocklist, allowlist, watchlist) not_null
                                                       -- blocklist = content matching these entries is blocked/flagged.
                                                       -- allowlist = entries that override blocklist matches.
                                                       -- watchlist = entries that flag content for review.
  scope             enum(global, community) not_null default global
  scope_id          string nullable                    -- Community ID. Null when scope = global.
  is_enabled        boolean not_null default true
  created_by        uuid not_null references users(id) on_delete restrict
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  index(scope, scope_id)                               -- "All keyword lists for this community."
  index(list_type)                                     -- "All blocklists."
  index(is_enabled)                                    -- "All active lists."
}
```

### `keyword_list_entries`

Individual words, phrases, or patterns within a keyword list. Each entry specifies how matching
should work: exact match, substring match, or regex pattern. Case sensitivity is configurable
per entry. Inspired by Discord's keyword_filter (up to 1000 entries per rule) and Twitch's
blocked/permitted terms.

```pseudo
table keyword_list_entries {
  id                uuid primary_key default auto_generate
  list_id           uuid not_null references keyword_lists(id) on_delete cascade
                                                       -- Which keyword list this entry belongs to.
                                                       -- Cascade: deleting a list removes all its entries.
  value             string not_null                    -- The word, phrase, or pattern to match against.
  match_type        enum(exact, contains, regex) not_null default exact
                                                       -- exact = full string match.
                                                       -- contains = substring match.
                                                       -- regex = regular expression pattern.
  is_case_sensitive boolean not_null default false      -- Whether matching is case-sensitive.
  added_by          uuid not_null references users(id) on_delete restrict
                                                       -- Who added this entry.
  created_at        timestamp default now
}

indexes {
  index(list_id)                                       -- "All entries in this list."
  unique(list_id, value, match_type)                   -- Prevent duplicate entries with the same match type.
}
```

### `moderation_queue_items`

Central moderation queue — the primary work surface for moderators. Every item needing human
review appears here, regardless of source (user report, auto-detection, or manual flagging).
Stores a JSON snapshot of the content at the time of flagging for evidence preservation (content
may be edited or deleted after flagging). Inspired by Reddit's unified modqueue, Stream's review
queue, and Discourse's reviewables table.

```pseudo
table moderation_queue_items {
  id                uuid primary_key default auto_generate
  content_type      enum(post, comment, message, user, media) not_null
                                                       -- What type of content is being reviewed.
                                                       -- Supports any content entity in the platform.
  content_id        string not_null                    -- ID of the flagged content. String, not UUID — supports
                                                       -- external ID formats across content systems.
  source            enum(user_report, auto_detection, manual) not_null
                                                       -- How this item entered the queue.
                                                       -- user_report = created from a user report.
                                                       -- auto_detection = triggered by a moderation rule or ML model.
                                                       -- manual = manually added by a moderator.
  status            enum(pending, in_review, resolved, escalated) not_null default pending
                                                       -- pending = awaiting moderator pickup.
                                                       -- in_review = assigned to a moderator, under review.
                                                       -- resolved = decision made (see resolution field).
                                                       -- escalated = sent to senior moderator/admin.
  priority          enum(low, medium, high, critical) not_null default medium
                                                       -- Queue ordering. Critical = illegal content, imminent harm.
                                                       -- Auto-set from violation category severity or ML confidence.
  assigned_moderator_id uuid nullable references users(id) on_delete set_null
                                                       -- Moderator currently reviewing this item.
                                                       -- Set null: if moderator is deleted, item returns to unassigned.
  content_snapshot  json nullable                      -- Frozen copy of the content at time of flagging.
                                                       -- Preserves evidence even if original is edited/deleted.
                                                       -- Structure depends on content_type.
  report_count      integer not_null default 0          -- Number of user reports linked to this item.
                                                       -- Denormalized from reports table for queue sorting.
  resolution        enum(approved, removed, escalated) nullable
                                                       -- Final outcome. Null = not yet resolved.
                                                       -- approved = content is fine, no action needed.
                                                       -- removed = content violates policy.
                                                       -- escalated = sent to higher authority.
  resolved_at       timestamp nullable                 -- When the item was resolved. Null = still open.
  resolved_by       uuid nullable references users(id) on_delete set_null
                                                       -- Moderator who resolved this item.
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  index(status, priority, created_at)                  -- Primary queue query: pending items by priority, oldest first.
  index(content_type, content_id)                      -- "All queue items for this specific content."
  index(assigned_moderator_id)                         -- "My assigned items."
  index(source)                                        -- "All auto-detected items" vs "all user-reported items."
  index(status)                                        -- "All pending items."
  index(resolved_at)                                   -- Time-range queries and metrics.
}
```

**Design notes:**
- `content_snapshot` JSON preserves evidence per Lemmy's pattern of storing original content in reports. Critical for fair appeals when original content is edited or deleted.
- `report_count` is denormalized for efficient queue sorting — "items with the most reports" surfaces repeat-offender content.
- `content_id` is string (not UUID) to support IDs from external content systems.

### `reports`

User-submitted content reports (flags). One row per report — multiple users can report the same
content, and each report creates a separate record linked to the same queue item. Reports capture
the reporter's perspective: why they think the content violates policy, which rule was broken, and
optional evidence. Inspired by Mastodon's reports (category + rule_ids + comment) and Lemmy's
per-content-type reports (with evidence preservation).

```pseudo
table reports {
  id                uuid primary_key default auto_generate
  reporter_id       uuid not_null references users(id) on_delete cascade
                                                       -- Who submitted this report.
                                                       -- Cascade: if reporter is deleted, their reports are removed.
  content_type      enum(post, comment, message, user, media) not_null
                                                       -- What type of content is being reported.
  content_id        string not_null                    -- ID of the reported content. String for external ID support.
  queue_item_id     uuid nullable references moderation_queue_items(id) on_delete set_null
                                                       -- The queue item this report is linked to.
                                                       -- Multiple reports can reference the same queue item.
                                                       -- Set null: if queue item is deleted, report preserves history.
  category          enum(spam, harassment, hate_speech, violence, sexual_content, illegal, misinformation, self_harm, other) not_null
                                                       -- Reporter-selected reason category.
                                                       -- Broad categories for user-facing report form.
  reason_text       string nullable                    -- Free-text explanation from the reporter.
  policy_id         uuid nullable references moderation_policies(id) on_delete set_null
                                                       -- Which specific policy the reporter believes was violated.
                                                       -- Set null: if policy is deleted, report preserves history.
  status            enum(pending, reviewed, dismissed) not_null default pending
                                                       -- pending = not yet reviewed.
                                                       -- reviewed = moderator reviewed and took action.
                                                       -- dismissed = moderator reviewed and found no violation.
  created_at        timestamp default now
}

indexes {
  index(queue_item_id)                                 -- "All reports linked to this queue item."
  index(reporter_id)                                   -- "All reports submitted by this user."
  index(content_type, content_id)                      -- "All reports for this specific content."
  index(status)                                        -- "All pending reports."
  index(category)                                      -- "All harassment reports."
  index(created_at)                                    -- Time-range queries and metrics.
}
```

### `report_notes`

Internal moderator notes on reports. Moderators add notes to document their reasoning, share
context with other moderators, or record interim decisions before final resolution. Append-only —
notes are never edited. Inspired by Mastodon's report_notes and Discourse's reviewable_notes.

```pseudo
table report_notes {
  id                uuid primary_key default auto_generate
  queue_item_id     uuid not_null references moderation_queue_items(id) on_delete cascade
                                                       -- The queue item this note is attached to.
                                                       -- Cascade: deleting a queue item removes all its notes.
  moderator_id      uuid not_null references users(id) on_delete restrict
                                                       -- Who wrote this note.
                                                       -- Restrict: don't delete moderators who have notes.
  content           string not_null                    -- The note text. Internal-only, never shown to the reported user.
  created_at        timestamp default now               -- Append-only: notes are never edited. No updated_at.
}

indexes {
  index(queue_item_id)                                 -- "All notes for this queue item."
  index(moderator_id)                                  -- "All notes by this moderator."
}
```

### `auto_detection_results`

Results from automated content analysis — ML classifiers, perceptual hash matching, keyword
matching, and regex pattern detection. Each row is a single detection event on a piece of content.
Multiple detectors can produce multiple results for the same content (e.g., Perspective toxicity
score + PhotoDNA hash match). Linked to queue items when detection creates or updates one.
Inspired by Conversation AI Moderator's CommentScore (three-source scoring) and Stream's
multi-engine detection labels.

```pseudo
table auto_detection_results {
  id                uuid primary_key default auto_generate
  content_type      enum(post, comment, message, user, media) not_null
  content_id        string not_null                    -- What was analyzed.
  queue_item_id     uuid nullable references moderation_queue_items(id) on_delete set_null
                                                       -- Queue item created/updated by this detection.
                                                       -- Set null: if queue item is deleted, result preserves history.
  detection_method  enum(ml_classifier, hash_match, keyword, regex, blocklist) not_null
                                                       -- Type of detection that produced this result.
  detection_source  string not_null                    -- Specific detector name (e.g., "perspective", "openai",
                                                       -- "photodna", "custom_profanity_filter").
                                                       -- String, not enum — new detectors added without schema changes.
  category          string nullable                    -- Detected violation category (e.g., "toxicity", "hate_speech",
                                                       -- "csam_hash_match"). String to support detector-specific
                                                       -- category names without schema coupling.
  confidence_score  decimal nullable                   -- Detection confidence, 0.00 to 1.00.
                                                       -- Nullable: some methods (keyword match) are binary, not scored.
  matched_value     string nullable                    -- What triggered the match. Examples:
                                                       -- keyword: the matched word.
                                                       -- regex: the matched pattern.
                                                       -- hash_match: the matched hash ID.
                                                       -- ml_classifier: null (score is the result).
  is_actionable     boolean not_null default false      -- Whether this result met the threshold for automated action.
                                                       -- True = rule action was triggered.
                                                       -- False = logged for review but below action threshold.
  metadata          json nullable default {}           -- Detection-specific extra data. Examples:
                                                       -- ml_classifier: {"per_category_scores": {"hate": 0.2, "violence": 0.8}}
                                                       -- hash_match: {"distance": 0.03, "database_entry_id": "..."}
  rule_id           uuid nullable references moderation_rules(id) on_delete set_null
                                                       -- The rule that triggered this detection, if applicable.
  created_at        timestamp default now               -- Detections are immutable. No updated_at.
}

indexes {
  index(content_type, content_id)                      -- "All detection results for this content."
  index(queue_item_id)                                 -- "All detections linked to this queue item."
  index(detection_method)                              -- "All ML classifier results."
  index(detection_source)                              -- "All Perspective API results."
  index(is_actionable)                                 -- "All actionable detections."
  index(created_at)                                    -- Time-range queries and metrics.
}
```

### `moderation_actions`

Enforcement actions taken by moderators (or automated systems). Each row is a single action on a
piece of content or a user account. Links to the queue item that prompted the action and
optionally to the response template used. Supports graduated enforcement from gentle (label,
approve) through moderate (warn, mute) to severe (ban). Records whether the action was automated
(triggered by a rule) or manual (human decision). Inspired by Mastodon's account_warnings (7
action levels) and the DSA's transparency reporting requirements (restriction type, grounds,
automation level).

```pseudo
table moderation_actions {
  id                uuid primary_key default auto_generate
  queue_item_id     uuid nullable references moderation_queue_items(id) on_delete set_null
                                                       -- The queue item that prompted this action.
                                                       -- Nullable: some actions (e.g., proactive bans) aren't from queue.
                                                       -- Set null: if queue item is deleted, action preserves history.
  moderator_id      uuid nullable references users(id) on_delete set_null
                                                       -- Who took this action. Null = automated action.
                                                       -- Set null: if moderator is deleted, action preserves history.
  action_type       enum(approve, remove, warn, mute, ban, restrict, escalate, label) not_null
                                                       -- approve = content is fine, no enforcement.
                                                       -- remove = content removed from public view.
                                                       -- warn = warning message sent to user.
                                                       -- mute = user temporarily silenced.
                                                       -- ban = user banned (temporary or permanent).
                                                       -- restrict = partial feature restriction.
                                                       -- escalate = sent to senior moderator/admin.
                                                       -- label = content labeled with context/warning.
  target_type       enum(content, user, account) not_null
                                                       -- What the action applies to.
                                                       -- content = specific post/comment/message.
                                                       -- user = user-level action (warn, restrict).
                                                       -- account = account-level action (ban, suspend).
  target_id         string not_null                    -- ID of the action target. String for external ID support.
  reason            string nullable                    -- Moderator's explanation of why this action was taken.
  violation_category_id uuid nullable references violation_categories(id) on_delete set_null
                                                       -- What policy category was violated.
  response_template_id uuid nullable references response_templates(id) on_delete set_null
                                                       -- Canned response used, if any.
  is_automated      boolean not_null default false      -- Whether this action was taken by an automated system.
                                                       -- DSA requires tracking automation level.
  metadata          json nullable default {}           -- Action-specific details. Examples:
                                                       -- ban: {"duration_hours": 24, "scope": "community", "scope_id": "..."}
                                                       -- remove: {"visibility": "removed", "was_public": true}
                                                       -- label: {"label_text": "Contains disputed claims"}
  created_at        timestamp default now               -- Actions are immutable. No updated_at.
}

indexes {
  index(queue_item_id)                                 -- "All actions taken on this queue item."
  index(moderator_id)                                  -- "All actions by this moderator."
  index(action_type)                                   -- "All bans" or "all removals."
  index(target_type, target_id)                        -- "All actions on this specific content/user."
  index(violation_category_id)                         -- "All actions for hate speech violations."
  index(is_automated)                                  -- "All automated actions" for DSA reporting.
  index(created_at)                                    -- Time-range queries, metrics, and reporting.
}
```

### `appeals`

User appeals against moderation actions. Each appeal challenges a specific enforcement action.
One appeal per action prevents abuse while ensuring users have recourse. Appeals follow a clear
state machine: pending → approved (action overturned) or rejected (action upheld). Inspired by
Mastodon's appeals (linked to account_warnings with approval/rejection workflow) and YouTube's
one-appeal-per-strike policy.

```pseudo
table appeals {
  id                uuid primary_key default auto_generate
  moderation_action_id uuid not_null references moderation_actions(id) on_delete restrict
                                                       -- The action being appealed.
                                                       -- Restrict: cannot delete an action that has an active appeal.
  appellant_id      uuid not_null references users(id) on_delete cascade
                                                       -- Who submitted the appeal.
                                                       -- Cascade: if user is deleted, their appeals are removed.
  appeal_text       string not_null                    -- The user's explanation of why the action should be overturned.
  status            enum(pending, approved, rejected) not_null default pending
                                                       -- pending = awaiting review.
                                                       -- approved = action overturned.
                                                       -- rejected = action upheld.
  reviewer_id       uuid nullable references users(id) on_delete set_null
                                                       -- Moderator who reviewed the appeal. Null = pending.
  reviewer_notes    string nullable                    -- Internal notes on the appeal decision.
  reviewed_at       timestamp nullable                 -- When the appeal was decided. Null = pending.
  created_at        timestamp default now
}

indexes {
  unique(moderation_action_id)                         -- One appeal per action.
  index(appellant_id)                                  -- "All appeals by this user."
  index(status)                                        -- "All pending appeals."
  index(reviewer_id)                                   -- "All appeals reviewed by this moderator."
  index(created_at)                                    -- Time-range queries and metrics.
}
```

### `user_restrictions`

Active restrictions on user accounts. Supports multiple concurrent restrictions (e.g., muted
in one community while on probation globally). Tracks the full lifecycle: who imposed it, when
it expires, who lifted it if ended early. Inspired by Mastodon's account_warnings, Twitch's
bans/timeouts, and Reddit's per-subreddit/site-wide bans.

```pseudo
table user_restrictions {
  id                uuid primary_key default auto_generate
  user_id           uuid not_null references users(id) on_delete cascade
                                                       -- The restricted user.
                                                       -- Cascade: if user is deleted, their restrictions are removed.
  restriction_type  enum(ban, mute, post_restriction, shadow_ban, warning, probation) not_null
                                                       -- ban = full access revocation.
                                                       -- mute = cannot post/comment.
                                                       -- post_restriction = limited posting frequency or features.
                                                       -- shadow_ban = content hidden from others without notifying user.
                                                       -- warning = formal warning on record.
                                                       -- probation = enhanced monitoring, lower trust.
  scope             enum(global, community, channel) not_null default global
                                                       -- Where the restriction applies.
  scope_id          string nullable                    -- Community/channel ID. Null when scope = global.
  reason            string nullable                    -- Why the restriction was imposed.
  moderation_action_id uuid nullable references moderation_actions(id) on_delete set_null
                                                       -- The moderation action that created this restriction.
  imposed_by        uuid not_null references users(id) on_delete restrict
                                                       -- Moderator who imposed the restriction.
                                                       -- Restrict: don't delete moderators who have imposed restrictions.
  imposed_at        timestamp not_null default now      -- When the restriction was imposed.
  expires_at        timestamp nullable                 -- When the restriction expires. Null = permanent.
  is_active         boolean not_null default true       -- Whether the restriction is currently in effect.
  lifted_by         uuid nullable references users(id) on_delete set_null
                                                       -- Moderator who lifted the restriction early.
  lifted_at         timestamp nullable                 -- When the restriction was lifted. Null = still active or expired.
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  index(user_id, is_active)                            -- "All active restrictions for this user."
  index(restriction_type)                              -- "All bans" for reporting.
  index(scope, scope_id)                               -- "All restrictions in this community."
  index(expires_at, is_active)                         -- Cleanup job: find expired restrictions to deactivate.
  index(imposed_by)                                    -- "All restrictions imposed by this moderator."
}
```

### `strikes`

Accumulated violations for users — a YouTube-style strike system with configurable expiry.
Strikes are distinct from restrictions: a strike is a permanent record of a violation, while
a restriction is an active enforcement. Strikes accumulate over time; exceeding a threshold
triggers automatic escalation (e.g., 3 active strikes → temporary ban). Strikes can expire
after a configured period if no repeat violations occur. Inspired by YouTube's three-strike
system with 90-day expiry and Discourse's trust level system.

```pseudo
table strikes {
  id                uuid primary_key default auto_generate
  user_id           uuid not_null references users(id) on_delete cascade
                                                       -- The user who received the strike.
                                                       -- Cascade: if user is deleted, their strikes are removed.
  moderation_action_id uuid not_null references moderation_actions(id) on_delete restrict
                                                       -- The action that generated this strike.
                                                       -- Restrict: cannot delete an action that has a strike record.
  violation_category_id uuid nullable references violation_categories(id) on_delete set_null
                                                       -- What type of violation the strike is for.
  severity          enum(minor, moderate, severe) not_null default moderate
                                                       -- Strike weight. Severe strikes may count as 2 or 3.
  issued_at         timestamp not_null default now
  expires_at        timestamp nullable                 -- When this strike expires. Null = never expires.
                                                       -- YouTube: 90 days if no repeat violation and training completed.
  is_active         boolean not_null default true       -- Whether this strike is currently counting.
                                                       -- False = expired or overturned on appeal.
  resolution        enum(active, expired, appealed_overturned) not_null default active
                                                       -- active = currently counting against the user.
                                                       -- expired = strike expired after the configured period.
                                                       -- appealed_overturned = strike removed via successful appeal.
  created_at        timestamp default now
}

indexes {
  index(user_id, is_active)                            -- "All active strikes for this user" — threshold check.
  index(moderation_action_id)                          -- "Strike for this action."
  index(violation_category_id)                         -- "All strikes for hate speech violations."
  index(expires_at, is_active)                         -- Background job: expire strikes past their expiry date.
  index(resolution)                                    -- "All overturned strikes" for reporting.
}
```

### `user_trust_scores`

User reputation tracking within the moderation system. Trust scores reflect a user's history of
compliance and participation quality. Higher trust users may have reduced moderation friction
(auto-approved content) while lower trust triggers enhanced scrutiny. Tracks both content creation
behavior (violations) and moderation participation behavior (report accuracy). Inspired by
Discourse's five-level trust system and Conversation AI Moderator's user accuracy tracking.

```pseudo
table user_trust_scores {
  id                uuid primary_key default auto_generate
  user_id           uuid unique not_null references users(id) on_delete cascade
                                                       -- One trust score record per user.
                                                       -- Cascade: if user is deleted, their trust score is removed.
  trust_level       enum(new, basic, member, trusted, veteran) not_null default new
                                                       -- Discrete trust tier for access control decisions.
                                                       -- new = new account, highest scrutiny.
                                                       -- basic = verified email, some activity.
                                                       -- member = established user, good standing.
                                                       -- trusted = long history of compliance.
                                                       -- veteran = exemplary record, may assist in moderation.
  trust_score       decimal not_null default 0.5        -- Continuous score from 0.00 (lowest trust) to 1.00 (highest trust).
                                                       -- Updated algorithmically based on behavior signals.
  total_reports_filed integer not_null default 0        -- Total reports this user has submitted.
  reports_upheld    integer not_null default 0          -- Reports that led to enforcement action.
  reports_dismissed integer not_null default 0          -- Reports that were dismissed.
  flag_accuracy     decimal not_null default 0.5        -- reports_upheld / total_reports_filed (cached).
                                                       -- Used to weight this user's future reports.
  content_violations integer not_null default 0         -- Total times this user's content was actioned.
  last_violation_at timestamp nullable                 -- When the user's most recent violation occurred.
  updated_at        timestamp default now on_update
}

indexes {
  -- unique(user_id) is already created by the field constraint above.
  index(trust_level)                                   -- "All new users" or "all trusted users."
  index(trust_score)                                   -- Score-based queries for trust thresholds.
}
```

### `moderator_assignments`

Default routing rules for assigning content to moderators by category, community, or content type.
Enables workload distribution — specific moderators handle specific communities or violation types.
Inspired by Mastodon's report assignment, Conversation AI Moderator's ModeratorAssignment table,
and Reddit's per-subreddit moderator teams.

```pseudo
table moderator_assignments {
  id                uuid primary_key default auto_generate
  moderator_id      uuid not_null references users(id) on_delete cascade
                                                       -- The assigned moderator.
                                                       -- Cascade: if moderator is deleted, their assignments are removed.
  scope             enum(community, channel, category) not_null
                                                       -- What this assignment covers.
                                                       -- community = moderator handles a specific community.
                                                       -- channel = moderator handles a specific channel.
                                                       -- category = moderator handles a specific violation category.
  scope_id          string not_null                    -- ID of the community, channel, or violation category.
                                                       -- String for external ID support.
  role              enum(moderator, senior_moderator, admin) not_null default moderator
                                                       -- Authority level within this assignment scope.
                                                       -- moderator = standard moderation powers.
                                                       -- senior_moderator = can handle escalations, override decisions.
                                                       -- admin = full authority including moderator management.
  is_active         boolean not_null default true       -- Whether this assignment is currently active.
  assigned_at       timestamp not_null default now      -- When this assignment was created.
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  unique(moderator_id, scope, scope_id)                -- One assignment per moderator per scope entity.
  index(scope, scope_id)                               -- "All moderators for this community."
  index(moderator_id)                                  -- "All assignments for this moderator."
  index(is_active)                                     -- "All active assignments."
}
```

### `moderator_performance`

Pre-aggregated moderator performance metrics for reporting and workload management. Each row is a
periodic rollup (daily, weekly, monthly) of a moderator's activity. Enables manager dashboards,
quality monitoring, and workload balancing. Computed by background jobs from operational data
(actions, appeals, queue items). Inspired by industry-standard moderation KPIs: review time,
action rate, accuracy, and appeal overturn rate.

```pseudo
table moderator_performance {
  id                uuid primary_key default auto_generate
  moderator_id      uuid not_null references users(id) on_delete cascade
                                                       -- The moderator being measured.
                                                       -- Cascade: if moderator is deleted, their metrics are removed.
  period_start      timestamp not_null                 -- Start of the measurement period.
  period_end        timestamp not_null                 -- End of the measurement period.
  items_reviewed    integer not_null default 0          -- Total queue items reviewed during this period.
  items_actioned    integer not_null default 0          -- Items where enforcement action was taken (vs approved/dismissed).
  average_review_time_seconds integer not_null default 0
                                                       -- Mean time from assignment to resolution, in seconds.
  appeals_overturned integer not_null default 0         -- Actions by this moderator that were overturned on appeal.
  accuracy_score    decimal not_null default 1.0        -- 1.0 - (appeals_overturned / items_actioned), clamped to 0-1.
                                                       -- Higher = more consistent with appeal outcomes.
  computed_at       timestamp not_null default now      -- When this rollup was last computed.
  created_at        timestamp default now
}

indexes {
  unique(moderator_id, period_start, period_end)       -- One rollup per moderator per period.
  index(moderator_id)                                  -- "All performance records for this moderator."
  index(period_start, period_end)                      -- "All performance records for this period."
}
```

### `moderation_action_log`

Immutable audit trail of all moderation-related events. Every significant moderation action —
policy changes, rule updates, queue assignments, enforcement decisions, appeal outcomes — is
logged here with actor identity, target, and full details. Append-only: rows are never updated
or deleted. Inspired by Mastodon's admin_action_logs (polymorphic target) and Discourse's
reviewable_histories.

```pseudo
table moderation_action_log {
  id                uuid primary_key default auto_generate
  actor_id          uuid not_null references users(id) on_delete restrict
                                                       -- Who performed the action.
                                                       -- Restrict: don't delete users who have audit trail entries.
  action_type       string not_null                    -- What happened. Intentionally not an enum — new action types
                                                       -- should not require schema migration.
                                                       -- Examples: "report_created", "queue_item_assigned", "action_taken",
                                                       -- "appeal_submitted", "appeal_decided", "rule_created",
                                                       -- "rule_updated", "policy_updated", "user_restricted",
                                                       -- "restriction_lifted", "domain_blocked".
  target_type       string not_null                    -- What entity the action was on (e.g., "queue_item", "report",
                                                       -- "user", "moderation_rule", "policy").
  target_id         string not_null                    -- ID of the target entity.
  details           json nullable                      -- Event-specific context. Examples:
                                                       -- action_taken: {"action_type": "ban", "reason": "...", "duration": "24h"}
                                                       -- appeal_decided: {"status": "approved", "original_action": "remove"}
                                                       -- rule_updated: {"field": "trigger_config", "old": {...}, "new": {...}}
  ip_address        string nullable                    -- Client IP address for security audit.
  created_at        timestamp default now               -- Append-only. No updated_at.
}

indexes {
  index(actor_id)                                      -- "All actions by this moderator."
  index(action_type)                                   -- "All appeal decisions" or "all bans."
  index(target_type, target_id)                        -- "All log entries for this specific entity."
  index(created_at)                                    -- Time-range queries and retention.
}
```

**Design notes:**
- `action_type` and `target_type` are strings rather than enums — the audit log should accept any event type without requiring schema migration. This follows Mastodon's polymorphic admin_action_logs pattern.

### `user_moderation_notes`

Internal moderator notes on a user account. Distinct from `report_notes` (which are attached to
queue items): these capture ongoing context about a user's moderation history — "known ban evader",
"handle with care", "cooperated with previous warning". Visible only to moderators, not to the user.
Inspired by Mastodon's `account_moderation_notes`.

```pseudo
table user_moderation_notes {
  id                uuid primary_key default auto_generate
  user_id           uuid not_null references users(id) on_delete cascade
                                                       -- The user this note is about.
                                                       -- Cascade: deleting the user removes their moderation notes.
  author_id         uuid not_null references users(id) on_delete restrict
                                                       -- The moderator who wrote this note.
                                                       -- Restrict: don't delete moderators who have notes on file.
  body              text not_null                       -- The note content.
  created_at        timestamp default now
  updated_at        timestamp default now on_update

  indexes {
    index(user_id)                                     -- "All moderation notes for this user."
    index(author_id)                                   -- "All notes written by this moderator."
  }
}
```

### `blocked_domains`

Domain-level blocking for preventing content from specific domains. Supports full domain blocks
(all content from that domain is rejected), media-only blocks (text allowed, media rejected),
and report-reject blocks (reports from users on that domain are ignored — relevant for federated
platforms). Inspired by Mastodon's domain_blocks with severity levels and public/private
comments.

```pseudo
table blocked_domains {
  id                uuid primary_key default auto_generate
  domain            string unique not_null             -- The blocked domain (e.g., "spam-site.com").
                                                       -- Unique constraint prevents duplicate blocks.
  block_type        enum(full, media_only, report_reject) not_null default full
                                                       -- full = all content from this domain is blocked.
                                                       -- media_only = text content allowed, media rejected.
                                                       -- report_reject = reports from this domain's users are ignored.
  reason            string nullable                    -- Why this domain was blocked.
  public_comment    string nullable                    -- Comment visible to users about why the domain is blocked.
  private_comment   string nullable                    -- Internal moderator note. Not visible to users.
  created_by        uuid not_null references users(id) on_delete restrict
                                                       -- Who blocked this domain.
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  -- unique(domain) is already created by the field constraint above.
  index(block_type)                                    -- "All full domain blocks."
  index(created_by)                                    -- "All domains blocked by this moderator."
}
```

### `blocked_ips`

IP-level blocking for preventing access from specific IP addresses or ranges. Supports CIDR
notation for range blocks (e.g., "192.168.1.0/24") and individual IPs. Blocks can be temporary
(with expiry) or permanent. Inspired by Mastodon's ip_blocks with severity levels and expiry
support.

```pseudo
table blocked_ips {
  id                uuid primary_key default auto_generate
  ip_address        string unique not_null             -- IP address or CIDR range (e.g., "192.168.1.100", "10.0.0.0/8").
                                                       -- String to support both IPv4 and IPv6.
                                                       -- Unique constraint prevents duplicate blocks.
  severity          enum(sign_up_block, login_block, full_block) not_null default full_block
                                                       -- sign_up_block = prevent new account creation from this IP.
                                                       -- login_block = prevent login from this IP.
                                                       -- full_block = block all access from this IP.
  reason            string nullable                    -- Why this IP was blocked.
  expires_at        timestamp nullable                 -- When this block expires. Null = permanent.
  created_by        uuid not_null references users(id) on_delete restrict
                                                       -- Who blocked this IP.
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}

indexes {
  -- unique(ip_address) is already created by the field constraint above.
  index(severity)                                      -- "All full blocks."
  index(expires_at)                                    -- Cleanup job: find and remove expired blocks.
  index(created_by)                                    -- "All IPs blocked by this moderator."
}
```

## Relationships

### One-to-Many

- `violation_categories` → `violation_categories` (a category has many child categories, via `parent_id`)
- `violation_categories` → `moderation_policies` (a category is referenced by many policies)
- `violation_categories` → `moderation_actions` (a category is cited in many actions)
- `violation_categories` → `strikes` (a category is cited in many strikes)
- `violation_categories` → `response_templates` (a category is suggested by many templates)
- `moderation_policies` → `reports` (a policy is cited in many reports)
- `moderation_rules` → `auto_detection_results` (a rule triggers many detections)
- `keyword_lists` → `keyword_list_entries` (a list has many entries)
- `moderation_queue_items` → `reports` (a queue item has many reports)
- `moderation_queue_items` → `report_notes` (a queue item has many notes)
- `moderation_queue_items` → `auto_detection_results` (a queue item has many detection results)
- `moderation_queue_items` → `moderation_actions` (a queue item has many actions)
- `moderation_actions` → `user_restrictions` (an action can create a restriction)
- `moderation_actions` → `strikes` (an action generates a strike)
- `moderation_actions` → `appeals` (an action can be appealed — one-to-one)
- `users` → `reports` (a user submits many reports, via `reporter_id`)
- `users` → `report_notes` (a moderator writes many notes, via `moderator_id`)
- `users` → `moderation_actions` (a moderator takes many actions, via `moderator_id`)
- `users` → `appeals` (a user submits many appeals, via `appellant_id`)
- `users` → `user_restrictions` (a user has many restrictions)
- `users` → `strikes` (a user receives many strikes)
- `users` → `moderator_assignments` (a moderator has many assignments)
- `users` → `moderator_performance` (a moderator has many performance records)
- `users` → `moderation_action_log` (an actor has many log entries, via `actor_id`)
- `users` → `user_moderation_notes` (a user has many moderation notes, via `user_id`)
- `users` → `user_moderation_notes` (a moderator writes many notes, via `author_id`)
- `users` → `moderation_queue_items` (a moderator reviews many items, via `assigned_moderator_id`)
- `users` → `moderation_queue_items` (a moderator resolves many items, via `resolved_by`)
- `users` → `user_restrictions` (a moderator imposes many restrictions, via `imposed_by`)
- `users` → `moderation_rules` (a moderator creates many rules, via `created_by`)
- `users` → `keyword_lists` (a moderator creates many lists, via `created_by`)
- `users` → `keyword_list_entries` (a moderator adds many entries, via `added_by`)
- `users` → `response_templates` (a moderator creates many templates, via `created_by`)
- `users` → `blocked_domains` (a moderator blocks many domains, via `created_by`)
- `users` → `blocked_ips` (a moderator blocks many IPs, via `created_by`)

### Many-to-Many (via junction tables)

- `moderation_rules` ↔ `keyword_lists` (through `trigger_config` JSON reference — not a junction table, but a logical M:N relationship)

## Best Practices

- **Unified moderation queue** — All flagged content from all sources (user reports, auto-detection, manual flagging) flows into one queue. Moderators work from a single prioritized list. Separate source tracking enables per-source metrics without fragmenting the workflow.
- **Separate reports from queue items** — Reports are user actions ("I flagged this"). Queue items are moderator work items ("This needs review"). Multiple reports can map to one queue item. Auto-detection creates queue items without reports. This separation enables both user-facing report tracking and moderator-facing queue management.
- **Preserve content snapshots** — Store a JSON snapshot of flagged content at the time of flagging. Content may be edited or deleted after being reported. Without snapshots, appeals review becomes unreliable. Follow Lemmy's evidence preservation pattern.
- **Graduated enforcement** — Support a range of enforcement actions from gentle (approve, label) through moderate (warn, mute, restrict) to severe (ban). YouTube, Mastodon, and Twitch all demonstrate that proportional response reduces over-enforcement and improves user trust.
- **One appeal per action** — Prevent appeal spam while ensuring user recourse. Clear state machine (pending → approved/rejected) with reviewer accountability. YouTube and Mastodon both use this pattern.
- **Strike accumulation with expiry** — Track violations as strikes that accumulate over time but can expire if the user demonstrates improved behavior. YouTube's 90-day expiry model balances enforcement with rehabilitation.
- **Configurable auto-moderation rules** — Store rule conditions as JSON (not normalized columns) because trigger types vary too widely. Discord, Twitch, and Conversation AI Moderator all use configurable rule-based automation. Support keyword, regex, ML threshold, and hash matching triggers.
- **Hierarchical violation categories** — Support TSPA and DSA taxonomies with parent/child categories. Enables roll-up reporting ("all hate speech violations") and granular classification ("racial hatred" specifically).
- **Separate domain/IP blocking from user restrictions** — Domain and IP blocks target infrastructure, not individual users. They have different fields (CIDR, media-only) and lifecycles. Mastodon correctly separates domain_blocks and ip_blocks from account-level moderation.
- **Immutable audit log** — Every moderation action is logged with actor identity, target, and details. Use string types for action_type and target_type (not enums) so new event types don't require schema migration. Append-only: rows are never updated or deleted.
- **Pre-aggregate moderator performance** — Compute periodic rollups rather than real-time aggregation from action logs. Moderation metrics don't need sub-minute freshness, and real-time computation is expensive at scale.

## Formats

Each table is a separate file within each format folder:

| Format      | Directory                        | Status  |
| ----------- | -------------------------------- | ------- |
| Convex      | [`convex/`](./convex/)           | ✅ Done |
| SQL         | [`sql/`](./sql/)                 | ✅ Done |
| Prisma      | [`prisma/`](./prisma/)           | ✅ Done |
| MongoDB     | [`mongodb/`](./mongodb/)         | ✅ Done |
| Drizzle     | [`drizzle/`](./drizzle/)         | ✅ Done |
| SpacetimeDB | [`spacetimedb/`](./spacetimedb/) | ✅ Done |
| Firebase    | [`firebase/`](./firebase/)       | ✅ Done |
