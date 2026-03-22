// notification_templates: Reusable content definitions for a notification category.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = notification_templates, public)]
pub struct NotificationTemplate {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub category_id: String, // FK → notification_categories.id (cascade delete)

    pub name: String, // Internal name (e.g., "Comment Created — Default").

    #[unique]
    pub slug: String, // Identifier used in code (e.g., "comment_created_default").

    // Default content (channel-agnostic). Used when no channel-specific template_content exists.
    pub title_template: Option<String>,      // e.g., "New comment on {{issue_title}}"
    pub body_template: Option<String>,       // e.g., "{{actor_name}} commented: {{comment_body}}"
    pub action_url_template: Option<String>, // e.g., "{{app_url}}/issues/{{issue_id}}#comment-{{comment_id}}"

    pub is_active: bool, // Toggle a template without deleting it. Inactive templates are skipped during delivery.

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
