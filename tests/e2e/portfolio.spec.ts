import { expect, test } from "@playwright/test";

test.describe("homepage", () => {
  test("renders the hero and featured work", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Ala Arab \| Portfolio/);
    await expect(
      page.getByRole("heading", { level: 1, name: /Full-stack developer/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Selected work" }),
    ).toBeVisible();

    for (const name of [
      "Phren",
      "Halo Explorer",
      "OGrid",
      "m4l-builder",
      "LiveMCP",
      "Intranet ERP",
    ]) {
      await expect(
        page.getByRole("heading", { level: 3, name }),
      ).toBeVisible();
    }
  });

  test("navigates to the resume and back", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Resume" }).first().click();
    await expect(page).toHaveURL(/\/resume$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Ala Arab" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Back to portfolio" }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe("projects", () => {
  test("lists every project and opens a detail page", async ({ page }) => {
    await page.goto("/projects");

    await expect(
      page.getByRole("heading", { level: 1, name: "Selected projects." }),
    ).toBeVisible();

    const viewLinks = page.getByRole("link", { name: "View project" });
    await expect(viewLinks).toHaveCount(12);

    await viewLinks.first().click();
    await expect(page).toHaveURL(/\/projects\/phren$/);
  });

  test("renders a detail page from a direct deep link", async ({ page }) => {
    await page.goto("/projects/phren");

    await expect(page).toHaveTitle(/Phren \| Ala Arab/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Phren" }),
    ).toBeVisible();

    for (const section of ["Overview", "Work", "Result", "Stack"]) {
      await expect(
        page.getByRole("heading", { level: 2, name: section }),
      ).toBeVisible();
    }

    await expect(page.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/alaarab/phren",
    );
  });
});

test.describe("project accents", () => {
  test("featured cards carry each app's brand color", async ({ page }) => {
    await page.goto("/");

    const cardFor = (name: string) =>
      page.locator("article", {
        has: page.getByRole("heading", { level: 3, name }),
      });

    await expect(cardFor("Phren")).toHaveCSS("--project-accent", "#7c3aed");
    await expect(cardFor("OGrid")).toHaveCSS("--project-accent", "#217346");
    await expect(cardFor("m4l-builder")).toHaveCSS(
      "--project-accent",
      "#b45309",
    );
  });

  test("the detail page tints with the project accent", async ({ page }) => {
    await page.goto("/projects/ogrid");
    // The eyebrow resolves var(--project-accent) to OGrid's green.
    await expect(page.getByText("Open source", { exact: true })).toHaveCSS(
      "color",
      "rgb(33, 115, 70)",
    );
  });
});

test("an unknown route shows the 404 page", async ({ page }) => {
  await page.goto("/this-page-does-not-exist");

  await expect(
    page.getByRole("heading", { level: 1, name: "Nothing here." }),
  ).toBeVisible();
});

test.describe("prerendered metadata", () => {
  test("each route serves its own head without running JS", async ({
    request,
  }) => {
    const project = await request.get("/projects/phren");
    expect(project.status()).toBe(200);
    const html = await project.text();
    expect(html).toContain("<title>Phren — Ala Arab</title>");
    expect(html).toContain(
      'property="og:url" content="https://alaarab.com/projects/phren"',
    );
    expect(html).toContain(
      'rel="canonical" href="https://alaarab.com/projects/phren"',
    );
    expect(html).toContain(
      'property="og:image" content="https://alaarab.com/og/phren.png"',
    );
    expect(html).toContain('name="twitter:card" content="summary_large_image"');

    const home = await (await request.get("/")).text();
    expect(home).toContain(
      "<title>Ala Arab — Full-stack developer, Los Angeles</title>",
    );
    expect(home).toContain(
      'property="og:image" content="https://alaarab.com/og.png"',
    );
  });

  test("server-renders the body so content is in the raw HTML", async ({
    request,
  }) => {
    const home = await (await request.get("/")).text();
    // The shell is no longer an empty #root — the body is prerendered.
    expect(home).not.toContain('<div id="root"></div>');
    expect(home).toContain("Selected work");

    const phren = await (await request.get("/projects/phren")).text();
    expect(phren).toContain("Persistent memory for AI coding agents");
  });

  test("the Open Graph cards are real PNGs", async ({ request }) => {
    for (const path of ["/og.png", "/og/phren.png"]) {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain("image/png");
    }
  });

  test("unknown routes return a 404 status", async ({ request }) => {
    expect((await request.get("/no-such-page")).status()).toBe(404);
    expect((await request.get("/projects/not-a-real-project")).status()).toBe(
      404,
    );
  });
});
