import type { Organization } from "./organization.js";
import type { OpportunityWithOrganization } from "./opportunity.js";
import type { EventWithOrganization } from "./event.js";

export interface OrganizationDetail extends Organization {
  opportunities: OpportunityWithOrganization[];
  events: EventWithOrganization[];
}
