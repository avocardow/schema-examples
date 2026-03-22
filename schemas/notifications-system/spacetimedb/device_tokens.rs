// device_tokens: Push notification device tokens and web push subscriptions.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum Platform {
    Ios,
    Android,
    Web,
    Macos,
    Windows,
}
// type: String

#[spacetimedb::table(name = device_tokens, public)]
pub struct DeviceToken {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub user_id: String, // FK → users.id (cascade delete)

    pub platform: Platform,

    pub token: String,    // Opaque push token from FCM, APNs, or web push endpoint URL.
    pub provider: String, // e.g. "fcm", "apns", "web_push", "onesignal", "expo"

    pub app_id: Option<String>, // e.g. Firebase project ID, APNs bundle ID. Null if only one app.

    // Web Push specific fields (RFC 8030 / VAPID). Null for native push tokens.
    pub p256dh_key: Option<String>,  // ECDH P-256 public key from the browser.
    pub auth_key: Option<String>,    // 16-byte authentication secret from the browser.
    pub endpoint_url: Option<String>, // Web push endpoint URL.

    // Device metadata.
    pub device_name: Option<String>,  // e.g. "iPhone 15 Pro", "Chrome on MacBook"
    pub device_model: Option<String>, // e.g. "iPhone15,3", "Pixel 8"
    pub os_version: Option<String>,   // e.g. "17.2", "14"
    pub app_version: Option<String>,  // e.g. "2.1.0"

    pub is_active: bool, // False when provider reports token invalid.

    pub last_used_at: Option<Timestamp>, // Last successful push delivery. For stale token cleanup.
    pub expires_at: Option<Timestamp>,   // Some tokens have explicit expiry. Null = no known expiry.

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
