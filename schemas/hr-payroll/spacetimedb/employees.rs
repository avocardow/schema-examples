// employees: Core employee record linking identity, employment terms, and status.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

// type: String
#[derive(SpacetimeType, Clone)]
pub enum EmploymentType {
    FullTime,
    PartTime,
    Contractor,
    Intern,
    Temporary,
}

// type: String
#[derive(SpacetimeType, Clone)]
pub enum EmployeeStatus {
    Active,
    OnLeave,
    Suspended,
    Terminated,
}

#[spacetimedb::table(name = employees, public)]
pub struct Employee {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub user_id: Option<String>, // UUID — FK → users.id (set null)

    #[unique]
    pub employee_number: Option<String>,

    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub phone: Option<String>,
    pub date_of_birth: Option<String>,
    pub hire_date: String,
    pub termination_date: Option<String>,

    #[index(btree)]
    pub employment_type: EmploymentType,

    #[index(btree)]
    pub status: EmployeeStatus, // default: Active

    pub metadata: Option<String>, // JSON

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
