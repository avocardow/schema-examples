# {Domain Name} — Research Notes

> This file is gitignored. It's a local working document for collecting research before writing pseudo code.

## Real-World Implementations Studied

<!-- Study at least 5-10 real implementations before writing pseudo code.
     Include a mix of: open-source projects, SaaS/cloud services, framework libraries, and enterprise systems.
     For each, document the full structure below — "What they got right" and "What could be improved"
     are critical for informing design decisions. -->

### Provider / Product 1
- URL:
- Key tables/entities:
- Notable patterns:
- What they got right:
- What could be improved:

### Provider / Product 2
- URL:
- Key tables/entities:
- Notable patterns:
- What they got right:
- What could be improved:

### Provider / Product 3
- URL:
- Key tables/entities:
- Notable patterns:
- What they got right:
- What could be improved:

<!-- Repeat for all providers studied (aim for 5-10+) -->

## Relevant Standards and Specifications

<!-- Document industry standards, RFCs, and specifications that inform the schema design.
     For each, note the database design implications. Skip this section if the domain has no relevant standards. -->

- Standard 1: Description and database relevance
- Standard 2: Description and database relevance

## Common Patterns Across Implementations

<!-- Identify recurring architectural patterns. For each, show a brief schema sketch,
     list pros/cons, and note which implementations use it. End with a consensus recommendation. -->

### Pattern 1: Name
- Used by: ...
- Schema sketch: ...
- Pros: ...
- Cons: ...

### Pattern 2: Name
- Used by: ...
- Schema sketch: ...
- Pros: ...
- Cons: ...

### Consensus Recommendation
Which pattern(s) the schema will adopt and why.

## Key Design Decisions

<!-- Document every significant design choice. "Options Considered" prevents tunnel vision. -->

| Decision | Options Considered | Chosen | Rationale |
| -------- | ------------------ | ------ | --------- |
| Example  | A, B, C            | B      | Because... |

## Tables Identified

<!-- List all tables grouped by category. Include brief proto-schema notes for complex tables
     (field names, types, key constraints) to bridge from research to pseudo code.
     IMPORTANT: This table list IS the final table list for the domain. Every table listed here
     will be implemented in pseudo code and all 7 formats. Do not reduce, collapse, or merge
     tables in Step 2 to hit a target number. Do not add tables not listed here.

     Before finalizing this list, apply two filters to every table:
     1. DEPENDENCY TEST: Would another domain own this table? (e.g., users → auth-rbac,
        projects → project-management, payments → billing). If yes, don't include it —
        reference it as an external FK dependency instead.
     2. USER VALUE TEST: Would a developer building an app that *uses* this domain actually
        need this table? Or does it only make sense if you're building the SaaS platform
        studied in research? (e.g., TMS task assignment, billing plan tiers, analytics
        dashboard configs are platform features, not domain data.) If platform-only, exclude it. -->

### Category 1
- `table_name` — brief description
- `table_name` — brief description

### Category 2
- `table_name` — brief description

## Open Questions

<!-- Track unresolved decisions. Mark as [x] when resolved with the chosen answer. -->

- [ ] Question 1?
- [ ] Question 2?

## References

- [Link 1](url) — Description
- [Link 2](url) — Description
