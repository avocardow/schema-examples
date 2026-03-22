# Schema Examples

A collection of production-ready database schema examples across multiple formats. Common patterns for e-commerce, SaaS, social media, healthcare, and 50+ more domains — with explanations and best practices.

**Copy. Learn. Contribute. Ship.**

## Formats

Each domain includes schemas in all of the following formats:

| Format                                                 | Language   | Type                                                |
| ------------------------------------------------------ | ---------- | --------------------------------------------------- |
| [Convex](https://convex.dev)                           | TypeScript | Real-time document DB                               |
| [SQL (PostgreSQL)](https://www.postgresql.org)         | SQL        | Traditional relational (with Supabase/SQLite notes) |
| [Prisma](https://www.prisma.io)                        | Prisma DSL | TypeScript ORM                                      |
| [MongoDB](https://mongoosejs.com)                      | JavaScript | Document DB (Mongoose)                              |
| [Drizzle](https://orm.drizzle.team)                    | TypeScript | Type-safe SQL ORM                                   |
| [SpacetimeDB](https://spacetimedb.com)                 | Rust       | Real-time relational                                |
| [Firebase](https://firebase.google.com/docs/firestore) | JavaScript | Firestore document DB                               |

## How Dependencies Work

Domains reference tables from other domains rather than duplicating them. For example, most domains depend on [Auth / RBAC](./schemas/auth-rbac) for user identity and authorization.

- **Within a domain** — Full foreign keys/references between all tables
- **Across domains** — Each domain's README lists its dependencies with links
- **Self-contained option** — If you don't need a dependency, replace the reference with your own table

See each domain's **Dependencies** section for details.

## Domains

### Core / Foundational

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Auth / RBAC](./schemas/auth-rbac)                           | 26     | ✅     |
| [Notifications System](./schemas/notifications-system)       | 20     | ✅     |
| [File Management / Document Storage](./schemas/file-management-document-storage) | — | 🔲 |
| [Multi-language / i18n](./schemas/multi-language-i18n)       | —      | 🔲     |
| [Analytics / Metrics](./schemas/analytics-metrics)           | —      | 🔲     |
| [Content Moderation](./schemas/content-moderation)           | —      | 🔲     |

### Commerce & Marketplace

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [E-commerce](./schemas/e-commerce)                           | —      | 🔲     |
| [Marketplace (Multi-vendor)](./schemas/marketplace)          | —      | 🔲     |
| [Auction](./schemas/auction)                                 | —      | 🔲     |
| [Subscription / Membership](./schemas/subscription-membership) | —    | 🔲     |
| [Affiliate / Referral Program](./schemas/affiliate-referral-program) | — | 🔲 |
| [Loyalty / Rewards Program](./schemas/loyalty-rewards-program) | —    | 🔲     |

### Social & Communication

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Social Media](./schemas/social-media)                       | —      | 🔲     |
| [Messaging / Chat](./schemas/messaging-chat)                 | —      | 🔲     |
| [Video Conferencing](./schemas/video-conferencing)           | —      | 🔲     |
| [Email / Campaign Marketing](./schemas/email-campaign-marketing) | —  | 🔲     |

### Content & Media

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [CMS / Blog](./schemas/cms-blog)                             | —      | 🔲     |
| [Media Streaming](./schemas/media-streaming)                 | —      | 🔲     |
| [Podcast Platform](./schemas/podcast-platform)               | —      | 🔲     |
| [Digital Asset Management (DAM)](./schemas/digital-asset-management) | — | 🔲 |
| [Recipe / Cooking](./schemas/recipe-cooking)                 | —      | 🔲     |

### Business & Enterprise

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [SaaS / Multi-tenant](./schemas/saas-multi-tenant)           | —      | 🔲     |
| [CRM](./schemas/crm)                                         | —      | 🔲     |
| [Project Management](./schemas/project-management)           | —      | 🔲     |
| [HR / Payroll](./schemas/hr-payroll)                         | —      | 🔲     |
| [Helpdesk / Customer Support](./schemas/helpdesk-customer-support) | — | 🔲   |
| [Compliance / GRC](./schemas/compliance-grc)                 | —      | 🔲     |

### Booking & Scheduling

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Booking / Scheduling](./schemas/booking-scheduling)         | —      | 🔲     |
| [Event Management / Ticketing](./schemas/event-management-ticketing) | — | 🔲 |

### Healthcare & Wellness

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Healthcare / Medical](./schemas/healthcare-medical)         | —      | 🔲     |
| [Fitness / Wellness](./schemas/fitness-wellness)             | —      | 🔲     |
| [Pet / Veterinary](./schemas/pet-veterinary)                 | —      | 🔲     |

### Finance & Legal

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Finance / Banking](./schemas/finance-banking)               | —      | 🔲     |
| [Insurance](./schemas/insurance)                             | —      | 🔲     |
| [Legal / Law Firm](./schemas/legal-law-firm)                 | —      | 🔲     |
| [Fundraising / Crowdfunding](./schemas/fundraising-crowdfunding) | —  | 🔲     |
| [Nonprofit Management](./schemas/nonprofit-management)       | —      | 🔲     |

### Real Estate & Property

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Real Estate](./schemas/real-estate)                         | —      | 🔲     |
| [Space / Facility Reservation](./schemas/space-facility-reservation) | — | 🔲 |

### Education & Research

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Education / LMS](./schemas/education-lms)                   | —      | 🔲     |
| [Library Management](./schemas/library-management)           | —      | 🔲     |
| [Academic Research Management](./schemas/academic-research)  | —      | 🔲     |

### Food & Hospitality

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Restaurant / Food Delivery](./schemas/restaurant-food-delivery) | —  | 🔲     |
| [Travel / Airlines / Hotels](./schemas/travel-airlines-hotels) | —    | 🔲     |

### Employment

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Job Board / Recruitment](./schemas/job-board-recruitment)   | —      | 🔲     |

### Logistics & Supply Chain

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Inventory / Warehouse Management](./schemas/inventory-warehouse) | — | 🔲     |
| [Logistics / Shipping](./schemas/logistics-shipping)         | —      | 🔲     |
| [Supply Chain Management](./schemas/supply-chain)            | —      | 🔲     |
| [Manufacturing / MES](./schemas/manufacturing-mes)           | —      | 🔲     |

### IoT & Technology

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [IoT / Device Management](./schemas/iot-device-management)   | —      | 🔲     |
| [Gaming / Leaderboards](./schemas/gaming-leaderboards)       | —      | 🔲     |

### Government & Utilities

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Government / Civic Services](./schemas/government-civic)    | —      | 🔲     |
| [Energy / Utilities](./schemas/energy-utilities)             | —      | 🔲     |

### Agriculture & Environment

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Agriculture / Farm Management](./schemas/agriculture-farm-management) | — | 🔲 |

### Events & Lifestyle

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [League / Competition Management](./schemas/league-competition-management) | — | 🔲 |
| [Event Planning](./schemas/event-planning)                   | —      | 🔲     |
| [Voting / Polling / Surveys](./schemas/voting-polling-surveys) | —    | 🔲     |

**57 domains — 2 complete, 55 in progress**

## How to Use

1. **Browse** — Find the domain that matches your project
2. **Read** — Check the README for the conceptual model and best practices
3. **Copy** — Grab the schema in your format of choice
4. **Customize** — Adapt it to your specific requirements
5. **Contribute** — (Optional) Share your knowledge and expand the examples

## Project Structure

```
schemas/
├── {domain}/
│   ├── README.md              # Pseudo code (source of truth), relationships, best practices
│   ├── RESEARCH.md            # Local research notes (gitignored)
│   ├── convex/
│   │   ├── users.ts
│   │   ├── sessions.ts
│   │   └── ...
│   ├── sql/
│   │   ├── users.sql
│   │   ├── sessions.sql
│   │   └── ...
│   ├── prisma/
│   │   ├── users.prisma
│   │   ├── sessions.prisma
│   │   └── ...
│   ├── mongodb/
│   │   ├── users.js
│   │   ├── sessions.js
│   │   └── ...
│   ├── drizzle/
│   │   ├── users.ts
│   │   ├── sessions.ts
│   │   └── ...
│   ├── spacetimedb/
│   │   ├── users.rs
│   │   ├── sessions.rs
│   │   └── ...
│   └── firebase/
│       ├── users.js
│       ├── sessions.js
│       └── ...
└── ...
```

**One file per table.** This makes it easy to copy exactly what you need and supports a future CLI tool.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full process, format conventions, and guidelines.

The short version:
- The domain README's pseudo code is the **source of truth** for all format implementations
- Follow the workflow: research → pseudo code → implement → audit
- Each format has specific conventions — check CONTRIBUTING.md before implementing

## License

MIT License — see [LICENSE](./LICENSE) for details.
