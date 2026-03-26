// events: Core event records with scheduling, status, and registration details.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum EventStatus {
    Draft, // type: String
    Published,
    Cancelled,
    Postponed,
    Completed,
}

#[derive(SpacetimeType, Clone)]
pub enum EventVisibility {
    Public, // type: String
    Private,
    Unlisted,
}

#[spacetimedb::table(name = events, public)]
pub struct Event {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub series_id: Option<String>, // UUID — FK → event_series.id (set null)

    #[index(btree)]
    pub category_id: Option<String>, // UUID — FK → event_categories.id (set null)

    #[index(btree)]
    pub venue_id: Option<String>, // UUID — FK → venues.id (set null)

    pub title: String,

    #[unique]
    pub slug: String,

    pub summary: Option<String>,
    pub description: Option<String>,
    pub cover_image_url: Option<String>,
    pub start_time: Timestamp,
    pub end_time: Timestamp,
    pub timezone: String,
    pub is_all_day: bool,
    pub max_attendees: Option<i32>,
    pub status: EventStatus,
    pub visibility: EventVisibility,
    pub registration_open_at: Option<Timestamp>,
    pub registration_close_at: Option<Timestamp>,
    pub is_free: bool,
    pub contact_email: Option<String>,
    pub website_url: Option<String>,

    #[index(btree)]
    pub created_by: String, // UUID — FK → users.id (restrict delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (status, start_time)
    // Composite index: (start_time, end_time)
}
