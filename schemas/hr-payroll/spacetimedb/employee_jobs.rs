// employee_jobs: Tracks job assignments linking employees to positions, departments, and managers.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Uses EmploymentType from employees.rs — do not redefine here.

#[spacetimedb::table(name = employee_jobs, public)]
pub struct EmployeeJob {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub employee_id: String, // FK → employees.id (cascade delete)

    #[index(btree)]
    pub position_id: Option<String>, // FK → positions.id (set null on delete)

    #[index(btree)]
    pub department_id: String, // FK → departments.id (restrict delete)

    #[index(btree)]
    pub manager_id: Option<String>, // FK → employees.id (set null on delete)

    pub title: String,

    pub employment_type: String, // EmploymentType enum (full_time, part_time, contractor, intern, temporary)

    #[index(btree)]
    pub effective_date: String, // date string

    pub end_date: Option<String>,

    pub reason: Option<String>,

    pub is_primary: bool, // default: true

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
