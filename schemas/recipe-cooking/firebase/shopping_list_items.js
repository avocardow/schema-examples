// shopping_list_items: Individual items on a shopping list with check-off support.
// See README.md for full design rationale.

/**
 * @typedef {Object} ShoppingListItemDocument
 * @property {string} id
 * @property {string} shoppingListId - FK → shopping_lists
 * @property {string|null} foodId - FK → foods
 * @property {string|null} recipeId - FK → recipes
 * @property {number|null} quantity
 * @property {string|null} unitId - FK → units
 * @property {string|null} customLabel
 * @property {boolean} checked
 * @property {number} position
 */

/**
 * @param {Omit<ShoppingListItemDocument, "id">} fields
 * @returns {Omit<ShoppingListItemDocument, "id">}
 */
export function createShoppingListItem(fields) {
  return {
    shoppingListId: fields.shoppingListId,
    foodId:         fields.foodId ?? null,
    recipeId:       fields.recipeId ?? null,
    quantity:       fields.quantity ?? null,
    unitId:         fields.unitId ?? null,
    customLabel:    fields.customLabel ?? null,
    checked:        fields.checked ?? false,
    position:       fields.position ?? 0,
  };
}

export const shoppingListItemConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      shoppingListId: data.shoppingListId,
      foodId:         data.foodId ?? null,
      recipeId:       data.recipeId ?? null,
      quantity:       data.quantity ?? null,
      unitId:         data.unitId ?? null,
      customLabel:    data.customLabel ?? null,
      checked:        data.checked,
      position:       data.position,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "shopping_list_items"
 *   - shoppingListId ASC, position ASC
 *   - shoppingListId ASC, checked ASC, position ASC
 */
