-- contact_list_members: Membership records linking contacts to mailing lists.
-- See README.md for full design rationale.

CREATE TYPE contact_list_member_status AS ENUM ('subscribed', 'unsubscribed', 'unconfirmed');

CREATE TABLE contact_list_members (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id      UUID NOT NULL,
    list_id         UUID NOT NULL,
    status          contact_list_member_status NOT NULL DEFAULT 'subscribed',
    subscribed_at   TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (contact_id, list_id)
);

CREATE INDEX idx_contact_list_members_list_id_status ON contact_list_members (list_id, status);

-- Forward FK: contact_lists is defined in contact_lists.sql (loaded after this file).
ALTER TABLE contact_list_members ADD CONSTRAINT fk_contact_list_members_list_id
  FOREIGN KEY (list_id) REFERENCES contact_lists(id) ON DELETE CASCADE;

-- Forward FK: contacts is defined in contacts.sql (loaded after this file).
ALTER TABLE contact_list_members ADD CONSTRAINT fk_contact_list_members_contact_id
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE;
