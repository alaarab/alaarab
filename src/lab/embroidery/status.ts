import { projects } from "../../data/siteContent";
import type { Project } from "../../types";

/**
 * Active means Ala is still building it: the status says "Active" or
 * "In active development", or its years run to "present". Everything else
 * (Shipped, Stable, the ADM-era systems, client and school work) is "made".
 */
export const isActive = (p: Project) => p.status === "Active" || p.status === "In active development" || p.year.includes("present");

/** Importance, not date: featured projects first in content order, then the rest. */
const byImportance = (list: Project[]) => [...list.filter((p) => p.featured), ...list.filter((p) => !p.featured)];

const ADM_ERA = ["intranet-erp", "emv", "equipment-tracker"];
const CLIENT_AND_SCHOOL = ["retrofit-program-data-tools", "garden-sensor-network"];
const bySlugs = (slugs: string[]) => slugs.map((s) => projects.find((p) => p.slug === s)).filter((p): p is Project => Boolean(p) && !isActive(p!));

export const activeProjects = byImportance(projects.filter(isActive));

const grouped = [...ADM_ERA, ...CLIENT_AND_SCHOOL];
/** Things he has made: the rest by importance, then the ADM-era work, then client and school work. */
export const madeProjects = byImportance(projects.filter((p) => !isActive(p) && !grouped.includes(p.slug)));
export const admEra = bySlugs(ADM_ERA);
export const clientAndSchool = bySlugs(CLIENT_AND_SCHOOL);

/** Reading order across project pages. */
export const readingOrder = [...activeProjects, ...madeProjects, ...admEra, ...clientAndSchool];
