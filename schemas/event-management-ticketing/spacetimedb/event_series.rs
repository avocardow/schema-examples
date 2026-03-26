// event_series: Recurring event groupings with optional recurrence rules.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = event_series, public)]
pub struct EventSeries {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,

    #[unique]
    pub slug: String,

    pub description: Option<String>,
    pub recurrence_rule: Option<String>,

    #[index(btree)]
    pub created_by: String, // UUID — FK → users.id (restrict delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
