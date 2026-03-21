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

Domains reference tables from other domains rather than duplicating them. For example, most domains depend on [Auth / RBAC](./schemas/auth-rbac) for user and role tables.

- **Within a domain** — Full foreign keys/references between all tables
- **Across domains** — Each domain's README lists its dependencies with links
- **Self-contained option** — If you don't need a dependency, replace the reference with your own table

See each domain's **Dependencies** section for details.

## Domains

### Core / Foundational

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Auth / RBAC](./schemas/auth-rbac)                           | 65     | 🔲     |
| [Notifications System](./schemas/notifications-system)       | 85     | 🔲     |
| [File Management / Document Storage](./schemas/file-management-document-storage) | 90 | 🔲 |
| [Multi-language / i18n](./schemas/multi-language-i18n)       | 107    | 🔲     |
| [Analytics / Metrics](./schemas/analytics-metrics)           | 187    | 🔲     |
| [Content Moderation](./schemas/content-moderation)           | 111    | 🔲     |

### Commerce & Marketplace

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [E-commerce](./schemas/e-commerce)                           | 59     | 🔲     |
| [Marketplace (Multi-vendor)](./schemas/marketplace)          | 160    | 🔲     |
| [Auction](./schemas/auction)                                 | 92     | 🔲     |
| [Subscription / Membership](./schemas/subscription-membership) | 90   | 🔲     |
| [Affiliate / Referral Program](./schemas/affiliate-referral-program) | 116 | 🔲 |
| [Loyalty / Rewards Program](./schemas/loyalty-rewards-program) | 118  | 🔲     |

### Social & Communication

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Social Media](./schemas/social-media)                       | 65     | 🔲     |
| [Messaging / Chat](./schemas/messaging-chat)                 | 52     | 🔲     |
| [Video Conferencing](./schemas/video-conferencing)           | 102    | 🔲     |
| [Email / Campaign Marketing](./schemas/email-campaign-marketing) | 110 | 🔲 |

### Content & Media

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [CMS / Blog](./schemas/cms-blog)                             | 155    | 🔲     |
| [Media Streaming](./schemas/media-streaming)                 | 115    | 🔲     |
| [Podcast Platform](./schemas/podcast-platform)               | 97     | 🔲     |
| [Digital Asset Management (DAM)](./schemas/digital-asset-management) | 122 | 🔲 |
| [Recipe / Cooking](./schemas/recipe-cooking)                 | 91     | 🔲     |

### Business & Enterprise

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [SaaS / Multi-tenant](./schemas/saas-multi-tenant)           | 53     | 🔲     |
| [CRM](./schemas/crm)                                         | 105    | 🔲     |
| [Project Management](./schemas/project-management)           | 185    | 🔲     |
| [HR / Payroll](./schemas/hr-payroll)                         | 117    | 🔲     |
| [Helpdesk / Customer Support](./schemas/helpdesk-customer-support) | 147 | 🔲 |
| [Compliance / GRC](./schemas/compliance-grc)                 | 130    | 🔲     |

### Booking & Scheduling

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Booking / Scheduling](./schemas/booking-scheduling)         | 101    | 🔲     |
| [Event Management / Ticketing](./schemas/event-management-ticketing) | 99 | 🔲 |

### Healthcare & Wellness

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Healthcare / Medical](./schemas/healthcare-medical)         | 126    | 🔲     |
| [Fitness / Wellness](./schemas/fitness-wellness)             | 86     | 🔲     |
| [Pet / Veterinary](./schemas/pet-veterinary)                 | 105    | 🔲     |

### Finance & Legal

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Finance / Banking](./schemas/finance-banking)               | 92     | 🔲     |
| [Insurance](./schemas/insurance)                             | 97     | 🔲     |
| [Legal / Law Firm](./schemas/legal-law-firm)                 | 104    | 🔲     |
| [Fundraising / Crowdfunding](./schemas/fundraising-crowdfunding) | 98 | 🔲     |
| [Nonprofit Management](./schemas/nonprofit-management)       | 123    | 🔲     |

### Real Estate & Property

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Real Estate](./schemas/real-estate)                         | 180    | 🔲     |
| [Space / Facility Reservation](./schemas/space-facility-reservation) | 101 | 🔲 |

### Education & Research

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Education / LMS](./schemas/education-lms)                   | 93     | 🔲     |
| [Library Management](./schemas/library-management)           | 114    | 🔲     |
| [Academic Research Management](./schemas/academic-research)  | 125    | 🔲     |

### Food & Hospitality

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Restaurant / Food Delivery](./schemas/restaurant-food-delivery) | 192 | 🔲   |
| [Travel / Airlines / Hotels](./schemas/travel-airlines-hotels) | 102  | 🔲     |

### Employment

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Job Board / Recruitment](./schemas/job-board-recruitment)   | 90     | 🔲     |

### Logistics & Supply Chain

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Inventory / Warehouse Management](./schemas/inventory-warehouse) | 144 | 🔲  |
| [Logistics / Shipping](./schemas/logistics-shipping)         | 188    | 🔲     |
| [Supply Chain Management](./schemas/supply-chain)            | 125    | 🔲     |
| [Manufacturing / MES](./schemas/manufacturing-mes)           | 126    | 🔲     |

### IoT & Technology

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [IoT / Device Management](./schemas/iot-device-management)   | 99     | 🔲     |
| [Gaming / Leaderboards](./schemas/gaming-leaderboards)       | 107    | 🔲     |

### Government & Utilities

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Government / Civic Services](./schemas/government-civic)    | 122    | 🔲     |
| [Energy / Utilities](./schemas/energy-utilities)             | 104    | 🔲     |

### Agriculture & Environment

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [Agriculture / Farm Management](./schemas/agriculture-farm-management) | 116 | 🔲 |

### Events & Lifestyle

| Domain                                                       | Tables | Status |
| ------------------------------------------------------------ | ------ | ------ |
| [League / Competition Management](./schemas/league-competition-management) | 121 | 🔲 |
| [Event Planning](./schemas/event-planning)                   | 129    | 🔲     |
| [Voting / Polling / Surveys](./schemas/voting-polling-surveys) | 97   | 🔲     |

**Total: 57 domains, 6,432 tables across 7 formats**

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
│   ├── README.md              # Conceptual model, tables, relationships, best practices
│   ├── convex/
│   │   └── schema.ts
│   ├── sql/
│   │   └── schema.sql
│   ├── prisma/
│   │   └── schema.prisma
│   ├── mongodb/
│   │   └── schema.js
│   ├── drizzle/
│   │   └── schema.ts
│   ├── spacetimedb/
│   │   └── lib.rs
│   └── firebase/
│       └── schema.js
└── ...
```

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

Ways to contribute:

- Implement a schema in a format that's missing (pick any 🔲 and make it ✅)
- Add a new domain
- Improve existing schemas with better indexes, constraints, or documentation
- Fix bugs or inconsistencies

## License

MIT License — see [LICENSE](./LICENSE) for details.
