// campaigns: Email campaigns with scheduling, A/B testing, and delivery tracking.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum CampaignStatus {
    // type: String
    Draft,
    Scheduled,
    Sending,
    Paused,
    Cancelled,
    Sent,
}

#[derive(SpacetimeType, Clone)]
pub enum CampaignType {
    // type: String
    Regular,
    AbTest,
}

#[derive(SpacetimeType, Clone)]
pub enum AbTestMetric {
    // type: String
    OpenRate,
    ClickRate,
}

#[spacetimedb::table(name = campaigns, public)]
pub struct Campaign {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,
    pub subject: Option<String>,
    pub from_name: Option<String>,
    pub from_email: Option<String>,
    pub reply_to: Option<String>,

    #[index(btree)]
    pub template_id: Option<String>, // UUID, FK → templates.id (set null)

    pub html_body: Option<String>,
    pub text_body: Option<String>,

    #[index(btree)]
    pub status: String, // CampaignStatus enum

    #[index(btree)]
    pub campaign_type: String, // CampaignType enum

    #[index(btree)]
    pub scheduled_at: Option<Timestamp>,

    pub sent_at: Option<Timestamp>,

    pub ab_test_winner_id: Option<String>, // UUID, loose self-ref
    pub ab_test_sample_pct: Option<i32>,
    pub ab_test_metric: Option<String>, // AbTestMetric enum

    pub created_by: Option<String>, // UUID, FK → users.id (set null)

    #[index(btree)]
    pub created_at: Timestamp,

    pub updated_at: Timestamp,
}
