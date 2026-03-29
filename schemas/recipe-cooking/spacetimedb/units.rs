// units: Measurement units for ingredient quantities.
// See README.md for full design rationale.

#[derive(SpacetimeType, Clone)]
pub enum UnitSystem {
    Metric,    // type: String
    Imperial,
    Universal,
}

#[spacetimedb::table(name = units, public)]
pub struct Unit {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub name: String,

    pub abbreviation: Option<String>,
    pub system: Option<UnitSystem>,
}
