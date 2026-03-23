// menu_items: Individual links within a navigation menu.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const MENU_LINK_TYPE = /** @type {const} */ ({
  POST: "post",
  CATEGORY: "category",
  CUSTOM: "custom",
});

/**
 * @typedef {Object} MenuItemDocument
 * @property {string} id
 * @property {string} menuId - FK → menus
 * @property {string|null} parentId - FK → menu_items (self-referential)
 * @property {string} label
 * @property {string} linkType
 * @property {string|null} linkPostId - FK → posts
 * @property {string|null} linkCategoryId - FK → categories
 * @property {string|null} linkUrl
 * @property {boolean} openInNewTab
 * @property {number} sortOrder
 * @property {boolean} isActive
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createMenuItem(fields) {
  return {
    menuId: fields.menuId,
    parentId: fields.parentId ?? null,
    label: fields.label,
    linkType: fields.linkType,
    linkPostId: fields.linkPostId ?? null,
    linkCategoryId: fields.linkCategoryId ?? null,
    linkUrl: fields.linkUrl ?? null,
    openInNewTab: fields.openInNewTab ?? false,
    sortOrder: fields.sortOrder ?? 0,
    isActive: fields.isActive ?? true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const menuItemConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      menuId: data.menuId,
      parentId: data.parentId ?? null,
      label: data.label,
      linkType: data.linkType,
      linkPostId: data.linkPostId ?? null,
      linkCategoryId: data.linkCategoryId ?? null,
      linkUrl: data.linkUrl ?? null,
      openInNewTab: data.openInNewTab,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - menu_items: menuId ASC, parentId ASC, sortOrder ASC
  - menu_items: menuId ASC, isActive ASC, sortOrder ASC
*/
