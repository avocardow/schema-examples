// templates: Reusable email templates with subject, body, and sender defaults.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = templates, public)]
pub struct Template {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,
    pub subject: Option<String>,
    pub html_body: Option<String>,
    pub text_body: Option<String>,
    pub from_name: Option<String>,
    pub from_email: Option<String>,

    #[index(btree)]
    pub created_by: Option<String>, // UUID, FK → users.id (set null)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
