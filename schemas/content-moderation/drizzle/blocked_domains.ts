// blocked_domains: Domain-level content blocking.
// See README.md for full design rationale.

import { pgEnum, pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const blockedDomainBlockTypeEnum = pgEnum("blocked_domain_block_type", [
  "full",
  "media_only",
  "report_reject",
]);

export const blockedDomains = pgTable(
  "blocked_domains",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    domain: text("domain").unique().notNull(), // The blocked domain (e.g., "spam-site.com").

    // full = all content from this domain is blocked.
    // media_only = text content allowed, media rejected.
    // report_reject = reports from this domain's users are ignored.
    blockType: blockedDomainBlockTypeEnum("block_type").notNull().default("full"),

    reason: text("reason"), // Why this domain was blocked.
    publicComment: text("public_comment"), // Comment visible to users about why the domain is blocked.
    privateComment: text("private_comment"), // Internal moderator note. Not visible to users.
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_blocked_domains_block_type").on(table.blockType),
    index("idx_blocked_domains_created_by").on(table.createdBy),
  ]
);
