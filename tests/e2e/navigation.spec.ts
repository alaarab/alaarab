import { expect, test } from "@playwright/test";
import { projects } from "../../src/data/siteContent";
import { allRoutes, SITE_ORIGIN } from "../../src/lib/routeMeta";
import { externalLinks } from "../../src/site/util";

const routes = allRoutes();

test("every public route uses Embroidery, hydrates, and keeps its canonical metadata", async ({ page, request }) => {
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && /hydrat|react|mismatch/i.test(message.text())) errors.push(message.text());
  });
  const destinations = new Set<string>();
  for (const route of routes) {
    const response = await page.goto(route.path);
    expect(response?.status(), route.path).toBe(200);
    await expect(page).toHaveTitle(route.title);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    const root = page.locator("#root > div");
    await expect(root).toHaveCSS("color", "rgb(59, 43, 31)");
    await expect(root).toHaveCSS("color-scheme", "light");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE_ORIGIN}${route.path}`);
    const html = await response!.text();
    expect(html).toContain(`<title>${route.title}</title>`);
    for (const href of await page.locator("a").evaluateAll((links) => links.map((a) => a.getAttribute("href")!))) {
      if (href.startsWith("/")) destinations.add(href.split("#")[0]);
      if (href.startsWith("#")) await expect(page.locator(href)).toHaveCount(1);
    }
    const project = projects.find((p) => route.path === `/projects/${p.slug}`);
    if (project) {
      for (const link of externalLinks(project)) {
        await expect(page.getByRole("link", { name: link.label, exact: true })).toHaveAttribute("href", link.href);
      }
      await expect(page.getByRole("link", { name: "Project page", exact: true })).toHaveCount(0);
    }
  }
  for (const destination of destinations) expect((await request.get(destination)).status(), destination).toBe(200);
  expect(errors).toEqual([]);
});

test("mobile navigation completes the home, resume, now, index and project round trip", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("navigation", { name: "Contact" }).getByRole("link", { name: "Resume", exact: true }).click();
  await expect(page).toHaveTitle("Resume | Ala Arab");
  const nav = page.getByRole("navigation", { name: "Site", exact: true });
  await expect(nav.getByRole("link", { name: "Resume" })).toHaveAttribute("aria-current", "page");
  await nav.getByRole("link", { name: "Now", exact: true }).click();
  await expect(page).toHaveTitle("Now | Ala Arab");
  await nav.getByRole("link", { name: "All work" }).click();
  await expect(page).toHaveTitle("Projects | Ala Arab");
  await page.getByRole("link", { name: "Phren", exact: true }).click();
  await expect(page).toHaveTitle("Phren | Ala Arab");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", `${SITE_ORIGIN}/og/phren.png`);
  await nav.getByRole("link", { name: "All work" }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", `${SITE_ORIGIN}/og.png`);
  await nav.getByRole("link", { name: "Ala Arab" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page).toHaveTitle(routes[0].title);
  await page.goBack();
  await expect(page).toHaveTitle("Projects | Ala Arab");
});

for (const width of [320, 390]) {
  test(`all routes fit ${width}px, including actual navigation and link bounds`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 844 });
    for (const path of [...routes.map((r) => r.path), "/missing-page", "/projects/missing-project"]) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("#root > div")).toHaveCSS("color-scheme", "light");
      const overflow = await page.evaluate(() => {
        const width = document.documentElement.clientWidth;
        const clipped = [...document.querySelectorAll("main a, nav a, footer a, h1, h2:not([class*=srOnly]), h3, img")]
          .filter((element) => {
            const bounds = element.getBoundingClientRect();
            return bounds.width > 0 && (bounds.left < -1 || bounds.right > width + 1);
          }).map((element) => element.textContent?.trim() || element.getAttribute("src"));
        return { document: document.documentElement.scrollWidth - width, clipped };
      });
      expect(overflow, path).toEqual({ document: 0, clipped: [] });
      for (const link of await page.locator("nav a").all()) {
        const box = await link.boundingBox();
        expect(box?.height, `${path}: ${await link.textContent()}`).toBeGreaterThanOrEqual(44);
      }
    }
  });
}

test("aliases redirect to canonical routes and all unknown pages share the Embroidery 404", async ({ page, request }) => {
  for (const path of ["/", "/projects", "/resume", "/now", "/projects/phren"]) {
    const aliases = path === "/" ? ["/index.html"] : [`${path}/`, `${path}/index.html`];
    for (const alias of aliases) {
      const response = await request.get(`${alias}?from=legacy`, { maxRedirects: 0 });
      expect(response.status(), alias).toBe(308);
      expect(response.headers().location).toBe(`${path}?from=legacy`);
      const resolved = await request.get(alias);
      expect(resolved.status()).toBe(200);
    }
  }
  for (const path of ["/not-a-page", "/projects/not-a-project", "/lab/embroidery", "/removed/index.html"]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
    await expect(page.getByRole("heading", { name: "Nothing here.", exact: true })).toBeVisible();
    await expect(page).toHaveTitle("Not found | Ala Arab");
    await expect(page.locator("#root > div")).toHaveCSS("color-scheme", "light");
  }
  await page.goto("/");
  await page.evaluate(() => {
    history.pushState({}, "", "/projects/not-a-project");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(page.getByRole("heading", { name: "Nothing here.", exact: true })).toBeVisible();
});

test("resume still prints its content with navigation and controls hidden", async ({ page }) => {
  await page.goto("/resume");
  await expect(page.getByRole("button", { name: "Print or save as PDF" })).toBeVisible();
  await page.emulateMedia({ media: "print" });
  await expect(page.getByRole("button", { name: "Print or save as PDF" })).toBeHidden();
  await expect(page.getByRole("navigation", { name: "Site", exact: true })).toBeHidden();
  await expect(page.getByRole("heading", { name: "Experience", exact: true })).toBeVisible();
  await expect(page.locator("#root > div")).toHaveCSS("background-color", "rgb(255, 255, 255)");
});
