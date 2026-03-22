// device_tokens: Push notification device tokens and web push subscriptions.
// See README.md for full design rationale and field documentation.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "device_tokens"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - Tokens are opaque strings from FCM, APNs, or the web push endpoint.
 *   - Web push fields (p256dhKey, authKey) are cryptographic material — treat as sensitive.
 *   - Cascade-delete device tokens when the owning user is deleted.
 *   - Set isActive to false when the provider reports "token not registered".
 */

/**
 * @typedef {"ios"|"android"|"web"|"macos"|"windows"} DevicePlatform
 */

export const DEVICE_PLATFORMS = /** @type {const} */ ({
  IOS:     "ios",
  ANDROID: "android",
  WEB:     "web",
  MACOS:   "macos",
  WINDOWS: "windows",
});

/**
 * @typedef {Object} DeviceTokenDocument
 * @property {string}              userId         - Reference to the owning user. Cascade-delete tokens when the user is deleted.
 * @property {DevicePlatform}      platform       - Which type of device/browser this token is for.
 * @property {string}              token          - Opaque push token from FCM, APNs, or web push endpoint URL.
 * @property {string}              provider       - Push service provider, e.g. "fcm", "apns", "web_push", "onesignal", "expo".
 * @property {string|null}         appId          - App identifier for multi-app setups. Null if only one app.
 * @property {string|null}         p256dhKey      - ECDH P-256 public key from the browser (web push). Null for native push.
 * @property {string|null}         authKey        - 16-byte authentication secret from the browser (web push). Null for native push.
 * @property {string|null}         endpointUrl    - Web push endpoint URL. Null for native push.
 * @property {string|null}         deviceName     - User-friendly device label, e.g. "iPhone 15 Pro", "Chrome on MacBook".
 * @property {string|null}         deviceModel    - Machine-readable model ID, e.g. "iPhone15,3", "Pixel 8".
 * @property {string|null}         osVersion      - Operating system version, e.g. "17.2", "14".
 * @property {string|null}         appVersion     - Your app's version on this device, e.g. "2.1.0".
 * @property {boolean}             isActive       - False when the provider reports the token as invalid.
 * @property {Timestamp|null}      lastUsedAt     - When a push was last successfully sent to this token. For stale token cleanup.
 * @property {Timestamp|null}      expiresAt      - Some tokens have explicit expiry. Null = no known expiry.
 * @property {Timestamp}           createdAt
 * @property {Timestamp}           updatedAt
 */

/**
 * @param {Omit<DeviceTokenDocument, "createdAt" | "updatedAt"> & Partial<Pick<DeviceTokenDocument, "isActive" | "lastUsedAt">>} fields
 * @returns {Omit<DeviceTokenDocument, "id">}
 */
export function createDeviceToken(fields) {
  return {
    userId:      fields.userId,
    platform:    fields.platform,
    token:       fields.token,
    provider:    fields.provider,
    appId:       fields.appId       ?? null,
    p256dhKey:   fields.p256dhKey   ?? null,
    authKey:     fields.authKey     ?? null,
    endpointUrl: fields.endpointUrl ?? null,
    deviceName:  fields.deviceName  ?? null,
    deviceModel: fields.deviceModel ?? null,
    osVersion:   fields.osVersion   ?? null,
    appVersion:  fields.appVersion  ?? null,
    isActive:    fields.isActive    ?? true,
    lastUsedAt:  fields.lastUsedAt ?? null,
    expiresAt:   fields.expiresAt   ?? null,
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("device_tokens").withConverter(deviceTokenConverter)
 */
export const deviceTokenConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      userId:      data.userId,
      platform:    data.platform,
      token:       data.token,
      provider:    data.provider,
      appId:       data.appId       ?? null,
      p256dhKey:   data.p256dhKey   ?? null,
      authKey:     data.authKey     ?? null,
      endpointUrl: data.endpointUrl ?? null,
      deviceName:  data.deviceName  ?? null,
      deviceModel: data.deviceModel ?? null,
      osVersion:   data.osVersion   ?? null,
      appVersion:  data.appVersion  ?? null,
      isActive:    data.isActive    ?? true,
      lastUsedAt:  data.lastUsedAt  ?? null,  // Timestamp | null
      expiresAt:   data.expiresAt   ?? null,  // Timestamp | null
      createdAt:   data.createdAt,            // Timestamp
      updatedAt:   data.updatedAt,            // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - device_tokens.userId                        ASC  — "All devices for this user" (fan-out push delivery).
 *
 * Composite:
 *   - device_tokens.userId + platform + isActive  ASC  — "Active iOS devices for this user."
 *   - device_tokens.token + provider              ASC  — "Look up a device by token" (token refresh/invalidation).
 *   - device_tokens.isActive + lastUsedAt         ASC  — "Stale active tokens" (cleanup: tokens not used in 30+ days).
 */
