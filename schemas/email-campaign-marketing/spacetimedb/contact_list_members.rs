// contact_list_members: Junction table linking contacts to lists with subscription status.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum ContactListMemberStatus {
    // type: String
    Subscribed,
    Unsubscribed,
    Unconfirmed,
}

#[spacetimedb::table(name = contact_list_members, public)]
pub struct ContactListMember {
    #[primary_key]
    pub id: String, // UUID

    pub contact_id: String, // UUID, FK → contacts.id (cascade delete)

    #[index(btree)]
    pub list_id: String, // UUID, FK → contact_lists.id (cascade delete)

    pub status: String, // ContactListMemberStatus enum
    // Composite unique: (contact_id, list_id) — enforce in reducer logic
    // Composite index: (list_id, status) — enforce in reducer logic

    pub subscribed_at: Option<Timestamp>,
    pub unsubscribed_at: Option<Timestamp>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
