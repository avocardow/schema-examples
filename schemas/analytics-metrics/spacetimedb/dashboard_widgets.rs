// dashboard_widgets: Individual widgets placed on dashboards with chart type and position.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum ChartType {
    Line,   // type: String
    Bar,
    Area,
    Pie,
    Number,
    Table,
    Funnel,
    Map,
}

#[spacetimedb::table(name = dashboard_widgets, public)]
pub struct DashboardWidget {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub dashboard_id: String, // UUID, FK → dashboards.id (cascade delete)

    #[index(btree)]
    pub metric_id: Option<String>, // UUID, FK → metric_definitions.id (set null)

    pub title: Option<String>,
    pub chart_type: ChartType,
    pub config: Option<String>, // JSON
    pub position_x: i32,
    pub position_y: i32,
    pub width: i32,
    pub height: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
