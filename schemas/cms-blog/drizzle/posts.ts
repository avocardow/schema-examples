// posts: Core content entries supporting posts and pages with publishing workflow.
// See README.md for full design rationale.
import { pgTable, pgEnum, uuid, text, boolean, timestamp, index } from "drizzle-orm/pg-core";

export const postTypeEnum = pgEnum("post_type", ["post", "page"]);
export const postStatusEnum = pgEnum("post_status", ["draft", "scheduled", "published", "archived"]);
export const postVisibilityEnum = pgEnum("post_visibility", ["public", "private", "password_protected"]);

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: postTypeEnum("type").notNull().default("post"),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  featuredImageUrl: text("featured_image_url"),
  status: postStatusEnum("status").notNull().default("draft"),
  visibility: postVisibilityEnum("visibility").notNull().default("public"),
  password: text("password"),
  isFeatured: boolean("is_featured").notNull().default(false),
  allowComments: boolean("allow_comments").notNull().default(true),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  ogImageUrl: text("og_image_url"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdBy: uuid("created_by").notNull(), // FK → users.id (restrict delete)
  updatedBy: uuid("updated_by"), // FK → users.id (set null)
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_posts_status_published_at").on(table.status, table.publishedAt),
  index("idx_posts_type_status").on(table.type, table.status),
  index("idx_posts_created_by").on(table.createdBy),
  index("idx_posts_is_featured").on(table.isFeatured),
]);
