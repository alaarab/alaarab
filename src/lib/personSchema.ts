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

function extractStartYear(years: string): string | undefined {
  const match = years.match(/\d{4}/);
  return match ? match[0] : undefined;
}
