// charts: Music charts and rankings such as top tracks, viral, and trending lists.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum ChartType {
    Top, // type: String
    Viral,
    NewReleases,
    Trending,
}

#[spacetimedb::table(name = charts, public)]
pub struct Chart {
    #[primary_key]
    pub id: String, // UUID
    pub name: String,
    #[unique]
    pub slug: String,
    pub description: Option<String>,
    #[index(btree)]
    pub chart_type: ChartType,
    pub region: Option<String>,
    #[index(btree)]
    pub is_active: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
// Composite index: (chart_type, region) — not supported; btree on chart_type covers leading column.
