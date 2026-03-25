// kb_articles: knowledge base articles with publishing workflow, authorship, and helpfulness tracking.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { kbCategories } from "./kb_categories";
import { users } from "./users";

export const kbArticleStatusEnum = pgEnum("kb_article_status", [
  "draft",
  "published",
  "archived",
]);

export const kbArticles = pgTable(
  "kb_articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id").references(() => kbCategories.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    body: text("body").notNull(),
    status: kbArticleStatusEnum("status").notNull().default("draft"),
    authorId: uuid("author_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    viewCount: integer("view_count").notNull().default(0),
    helpfulCount: integer("helpful_count").notNull().default(0),
    notHelpfulCount: integer("not_helpful_count").notNull().default(0),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_kb_articles_category_id").on(table.categoryId),
    index("idx_kb_articles_status").on(table.status),
    index("idx_kb_articles_author_id").on(table.authorId),
  ]
);
