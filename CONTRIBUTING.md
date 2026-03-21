# Contributing to Schema Examples

Thank you for your interest in contributing! This project aims to be the most comprehensive collection of database schema examples available.

## Ways to Contribute

### 1. Implement a Schema

Pick any domain with a 🔲 status and implement it in one or more formats:

- **Convex** (`convex/schema.ts`) — Use `defineSchema`, `defineTable`, validators, and indexes
- **SQL** (`sql/schema.sql`) — PostgreSQL dialect, include comments for Supabase/SQLite differences
- **Prisma** (`prisma/schema.prisma`) — Full Prisma schema with relations and indexes
- **MongoDB** (`mongodb/schema.js`) — Mongoose schemas with validation
- **Drizzle** (`drizzle/schema.ts`) — Drizzle ORM table definitions with relations
- **SpacetimeDB** (`spacetimedb/lib.rs`) — Rust module with `#[spacetimedb::table]` macros
- **Firebase** (`firebase/schema.js`) — Firestore collection structure with security rules

### 2. Add a New Domain

If you have expertise in a domain we haven't covered:

1. Create a new folder under `schemas/`
2. Write a comprehensive `README.md` with:
   - Domain overview and common use cases
   - Complete table listing with descriptions
   - Entity relationships
   - Best practices and design considerations
3. Implement the schema in at least one format
4. Submit a PR

### 3. Improve Existing Schemas

- Add missing indexes for common query patterns
- Improve data types or constraints
- Add inline documentation
- Fix inconsistencies between formats

## Guidelines

### Schema Quality

- **Be production-ready** — Schemas should be usable in real applications, not just toy examples
- **Include indexes** — Add indexes for common query patterns, not just primary keys
- **Document decisions** — Use comments to explain non-obvious design choices
- **Follow conventions** — Use snake_case for SQL/Prisma, camelCase for JS/TS formats
- **Be consistent** — All formats for a domain should represent the same conceptual model

### README Quality

Each domain README should include:
- A clear overview of what the domain covers
- A complete list of tables with brief descriptions
- Entity relationship descriptions (which tables reference which)
- Best practices specific to that domain
- Common variations or extensions

### Commit Messages

- Use clear, descriptive commit messages
- Reference the domain and format: e.g., "Add SQL schema for e-commerce domain"

### Pull Requests

- One domain or one format per PR (keep them focused)
- Include a brief description of what you added or changed
- Ensure your schema compiles/validates where applicable

## Code of Conduct

Be kind, be helpful, be constructive. We're all here to learn and share knowledge.

## Questions?

Open an issue if you have questions about contributing or want to discuss a schema design decision.
