// menu_items: Hierarchical navigation links within a menu.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const menuItems = defineTable({
  menuId: v.id("menus"),
  parentId: v.optional(v.id("menu_items")),
  label: v.string(),
  linkType: v.union(
    v.literal("post"),
    v.literal("category"),
    v.literal("custom")
  ),
  linkPostId: v.optional(v.id("posts")),
  linkCategoryId: v.optional(v.id("categories")),
  linkUrl: v.optional(v.string()),
  openInNewTab: v.boolean(),
  sortOrder: v.number(),
  isActive: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_menu_id_parent_id_sort_order", [
    "menuId",
    "parentId",
    "sortOrder",
  ])
  .index("by_link_post_id", ["linkPostId"])
  .index("by_link_category_id", ["linkCategoryId"]);
