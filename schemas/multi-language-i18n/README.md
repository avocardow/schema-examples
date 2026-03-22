# Multi-language / i18n

> Internationalization infrastructure: locales, translation keys, content translations, plural forms, translation memory, glossary, workflow, and tooling.

## Overview

Full internationalization (i18n) and localization (l10n) infrastructure for applications that serve content in multiple languages. Covers the complete translation lifecycle from locale configuration through key management, content translation, quality assurance, and delivery. Supports both UI string translations (key-value lookups for buttons, labels, messages) and content translations (translating arbitrary entity fields like product names or article bodies).

Designed from a study of 12 systems: CMS platforms (WordPress WPML, Drupal, Strapi, Contentful, Sanity), e-commerce (Shopify Translations API, Magento/Adobe Commerce EAV), frameworks (Rails Globalize/Mobility, Django parler/modeltranslation, Laravel Spatie), and translation management platforms (Crowdin, Weblate). Follows industry standards: BCP 47 language tags, Unicode CLDR plural rules, ICU MessageFormat patterns, and TMX-compatible translation memory.

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (18 tables)</summary>

- [Multi-language / i18n](#multi-language--i18n)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Dependencies](#dependencies)
  - [Tables](#tables)
    - [Core Locale Management](#core-locale-management)
    - [Key Management](#key-management)
    - [Content Translation](#content-translation)
    - [Translation Memory & Glossary](#translation-memory--glossary)
    - [Workflow & Quality](#workflow--quality)
    - [Context & Tooling](#context--tooling)
  - [Schema](#schema)
    - [`locales`](#locales)
    - [`locale_fallbacks`](#locale_fallbacks)
    - [`locale_plural_rules`](#locale_plural_rules)
    - [`namespaces`](#namespaces)
    - [`translation_keys`](#translation_keys)
    - [`translation_values`](#translation_values)
    - [`translation_key_tags`](#translation_key_tags)
    - [`translatable_resources`](#translatable_resources)
    - [`content_translations`](#content_translations)
    - [`translation_memory_entries`](#translation_memory_entries)
    - [`glossary_terms`](#glossary_terms)
    - [`glossary_term_translations`](#glossary_term_translations)
    - [`translation_status_history`](#translation_status_history)
    - [`translation_comments`](#translation_comments)
    - [`screenshots`](#screenshots)
    - [`screenshot_key_links`](#screenshot_key_links)
    - [`import_export_jobs`](#import_export_jobs)
    - [`machine_translation_configs`](#machine_translation_configs)
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
| [Auth / RBAC](../auth-rbac) | `users` | Translators, reviewers, content owners, and audit trails |

## Tables

### Core Locale Management

- `locales`
- `locale_fallbacks`
- `locale_plural_rules`

### Key Management

- `namespaces`
- `translation_keys`
- `translation_values`
- `translation_key_tags`

### Content Translation

- `translatable_resources`
- `content_translations`

### Translation Memory & Glossary

- `translation_memory_entries`
- `glossary_terms`
- `glossary_term_translations`

### Workflow & Quality

- `translation_status_history`
- `translation_comments`

### Context & Tooling

- `screenshots`
- `screenshot_key_links`
- `import_export_jobs`
- `machine_translation_configs`

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. locales

Supported locales with BCP 47 tags, display metadata, and plural configuration. Each locale stores
its native name, text direction (LTR/RTL), script, and CLDR plural form count. The `is_default` flag
identifies the system's fallback locale — only one locale should have this set. Inspired by Contentful's
locale configuration, CLDR locale data, and Weblate's Language model.

```pseudo
table locales {
  id                uuid primary_key default auto_generate
  code              string unique not_null               -- BCP 47 language tag (e.g., "en-US", "zh-Hans", "ar-EG").
                                                         -- VARCHAR(35) covers all practical BCP 47 tags.
                                                         -- This is the universal identifier — all references use locale_id FK, not code.
  name              string not_null                      -- English display name (e.g., "English (United States)", "Chinese (Simplified)").
  native_name       string nullable                      -- Name in the locale's own language (e.g., "English (US)", "中文(简体)", "العربية").
                                                         -- Nullable: not all locales have native name data readily available.
  text_direction    enum(ltr, rtl) not_null default ltr  -- Text direction. Stored here (not computed) as the authoritative source
                                                         -- for UI layout decisions. RTL: Arabic, Hebrew, Persian, Urdu.
  script            string nullable                      -- ISO 15924 script code (e.g., "Latn", "Hans", "Hant", "Arab", "Cyrl").
                                                         -- Enables font selection and rendering decisions.
                                                         -- Nullable: most locales have an implied script from the language subtag.
  plural_rule       string nullable                      -- CLDR plural rule type (e.g., "western", "slavic", "arabic").
                                                         -- Determines which plural categories apply to this locale.
  plural_forms      integer not_null default 2           -- Number of plural forms (1-6). English=2, Arabic=6, Japanese=1.
                                                         -- Derived from CLDR. Determines how many translation_values rows
                                                         -- are needed per plural key per locale.
  is_default        boolean not_null default false       -- System default locale. Only one locale should have this set to true.
                                                         -- Used as the terminal fallback when no translation exists.
                                                         -- Enforce via partial unique index or application logic.
  is_enabled        boolean not_null default true        -- Whether this locale is active. Disabled locales are hidden from
                                                         -- end users but preserved for translators and admin.
  date_format       string nullable                      -- Display format override (e.g., "MM/DD/YYYY", "DD.MM.YYYY").
                                                         -- Null = use CLDR default for this locale.
  time_format       string nullable                      -- Display format override (e.g., "h:mm A", "HH:mm").
  number_format     string nullable                      -- Display format override (e.g., "1,234.56", "1.234,56").
  currency_code     string nullable                      -- ISO 4217 currency code (e.g., "USD", "EUR", "JPY").
  currency_symbol   string nullable                      -- Currency symbol (e.g., "$", "€", "¥", "£").
  first_day_of_week integer not_null default 1           -- 0 = Sunday, 1 = Monday, 6 = Saturday.
                                                         -- Varies by region: US=0, most of Europe=1, Middle East=6.
  measurement_system string nullable                     -- "metric" or "imperial". Null = use locale default.
  created_at        timestamp default now
  updated_at        timestamp default now on_update

  indexes {
    index(is_enabled)                                    -- "All active locales" — the locale picker query.
  }
}
```

### 2. locale_fallbacks

Fallback chain definitions per locale. When a translation is missing for a locale, the system walks
the fallback chain in priority order until a translation is found or the default locale is reached.
Enables chains like `en-AU → en-GB → en → default`. Inspired by Contentful's fallback locale
configuration and RFC 4647 lookup matching.

```pseudo
table locale_fallbacks {
  id                    uuid primary_key default auto_generate
  locale_id             uuid not_null references locales(id) on_delete cascade
                                                         -- The locale that needs a fallback.
                                                         -- Cascade: removing a locale removes its fallback rules.
  fallback_locale_id    uuid not_null references locales(id) on_delete cascade
                                                         -- The locale to fall back to.
                                                         -- Cascade: removing the fallback locale removes the rule.
  priority              integer not_null default 0       -- Lower = higher priority. Allows multiple fallbacks per locale.
                                                         -- e.g., en-AU: priority 0 → en-GB, priority 1 → en.
  created_at            timestamp default now
  updated_at            timestamp default now on_update

  indexes {
    composite_unique(locale_id, fallback_locale_id)      -- A locale can only have one fallback rule per target locale.
    composite_unique(locale_id, priority)                 -- Priority must be unique per locale to ensure deterministic ordering.
  }
}
```

### 3. locale_plural_rules

Per-locale CLDR plural category definitions. Defines which plural categories (zero, one, two, few,
many, other) apply to each locale and provides example numbers and rule formulas. Acts as an integrity
anchor for `translation_values.plural_category` — without this table, nothing validates which categories
are valid for a given locale. Inspired by Weblate's Plural model and CLDR plural rules.

```pseudo
table locale_plural_rules {
  id                uuid primary_key default auto_generate
  locale_id         uuid not_null references locales(id) on_delete cascade
                                                         -- Which locale this rule applies to.
                                                         -- Cascade: removing a locale removes its plural rules.
  category          enum(zero, one, two, few, many, other) not_null
                                                         -- CLDR plural category.
  example           string nullable                      -- Example number(s) for this category (e.g., "0" for zero, "1" for one,
                                                         -- "2" for two, "3,4" for few, "5-19" for many).
                                                         -- Helps translators understand when each form is used.
  rule_formula      string nullable                      -- CLDR rule expression (e.g., "n = 1", "n % 10 = 2..4 and n % 100 != 12..14").
                                                         -- Machine-readable rule for the application layer.
  created_at        timestamp default now

  indexes {
    composite_unique(locale_id, category)                -- One rule per locale per plural category.
  }
}
```

### 4. namespaces

Organizational grouping for translation keys. Maps to i18next namespaces, gettext domains, and
Rails i18n scopes. Enables lazy loading — only fetch the keys needed for the current page or feature.
Supports dot notation in names for hierarchical organization (e.g., "admin.users", "checkout.payment").

```pseudo
table namespaces {
  id                uuid primary_key default auto_generate
  name              string unique not_null               -- Namespace identifier (e.g., "common", "checkout", "admin.users").
                                                         -- Unique globally. Used in API paths and cache keys.
  description       string nullable                      -- Explain what this namespace contains (e.g., "Shared UI labels").
  is_default        boolean not_null default false       -- Default namespace for keys without explicit namespace assignment.
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}
```

### 5. translation_keys

Individual translatable string identifiers with context and metadata. Each key belongs to a namespace
and has a unique key string within that namespace. Keys can be marked as plural (requiring multiple
translation_values per locale) and can specify format constraints. Inspired by Crowdin's source strings
and Lokalise's keys.

```pseudo
table translation_keys {
  id                uuid primary_key default auto_generate
  namespace_id      uuid not_null references namespaces(id) on_delete cascade
                                                         -- Which namespace this key belongs to.
                                                         -- Cascade: deleting a namespace removes all its keys.
  key               string not_null                      -- The translation key (e.g., "submit_button", "cart.item_count").
                                                         -- Uses dot notation for hierarchical organization within namespace.
  description       string nullable                      -- Context for translators (e.g., "Button label on the checkout page").
                                                         -- Critical for translation quality — appears in translation tools.
  max_length        integer nullable                     -- Character limit for UI constraints (e.g., button width).
                                                         -- Null = no limit. Translators see this as a warning threshold.
  is_plural         boolean not_null default false       -- Whether this key has plural forms.
                                                         -- When true, translation_values stores one row per CLDR plural category.
  format            string not_null default 'text'       -- Content format: 'text', 'html', 'markdown', 'icu'.
                                                         -- Tells translators what markup/syntax is allowed.
  is_hidden         boolean not_null default false       -- Hide from translators (internal/system use only).
  created_at        timestamp default now
  updated_at        timestamp default now on_update

  indexes {
    composite_unique(namespace_id, key)                  -- Key must be unique within its namespace.
    index(namespace_id)                                  -- "All keys in this namespace" — the bulk loading query.
    index(is_plural)                                     -- Filter plural vs non-plural keys.
  }
}
```

### 6. translation_values

Translated string values per key per locale, with plural form support. This is the core translation
storage — one row per key × locale × plural category. Non-plural keys have `plural_category` set to
NULL. Plural keys have one row per CLDR category (zero, one, two, few, many, other) — the number
of categories depends on the locale's `plural_forms` count.

Status tracks the translation workflow lifecycle. `source_digest` enables Shopify-style staleness
detection — when the source text changes, translations with a mismatched digest are flagged as outdated.

```pseudo
table translation_values {
  id                    uuid primary_key default auto_generate
  translation_key_id    uuid not_null references translation_keys(id) on_delete cascade
                                                         -- Which key this translation is for.
                                                         -- Cascade: deleting a key removes all its translations.
  locale_id             uuid not_null references locales(id) on_delete cascade
                                                         -- Which locale this translation is in.
                                                         -- Cascade: removing a locale removes all its translations.
  plural_category       string nullable                  -- CLDR plural category: 'zero', 'one', 'two', 'few', 'many', 'other'.
                                                         -- NULL for non-plural keys. Exactly one of the six CLDR categories for plural keys.
  value                 text not_null                    -- The translated string. May contain ICU MessageFormat patterns,
                                                         -- HTML, or markdown depending on the key's format field.
  status                enum(draft, in_review, approved, published, rejected) not_null default draft
                                                         -- Translation workflow status.
                                                         -- draft → in_review → approved → published (happy path).
                                                         -- rejected sends back to draft for revision.
  is_machine_translated boolean not_null default false   -- Whether this translation was generated by a machine translation engine.
                                                         -- Used for quality awareness and review prioritization.
  source_digest         string nullable                  -- SHA-256 hash of the source (default locale) value.
                                                         -- When the source changes, translations with a mismatched digest
                                                         -- are flagged as outdated. Inspired by Shopify's translatableContentDigest.
  translator_id         uuid nullable references users(id) on_delete set_null
                                                         -- Who created or last edited this translation.
                                                         -- Set null: preserve translation if user is deleted.
  reviewed_by           uuid nullable references users(id) on_delete set_null
                                                         -- Who last reviewed this translation.
  published_at          timestamp nullable               -- When this translation was published. Null = not yet published.
  created_at            timestamp default now
  updated_at            timestamp default now on_update

  indexes {
    composite_unique(translation_key_id, locale_id, plural_category)
                                                         -- One translation per key per locale per plural category.
                                                         -- ⚠️ plural_category is nullable. In SQL, NULL != NULL, so this
                                                         --    unique constraint allows multiple NULLs. Use a partial unique index
                                                         --    or COALESCE to enforce uniqueness for non-plural keys.
    index(locale_id, status)                             -- "All published translations for this locale" — the bundle query.
    index(translation_key_id)                            -- "All translations for this key" — the translation matrix view.
    index(status)                                        -- "All translations in review" — the reviewer queue.
    index(translator_id)                                 -- "All translations by this user."
  }
}
```

### 7. translation_key_tags

Tagging system for organizing and filtering translation keys. Tags like "urgent", "marketing",
"legal", "v2.0" enable bulk operations and workflow organization. Matches Crowdin's labels and
Lokalise's tags.

```pseudo
table translation_key_tags {
  id                    uuid primary_key default auto_generate
  translation_key_id    uuid not_null references translation_keys(id) on_delete cascade
                                                         -- Which key this tag is applied to.
                                                         -- Cascade: deleting a key removes its tags.
  tag                   string not_null                  -- Tag name (e.g., "urgent", "marketing", "v2.0").
  created_at            timestamp default now

  indexes {
    composite_unique(translation_key_id, tag)            -- A key can have each tag only once.
    index(tag)                                           -- "All keys with this tag" — bulk filtering.
  }
}
```

### 8. translatable_resources

Registry of entity types that support content translation. Defines which entity types (e.g., "product",
"article", "category") can have translated fields, and which fields are translatable. Inspired by
Shopify's TranslatableResourceType enum and Contentful's per-field localizability control.

```pseudo
table translatable_resources {
  id                    uuid primary_key default auto_generate
  resource_type         string unique not_null           -- Entity type identifier (e.g., "product", "article", "category", "page").
                                                         -- Unique: one registry entry per entity type.
  display_name          string not_null                  -- Human-readable name (e.g., "Product", "Blog Article").
  translatable_fields   json not_null                    -- Array of field names that can be translated
                                                         -- (e.g., ["name", "description", "meta_title"]).
                                                         -- Application code uses this to determine which fields to offer for translation.
  description           string nullable                  -- Explain what this resource type is (e.g., "E-commerce product listings").
  is_enabled            boolean not_null default true    -- Whether translation is active for this resource type.
  created_at            timestamp default now
  updated_at            timestamp default now on_update
}
```

### 9. content_translations

Translated field values for arbitrary content entities. This is the generic content translation table —
any entity type, any field, any locale. Separates content translations from UI string translations
because they have different access patterns: content translations are entity-based lookups while UI
strings are key-based lookups. `entity_id` is a string for polymorphic references (works with UUIDs,
integers, slugs).

```pseudo
table content_translations {
  id                    uuid primary_key default auto_generate
  resource_id           uuid not_null references translatable_resources(id) on_delete cascade
                                                         -- Which resource type this translation is for.
                                                         -- Cascade: removing a resource type removes all its translations.
  entity_id             string not_null                  -- The ID of the specific entity being translated (polymorphic).
                                                         -- String type accommodates UUIDs, integers, and composite keys.
                                                         -- Not a FK — target table depends on resource_type.
  locale_id             uuid not_null references locales(id) on_delete cascade
                                                         -- Which locale this translation is in.
                                                         -- Cascade: removing a locale removes all content translations for it.
  field_name            string not_null                  -- Which field of the entity this translation is for
                                                         -- (e.g., "name", "description", "meta_title").
                                                         -- Must be in the resource's translatable_fields array.
  value                 text not_null                    -- The translated field value.
  status                enum(draft, in_review, approved, published, rejected) not_null default draft
                                                         -- Workflow status. Same lifecycle as translation_values.
  source_digest         string nullable                  -- SHA-256 hash of the source field value for staleness detection.
  translator_id         uuid nullable references users(id) on_delete set_null
                                                         -- Who created this translation.
  version               integer not_null default 1       -- Incremented on each edit. Enables optimistic locking.
  created_at            timestamp default now
  updated_at            timestamp default now on_update

  indexes {
    composite_unique(resource_id, entity_id, locale_id, field_name)
                                                         -- One translation per resource × entity × locale × field.
    index(resource_id, entity_id)                        -- "All translations for this entity."
    index(locale_id)                                     -- "All content translations for this locale."
    index(status)                                        -- "All content translations in review."
  }
}
```

### 10. translation_memory_entries

Source-target segment pairs for translation reuse. TMX-compatible structure enabling import/export
with industry-standard Translation Memory eXchange format. `source_hash` enables O(1) exact match
lookup; fuzzy matching is handled at the application layer. Inspired by Crowdin's Translation Memory
and professional CAT tools (SDL Trados, memoQ).

```pseudo
table translation_memory_entries {
  id                    uuid primary_key default auto_generate
  source_locale_id      uuid not_null references locales(id) on_delete cascade
                                                         -- Source language of the segment.
                                                         -- Cascade: removing a locale removes its TM entries.
  target_locale_id      uuid not_null references locales(id) on_delete cascade
                                                         -- Target language of the segment.
  source_text           text not_null                    -- The source language text segment.
  target_text           text not_null                    -- The translated text segment.
  source_hash           string not_null                  -- Hash of normalized source text for fast exact-match lookup.
                                                         -- Application normalizes (lowercase, trim, collapse whitespace) before hashing.
  domain                string nullable                  -- Optional domain/context (e.g., "legal", "marketing", "technical").
                                                         -- Improves match relevance — a "bank" in finance differs from banking.
  quality_score         decimal nullable                 -- 0.00 to 1.00. Quality estimate for match confidence.
                                                         -- Human translations ≈ 1.0, machine translations lower.
  usage_count           integer not_null default 0       -- How many times this TM entry has been applied.
                                                         -- High counts indicate reliable, reusable translations.
  source                string not_null default 'human'  -- Origin: 'human', 'machine', 'import'.
                                                         -- Distinguishes hand-crafted translations from MT output and TMX imports.
  created_by            uuid nullable references users(id) on_delete set_null
                                                         -- Who created or imported this entry.
  created_at            timestamp default now
  updated_at            timestamp default now on_update

  indexes {
    index(source_locale_id, target_locale_id, source_hash)
                                                         -- Primary TM lookup: "find translations of this source text
                                                         --  from source locale to target locale."
    index(source_locale_id, target_locale_id)            -- "All TM entries for this language pair."
    index(domain)                                        -- Filter TM by domain for relevance.
  }
}
```

### 11. glossary_terms

Terminology entries with metadata for translation consistency. Each term is defined in a source
language with part of speech, domain context, and usage notes. The `is_forbidden` flag marks terms
that must NOT be used (common in regulated industries — legal, medical, pharmaceutical). Inspired
by Crowdin's glossary, SDL MultiTerm, and professional terminology management.

```pseudo
table glossary_terms {
  id                    uuid primary_key default auto_generate
  term                  string not_null                  -- The term in the source language (e.g., "dashboard", "checkout").
  description           string nullable                  -- Definition or explanation of the term.
  part_of_speech        string nullable                  -- Grammatical category: "noun", "verb", "adjective", "adverb", etc.
                                                         -- Helps translators choose the correct form.
  domain                string nullable                  -- Subject area (e.g., "legal", "medical", "marketing", "technical").
                                                         -- Same term may have different translations in different domains.
  source_locale_id      uuid not_null references locales(id) on_delete restrict
                                                         -- Language the term is defined in.
                                                         -- Restrict: don't delete a locale used as a glossary source.
  is_forbidden          boolean not_null default false   -- When true, this term must NOT be used in translations.
                                                         -- Used in regulated industries to enforce approved terminology.
  is_case_sensitive     boolean not_null default false   -- Whether matching should be case-sensitive.
  notes                 string nullable                  -- Usage notes for translators (e.g., "Use only in formal context").
  created_by            uuid nullable references users(id) on_delete set_null
                                                         -- Who created this term.
  created_at            timestamp default now
  updated_at            timestamp default now on_update

  indexes {
    index(source_locale_id, term)                        -- Glossary lookup: "find this term in source locale."
    index(source_locale_id)                              -- "All terms for this source locale."
    index(domain)                                        -- Filter terms by domain.
  }
}
```

### 12. glossary_term_translations

Per-locale translations of glossary terms. One translation per term per locale. Simpler workflow
than full translations — just draft/approved status. Locale-specific notes allow guidance like
"In formal context, use X instead."

```pseudo
table glossary_term_translations {
  id                    uuid primary_key default auto_generate
  term_id               uuid not_null references glossary_terms(id) on_delete cascade
                                                         -- Which glossary term this translation is for.
                                                         -- Cascade: deleting a term removes all its translations.
  locale_id             uuid not_null references locales(id) on_delete cascade
                                                         -- Which locale this translation is in.
                                                         -- Cascade: removing a locale removes its glossary translations.
  translation           string not_null                  -- The translated term.
  notes                 string nullable                  -- Locale-specific usage notes (e.g., "Use X in formal, Y in informal").
  status                enum(draft, approved) not_null default draft
                                                         -- Simplified workflow for terminology.
  created_at            timestamp default now
  updated_at            timestamp default now on_update

  indexes {
    composite_unique(term_id, locale_id)                 -- One translation per term per locale.
    index(locale_id)                                     -- "All glossary translations for this locale."
  }
}
```

### 13. translation_status_history

Audit trail for translation status changes. Records every workflow transition — who changed what,
when, and why. The `translation_type` discriminator identifies whether the translation is a UI string
(from `translation_values`) or content (from `content_translations`). Append-only table — status
history is never modified.

```pseudo
table translation_status_history {
  id                    uuid primary_key default auto_generate
  translation_type      string not_null                  -- Discriminator: 'key_value' or 'content'.
                                                         -- Identifies which table translation_id references.
  translation_id        uuid not_null                    -- FK to translation_values.id or content_translations.id.
                                                         -- Not a database FK — target depends on translation_type.
  from_status           string nullable                  -- Previous status. Null for the initial status assignment.
  to_status             string not_null                  -- New status after this transition.
  changed_by            uuid nullable references users(id) on_delete set_null
                                                         -- Who made this change. Null for system-initiated changes.
  comment               string nullable                  -- Explanation for the transition (e.g., "Rejected: incorrect terminology").
  created_at            timestamp default now

  indexes {
    index(translation_type, translation_id)              -- "Full status history for this translation."
    index(changed_by)                                    -- "All status changes by this user."
  }
}
```

### 14. translation_comments

Threaded discussion on specific translations or keys. Supports issue tracking with categorized
comment types and resolution status. `parent_id` enables thread replies. Inspired by Crowdin's
string comments with issue types.

```pseudo
table translation_comments {
  id                    uuid primary_key default auto_generate
  translation_type      string not_null                  -- Discriminator: 'key_value' or 'content'.
  translation_id        uuid not_null                    -- FK to translation_values.id or content_translations.id.
                                                         -- Not a database FK — target depends on translation_type.
  parent_id             uuid nullable references translation_comments(id) on_delete cascade
                                                         -- Parent comment for thread replies. Null = top-level comment.
                                                         -- Cascade: deleting a parent removes all replies.
  author_id             uuid not_null references users(id) on_delete cascade
                                                         -- Who wrote this comment.
                                                         -- Cascade: deleting a user removes their comments.
  body                  text not_null                    -- Comment content.
  issue_type            string nullable                  -- Categorization: 'general', 'context', 'source_issue', 'translation_issue'.
                                                         -- Null = general discussion (not an issue).
  is_resolved           boolean not_null default false   -- Whether this issue has been addressed.
  created_at            timestamp default now
  updated_at            timestamp default now on_update

  indexes {
    index(translation_type, translation_id)              -- "All comments on this translation."
    index(parent_id)                                     -- "All replies to this comment."
    index(author_id)                                     -- "All comments by this user."
  }
}
```

### 15. screenshots

Visual context images for translators. Screenshots show where strings appear in the UI, dramatically
improving translation quality. File storage is external — this table stores path/URL references and
dimensions. Inspired by Crowdin's screenshot feature and Lokalise's screenshot annotations.

```pseudo
table screenshots {
  id                uuid primary_key default auto_generate
  name              string not_null                      -- Display name (e.g., "Checkout page - desktop", "Login form - mobile").
  file_path         string not_null                      -- Storage path or URL to the screenshot image.
  file_size         integer nullable                     -- File size in bytes.
  mime_type         string nullable                      -- Image MIME type (e.g., "image/png", "image/jpeg").
  width             integer nullable                     -- Image width in pixels.
  height            integer nullable                     -- Image height in pixels.
  uploaded_by       uuid nullable references users(id) on_delete set_null
                                                         -- Who uploaded this screenshot.
  created_at        timestamp default now
  updated_at        timestamp default now on_update
}
```

### 16. screenshot_key_links

Many-to-many junction between screenshots and translation keys. Optional bounding box coordinates
identify exactly where a string appears in the screenshot. Translators see the visual context
alongside the string to translate.

```pseudo
table screenshot_key_links {
  id                    uuid primary_key default auto_generate
  screenshot_id         uuid not_null references screenshots(id) on_delete cascade
                                                         -- The screenshot.
                                                         -- Cascade: deleting a screenshot removes its key links.
  translation_key_id    uuid not_null references translation_keys(id) on_delete cascade
                                                         -- The translation key visible in this screenshot.
                                                         -- Cascade: deleting a key removes its screenshot links.
  x                     integer nullable                 -- Bounding box: X coordinate (pixels from left).
  y                     integer nullable                 -- Bounding box: Y coordinate (pixels from top).
  width                 integer nullable                 -- Bounding box: width in pixels.
  height                integer nullable                 -- Bounding box: height in pixels.
  created_at            timestamp default now

  indexes {
    composite_unique(screenshot_id, translation_key_id)  -- A key appears at most once per screenshot.
    index(translation_key_id)                            -- "All screenshots showing this key."
  }
}
```

### 17. import_export_jobs

Bulk import/export operations for translation files. Supports all major i18n file formats:
JSON, PO/POT, XLIFF, CSV, TMX, YAML, ARB, Java .properties. Tracks progress with counters and
records errors. Inspired by Crowdin's file import system and Weblate's file format support.

```pseudo
table import_export_jobs {
  id                uuid primary_key default auto_generate
  type              enum(import, export) not_null        -- Whether this is an import or export job.
  format            string not_null                      -- File format: 'json', 'po', 'xliff', 'csv', 'tmx',
                                                         -- 'yaml', 'arb', 'properties', 'xlf', 'strings'.
  status            enum(pending, processing, completed, failed) not_null default pending
                                                         -- Job lifecycle status.
  locale_id         uuid nullable references locales(id) on_delete set_null
                                                         -- Scope to a specific locale. Null = all locales.
  namespace_id      uuid nullable references namespaces(id) on_delete set_null
                                                         -- Scope to a specific namespace. Null = all namespaces.
  file_path         string nullable                      -- Input file (import) or output file (export) path/URL.
  total_count       integer not_null default 0           -- Total strings in the job.
  processed_count   integer not_null default 0           -- Strings processed so far. Enables progress tracking.
  error_message     text nullable                        -- Error details if status = 'failed'.
  options           json nullable                        -- Format-specific options (e.g., merge strategy, overwrite existing,
                                                         -- include untranslated, encoding).
  created_by        uuid nullable references users(id) on_delete set_null
                                                         -- Who initiated this job.
  started_at        timestamp nullable                   -- When processing began. Null if still pending.
  completed_at      timestamp nullable                   -- When processing finished. Null if not yet done.
  created_at        timestamp default now
  updated_at        timestamp default now on_update

  indexes {
    index(status)                                        -- "All pending jobs" — the job queue query.
    index(created_by)                                    -- "My import/export jobs."
    index(type, status)                                  -- "All running import jobs."
  }
}
```

### 18. machine_translation_configs

Configured machine translation providers. Stores engine configuration, supported locales, and
rate limits. The actual API key is stored in an external secret manager — `api_key_ref` holds
only the reference. Multiple engines can coexist; `is_default` identifies the primary one.
Inspired by Crowdin's Machine Translation Engines.

```pseudo
table machine_translation_configs {
  id                    uuid primary_key default auto_generate
  name                  string not_null                  -- Display name (e.g., "DeepL Pro", "Google Translate", "Azure AI").
  engine                string not_null                  -- Engine identifier: 'google', 'deepl', 'amazon', 'azure', 'openai', 'custom'.
  is_enabled            boolean not_null default true    -- Whether this engine is active.
  is_default            boolean not_null default false   -- Primary engine for auto-translation.
  api_key_ref           string nullable                  -- Reference to secret store (e.g., "vault:mt/deepl-api-key").
                                                         -- ⚠️ NEVER store the actual API key in the database.
  endpoint_url          string nullable                  -- Custom endpoint URL for self-hosted or proxy setups.
  supported_locales     json nullable                    -- Array of supported BCP 47 locale codes. Null = all locales.
  default_quality_score decimal nullable                 -- Default quality score (0.00-1.00) for TM entries
                                                         -- created via this engine (e.g., 0.70 for MT output).
  rate_limit            integer nullable                 -- Requests per minute. Null = unlimited.
  options               json nullable                    -- Engine-specific configuration (e.g., formality level,
                                                         -- glossary ID, model version).
  created_at            timestamp default now
  updated_at            timestamp default now on_update
}
```

## Relationships

### One-to-Many

- `locales` → `locale_fallbacks` (a locale has many fallback rules, via `locale_id`)
- `locales` → `locale_fallbacks` (a locale is a fallback target for many locales, via `fallback_locale_id`)
- `locales` → `locale_plural_rules` (a locale has many plural category rules)
- `locales` → `translation_values` (a locale has many translation values)
- `locales` → `content_translations` (a locale has many content translations)
- `locales` → `translation_memory_entries` (a locale is source for many TM entries, via `source_locale_id`)
- `locales` → `translation_memory_entries` (a locale is target for many TM entries, via `target_locale_id`)
- `locales` → `glossary_terms` (a locale is source for many glossary terms)
- `locales` → `glossary_term_translations` (a locale has many glossary translations)
- `namespaces` → `translation_keys` (a namespace contains many keys)
- `translation_keys` → `translation_values` (a key has many translations across locales and plural forms)
- `translation_keys` → `translation_key_tags` (a key has many tags)
- `translation_keys` → `screenshot_key_links` (a key appears in many screenshots)
- `translatable_resources` → `content_translations` (a resource type has many content translations)
- `glossary_terms` → `glossary_term_translations` (a term has many locale translations)
- `screenshots` → `screenshot_key_links` (a screenshot links to many keys)
- `translation_comments` → `translation_comments` (a comment has many replies, via `parent_id`)
- `users` → `translation_values` (a user translates many values, via `translator_id`)
- `users` → `translation_values` (a user reviews many values, via `reviewed_by`)
- `users` → `content_translations` (a user translates many content fields, via `translator_id`)
- `users` → `translation_status_history` (a user makes many status changes, via `changed_by`)
- `users` → `translation_comments` (a user writes many comments, via `author_id`)
- `users` → `translation_memory_entries` (a user creates many TM entries, via `created_by`)
- `users` → `glossary_terms` (a user creates many glossary terms, via `created_by`)
- `users` → `screenshots` (a user uploads many screenshots, via `uploaded_by`)
- `users` → `import_export_jobs` (a user initiates many jobs, via `created_by`)

### Many-to-Many (via junction tables)

- `screenshots` ↔ `translation_keys` (through `screenshot_key_links`)

## Best Practices

- **Use BCP 47 for locale codes** — The `locales.code` field stores IETF BCP 47 language tags (e.g., "en-US", "zh-Hans"). This is the universal standard used by browsers, CLDR, ICU, and every major i18n library. VARCHAR(35) covers all practical tags.
- **Separate UI strings from content translations** — UI strings (`translation_keys` / `translation_values`) are key-based lookups loaded in bulk per namespace. Content translations (`content_translations`) are entity-based lookups. Different access patterns warrant separate tables.
- **Store plural forms as separate rows** — Each CLDR plural category (zero, one, two, few, many, other) gets its own `translation_values` row. This enables per-form workflow tracking and matches the data model of professional TMS platforms (Crowdin, Weblate, Phrase).
- **Implement fallback chains in the database** — The `locale_fallbacks` table stores explicit priority-ordered chains (e.g., `en-AU` → `en-GB` → `en`). This is more flexible than hardcoded logic and supports regional variants cleanly.
- **Use digest-based staleness detection** — The `source_digest` field on `translation_values` and `content_translations` stores a hash of the source text. When the source changes, translations with a mismatched digest are flagged as outdated. Inspired by Shopify's `translatableContentDigest`.
- **Never store API keys in the database** — `machine_translation_configs.api_key_ref` stores a reference to an external secret manager, not the key itself. This is a security requirement, not a suggestion.
- **Namespace keys for lazy loading** — Group keys into namespaces matching your application's pages or features. Load only the namespace(s) needed for the current route. Cache by `{locale}:{namespace}:{version_hash}`.
- **Make Translation Memory a first-class entity** — TM enables reuse across projects and reduces translation costs. Store entries in a TMX-compatible format for import/export with industry tools.
- **Track translation workflow explicitly** — The status enum (draft → in_review → approved → published) combined with `translation_status_history` provides both current state and full audit trail. Don't rely on boolean flags for workflow.
- **Index for common access patterns** — `(locale_id, namespace_id)` for bulk loading, `(namespace_id, key)` for individual lookups, `(resource_id, entity_id, locale_id)` for entity translations, `(source_locale_id, target_locale_id, source_hash)` for TM matching.

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
