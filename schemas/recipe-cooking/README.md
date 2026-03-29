# Recipe / Cooking

> Recipes with structured ingredients, step-by-step instructions, nutrition, tagging, collections, ratings, meal planning, and shopping lists for home cooking and recipe management apps.

## Overview

A complete recipe and cooking management schema covering the full lifecycle from recipe creation through organization, meal planning, and grocery shopping. Designed after studying Tandoor Recipes, Mealie, Schema.org Recipe, Spoonacular, Whisk/Samsung Food, Cooklang, Yummly, Paprika, USDA FoodData Central, and Grocy.

The schema centers on **recipes** as first-class entities with rich metadata — preparation and cook times, servings, difficulty, source attribution, and dietary information. Ingredients are structured with normalized **foods** and **units** tables enabling nutrition lookup, smart shopping list aggregation, and serving scaling. Instructions support sectioned grouping for complex multi-part recipes.

Key design decisions:
- **Structured ingredients with normalized foods/units** — Each ingredient links to a `foods` entry and a `units` entry with a numeric quantity, enabling nutrition computation, shopping list aggregation, and serving-size scaling. An optional `section_label` groups ingredients by recipe section ("For the sauce", "For the dough") without the complexity of step-level ingredient assignment.
- **Static per-recipe nutrition** — `recipe_nutrition` stores author-provided nutritional values per serving. Automatic computation from ingredient data is a service concern, not a schema concern.
- **Tags for flexible classification** — A single `tags` table with a junction table replaces rigid category/cuisine/diet columns. Tags cover cuisine ("Italian"), course ("dessert"), diet ("vegan"), difficulty ("easy"), and any user-defined label.
- **Collections as curated groupings** — Like cookbooks or themed sets, collections provide organizational structure independent of tags. A recipe can appear in multiple collections.
- **Meal planning with date/slot structure** — `meal_plans` are containers (e.g., "Week of March 24") with `meal_plan_entries` for individual date + meal type + recipe assignments. Enables weekly planning workflows.
- **Persisted shopping lists** — Shopping lists have state (items get checked off, quantities edited, custom items added). Generated from meal plans or created manually.

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (18 tables)</summary>

- [`recipes`](#1-recipes)
- [`recipe_ingredients`](#2-recipe_ingredients)
- [`recipe_instructions`](#3-recipe_instructions)
- [`recipe_images`](#4-recipe_images)
- [`foods`](#5-foods)
- [`units`](#6-units)
- [`recipe_nutrition`](#7-recipe_nutrition)
- [`tags`](#8-tags)
- [`recipe_tags`](#9-recipe_tags)
- [`collections`](#10-collections)
- [`collection_recipes`](#11-collection_recipes)
- [`ratings`](#12-ratings)
- [`recipe_favorites`](#13-recipe_favorites)
- [`meal_plans`](#14-meal_plans)
- [`meal_plan_entries`](#15-meal_plan_entries)
- [`shopping_lists`](#16-shopping_lists)
- [`shopping_list_items`](#17-shopping_list_items)
- [`recipe_activities`](#18-recipe_activities)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users` | User identity for recipe ownership, ratings, meal plans, and all actor references |

## Tables

### Core Recipe
- `recipes` — Central recipe entity with metadata, times, servings, difficulty, and source attribution
- `recipe_ingredients` — Structured ingredients with food/unit/quantity and optional section grouping
- `recipe_instructions` — Ordered step-by-step cooking instructions with optional section grouping
- `recipe_images` — Multiple images per recipe with ordering and primary designation

### Reference Data
- `foods` — Normalized food items for deduplication and nutrition lookup
- `units` — Measurement units with abbreviations and metric/imperial classification

### Nutrition
- `recipe_nutrition` — Per-recipe nutritional values per serving

### Organization & Discovery
- `tags` — Flexible labels for categorization (cuisine, diet, course, difficulty, etc.)
- `recipe_tags` — Junction table linking tags to recipes
- `collections` — Curated recipe groupings (cookbooks, favorites, themed sets)
- `collection_recipes` — Junction table linking recipes to collections with ordering

### Engagement
- `ratings` — User ratings and optional text reviews
- `recipe_favorites` — Quick-access favorites per user

### Meal Planning
- `meal_plans` — Container for a meal plan over a date range
- `meal_plan_entries` — Individual date + meal slot + recipe assignments

### Shopping
- `shopping_lists` — User-created or meal-plan-generated shopping lists
- `shopping_list_items` — Individual items with quantity, unit, and checked state

### Operations
- `recipe_activities` — Append-only activity log for recipe lifecycle events

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. recipes

Central recipe entity containing all core metadata. Aligns with Schema.org Recipe properties where practical. Times stored as integer minutes for queryability. Servings as a string to support ranges ("4-6") and descriptive yields ("1 loaf").

```pseudo
table recipes {
  id                uuid primary_key default auto_generate
  title             string not_null              -- Recipe name (e.g., "Classic Margherita Pizza").
  slug              string unique not_null        -- URL-friendly identifier.
  description       string nullable              -- Brief summary or introduction.
  source_url        string nullable              -- Original URL if imported from the web.
  source_name       string nullable              -- Attribution (e.g., "Bon Appétit", "Grandma's cookbook").
  servings          string nullable              -- Yield description (e.g., "4 servings", "1 loaf", "12 cookies").
  prep_time_minutes integer nullable             -- Preparation time in minutes.
  cook_time_minutes integer nullable             -- Active cooking time in minutes.
  total_time_minutes integer nullable            -- Total time including resting, chilling, etc.
  difficulty        enum(easy, medium, hard) nullable
  status            enum(draft, published, archived) not_null default draft
  language          string nullable              -- ISO 639-1 code (e.g., "en", "fr"). Null = unspecified.
  created_by        uuid not_null references users(id) on_delete cascade
  created_at        timestamp default now
  updated_at        timestamp default now on_update

  indexes {
    -- unique(slug) covered by field constraint.
    index(created_by)
    index(status)
    index(difficulty)
  }
}
```

**Design notes:**
- `servings` is a string (not integer) because recipes express yield in many forms: "4 servings", "1 loaf", "24 cookies", "4-6 portions".
- Times are nullable because not every recipe has structured timing (e.g., no-cook recipes, slow-cook "until done" recipes).
- `cascade` on `created_by` — deleting a user removes their recipes. Apps may prefer `restrict` or soft delete.

### 2. recipe_ingredients

Structured ingredients for a recipe. Each row links to a normalized food and unit with a numeric quantity. `section_label` groups ingredients by recipe section ("For the sauce", "For the dough") without requiring step-level assignment. `position` controls display order.

```pseudo
table recipe_ingredients {
  id                uuid primary_key default auto_generate
  recipe_id         uuid not_null references recipes(id) on_delete cascade
  food_id           uuid not_null references foods(id) on_delete restrict
  unit_id           uuid nullable references units(id) on_delete set_null  -- Null for unitless items (e.g., "3 eggs").
  quantity          decimal nullable             -- Numeric amount. Null for "to taste" or unquantified items.
  note              string nullable              -- Preparation note (e.g., "finely chopped", "room temperature").
  section_label     string nullable              -- Groups ingredients by section (e.g., "For the frosting").
  position          integer not_null default 0   -- Display order within the recipe.
  optional          boolean not_null default false -- Whether the ingredient is optional.

  indexes {
    index(recipe_id, position)                   -- Ordered ingredient list.
    index(food_id)                               -- "Which recipes use this food?"
  }
}
```

**Design notes:**
- `restrict` on `food_id` prevents deleting a food that's in use. Merging foods should update references first.
- `quantity` is decimal to support fractional amounts (0.5, 1.25). Null means "to taste" or "a pinch".

### 3. recipe_instructions

Ordered step-by-step instructions. Each row is one instruction step. `section_label` groups steps by section for multi-part recipes (aligning with Mealie's instruction sections and Cooklang's recipe sections).

```pseudo
table recipe_instructions {
  id                uuid primary_key default auto_generate
  recipe_id         uuid not_null references recipes(id) on_delete cascade
  step_number       integer not_null             -- 1-based step order within the recipe.
  instruction       string not_null              -- The instruction text for this step.
  section_label     string nullable              -- Groups steps by section (e.g., "Make the dough").
  time_minutes      integer nullable             -- Estimated time for this step, if applicable.

  indexes {
    unique(recipe_id, step_number)               -- Step numbers unique per recipe.
    -- composite_unique(recipe_id, step_number) covers index(recipe_id) via leading column.
  }
}
```

### 4. recipe_images

Multiple images per recipe with ordering. One image can be designated as primary (cover image). Supports both uploaded images and external URLs.

```pseudo
table recipe_images {
  id                uuid primary_key default auto_generate
  recipe_id         uuid not_null references recipes(id) on_delete cascade
  image_url         string not_null              -- URL or storage key for the image.
  caption           string nullable              -- Alt text or description.
  is_primary        boolean not_null default false -- Whether this is the cover/hero image.
  position          integer not_null default 0   -- Display order.
  created_at        timestamp default now

  indexes {
    index(recipe_id, position)                   -- Ordered image gallery.
  }
}
```

### 5. foods

Normalized food items. Each unique food (flour, chicken breast, garlic) appears once. Used by `recipe_ingredients` for deduplication, nutrition lookup, and shopping list aggregation.

```pseudo
table foods {
  id                uuid primary_key default auto_generate
  name              string unique not_null        -- Canonical name (e.g., "all-purpose flour", "chicken breast").
  category          string nullable              -- Optional grouping (e.g., "dairy", "produce", "meat").
  created_at        timestamp default now

  indexes {
    -- unique(name) covered by field constraint.
    index(category)
  }
}
```

**Design notes:**
- `category` is a plain string (not an enum) to allow open-ended food categorization. Apps can standardize categories in the application layer.

### 6. units

Measurement units. Normalized to avoid "cup" vs "cups" vs "Cup" duplicates. Includes abbreviation and measurement system for conversion support.

```pseudo
table units {
  id                uuid primary_key default auto_generate
  name              string unique not_null        -- Full name (e.g., "cup", "tablespoon", "gram").
  abbreviation      string nullable              -- Short form (e.g., "c", "tbsp", "g").
  system            enum(metric, imperial, universal) nullable  -- Measurement system. Null = unclassified.

  indexes {
    -- unique(name) covered by field constraint.
  }
}
```

### 7. recipe_nutrition

Per-recipe nutritional values per serving. Stores author-provided or computed values. One row per recipe (1:1 relationship). All nutrient fields are nullable because recipes may only have partial nutrition data.

```pseudo
table recipe_nutrition {
  id                uuid primary_key default auto_generate
  recipe_id         uuid unique not_null references recipes(id) on_delete cascade
  calories          decimal nullable             -- kcal per serving.
  total_fat_grams   decimal nullable
  saturated_fat_grams decimal nullable
  carbohydrates_grams decimal nullable
  fiber_grams       decimal nullable
  sugar_grams       decimal nullable
  protein_grams     decimal nullable
  sodium_mg         decimal nullable
  cholesterol_mg    decimal nullable
  updated_at        timestamp default now on_update

  indexes {
    -- unique(recipe_id) covered by field constraint.
  }
}
```

**Design notes:**
- 1:1 with recipes via `unique(recipe_id)`. Separate table keeps the recipes table lean and allows nullable-heavy nutrition data without bloating every recipe query.
- No `created_at` — nutrition is always written with the recipe; `updated_at` tracks last nutrition edit.

### 8. tags

Flexible labels for categorizing recipes. Tags replace rigid enum columns for cuisine, course, diet, difficulty, etc. A tag can represent any dimension: "Italian", "dessert", "vegan", "quick", "holiday".

```pseudo
table tags {
  id                uuid primary_key default auto_generate
  name              string unique not_null        -- Tag display name (e.g., "Italian", "vegan", "appetizer").
  created_at        timestamp default now

  indexes {
    -- unique(name) covered by field constraint.
  }
}
```

### 9. recipe_tags

Junction table linking tags to recipes. Many-to-many.

```pseudo
table recipe_tags {
  id                uuid primary_key default auto_generate
  recipe_id         uuid not_null references recipes(id) on_delete cascade
  tag_id            uuid not_null references tags(id) on_delete cascade

  indexes {
    unique(recipe_id, tag_id)                    -- A tag applied once per recipe.
    -- composite_unique(recipe_id, tag_id) covers index(recipe_id) via leading column.
    index(tag_id)                                -- "All recipes with this tag."
  }
}
```

### 10. collections

Curated recipe groupings — cookbooks, themed sets, weekly favorites, etc. Collections are owned by a user and can be shared. Independent of the tag system.

```pseudo
table collections {
  id                uuid primary_key default auto_generate
  name              string not_null              -- Collection name (e.g., "Family Favorites", "Italian Classics").
  description       string nullable
  cover_image_url   string nullable              -- Cover image for the collection.
  is_public         boolean not_null default false -- Whether visible to all users.
  recipe_count      integer not_null default 0   -- Cached count. Updated on add/remove.
  created_by        uuid not_null references users(id) on_delete cascade
  created_at        timestamp default now
  updated_at        timestamp default now on_update

  indexes {
    index(created_by)
  }
}
```

### 11. collection_recipes

Junction table linking recipes to collections with explicit ordering.

```pseudo
table collection_recipes {
  id                uuid primary_key default auto_generate
  collection_id     uuid not_null references collections(id) on_delete cascade
  recipe_id         uuid not_null references recipes(id) on_delete cascade
  position          integer not_null default 0   -- Sort order within the collection.
  added_at          timestamp default now

  indexes {
    unique(collection_id, recipe_id)             -- Recipe appears once per collection.
    -- composite_unique(collection_id, recipe_id) covers index(collection_id) via leading column.
    index(recipe_id)                             -- "Which collections contain this recipe?"
  }
}
```

### 12. ratings

User ratings and optional text reviews. One rating per user per recipe. Supports both star ratings and written reviews.

```pseudo
table ratings {
  id                uuid primary_key default auto_generate
  recipe_id         uuid not_null references recipes(id) on_delete cascade
  user_id           uuid not_null references users(id) on_delete cascade
  score             integer not_null             -- Rating value (e.g., 1-5 stars). App validates range.
  review            string nullable              -- Optional text review.
  created_at        timestamp default now
  updated_at        timestamp default now on_update

  indexes {
    unique(recipe_id, user_id)                   -- One rating per user per recipe.
    -- composite_unique(recipe_id, user_id) covers index(recipe_id) via leading column.
    index(user_id)                               -- "All ratings by this user."
  }
}
```

### 13. recipe_favorites

Quick-access favorites per user. Lightweight alternative to a "Favorites" collection — optimized for the common "is this recipe favorited?" check. No rating or review, just a bookmark.

```pseudo
table recipe_favorites {
  id                uuid primary_key default auto_generate
  recipe_id         uuid not_null references recipes(id) on_delete cascade
  user_id           uuid not_null references users(id) on_delete cascade
  created_at        timestamp default now

  indexes {
    unique(recipe_id, user_id)                   -- One favorite per user per recipe.
    -- composite_unique(recipe_id, user_id) covers index(recipe_id) via leading column.
    index(user_id)                               -- "All favorites for this user."
  }
}
```

### 14. meal_plans

Container for a meal plan covering a date range. A user can have multiple meal plans (e.g., "This Week", "Holiday Menu", "Meal Prep Sunday").

```pseudo
table meal_plans {
  id                uuid primary_key default auto_generate
  name              string not_null              -- Plan name (e.g., "Week of March 24", "Holiday Menu").
  start_date        string not_null              -- Start date (YYYY-MM-DD). String because it's a calendar date, not a UTC moment.
  end_date          string not_null              -- End date (YYYY-MM-DD).
  created_by        uuid not_null references users(id) on_delete cascade
  created_at        timestamp default now
  updated_at        timestamp default now on_update

  indexes {
    index(created_by)
  }
}
```

### 15. meal_plan_entries

Individual entries in a meal plan. Each entry assigns a recipe to a specific date and meal type (breakfast, lunch, dinner, snack).

```pseudo
table meal_plan_entries {
  id                uuid primary_key default auto_generate
  meal_plan_id      uuid not_null references meal_plans(id) on_delete cascade
  recipe_id         uuid not_null references recipes(id) on_delete cascade
  plan_date         string not_null              -- Date for this entry (YYYY-MM-DD).
  meal_type         enum(breakfast, lunch, dinner, snack) not_null
  servings          integer nullable             -- Planned servings override. Null = use recipe default.
  note              string nullable              -- Additional notes (e.g., "double batch", "for guests").

  indexes {
    index(meal_plan_id, plan_date)               -- Entries for a specific day.
    index(recipe_id)                             -- "Which meal plans use this recipe?"
  }
}
```

**Design notes:**
- `plan_date` and meal plan dates are strings (YYYY-MM-DD) because they represent calendar dates, not UTC moments.
- No unique constraint on (meal_plan_id, plan_date, meal_type) — a user might plan two recipes for the same meal slot.

### 16. shopping_lists

User-created or meal-plan-generated shopping lists. A list can be linked to a meal plan (auto-generated) or standalone (manual).

```pseudo
table shopping_lists {
  id                uuid primary_key default auto_generate
  name              string not_null              -- List name (e.g., "Grocery Run March 25", "Thanksgiving Shopping").
  meal_plan_id      uuid nullable references meal_plans(id) on_delete set_null  -- If generated from a meal plan.
  created_by        uuid not_null references users(id) on_delete cascade
  created_at        timestamp default now
  updated_at        timestamp default now on_update

  indexes {
    index(created_by)
    index(meal_plan_id)
  }
}
```

### 17. shopping_list_items

Individual items on a shopping list. Items can come from recipes (with food/unit references) or be manually added (custom text). The `checked` flag tracks completion.

```pseudo
table shopping_list_items {
  id                uuid primary_key default auto_generate
  shopping_list_id  uuid not_null references shopping_lists(id) on_delete cascade
  food_id           uuid nullable references foods(id) on_delete set_null  -- Null for manually added custom items.
  recipe_id         uuid nullable references recipes(id) on_delete set_null  -- Source recipe, if from a recipe.
  quantity          decimal nullable             -- Amount needed.
  unit_id           uuid nullable references units(id) on_delete set_null
  custom_label      string nullable              -- Display text for manually added items or override label.
  checked           boolean not_null default false -- Whether the item has been purchased/checked off.
  position          integer not_null default 0   -- Display order.

  indexes {
    index(shopping_list_id, checked)             -- Unchecked items first.
    index(food_id)                               -- Aggregate same food across lists.
  }
}
```

**Design notes:**
- Items from recipes have `food_id` + `unit_id` + `quantity` populated. Manually added items use `custom_label`.
- `recipe_id` tracks provenance so users can see "this item comes from Recipe X".

### 18. recipe_activities

Append-only activity log for recipe lifecycle events. Used for audit trails and activity feeds.

```pseudo
table recipe_activities {
  id                uuid primary_key default auto_generate
  recipe_id         uuid nullable references recipes(id) on_delete set_null  -- Null if recipe was deleted.
  actor_id          uuid not_null references users(id) on_delete restrict
  action            enum(created, updated, published, archived, rated, favorited, added_to_collection, added_to_meal_plan) not_null
  details           json nullable                -- Action-specific context (e.g., {"collection_id": "abc", "rating": 5}).
  occurred_at       timestamp default now

  indexes {
    index(recipe_id)
    index(actor_id)
    index(action)
    index(occurred_at)                           -- Time-range queries.
  }
}
```

**Design notes:**
- No `updated_at` — activities are immutable (append-only).
- `recipe_id` is nullable with `set_null` so the activity log is preserved even if the recipe is deleted.

## Relationships

### One-to-Many
```
recipes           1 ──── * recipe_ingredients    (recipe has ingredients)
recipes           1 ──── * recipe_instructions   (recipe has steps)
recipes           1 ──── * recipe_images         (recipe has images)
recipes           1 ──── 1 recipe_nutrition      (recipe has nutrition — 1:1)
recipes           1 ──── * recipe_tags           (recipe has tags)
recipes           1 ──── * collection_recipes    (recipe appears in collections)
recipes           1 ──── * ratings               (recipe has ratings)
recipes           1 ──── * recipe_favorites      (recipe has favorites)
recipes           1 ──── * meal_plan_entries      (recipe appears in meal plans)
recipes           1 ──── * shopping_list_items    (recipe sources shopping items)
recipes           1 ──── * recipe_activities      (recipe has activity records)
foods             1 ──── * recipe_ingredients    (food used in ingredients)
foods             1 ──── * shopping_list_items   (food referenced in shopping items)
units             1 ──── * recipe_ingredients    (unit used in ingredients)
units             1 ──── * shopping_list_items   (unit referenced in shopping items)
tags              1 ──── * recipe_tags           (tag applied to recipes)
collections       1 ──── * collection_recipes    (collection contains recipes)
meal_plans        1 ──── * meal_plan_entries      (plan has entries)
meal_plans        1 ──── * shopping_lists         (plan generates shopping lists)
shopping_lists    1 ──── * shopping_list_items    (list has items)
users             1 ──── * recipes               (user creates recipes)
users             1 ──── * collections           (user creates collections)
users             1 ──── * ratings               (user rates recipes)
users             1 ──── * recipe_favorites      (user favorites recipes)
users             1 ──── * meal_plans            (user creates meal plans)
users             1 ──── * shopping_lists        (user creates shopping lists)
users             1 ──── * recipe_activities     (user performs actions)
```

### Many-to-Many (via junction tables)
```
recipes   ←──→ tags          (via recipe_tags)
recipes   ←──→ collections   (via collection_recipes)
```

## Best Practices

- **Ingredient normalization**: Use the `foods` table for deduplication. When a user types "flour", match to the existing food entry. This enables smart shopping list aggregation (combining "2 cups flour" from recipe A with "1 cup flour" from recipe B).
- **Nutrition per serving**: Store nutrition values per serving in `recipe_nutrition`. Display total nutrition by multiplying by serving count.
- **Tag flexibility**: Use tags for all categorization dimensions — cuisine, course, diet, difficulty, season. Avoid rigid enum columns that can't evolve with user needs.
- **Meal plan → shopping list**: Generate shopping list items by aggregating ingredients across all recipes in the meal plan. Group by food, sum quantities where units match, and flag unit mismatches for user resolution.
- **Activity log**: Insert activities asynchronously (queue) to avoid impacting write performance.
- **Image management**: Set `is_primary = false` on all other images when a new primary is designated. Apps should enforce exactly one primary image per recipe.

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
