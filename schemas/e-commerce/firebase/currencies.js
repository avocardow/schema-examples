// currencies: Supported currency definitions with exchange rates and display formatting.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} CurrencyDocument
 * @property {string} id
 * @property {string} code
 * @property {string} name
 * @property {string} symbol
 * @property {number} decimalPlaces
 * @property {number} exchangeRate
 * @property {boolean} isBase
 * @property {boolean} isActive
 * @property {Timestamp} updatedAt
 * @property {Timestamp} createdAt
 */

export function createCurrency(fields) {
  return {
    code: fields.code,
    name: fields.name,
    symbol: fields.symbol,
    decimalPlaces: fields.decimalPlaces ?? 2,
    exchangeRate: fields.exchangeRate ?? 1.0,
    isBase: fields.isBase ?? false,
    isActive: fields.isActive ?? true,
    updatedAt: Timestamp.now(),
    createdAt: Timestamp.now(),
  };
}

export const currencyConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      code: data.code,
      name: data.name,
      symbol: data.symbol,
      decimalPlaces: data.decimalPlaces,
      exchangeRate: data.exchangeRate,
      isBase: data.isBase,
      isActive: data.isActive,
      updatedAt: data.updatedAt,
      createdAt: data.createdAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - currencies: isActive ASC
*/
