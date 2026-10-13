import { educationItems, experienceItems, siteMeta } from "../data/siteContent";
import type { EducationItem, ExperienceItem, SiteMeta } from "../types";

interface SchemaInput {
  siteMeta: SiteMeta;
  experienceItems: ExperienceItem[];
  educationItems: EducationItem[];
}

export function buildPersonSchema({
  siteMeta,
  experienceItems,
  educationItems,
}: SchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteMeta.name,
    jobTitle: "Full-stack developer",
    description: siteMeta.summary,
    email: siteMeta.email,
    url: "https://alaarab.com/",
    sameAs: [siteMeta.linkedinHref, "https://github.com/alaarab"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Los Angeles",
      addressRegion: "CA",
      addressCountry: "US",
    },
    worksFor: experienceItems[0]
      ? { "@type": "Organization", name: experienceItems[0].company }
      : undefined,
    alumniOf: educationItems.map((item) => ({
      "@type": "EducationalOrganization",
      name: item.school,
    })),
    hasOccupation: experienceItems.map((item) => ({
      "@type": "EmployeeRole",
      roleName: item.role,
      startDate: extractStartYear(item.years),
      employmentType: "FULL_TIME",
      employer: { "@type": "Organization", name: item.company },
      description: item.summary,
    })),
  };
}

/** The site owner's Person schema as a JSON-LD script body, for home and resume. */
export const personJsonLd = JSON.stringify(
  buildPersonSchema({ siteMeta, experienceItems, educationItems }),
).replace(/</g, "\\u003c");

function extractStartYear(years: string): string | undefined {
  const match = years.match(/\d{4}/);
  return match ? match[0] : undefined;
}
