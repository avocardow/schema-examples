// control_tests: Records of control testing with results and scheduling.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum TestResult {
    Pass,          // type: String
    Fail,
    Partial,
    NotApplicable,
}

#[spacetimedb::table(name = control_tests, public)]
pub struct ControlTest {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub control_id: String, // UUID — FK → controls.id (cascade delete)

    #[index(btree)]
    pub tested_by: Option<String>, // UUID — FK → users.id (set null)

    #[index(btree)]
    pub test_date: Timestamp,

    #[index(btree)]
    pub result: TestResult,

    pub notes: Option<String>,

    pub next_test_date: Option<Timestamp>,

    pub created_at: Timestamp,
}
