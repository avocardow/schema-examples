// positions: Job positions within departments, tracking title, level, and pay grade.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = positions, public)]
pub struct Position {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub department_id: Option<String>, // UUID — FK → departments.id (set null)

    pub title: String,
    pub code: Option<String>,
    pub description: Option<String>,
    pub level: Option<i32>,
    pub pay_grade: Option<String>,

    #[index(btree)]
    pub is_active: bool, // default: true

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
