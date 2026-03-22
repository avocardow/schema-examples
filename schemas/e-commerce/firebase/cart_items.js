// cart_items: Individual line items within a shopping cart, linking a cart to a product variant with quantity.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} CartItemDocument
 * @property {string} id
 * @property {string} cartId - FK → carts
 * @property {string} variantId - FK → product_variants
 * @property {number} quantity
 * @property {Timestamp} addedAt
 * @property {Timestamp} updatedAt
 */

export function createCartItem(fields) {
  return {
    cartId: fields.cartId,
    variantId: fields.variantId,
    quantity: fields.quantity ?? 1,
    addedAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const cartItemConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      cartId: data.cartId,
      variantId: data.variantId,
      quantity: data.quantity,
      addedAt: data.addedAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - cart_items: cartId ASC, variantId ASC (composite unique)
  - cart_items: variantId ASC
*/
