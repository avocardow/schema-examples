// blocked_ips: IP-level access blocking.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// sign_up_block = prevent new account creation from this IP.
/// login_block = prevent login from this IP.
/// full_block = block all access from this IP.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum BlockedIpSeverity {
    SignUpBlock,
    LoginBlock,
    FullBlock,
}

#[spacetimedb::table(name = blocked_ips, public)]
pub struct BlockedIp {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub ip_address: String, // IP address or CIDR range (e.g., "192.168.1.100", "10.0.0.0/8").

    #[index(btree)]
    pub severity: BlockedIpSeverity,

    pub reason: Option<String>,

    #[index(btree)]
    pub expires_at: Option<Timestamp>, // Null = permanent.

    #[index(btree)]
    pub created_by: String, // FK → users.id (restrict delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
