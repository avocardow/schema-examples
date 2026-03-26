# Compliance / GRC

> Governance frameworks, risk management, regulatory compliance tracking, control libraries, audit management, and policy lifecycle.

## Overview

A comprehensive Governance, Risk, and Compliance (GRC) schema covering the core pillars of enterprise compliance programs: regulatory framework tracking, control libraries with testing and assessment workflows, risk registers with scoring and mitigation, policy lifecycle management with acknowledgment tracking, audit planning and execution with findings, and compliance evidence collection.

Designed from a study of real GRC implementations: enterprise platforms (ServiceNow GRC, IBM OpenPages, SAP GRC), mid-market solutions (LogicGate, AuditBoard, Hyperproof, Drata), open-source frameworks (Eramba, CISO Assistant), and compliance automation tools (Vanta, Secureframe). Also informed by industry standards: NIST CSF, ISO 27001, SOC 2, COBIT, and COSO ERM.

Key design decisions:
- **Frameworks as a first-class entity** — regulatory frameworks (SOC 2, ISO 27001, HIPAA, GDPR) are stored as rows, not hardcoded. Each framework has requirements that map to controls, enabling multi-framework compliance tracking through a single control library.
- **Controls are the central hub** — controls link upward to framework requirements and downward to risks, policies, and evidence. This mirrors the universal GRC pattern where controls are tested, assessed, and mapped across multiple regulations.
- **Risk register with quantitative scoring** — risks have likelihood and impact scores, a calculated risk level, and link to controls as mitigations. This follows the COSO ERM and ISO 31000 pattern adopted by OpenPages, LogicGate, and ServiceNow.
- **Policy lifecycle with acknowledgments** — policies have versioned status workflows (draft → active → archived) and a separate acknowledgment table tracking which users have reviewed and accepted each policy version.
- **Audit management with findings** — audits progress through a defined lifecycle (planned → in_progress → completed), with individual findings that link to controls and risks for remediation tracking.
- **Evidence collection linked to controls** — evidence artifacts (documents, screenshots, automated exports) link to controls and optionally to audits, enabling continuous compliance monitoring.
- **Configurable categories via enums** — risk categories, control types, finding severities, and policy types use enums that cover the standard GRC taxonomy without requiring separate lookup tables (the set of categories is stable across implementations).

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (17 tables)</summary>

- [`frameworks`](#1-frameworks)
- [`framework_requirements`](#2-framework_requirements)
- [`controls`](#3-controls)
- [`control_requirements`](#4-control_requirements)
- [`control_tests`](#5-control_tests)
- [`risks`](#6-risks)
- [`risk_controls`](#7-risk_controls)
- [`policies`](#8-policies)
- [`policy_versions`](#9-policy_versions)
- [`policy_acknowledgments`](#10-policy_acknowledgments)
- [`audits`](#11-audits)
- [`audit_findings`](#12-audit_findings)
- [`finding_remediations`](#13-finding_remediations)
- [`evidence`](#14-evidence)
- [`compliance_tags`](#15-compliance_tags)
- [`compliance_taggables`](#16-compliance_taggables)
- [`compliance_activities`](#17-compliance_activities)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users` | User identity. Control owners, risk owners, policy approvers, auditors, and activity actors reference `users`. |
| [Auth / RBAC](../auth-rbac) | `organizations` | Organization identity. Frameworks, controls, and risks optionally scoped to organizations for multi-tenant deployments. |
| [File Management / Document Storage](../file-management-document-storage) | `files` | File storage. Evidence artifacts and policy documents reference `files` for the actual content. |

## Tables

### Frameworks & Requirements
- `frameworks` — Regulatory and compliance frameworks (SOC 2, ISO 27001, HIPAA, GDPR, PCI DSS, etc.) with version and authority tracking
- `framework_requirements` — Individual requirements/clauses within a framework, organized hierarchically (e.g., SOC 2 CC6.1, ISO 27001 A.5.1)

### Controls
- `controls` — Control library entries defining security and compliance controls with ownership, type classification, and operational status
- `control_requirements` — Many-to-many mapping between controls and framework requirements, enabling multi-framework control coverage
- `control_tests` — Periodic test results for controls, tracking test execution and pass/fail outcomes

### Risk Management
- `risks` — Risk register entries with likelihood/impact scoring, categorization, treatment strategy, and ownership
- `risk_controls` — Many-to-many mapping between risks and the controls that mitigate them

### Policy Management
- `policies` — Policy definitions with type classification and ownership (the policy concept, not a specific version)
- `policy_versions` — Versioned policy content with approval workflow status (draft → in_review → approved → archived)
- `policy_acknowledgments` — User acknowledgments of specific policy versions, tracking who has reviewed and accepted each policy

### Audit Management
- `audits` — Audit engagements with lifecycle tracking (planned → in_progress → review → completed → cancelled), scope, and lead assignment
- `audit_findings` — Individual findings from audits with severity classification, linked to controls and risks for remediation
- `finding_remediations` — Remediation actions for audit findings with status tracking and due dates

### Evidence & Tagging
- `evidence` — Compliance evidence artifacts linked to controls and optionally audits, with collection date and validity period tracking
- `compliance_tags` — Tag definitions for categorizing and filtering GRC entities (controls, risks, policies, etc.)
- `compliance_taggables` — Polymorphic many-to-many mapping between tags and any GRC entity type

### Activity Log
- `compliance_activities` — Append-only audit trail of significant GRC actions (control tested, risk updated, policy approved, finding created, etc.)

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. frameworks

Regulatory and compliance frameworks that the organization must comply with. Each framework represents a standard, regulation, or internal governance program (e.g., SOC 2 Type II, ISO 27001:2022, HIPAA, GDPR). Frameworks contain requirements that map to controls.

```pseudo
table frameworks {
  id                  uuid primary_key default auto_generate
  organization_id     uuid nullable references organizations(id) on_delete cascade
                                                 -- From Auth / RBAC. For multi-tenant scoping.
                                                 -- Nullable for single-tenant deployments.
  name                string not_null             -- Framework name (e.g., "SOC 2 Type II", "ISO 27001:2022").
  version             string nullable             -- Framework version or year (e.g., "2022", "Rev 5").
  authority           string nullable             -- Issuing authority (e.g., "AICPA", "ISO", "NIST", "EU").
  description         string nullable
  website_url         string nullable             -- Official framework documentation URL.
  is_active           boolean not_null default true
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    index(organization_id)
    index(is_active)
  }
}
```

**Design notes:**
- Frameworks are data rows, not hardcoded — organizations can add custom frameworks or internal standards alongside regulatory ones.
- `version` allows tracking multiple versions of the same standard (e.g., ISO 27001:2013 vs ISO 27001:2022).
- `authority` enables filtering by regulatory body.

### 2. framework_requirements

Individual requirements, clauses, or controls within a framework. Requirements are organized hierarchically (sections contain sub-requirements) and represent the specific compliance obligations that controls must satisfy.

```pseudo
table framework_requirements {
  id                  uuid primary_key default auto_generate
  framework_id        uuid not_null references frameworks(id) on_delete cascade
  parent_id           uuid nullable references framework_requirements(id) on_delete cascade
                                                 -- Parent requirement for hierarchy (e.g., CC6 → CC6.1 → CC6.1.1).
  identifier          string not_null             -- Requirement identifier within the framework (e.g., "CC6.1", "A.5.1.1", "164.312(a)(1)").
  title               string not_null             -- Short title or name of the requirement.
  description         string nullable             -- Full requirement text or summary.
  sort_order          integer not_null default 0   -- Display ordering within the parent level.
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    composite_unique(framework_id, identifier)   -- Requirement identifiers are unique within a framework.
    index(parent_id)
    index(sort_order)
  }
}
```

**Design notes:**
- `identifier` is the official reference code from the framework specification. Combined with `framework_id`, it uniquely identifies any requirement.
- Self-referencing `parent_id` enables hierarchical structure (sections → sub-sections → individual requirements) matching how frameworks organize their content.
- `sort_order` preserves the original framework ordering for display.

### 3. controls

The control library — security and compliance controls that the organization implements to meet framework requirements and mitigate risks. Controls are the central entity in GRC, linking requirements (what must be done) to evidence (proof it's done) and risks (what it mitigates).

```pseudo
table controls {
  id                  uuid primary_key default auto_generate
  organization_id     uuid nullable references organizations(id) on_delete cascade
                                                 -- From Auth / RBAC. For multi-tenant scoping.
  owner_id            uuid nullable references users(id) on_delete set_null
                                                 -- From Auth / RBAC. Person responsible for this control.
  identifier          string nullable             -- Control ID (e.g., "CTRL-001", "AC-1"). Application-generated.
  title               string not_null             -- Control name (e.g., "Access Review", "Encryption at Rest").
  description         string nullable             -- Detailed control description and implementation guidance.
  control_type        enum(preventive, detective, corrective, directive) not_null
                                                 -- Classification by function.
  category            enum(technical, administrative, physical) not_null
                                                 -- Classification by nature.
  frequency           enum(continuous, daily, weekly, monthly, quarterly, annually, as_needed) not_null default continuous
                                                 -- How often the control operates or is tested.
  status              enum(draft, active, inactive, deprecated) not_null default draft
  effectiveness       enum(effective, partially_effective, ineffective, not_assessed) not_null default not_assessed
                                                 -- Current assessment of control effectiveness.
  implementation_notes string nullable            -- Notes on how the control is implemented.
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    unique(identifier)
    index(organization_id)
    index(owner_id)
    index(status)
    index(control_type)
    index(category)
  }
}
```

**Design notes:**
- `control_type` covers the standard NIST/COBIT taxonomy: preventive (stops threats), detective (identifies threats), corrective (remediates), directive (mandates behavior).
- `category` classifies by implementation nature: technical (encryption, firewalls), administrative (policies, training), physical (locks, badges).
- `effectiveness` tracks the current assessment result without requiring a join to the latest test.
- `frequency` indicates how often the control operates, which drives testing schedules.

### 4. control_requirements

Many-to-many mapping between controls and framework requirements. A single control can satisfy requirements across multiple frameworks (e.g., an encryption control satisfies SOC 2 CC6.1 and ISO 27001 A.10.1), and a single requirement may be addressed by multiple controls.

```pseudo
table control_requirements {
  id                  uuid primary_key default auto_generate
  control_id          uuid not_null references controls(id) on_delete cascade
  requirement_id      uuid not_null references framework_requirements(id) on_delete cascade
  notes               string nullable             -- Notes on how the control satisfies this requirement.
  created_at          timestamp default now

  indexes {
    composite_unique(control_id, requirement_id) -- Each mapping is unique.
  }
}
```

**Design notes:**
- This join table is the core of multi-framework compliance: changing a control's status automatically reflects across all frameworks it maps to.
- `notes` allows documenting the specific aspect of the control that addresses the requirement.

### 5. control_tests

Test executions for controls. Each record represents a single test event — when a control was tested, by whom, and the result. Regular testing is how organizations demonstrate that controls are operating effectively over time.

```pseudo
table control_tests {
  id                  uuid primary_key default auto_generate
  control_id          uuid not_null references controls(id) on_delete cascade
  tested_by           uuid nullable references users(id) on_delete set_null
                                                 -- From Auth / RBAC. Person who performed the test.
  test_date           timestamp not_null          -- When the test was performed.
  result              enum(pass, fail, partial, not_applicable) not_null
  notes               string nullable             -- Test observations and detailed findings.
  next_test_date      timestamp nullable          -- Scheduled date for the next test.
  created_at          timestamp default now

  indexes {
    index(control_id)
    index(tested_by)
    index(result)
    index(test_date)
  }
}
```

**Design notes:**
- Test results are append-only history — a new record per test execution, never updating old results.
- `next_test_date` enables compliance dashboards to show overdue controls.
- `result` uses standard audit outcomes: pass (operating effectively), fail (not operating), partial (partially effective), not_applicable (control not relevant for this test cycle).

### 6. risks

Risk register entries representing identified risks to the organization. Each risk has quantitative scoring (likelihood × impact), categorization, treatment strategy, and ownership. Risks link to controls that mitigate them.

```pseudo
table risks {
  id                  uuid primary_key default auto_generate
  organization_id     uuid nullable references organizations(id) on_delete cascade
                                                 -- From Auth / RBAC. For multi-tenant scoping.
  owner_id            uuid nullable references users(id) on_delete set_null
                                                 -- From Auth / RBAC. Person responsible for managing this risk.
  identifier          string nullable             -- Risk ID (e.g., "RISK-001"). Application-generated.
  title               string not_null             -- Short risk title.
  description         string nullable             -- Detailed risk description and context.
  category            enum(strategic, operational, financial, compliance, reputational, technical, third_party) not_null
  likelihood          integer not_null default 3   -- Likelihood score (1-5 scale). 1=rare, 5=almost certain.
  impact              integer not_null default 3   -- Impact score (1-5 scale). 1=negligible, 5=catastrophic.
  risk_level          enum(critical, high, medium, low, very_low) not_null default medium
                                                 -- Calculated from likelihood × impact, stored for query performance.
  treatment           enum(mitigate, accept, transfer, avoid) not_null default mitigate
                                                 -- Risk treatment strategy per ISO 31000.
  status              enum(identified, assessing, treating, monitoring, closed) not_null default identified
  due_date            string nullable             -- Calendar date "YYYY-MM-DD" for treatment completion target.
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    unique(identifier)
    index(organization_id)
    index(owner_id)
    index(category)
    index(risk_level)
    index(status)
  }
}
```

**Design notes:**
- `likelihood` and `impact` use a 1-5 integer scale (the universal GRC standard). The product gives a 1-25 risk score.
- `risk_level` is denormalized from likelihood × impact for efficient filtering. Application logic maps score ranges to levels (e.g., 1-4 = very_low, 5-9 = low, 10-14 = medium, 15-19 = high, 20-25 = critical).
- `treatment` follows ISO 31000 risk treatment options.
- `category` covers the standard enterprise risk taxonomy.

### 7. risk_controls

Many-to-many mapping between risks and the controls that mitigate them. A risk may be mitigated by multiple controls, and a control may mitigate multiple risks.

```pseudo
table risk_controls {
  id                  uuid primary_key default auto_generate
  risk_id             uuid not_null references risks(id) on_delete cascade
  control_id          uuid not_null references controls(id) on_delete cascade
  effectiveness_notes string nullable             -- Notes on how effectively the control mitigates this risk.
  created_at          timestamp default now

  indexes {
    composite_unique(risk_id, control_id)        -- Each mapping is unique.
  }
}
```

**Design notes:**
- This join table enables risk-to-control gap analysis: risks without adequate control coverage are compliance gaps.
- `effectiveness_notes` documents the specific mitigation relationship.

### 8. policies

Policy definitions representing organizational policies, standards, and procedures. Each policy tracks the concept (e.g., "Information Security Policy") independently of its versions. Policies go through a version lifecycle managed in `policy_versions`.

```pseudo
table policies {
  id                  uuid primary_key default auto_generate
  organization_id     uuid nullable references organizations(id) on_delete cascade
                                                 -- From Auth / RBAC. For multi-tenant scoping.
  owner_id            uuid nullable references users(id) on_delete set_null
                                                 -- From Auth / RBAC. Policy owner responsible for maintenance.
  title               string not_null             -- Policy title (e.g., "Information Security Policy").
  policy_type         enum(policy, standard, procedure, guideline) not_null default policy
                                                 -- Document hierarchy classification.
  description         string nullable             -- Brief description of the policy's purpose and scope.
  review_frequency    enum(monthly, quarterly, semi_annually, annually, biennially) not_null default annually
                                                 -- How often the policy should be reviewed.
  next_review_date    string nullable             -- Calendar date "YYYY-MM-DD" for the next scheduled review.
  is_active           boolean not_null default true
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    index(organization_id)
    index(owner_id)
    index(policy_type)
    index(is_active)
  }
}
```

**Design notes:**
- The policy/version split separates the concept (policy) from the content (version). This enables versioned review workflows without duplicating metadata.
- `policy_type` follows the standard document hierarchy: policies (high-level mandates), standards (specific requirements), procedures (step-by-step instructions), guidelines (recommended practices).
- `review_frequency` drives the compliance dashboard for policies due for review.

### 9. policy_versions

Versioned snapshots of policy content with approval workflow status. Each version represents a specific revision of a policy that goes through a review and approval process before becoming the active version.

```pseudo
table policy_versions {
  id                  uuid primary_key default auto_generate
  policy_id           uuid not_null references policies(id) on_delete cascade
  version_number      string not_null             -- Version label (e.g., "1.0", "2.1", "3.0-draft").
  content             string nullable             -- Full policy text content (or reference to external document).
  file_id             uuid nullable references files(id) on_delete set_null
                                                 -- From File Management. Attached policy document.
  status              enum(draft, in_review, approved, archived) not_null default draft
  approved_by         uuid nullable references users(id) on_delete set_null
                                                 -- From Auth / RBAC. User who approved this version.
  approved_at         timestamp nullable          -- When the version was approved.
  effective_date      string nullable             -- Calendar date "YYYY-MM-DD". When this version becomes effective.
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    composite_unique(policy_id, version_number)  -- Version numbers unique within a policy.
    index(status)
    index(approved_by)
  }
}
```

**Design notes:**
- `status` workflow: draft → in_review → approved → archived. Only one version should be `approved` at a time (enforced in application logic).
- `content` stores the policy text directly for simple deployments. `file_id` references file-management for document attachments (PDF, DOCX).
- `effective_date` may differ from `approved_at` — a policy can be approved in advance of its effective date.

### 10. policy_acknowledgments

User acknowledgments of specific policy versions. Tracks who has read and accepted each policy, when, and their acknowledgment method. Required for compliance audits that need proof of policy awareness.

```pseudo
table policy_acknowledgments {
  id                  uuid primary_key default auto_generate
  policy_version_id   uuid not_null references policy_versions(id) on_delete cascade
  user_id             uuid not_null references users(id) on_delete cascade
                                                 -- From Auth / RBAC. User who acknowledged the policy.
  acknowledged_at     timestamp not_null          -- When the acknowledgment was recorded.
  method              enum(click_through, electronic_signature, manual) not_null default click_through
  ip_address          string nullable             -- IP address at time of acknowledgment (for audit trail).
  notes               string nullable             -- User comments or notes on the acknowledgment.
  created_at          timestamp default now

  indexes {
    composite_unique(policy_version_id, user_id) -- One acknowledgment per user per version.
    index(user_id)                               -- composite_unique(policy_version_id, user_id) covers index(policy_version_id) via leading column.
    index(acknowledged_at)
  }
}
```

**Design notes:**
- The composite unique constraint ensures each user can only acknowledge a policy version once.
- `method` tracks how the acknowledgment was captured for audit evidence.
- `ip_address` provides an additional audit trail element.

### 11. audits

Audit engagements representing planned or completed compliance audits. Each audit has a defined scope, lifecycle status, lead auditor, and date range. Audits contain findings that link to controls and risks.

```pseudo
table audits {
  id                  uuid primary_key default auto_generate
  organization_id     uuid nullable references organizations(id) on_delete cascade
                                                 -- From Auth / RBAC. For multi-tenant scoping.
  lead_auditor_id     uuid nullable references users(id) on_delete set_null
                                                 -- From Auth / RBAC. Primary auditor responsible.
  title               string not_null             -- Audit title (e.g., "Q1 2025 SOC 2 Internal Audit").
  audit_type          enum(internal, external, self_assessment, certification) not_null
  status              enum(planned, in_progress, review, completed, cancelled) not_null default planned
  scope               string nullable             -- Description of what the audit covers.
  start_date          string nullable             -- Calendar date "YYYY-MM-DD".
  end_date            string nullable             -- Calendar date "YYYY-MM-DD".
  conclusion          string nullable             -- Final audit conclusion or summary.
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    index(organization_id)
    index(lead_auditor_id)
    index(audit_type)
    index(status)
  }
}
```

**Design notes:**
- `audit_type` covers the standard audit modes: internal (by staff), external (by third party), self-assessment (team self-review), certification (formal certification audit like SOC 2 Type II).
- `status` lifecycle: planned → in_progress → review → completed. `cancelled` is a terminal state.
- `conclusion` is populated at audit completion with the overall assessment.

### 12. audit_findings

Individual findings discovered during an audit. Each finding describes an issue, its severity, and links to the control(s) and risk(s) involved. Findings drive remediation actions.

```pseudo
table audit_findings {
  id                  uuid primary_key default auto_generate
  audit_id            uuid not_null references audits(id) on_delete cascade
  control_id          uuid nullable references controls(id) on_delete set_null
                                                 -- The control where the finding was identified.
  risk_id             uuid nullable references risks(id) on_delete set_null
                                                 -- The risk this finding relates to.
  title               string not_null             -- Finding title.
  description         string nullable             -- Detailed finding description.
  severity            enum(critical, high, medium, low, informational) not_null
  status              enum(open, in_progress, remediated, accepted, closed) not_null default open
  due_date            string nullable             -- Calendar date "YYYY-MM-DD" for remediation deadline.
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    index(audit_id)
    index(control_id)
    index(risk_id)
    index(severity)
    index(status)
  }
}
```

**Design notes:**
- `severity` aligns with standard audit finding classifications.
- `status` workflow: open → in_progress → remediated → closed. `accepted` is for findings the organization accepts (risk acceptance).
- Linking to both `control_id` and `risk_id` enables compliance dashboards showing which controls have findings and which risks have materialized.

### 13. finding_remediations

Remediation actions for audit findings. Each remediation tracks a specific corrective action, its assignee, status, and completion. Multiple remediation steps may be required to resolve a single finding.

```pseudo
table finding_remediations {
  id                  uuid primary_key default auto_generate
  finding_id          uuid not_null references audit_findings(id) on_delete cascade
  assigned_to         uuid nullable references users(id) on_delete set_null
                                                 -- From Auth / RBAC. Person responsible for this remediation action.
  title               string not_null             -- Remediation action title.
  description         string nullable             -- Detailed description of the remediation action.
  status              enum(pending, in_progress, completed, cancelled) not_null default pending
  priority            enum(critical, high, medium, low) not_null default medium
  due_date            string nullable             -- Calendar date "YYYY-MM-DD" for action completion target.
  completed_at        timestamp nullable          -- When the remediation was completed.
  created_at          timestamp default now
  updated_at          timestamp default now on_update

  indexes {
    index(finding_id)
    index(assigned_to)
    index(status)
    index(priority)
    index(due_date)
  }
}
```

**Design notes:**
- Separate from findings because a single finding may require multiple remediation steps assigned to different people.
- `priority` may differ from the finding's severity — a high-severity finding might have both a critical short-term fix and a medium-priority long-term improvement.
- `completed_at` enables tracking remediation velocity.

### 14. evidence

Compliance evidence artifacts that demonstrate control effectiveness. Evidence can be documents, screenshots, automated exports, or test results linked to specific controls and optionally to audits.

```pseudo
table evidence {
  id                  uuid primary_key default auto_generate
  control_id          uuid not_null references controls(id) on_delete cascade
  audit_id            uuid nullable references audits(id) on_delete set_null
                                                 -- Optionally linked to a specific audit.
  file_id             uuid nullable references files(id) on_delete set_null
                                                 -- From File Management. The evidence file/artifact.
  collected_by        uuid nullable references users(id) on_delete set_null
                                                 -- From Auth / RBAC. Person who collected/uploaded the evidence.
  title               string not_null             -- Evidence title or description.
  evidence_type       enum(document, screenshot, log_export, automated_test, manual_review, certification) not_null
  description         string nullable             -- Additional context about the evidence.
  collected_at        timestamp not_null          -- When the evidence was collected or generated.
  valid_from          string nullable             -- Calendar date "YYYY-MM-DD". Start of the period this evidence covers.
  valid_until         string nullable             -- Calendar date "YYYY-MM-DD". End of the validity period.
  created_at          timestamp default now

  indexes {
    index(control_id)
    index(audit_id)
    index(collected_by)
    index(evidence_type)
    index(collected_at)
  }
}
```

**Design notes:**
- `evidence_type` covers common evidence artifact types in GRC platforms.
- `valid_from`/`valid_until` define the period the evidence covers, which is critical for continuous compliance — evidence must cover the entire audit period.
- `file_id` references file-management for the actual artifact. `title` and `description` provide context even if the file is not yet uploaded.

### 15. compliance_tags

Tag definitions for categorizing and filtering GRC entities. Tags provide flexible, user-defined taxonomy beyond the fixed enum categories.

```pseudo
table compliance_tags {
  id                  uuid primary_key default auto_generate
  organization_id     uuid nullable references organizations(id) on_delete cascade
                                                 -- From Auth / RBAC. For multi-tenant scoping.
  name                string not_null             -- Tag name (e.g., "cloud-infrastructure", "pii", "critical-asset").
  color               string nullable             -- Hex color code for UI display (e.g., "#FF5733").
  created_at          timestamp default now

  indexes {
    composite_unique(organization_id, name)      -- Tag names unique within an organization.
  }
}
```

**Design notes:**
- Tags complement the fixed enum categories on controls and risks with user-defined labels.
- `color` enables visual differentiation in dashboards.

### 16. compliance_taggables

Polymorphic many-to-many mapping between tags and GRC entities. Any entity type (control, risk, policy, audit) can be tagged.

```pseudo
table compliance_taggables {
  id                  uuid primary_key default auto_generate
  tag_id              uuid not_null references compliance_tags(id) on_delete cascade
  taggable_type       enum(control, risk, policy, audit, finding, evidence) not_null
                                                 -- The type of entity being tagged.
  taggable_id         uuid not_null             -- The ID of the tagged entity (polymorphic FK).
  created_at          timestamp default now

  indexes {
    composite_unique(tag_id, taggable_type, taggable_id)  -- Each tag applied once per entity.
    index(taggable_type)
    index(taggable_id)
  }
}
```

**Design notes:**
- Polymorphic pattern avoids creating separate join tables for each entity type.
- `taggable_id` is not a database-level FK (cannot reference multiple tables). Referential integrity is enforced in application logic.
- The composite unique constraint prevents duplicate tag assignments.

### 17. compliance_activities

Append-only audit trail of significant actions within the GRC system. Every important state change (control tested, risk updated, policy approved, finding created) is logged for compliance and governance purposes.

```pseudo
table compliance_activities {
  id                  uuid primary_key default auto_generate
  organization_id     uuid nullable references organizations(id) on_delete cascade
                                                 -- From Auth / RBAC. For multi-tenant scoping.
  actor_id            uuid nullable references users(id) on_delete set_null
                                                 -- From Auth / RBAC. User who performed the action.
  activity_type       enum(
    control_created, control_updated, control_tested,
    risk_created, risk_updated, risk_closed,
    policy_created, policy_approved, policy_acknowledged,
    audit_started, audit_completed,
    finding_created, finding_remediated, finding_closed,
    evidence_collected
  ) not_null
  entity_type         enum(control, risk, policy, policy_version, audit, audit_finding, finding_remediation, evidence) not_null
                                                 -- The type of entity this activity relates to.
  entity_id           uuid not_null             -- The ID of the entity (polymorphic FK).
  summary             string not_null             -- Human-readable summary of the activity.
  details             json nullable               -- Additional structured data about the activity.
  created_at          timestamp default now

  indexes {
    index(organization_id)
    index(actor_id)
    index(activity_type)
    index(entity_type)
    index(entity_id)
    index(created_at)
  }
}
```

**Design notes:**
- Append-only — activities are never updated or deleted. This ensures a tamper-resistant audit trail.
- `entity_type` + `entity_id` is a polymorphic reference enabling the activity feed to cover all GRC entity types.
- `details` stores structured context (e.g., `{ "old_status": "draft", "new_status": "active" }`) for detailed audit trail reconstruction.
- `summary` provides a human-readable description for dashboards and reports.

## Relationships

```
frameworks           1 ──── * framework_requirements   (one framework has many requirements)
framework_requirements 1 ── * framework_requirements   (self-referencing hierarchy)
controls             1 ──── * control_requirements     (one control maps to many requirements)
framework_requirements 1 ── * control_requirements     (one requirement maps to many controls)
controls             1 ──── * control_tests            (one control has many test executions)
risks                1 ──── * risk_controls            (one risk mitigated by many controls)
controls             1 ──── * risk_controls            (one control mitigates many risks)
policies             1 ──── * policy_versions          (one policy has many versions)
policy_versions      1 ──── * policy_acknowledgments   (one version has many acknowledgments)
audits               1 ──── * audit_findings           (one audit has many findings)
audit_findings       1 ──── * finding_remediations     (one finding has many remediation actions)
controls             1 ──── * evidence                 (one control has many evidence artifacts)
audits               1 ──── * evidence                 (one audit has many evidence artifacts)
compliance_tags      1 ──── * compliance_taggables     (one tag applied to many entities)
users                1 ──── * controls                 (one user owns many controls)
users                1 ──── * risks                    (one user owns many risks)
users                1 ──── * policies                 (one user owns many policies)
users                1 ──── * audits                   (one user leads many audits)
```

## Best Practices

- **Multi-framework mapping**: Map controls to requirements across all applicable frameworks. When a control fails, all affected frameworks are automatically flagged — this is the primary value of the GRC model.
- **Continuous evidence collection**: Collect evidence regularly (not just before audits) using automated exports where possible. The `valid_from`/`valid_until` fields on evidence track coverage periods.
- **Risk scoring consistency**: Use the 1-5 likelihood × 1-5 impact matrix consistently. Store `risk_level` as a denormalized field for query performance but derive it from the score matrix in application logic.
- **Policy review cadence**: Use `review_frequency` and `next_review_date` on policies to drive automated reminders. Overdue policy reviews are a common audit finding.
- **Activity trail**: Log all significant GRC state changes to `compliance_activities`. This append-only trail is essential for demonstrating governance to auditors.
- **Soft deletes**: Consider implementing soft deletes for controls, risks, and policies rather than hard deletes, as historical data is critical for compliance. Use `status` fields (deprecated, closed, archived) rather than a generic `deleted_at` column.

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
