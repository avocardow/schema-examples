// menu_items: Hierarchical navigation links within a menu.
// See README.md for full design rationale.
import { pgTable, pgEnum, uuid, text, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";
import { menus } from "./menus";
import { posts } from "./posts";
import { categories } from "./categories";

export const menuLinkTypeEnum = pgEnum("menu_link_type", ["post", "category", "custom"]);

export const menuItems = pgTable("menu_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  menuId: uuid("menu_id").notNull().references(() => menus.id, { onDelete: "cascade" }),
  parentId: uuid("parent_id").references((): any => menuItems.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  linkType: menuLinkTypeEnum("link_type").notNull(),
  linkPostId: uuid("link_post_id").references(() => posts.id, { onDelete: "cascade" }),
  linkCategoryId: uuid("link_category_id").references(() => categories.id, { onDelete: "cascade" }),
  linkUrl: text("link_url"),
  openInNewTab: boolean("open_in_new_tab").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_menu_items_menu_id_parent_id_sort_order").on(table.menuId, table.parentId, table.sortOrder),
  index("idx_menu_items_link_post_id").on(table.linkPostId),
  index("idx_menu_items_link_category_id").on(table.linkCategoryId),
]);
