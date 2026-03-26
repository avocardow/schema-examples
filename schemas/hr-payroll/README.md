# HR / Payroll

> Employee management, organizational structure, compensation tracking, payroll processing, benefits enrollment, and leave management.

## Overview

A complete human resources and payroll schema covering the full employee lifecycle: organizational structure (departments, positions), employee records with date-effective job assignments and compensation history, configurable payroll processing (earning types, deduction types, pay schedules, payroll runs, pay stubs with line items), benefits plan enrollment, leave management (policies, balances, requests), and employment document tracking.

Designed from a study of 10 real implementations: HRIS platforms (BambooHR, Workday HCM, Rippling, OrangeHRM), payroll systems (Gusto, ADP Workforce Now), unified APIs (Finch, Merge), open-source HR (Frappe HRMS), and the Oracle HR sample schema.

Key design decisions:
- **Employees reference auth-rbac users** — not all users are employees (admins, external contractors). Employee-specific data (hire date, department, employment type) lives here, while identity and authentication live in auth-rbac.
- **Date-effective job assignments** — every job change (title, department, manager) creates a new `employee_jobs` record with an effective date. This is the universal pattern across Workday, Merge, Finch, and Oracle for reconstructing org charts at any point in time.
- **Separate compensation tracking** — compensation changes (raises, rate adjustments) can occur independently of job changes. A dedicated `compensation` table with effective dates enables full pay history without conflating it with job assignments.
- **Configurable earning and deduction types** — earning categories (regular, overtime, bonus, commission) and deduction categories (federal tax, 401k, health insurance) are first-class entities. New types are added as rows, not schema changes. This follows the universal Gusto/ADP/Finch/Frappe pattern.
- **Pay schedule → payroll run → pay stub pipeline** — pay schedules define frequency (weekly, biweekly, monthly), payroll runs process a batch for a period, and pay stubs capture individual employee compensation with typed line items for earnings and deductions.
- **Simplified benefits** — benefit plans define what's available (health, dental, 401k); enrollments link employees to plans. Dependent and coverage sub-models are excluded as platform-level complexity that fails the user value test.
- **Leave allocation + request separation** — leave policies define accrual rules, leave balances track current entitlements (denormalized for query performance), and leave requests implement the approval workflow.
- **Employee documents** — lightweight metadata table linking to file-management for storing contracts, tax forms, and certifications with optional expiry dates.

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (18 tables)</summary>

- [`employees`](#1-employees)
- [`departments`](#2-departments)
- [`positions`](#3-positions)
- [`employee_jobs`](#4-employee_jobs)
- [`compensation`](#5-compensation)
- [`earning_types`](#6-earning_types)
- [`deduction_types`](#7-deduction_types)
- [`pay_schedules`](#8-pay_schedules)
- [`payroll_runs`](#9-payroll_runs)
- [`pay_stubs`](#10-pay_stubs)
- [`pay_stub_earnings`](#11-pay_stub_earnings)
- [`pay_stub_deductions`](#12-pay_stub_deductions)
- [`benefit_plans`](#13-benefit_plans)
- [`benefit_enrollments`](#14-benefit_enrollments)
- [`leave_policies`](#15-leave_policies)
- [`leave_balances`](#16-leave_balances)
- [`leave_requests`](#17-leave_requests)
- [`employee_documents`](#18-employee_documents)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users` | User identity. `employees` references `users` for login and authentication. Approvers on leave requests reference `users`. |
| [Auth / RBAC](../auth-rbac) | `organizations` | Organization identity. `departments` optionally references `organizations` for multi-tenant org structures. |
| [File Management / Document Storage](../file-management-document-storage) | `files` | File storage. `employee_documents` references `files` for the actual document content. |

## Tables

### Core Employee & Organization
- `employees` — Core employee records with personal info, hire date, employment type, and status, linked to auth-rbac users
- `departments` — Organizational departments with optional self-referencing hierarchy
- `positions` — Job position definitions with level and pay grade classification

### Job & Compensation History
- `employee_jobs` — Date-effective job assignments linking employees to positions and departments with reporting relationships
- `compensation` — Employee compensation records with pay rate, frequency, currency, and effective dates

### Payroll Processing
- `earning_types` — Configurable earning category definitions (regular, overtime, bonus, commission, etc.)
- `deduction_types` — Configurable deduction category definitions (federal tax, state tax, 401k, health insurance, etc.)
- `pay_schedules` — Pay period frequency definitions (weekly, biweekly, semimonthly, monthly)
- `payroll_runs` — Batch payroll processing runs for a pay schedule and period
- `pay_stubs` — Individual employee pay statements per payroll run with gross, deductions, and net totals
- `pay_stub_earnings` — Earning line items on a pay stub (hours, rate, amount per earning type)
- `pay_stub_deductions` — Deduction line items on a pay stub (amount per deduction type)

### Benefits
- `benefit_plans` — Benefit plan definitions (health, dental, vision, 401k, life insurance, etc.) with employer/employee contribution details
- `benefit_enrollments` — Employee enrollments in benefit plans with coverage level and effective dates

### Leave / Time Off
- `leave_policies` — Leave type definitions (vacation, sick, personal) with accrual rules and carryover limits
- `leave_balances` — Current leave balances per employee per policy, denormalized for query performance
- `leave_requests` — Time off requests with date ranges, duration, and approval workflow

### Documents
- `employee_documents` — Employment-related document metadata (contracts, tax forms, certifications) with optional expiry tracking, linked to file-management

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. employees

Core employee records representing people employed by the organization. Each employee links to an auth-rbac user for login/authentication and contains HR-specific data: personal information, hire/termination dates, employment classification, and current status. This is the central table that most other HR tables reference.

```pseudo
table employees {
  id                  uuid primary_key default auto_generate
  user_id             uuid nullable references users(id) on_delete set_null
                                                 -- Auth identity. From Auth / RBAC.
                                                 -- Nullable for employees imported without user accounts.
  employee_number     string nullable             -- Company-assigned employee ID (e.g., "EMP-001"). Application-generated.
  first_name          string not_null
  last_name           string not_null
  email               string not_null             -- Work email address.
  phone               string nullable             -- Work phone number.
  date_of_birth       string nullable             -- Calendar date "YYYY-MM-DD". Interpreted in local context.
  hire_date           string not_null             -- Calendar date "YYYY-MM-DD". When employment began.
  termination_date    string nullable             -- Calendar date "YYYY-MM-DD". Null if currently employed.
  employment_type     enum(full_time, part_time, contractor, intern, temporary) not_null
  status              enum(active, on_leave, suspended, terminated) not_null default active
  metadata            json nullable               -- App-specific employee data.
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    unique(employee_number)                       -- Employee numbers must be unique when present.
    index(user_id)
    index(status)
    index(employment_type)
  }
}
```

**Design notes:**
- `user_id` is nullable to support importing employee records before user accounts are created, or for employees who don't need system access.
- `employee_number` is application-generated, not the primary key. Using UUID as PK enables cross-system sync and avoids renumbering issues.
- Date fields (`date_of_birth`, `hire_date`, `termination_date`) use `string` type because they represent calendar dates in local context, not UTC moments.
- `employment_type` covers the core classifications. The `contractor` value is for individual contractors managed in the HR system; full vendor management belongs to a separate domain.

### 2. departments

Organizational departments with optional hierarchical structure via self-referencing parent. Departments organize employees and positions, and serve as a basis for payroll grouping, reporting, and access control.

```pseudo
table departments {
  id                  uuid primary_key default auto_generate
  organization_id     uuid nullable references organizations(id) on_delete cascade
                                                 -- From Auth / RBAC. For multi-tenant org scoping.
                                                 -- Nullable for single-tenant deployments.
  parent_id           uuid nullable references departments(id) on_delete set_null
                                                 -- Parent department for hierarchy. Null for top-level departments.
  name                string not_null             -- Department name (e.g., "Engineering", "Human Resources").
  code                string nullable             -- Short code (e.g., "ENG", "HR"). For reporting and payroll grouping.
  description         string nullable
  is_active           boolean not_null default true
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    index(organization_id)
    index(parent_id)
    index(is_active)
  }
}
```

**Design notes:**
- Self-referencing `parent_id` enables simple hierarchies (Engineering → Backend, Frontend). Most organizations need 2-3 levels.
- `organization_id` supports multi-tenant deployments where departments belong to specific organizations. Nullable for single-tenant apps.
- `code` enables short identifiers for payroll systems, reports, and cost center mapping.

### 3. positions

Job position definitions representing roles within the organization (e.g., "Senior Software Engineer", "HR Manager"). Positions define the role independently of who fills it — employees are assigned to positions via `employee_jobs`. Each position has a level for org chart hierarchy and an optional pay grade for compensation banding.

```pseudo
table positions {
  id                  uuid primary_key default auto_generate
  department_id       uuid nullable references departments(id) on_delete set_null
                                                 -- Default department for this position. Nullable for cross-department roles.
  title               string not_null             -- Position title (e.g., "Senior Software Engineer").
  code                string nullable             -- Position code for HR systems (e.g., "SWE-3").
  description         string nullable             -- Role description and responsibilities.
  level               integer nullable            -- Organizational level (1 = executive, 2 = director, etc.).
  pay_grade           string nullable             -- Pay grade classification (e.g., "L5", "Band-3") for compensation banding.
  is_active           boolean not_null default true
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    index(department_id)
    index(is_active)
  }
}
```

**Design notes:**
- `department_id` is the default department for the position. An employee's actual department in `employee_jobs` may differ (temporary assignments, matrix organizations).
- `pay_grade` is a string label referencing an external compensation band. Actual salary ranges are managed at the compensation level, not the position level, to avoid coupling position definitions to compensation policy.
- `level` enables org chart visualization and reporting hierarchy without requiring a rigid tree structure.

### 4. employee_jobs

Date-effective job assignments linking employees to positions, departments, and managers. Every job change (promotion, transfer, title change, manager change) creates a new record with an `effective_date`. The current job is the most recent record by effective date. This is the universal pattern across Workday, Merge, Finch, and Oracle for full employment history.

```pseudo
table employee_jobs {
  id                  uuid primary_key default auto_generate
  employee_id         uuid not_null references employees(id) on_delete cascade
  position_id         uuid nullable references positions(id) on_delete set_null
                                                 -- The position assigned. Nullable for unstructured orgs.
  department_id       uuid not_null references departments(id) on_delete restrict
                                                 -- The department for this assignment.
  manager_id          uuid nullable references employees(id) on_delete set_null
                                                 -- Direct reporting manager. Null for top-level employees.
  title               string not_null             -- Actual job title (may differ from position title for specificity).
  employment_type     enum(full_time, part_time, contractor, intern, temporary) not_null
  effective_date      string not_null             -- Calendar date "YYYY-MM-DD". When this assignment takes effect.
  end_date            string nullable             -- Calendar date "YYYY-MM-DD". When this assignment ended. Null if current.
  reason              string nullable             -- Reason for the change (e.g., "Promotion", "Transfer", "Reorganization").
  is_primary          boolean not_null default true
                                                 -- Whether this is the employee's primary job (for employees with multiple concurrent roles).
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    index(employee_id)
    index(position_id)
    index(department_id)
    index(manager_id)
    index(effective_date)
  }
}
```

**Design notes:**
- `effective_date` + `end_date` define the period this assignment was active. Current job: `end_date IS NULL` or the record with the latest `effective_date`.
- `title` is stored directly (not just derived from position) because actual job titles often differ from the position template (e.g., "Senior Backend Engineer" vs the position "Senior Software Engineer").
- `is_primary` supports employees with multiple concurrent roles (e.g., an engineer who also serves as a team lead in another department).
- `on_delete restrict` on `department_id` prevents deleting departments that have active job assignments.

### 5. compensation

Employee compensation records tracking pay rate, type, and frequency with effective dates. Each compensation change (raise, promotion bump, rate adjustment) creates a new record. The current compensation is the most recent by effective date. Separated from `employee_jobs` because compensation changes can occur independently of job changes.

```pseudo
table compensation {
  id                  uuid primary_key default auto_generate
  employee_id         uuid not_null references employees(id) on_delete cascade
  pay_type            enum(salary, hourly) not_null
                                                 -- How the employee is paid.
  amount              integer not_null            -- Pay amount in smallest currency unit (cents). For salary: annual amount. For hourly: hourly rate.
  currency            string not_null default 'USD'
                                                 -- ISO 4217 currency code.
  pay_frequency       enum(weekly, biweekly, semimonthly, monthly, annually) not_null
                                                 -- How often the employee is paid.
  effective_date      string not_null             -- Calendar date "YYYY-MM-DD". When this compensation takes effect.
  end_date            string nullable             -- Calendar date "YYYY-MM-DD". When this compensation ended. Null if current.
  reason              string nullable             -- Reason for the change (e.g., "Annual raise", "Promotion", "Market adjustment").
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    index(employee_id)
    index(effective_date)
  }
}
```

**Design notes:**
- `amount` is stored in smallest currency unit (cents) as an integer to avoid floating-point precision issues. For salary employees, this is the annual amount (e.g., 7500000 = $75,000.00/year). For hourly employees, this is the hourly rate (e.g., 3500 = $35.00/hour).
- `pay_frequency` determines how the annual salary is divided into paychecks, or how often an hourly employee is paid.
- Effective dates enable full compensation history reconstruction without overwriting previous data.

### 6. earning_types

Configurable earning category definitions used as line items on pay stubs. Each earning type represents a category of compensation (regular hours, overtime, bonus, commission, etc.) with classification and tax treatment metadata. New earning types are added as rows, not schema changes.

```pseudo
table earning_types {
  id                  uuid primary_key default auto_generate
  name                string not_null             -- Display name (e.g., "Regular Hours", "Overtime", "Annual Bonus").
  code                string not_null             -- Short code for payroll systems (e.g., "REG", "OT", "BONUS").
  category            enum(regular, overtime, bonus, commission, reimbursement, other) not_null
                                                 -- Classification for reporting and tax treatment.
  is_taxable          boolean not_null default true
                                                 -- Whether this earning type is subject to tax withholding.
  is_active           boolean not_null default true
  description         string nullable
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    unique(code)
    index(category)
    index(is_active)
  }
}
```

**Design notes:**
- `code` is unique and used for programmatic reference in payroll processing (e.g., `"REG"`, `"OT_1_5"`, `"BONUS_ANNUAL"`).
- `category` enables grouping for tax calculations and reporting (e.g., all overtime earnings, all bonuses).
- `is_taxable` flags whether the earning is subject to tax withholding (reimbursements typically aren't).

### 7. deduction_types

Configurable deduction category definitions used as line items on pay stubs. Each deduction type represents a category of withholding (federal tax, state tax, 401k, health insurance, garnishment, etc.) with classification metadata. Separate from earning types because deductions have fundamentally different semantics (subtracted from gross pay).

```pseudo
table deduction_types {
  id                  uuid primary_key default auto_generate
  name                string not_null             -- Display name (e.g., "Federal Income Tax", "401(k)", "Health Insurance").
  code                string not_null             -- Short code for payroll systems (e.g., "FIT", "401K", "HEALTH").
  category            enum(tax, retirement, insurance, garnishment, other) not_null
                                                 -- Classification for reporting.
  is_pretax           boolean not_null default false
                                                 -- Whether this deduction is taken before tax calculation (e.g., 401k, HSA).
  is_active           boolean not_null default true
  description         string nullable
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    unique(code)
    index(category)
    index(is_active)
  }
}
```

**Design notes:**
- `is_pretax` is critical for payroll calculation order. Pre-tax deductions (401k, HSA, FSA) reduce taxable income before tax withholding is calculated.
- `category` groups deductions for reporting: taxes (federal, state, local), retirement (401k, pension), insurance (health, dental, vision), garnishments (court-ordered), and other.

### 8. pay_schedules

Pay period frequency definitions determining when payroll runs occur. Each pay schedule defines the frequency (weekly, biweekly, etc.) and serves as a grouping mechanism for employees and payroll runs. A company may have multiple pay schedules (e.g., hourly employees paid weekly, salaried employees paid monthly).

```pseudo
table pay_schedules {
  id                  uuid primary_key default auto_generate
  name                string not_null             -- Display name (e.g., "Weekly Hourly", "Monthly Salaried").
  frequency           enum(weekly, biweekly, semimonthly, monthly) not_null
  anchor_date         string not_null             -- Calendar date "YYYY-MM-DD". Reference date for calculating pay periods.
  is_active           boolean not_null default true
  description         string nullable
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    index(frequency)
    index(is_active)
  }
}
```

**Design notes:**
- `anchor_date` is the reference point from which pay periods are calculated. For biweekly: every 14 days from anchor. For semimonthly: 1st and 15th (or similar). The application uses this to generate pay period start/end dates.
- A company typically has 1-3 pay schedules. Employees are associated with a pay schedule via their compensation record's `pay_frequency`.

### 9. payroll_runs

Batch payroll processing runs representing a single payroll execution for a pay schedule and period. Each run goes through a lifecycle (draft → processing → completed or failed) and generates individual pay stubs for all employees in the pay group. This is the central orchestration table for payroll processing.

```pseudo
table payroll_runs {
  id                  uuid primary_key default auto_generate
  pay_schedule_id     uuid not_null references pay_schedules(id) on_delete restrict
                                                 -- The pay schedule this run belongs to.
  period_start        string not_null             -- Calendar date "YYYY-MM-DD". Pay period start date.
  period_end          string not_null             -- Calendar date "YYYY-MM-DD". Pay period end date.
  pay_date            string not_null             -- Calendar date "YYYY-MM-DD". Date employees are paid.
  status              enum(draft, processing, completed, failed, voided) not_null default draft
  total_gross         integer not_null default 0  -- Sum of all gross pay in smallest currency unit.
  total_deductions    integer not_null default 0  -- Sum of all deductions in smallest currency unit.
  total_net           integer not_null default 0  -- Sum of all net pay in smallest currency unit.
  employee_count      integer not_null default 0  -- Number of employees in this run.
  currency            string not_null default 'USD'
  processed_at        timestamp nullable          -- When this run was finalized. Null if not yet processed.
  processed_by        uuid nullable references users(id) on_delete set_null
                                                 -- User who approved/processed this run. From Auth / RBAC.
  notes               string nullable             -- Admin notes about the run (adjustments, exceptions).
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    index(pay_schedule_id)
    index(status)
    index(pay_date)
  }
}
```

**Design notes:**
- `period_start`/`period_end` define the work period being compensated. `pay_date` is when payment is issued (may be days after the period ends).
- Totals (`total_gross`, `total_deductions`, `total_net`) are denormalized aggregates updated when pay stubs are finalized. Enables quick payroll dashboard display without summing all pay stubs.
- `on_delete restrict` on `pay_schedule_id` prevents deleting a pay schedule that has historical payroll runs.

### 10. pay_stubs

Individual employee pay statements generated per payroll run. Each pay stub captures the gross, deduction, and net amounts for one employee for one pay period. The detailed breakdown lives in `pay_stub_earnings` and `pay_stub_deductions` line item tables. This is the employee-facing record for "what was I paid and why."

```pseudo
table pay_stubs {
  id                  uuid primary_key default auto_generate
  payroll_run_id      uuid not_null references payroll_runs(id) on_delete cascade
  employee_id         uuid not_null references employees(id) on_delete cascade
  gross_pay           integer not_null default 0  -- Total earnings before deductions, in smallest currency unit.
  total_deductions    integer not_null default 0  -- Total deductions, in smallest currency unit.
  net_pay             integer not_null default 0  -- Gross pay minus deductions, in smallest currency unit.
  currency            string not_null default 'USD'
  pay_date            string not_null             -- Calendar date "YYYY-MM-DD". Mirrors payroll_run pay_date.
  period_start        string not_null             -- Calendar date "YYYY-MM-DD". Mirrors payroll_run period.
  period_end          string not_null             -- Calendar date "YYYY-MM-DD". Mirrors payroll_run period.
  created_at          timestamp default now

  indexes {
    composite_unique(payroll_run_id, employee_id) -- One pay stub per employee per payroll run.
    -- composite_unique(payroll_run_id, employee_id) covers index(payroll_run_id) via leading column.
    index(employee_id)
    index(pay_date)
  }
}
```

**Design notes:**
- Period and pay date are denormalized from the payroll run for direct access without joins — pay stubs are the most frequently queried payroll table (employee self-service).
- `gross_pay`, `total_deductions`, and `net_pay` are aggregates of the line item tables. The application maintains consistency.
- No `updated_at` — pay stubs are effectively immutable once the payroll run is completed. Corrections create adjustment entries in subsequent runs.

### 11. pay_stub_earnings

Earning line items on a pay stub. Each record represents one earning type (regular hours, overtime, bonus, etc.) for one pay stub. Multiple earning records per pay stub are typical (e.g., regular + overtime + bonus in one pay period).

```pseudo
table pay_stub_earnings {
  id                  uuid primary_key default auto_generate
  pay_stub_id         uuid not_null references pay_stubs(id) on_delete cascade
  earning_type_id     uuid not_null references earning_types(id) on_delete restrict
  hours               decimal nullable            -- Hours worked for this earning. Null for non-hourly items (salary, bonus).
  rate                integer nullable            -- Pay rate in smallest currency unit. Null for flat amounts (bonus).
  amount              integer not_null            -- Total earning amount in smallest currency unit.
  created_at          timestamp default now

  indexes {
    index(pay_stub_id)
    index(earning_type_id)
  }
}
```

**Design notes:**
- `hours` and `rate` are nullable because not all earning types are hourly. Salary earnings may show 0 hours with a flat amount. Bonuses have an amount but no hours/rate.
- `amount` is always populated — it's the final calculated earning for this line item.
- `on_delete restrict` on `earning_type_id` prevents deleting earning types referenced by historical pay stubs.

### 12. pay_stub_deductions

Deduction line items on a pay stub. Each record represents one deduction type (federal tax, 401k, health insurance, etc.) for one pay stub. Multiple deduction records per pay stub are typical.

```pseudo
table pay_stub_deductions {
  id                  uuid primary_key default auto_generate
  pay_stub_id         uuid not_null references pay_stubs(id) on_delete cascade
  deduction_type_id   uuid not_null references deduction_types(id) on_delete restrict
  employee_amount     integer not_null default 0  -- Amount withheld from employee pay, in smallest currency unit.
  employer_amount     integer not_null default 0  -- Employer contribution amount (e.g., 401k match), in smallest currency unit.
  created_at          timestamp default now

  indexes {
    index(pay_stub_id)
    index(deduction_type_id)
  }
}
```

**Design notes:**
- `employee_amount` is the portion deducted from the employee's gross pay. `employer_amount` is the employer's matching contribution (e.g., 401k match, employer-paid insurance portion). Both are tracked per pay period for reporting.
- `on_delete restrict` on `deduction_type_id` prevents deleting deduction types referenced by historical pay stubs.
- No `updated_at` — pay stub deductions are immutable once payroll is completed.

### 13. benefit_plans

Benefit plan definitions representing what the organization offers employees — health insurance, dental, vision, 401(k), life insurance, HSA, etc. Each plan defines the benefit type, coverage details, and employer/employee contribution structure. Employees enroll in plans via `benefit_enrollments`.

```pseudo
table benefit_plans {
  id                  uuid primary_key default auto_generate
  name                string not_null             -- Plan display name (e.g., "Premium Health PPO", "Basic Dental").
  type                enum(health, dental, vision, retirement_401k, life_insurance, disability, hsa, fsa, other) not_null
  description         string nullable
  employer_contribution  integer nullable         -- Employer contribution per period in smallest currency unit. Null if variable.
  employee_contribution  integer nullable         -- Employee contribution per period in smallest currency unit. Null if variable.
  currency            string not_null default 'USD'
  is_active           boolean not_null default true
  plan_year_start     string nullable             -- Calendar date "YYYY-MM-DD". Start of the plan year (for open enrollment).
  plan_year_end       string nullable             -- Calendar date "YYYY-MM-DD". End of the plan year.
  metadata            json nullable               -- Plan-specific details (provider name, group number, coverage tiers).
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    index(type)
    index(is_active)
  }
}
```

**Design notes:**
- `employer_contribution` and `employee_contribution` store fixed per-period amounts. For variable contributions (percentage-based, tiered), the amounts are null and the application calculates per employee.
- `plan_year_start`/`plan_year_end` define the plan year for benefits administration (open enrollment windows, renewal periods).
- `metadata` stores provider-specific details (insurance carrier, group number, plan ID) that vary by benefit type.

### 14. benefit_enrollments

Employee enrollments in benefit plans. Each record represents one employee enrolled in one benefit plan, with coverage level, contribution amounts, and effective dates. Supports enrollment history via effective/end dates.

```pseudo
table benefit_enrollments {
  id                  uuid primary_key default auto_generate
  employee_id         uuid not_null references employees(id) on_delete cascade
  benefit_plan_id     uuid not_null references benefit_plans(id) on_delete restrict
  coverage_level      enum(employee_only, employee_spouse, employee_children, family) not_null default employee_only
                                                 -- Who is covered under this enrollment.
  employee_contribution  integer not_null default 0
                                                 -- Employee per-period contribution in smallest currency unit.
  employer_contribution  integer not_null default 0
                                                 -- Employer per-period contribution in smallest currency unit.
  currency            string not_null default 'USD'
  effective_date      string not_null             -- Calendar date "YYYY-MM-DD". When coverage begins.
  end_date            string nullable             -- Calendar date "YYYY-MM-DD". When coverage ends. Null if active.
  status              enum(active, pending, terminated, waived) not_null default pending
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    index(employee_id)
    index(benefit_plan_id)
    index(status)
    index(effective_date)
  }
}
```

**Design notes:**
- `coverage_level` determines who is covered and typically affects the contribution amount. The application maps coverage levels to plan pricing.
- Contribution amounts are per-period and flow into payroll deductions. The `deduction_types` table defines the corresponding deduction category.
- `on_delete restrict` on `benefit_plan_id` prevents deleting plans with active enrollments.
- `waived` status supports tracking employees who explicitly declined coverage (required for compliance reporting).

### 15. leave_policies

Leave type definitions that determine accrual rules, carryover limits, and maximum balances. Each policy defines a category of time off (vacation, sick leave, personal days, etc.) and the rules for how employees earn and use it.

```pseudo
table leave_policies {
  id                  uuid primary_key default auto_generate
  name                string not_null             -- Policy name (e.g., "Annual Vacation", "Sick Leave", "Personal Days").
  type                enum(vacation, sick, personal, parental, bereavement, jury_duty, unpaid, other) not_null
  accrual_rate        decimal nullable            -- Days accrued per accrual period. Null for unlimited/fixed policies.
  accrual_frequency   enum(per_pay_period, monthly, quarterly, annually, none) not_null default none
                                                 -- How often leave accrues. "none" for fixed annual allocations.
  max_balance         decimal nullable            -- Maximum balance that can be accumulated. Null for unlimited.
  max_carryover       decimal nullable            -- Maximum days that can be carried over to next year. Null for unlimited.
  is_paid             boolean not_null default true
                                                 -- Whether this leave type is paid time off.
  requires_approval   boolean not_null default true
  is_active           boolean not_null default true
  description         string nullable
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    index(type)
    index(is_active)
  }
}
```

**Design notes:**
- `accrual_rate` + `accrual_frequency` together define how leave is earned. Example: 1.25 days per pay period × 24 periods = 30 days/year. For fixed allocations (e.g., 10 sick days/year), use `accrual_frequency = none` and set balances directly.
- `max_balance` prevents indefinite accumulation ("use it or lose it" above a cap).
- `max_carryover` limits how much unused leave rolls into the next year.
- `requires_approval` allows some leave types (e.g., jury duty) to be automatically approved.

### 16. leave_balances

Current leave balances per employee per policy. Denormalized for query performance — instead of computing balances from all historical requests and accruals, the balance is maintained as a running total. Updated when leave accrues, is requested, or carries over.

```pseudo
table leave_balances {
  id                  uuid primary_key default auto_generate
  employee_id         uuid not_null references employees(id) on_delete cascade
  leave_policy_id     uuid not_null references leave_policies(id) on_delete cascade
  balance             decimal not_null default 0  -- Current available balance in days.
  accrued             decimal not_null default 0  -- Total days accrued in current period/year.
  used                decimal not_null default 0  -- Total days used in current period/year.
  carried_over        decimal not_null default 0  -- Days carried over from previous period/year.
  year                integer not_null            -- Calendar year this balance applies to.
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    composite_unique(employee_id, leave_policy_id, year)  -- One balance per employee per policy per year.
    -- composite_unique(employee_id, leave_policy_id, year) covers index(employee_id) via leading column.
    index(leave_policy_id)
  }
}
```

**Design notes:**
- `balance` = `carried_over` + `accrued` - `used`. Maintained by the application on every accrual event and leave request approval.
- `year` enables annual balance tracking. At year-end, `carried_over` for the new year is calculated from the previous year's remaining balance, capped by `leave_policies.max_carryover`.
- The composite unique constraint ensures exactly one balance record per employee, per leave type, per year.

### 17. leave_requests

Time off requests submitted by employees with approval workflow. Each request specifies a date range, the leave policy being used, and tracks the approval chain. Approved requests deduct from `leave_balances`.

```pseudo
table leave_requests {
  id                  uuid primary_key default auto_generate
  employee_id         uuid not_null references employees(id) on_delete cascade
  leave_policy_id     uuid not_null references leave_policies(id) on_delete restrict
  start_date          string not_null             -- Calendar date "YYYY-MM-DD". First day of leave.
  end_date            string not_null             -- Calendar date "YYYY-MM-DD". Last day of leave.
  days_requested      decimal not_null            -- Number of days requested (supports half-days, e.g., 0.5).
  status              enum(pending, approved, rejected, cancelled) not_null default pending
  reason              string nullable             -- Employee-provided reason for the request.
  reviewer_id         uuid nullable references users(id) on_delete set_null
                                                 -- User who approved or rejected. From Auth / RBAC.
  reviewed_at         timestamp nullable          -- When the request was reviewed.
  reviewer_note       string nullable             -- Reviewer's comment on approval/rejection.
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    index(employee_id)
    index(leave_policy_id)
    index(status)
    index(start_date)
  }
}
```

**Design notes:**
- `days_requested` supports fractional days (0.5 for half-day leave). The application validates against `leave_balances.balance` before approving.
- `reviewer_id` references auth-rbac `users` (not `employees`) because the reviewer may be an HR admin, not necessarily the employee's manager.
- `on_delete restrict` on `leave_policy_id` prevents deleting policies referenced by historical requests.
- `start_date`/`end_date` use string type for calendar dates. The actual working days within the range depend on the company's work schedule (handled at the application level).

### 18. employee_documents

Employment-related document metadata linking to the file-management domain for actual file storage. Tracks document type, status, and optional expiry for compliance monitoring (e.g., certifications, work permits, professional licenses).

```pseudo
table employee_documents {
  id                  uuid primary_key default auto_generate
  employee_id         uuid not_null references employees(id) on_delete cascade
  file_id             uuid not_null references files(id) on_delete cascade
                                                 -- From File Management / Document Storage.
  type                enum(contract, tax_form, identification, certification, offer_letter, performance_review, other) not_null
  name                string not_null             -- Document display name (e.g., "W-4 2025", "Engineering Certification").
  description         string nullable
  issued_date         string nullable             -- Calendar date "YYYY-MM-DD". When the document was issued.
  expiry_date         string nullable             -- Calendar date "YYYY-MM-DD". When the document expires. Null if no expiry.
  status              enum(active, expired, superseded, archived) not_null default active
  uploaded_by         uuid nullable references users(id) on_delete set_null
                                                 -- User who uploaded the document. From Auth / RBAC.
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    index(employee_id)
    index(file_id)
    index(type)
    index(expiry_date)
    index(status)
  }
}
```

**Design notes:**
- `file_id` references the file-management domain's `files` table for actual file storage, versioning, and access control. This table adds HR-specific metadata on top.
- `expiry_date` enables compliance monitoring — query for documents expiring within 30 days to alert HR.
- `status = superseded` marks documents replaced by newer versions (e.g., a new W-4 replacing last year's).
- `uploaded_by` tracks who added the document (may be the employee, their manager, or HR).

## Relationships

```
users                1 ──── * employees                 (one user maps to one or more employee records)
organizations        1 ──── * departments                (one org has many departments)
departments          1 ──── * departments                (self-referencing parent hierarchy)
departments          1 ──── * positions                  (one department has many positions)
departments          1 ──── * employee_jobs              (one department has many job assignments)
positions            1 ──── * employee_jobs              (one position has many job assignments)
employees            1 ──── * employee_jobs              (one employee has many job assignments over time)
employees            1 ──── * employee_jobs [manager]    (one employee manages many job assignments)
employees            1 ──── * compensation               (one employee has many compensation records over time)
employees            1 ──── * pay_stubs                  (one employee has many pay stubs)
employees            1 ──── * benefit_enrollments        (one employee has many benefit enrollments)
employees            1 ──── * leave_balances             (one employee has many leave balances)
employees            1 ──── * leave_requests             (one employee has many leave requests)
employees            1 ──── * employee_documents         (one employee has many documents)
pay_schedules        1 ──── * payroll_runs               (one pay schedule has many payroll runs)
payroll_runs         1 ──── * pay_stubs                  (one payroll run has many pay stubs)
pay_stubs            1 ──── * pay_stub_earnings          (one pay stub has many earning line items)
pay_stubs            1 ──── * pay_stub_deductions        (one pay stub has many deduction line items)
earning_types        1 ──── * pay_stub_earnings          (one earning type appears in many pay stubs)
deduction_types      1 ──── * pay_stub_deductions        (one deduction type appears in many pay stubs)
benefit_plans        1 ──── * benefit_enrollments        (one plan has many enrollments)
leave_policies       1 ──── * leave_balances             (one policy has many balances)
leave_policies       1 ──── * leave_requests             (one policy has many requests)
files                1 ──── * employee_documents         (one file backs one document record)
```

## Best Practices

- **Date-effective records** — never overwrite job assignments or compensation. Create new records with effective dates. This provides full audit history and enables point-in-time queries ("what was this employee's salary on March 1?").
- **Amounts in smallest currency unit** — store all monetary values as integers in the smallest currency unit (cents for USD). Prevents floating-point precision errors in payroll calculations.
- **Payroll immutability** — once a payroll run is completed, its pay stubs and line items should not be modified. Corrections go through adjustment entries in subsequent runs or voided runs.
- **Balance consistency** — leave balances are denormalized for performance. Implement application-level checks to keep `balance = carried_over + accrued - used` in sync.
- **Compliance monitoring** — use `employee_documents.expiry_date` to proactively alert on expiring certifications, work permits, and licenses.
- **Multi-schedule support** — design for multiple pay schedules from the start. It's common to pay hourly employees weekly and salaried employees monthly.
- **Soft deactivation** — deactivate positions, earning types, deduction types, benefit plans, and leave policies (`is_active = false`) rather than deleting them. Historical records reference these entities.

## Formats

| Format      | Status |
| ----------- | ------ |
| Convex      | ✅ Done |
| SQL         | ✅ Done |
| Prisma      | ✅ Done |
| MongoDB     | ✅ Done |
| Drizzle     | ✅ Done |
| SpacetimeDB | ✅ Done |
| Firebase    | ✅ Done |
