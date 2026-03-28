// chart_entries: Individual track positions within charts on specific dates.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = chart_entries, public)]
pub struct ChartEntry {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub chart_id: String, // UUID — FK → charts.id (cascade delete)
    #[index(btree)]
    pub track_id: String, // UUID — FK → tracks.id (cascade delete)
    pub position: i32,
    pub previous_position: Option<i32>,
    pub peak_position: i32,
    pub weeks_on_chart: i32,
    pub chart_date: String,
    pub created_at: Timestamp,
}
// Composite index: (chart_id, chart_date, position) — not supported; btree on chart_id covers leading column.
// Composite index: (track_id, chart_date) — not supported; btree on track_id covers leading column.
