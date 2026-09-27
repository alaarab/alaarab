import { expect, test } from "@playwright/test";

test.describe("homepage", () => {
  test("leads with who Ala is, then the work", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Ala Arab \| Portfolio/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Ala Arab" }),
    ).toBeVisible();

    for (const section of [
      "About",
      "Experience",
      "Education",
      "Active projects",
      "Things I've made",
    ]) {
      await expect(
        page.getByRole("heading", { level: 2, name: section }),
      ).toBeVisible();
    }

    for (const name of ["Phren", "m4l-builder", "Mina", "Intranet ERP"]) {
      await expect(page.getByRole("link", { name, exact: true }).first()).toBeVisible();
    }
  });

  test("opens a project from the home page", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Phren", exact: true }).first().click();
    await expect(page).toHaveURL(/\/projects\/phren$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Phren" }),
    ).toBeVisible();
  });
});

test.describe("projects", () => {
  test("lists every project and opens a detail page", async ({ page }) => {
    await page.goto("/projects");

    await expect(
      page.getByRole("heading", { level: 1, name: "Selected projects." }),
    ).toBeVisible();

    const viewLinks = page.getByRole("link", { name: "View project" });
    await expect(viewLinks).toHaveCount(15);

    await viewLinks.first().click();
    await expect(page).toHaveURL(/\/projects\/phren$/);
  });

  test("renders a detail page from a direct deep link", async ({ page }) => {
    await page.goto("/projects/phren");

    await expect(page).toHaveTitle(/Phren \| Ala Arab/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Phren" }),
    ).toBeVisible();

    for (const section of ["The problem", "What I built", "Where it is now"]) {
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
    expect(html).toContain("<title>Phren | Ala Arab</title>");
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
      "<title>Ala Arab | Full-stack developer, Los Angeles</title>",
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
    expect(home).toContain("Active projects");

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

test.describe("blog", () => {
  test("the index renders with its own metadata", async ({ page, request }) => {
    await page.goto("/blog");
    await expect(page).toHaveTitle(/Blog \| Ala Arab/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Blog" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Subscribe to the feed" }),
    ).toHaveAttribute("href", "/blog/feed.xml");

    const html = await (await request.get("/blog")).text();
    expect(html).toContain("<title>Blog | Ala Arab</title>");
    expect(html).toContain('rel="canonical" href="https://alaarab.com/blog"');
    expect(html).toContain('type="application/atom+xml"');
  });

  test("drafts stay out of the index, feed, sitemap, and routes", async ({
    page,
    request,
  }) => {
    await page.goto("/blog");
    await expect(page.getByText("Sample post")).toHaveCount(0);

    expect((await request.get("/blog/sample-post")).status()).toBe(404);

    const feed = await request.get("/blog/feed.xml");
    expect(feed.status()).toBe(200);
    expect(feed.headers()["content-type"]).toContain("application/atom+xml");
    expect(await feed.text()).not.toContain("sample-post");

    expect(await (await request.get("/sitemap.xml")).text()).not.toContain(
      "sample-post",
    );
  });

  test("a draft can be previewed with ?preview", async ({ page }) => {
    await page.goto("/blog/sample-post?preview");

    await expect(page.getByRole("note")).toContainText("Draft preview");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Sample post: what a post can hold",
      }),
    ).toBeVisible();
    await expect(page).toHaveTitle(/^Draft: Sample post/);
    await expect(
      page.getByRole("heading", { level: 2, name: "A section heading" }),
    ).toHaveAttribute("id", "a-section-heading");
    await expect(page.getByRole("link", { name: "Phren" })).toHaveAttribute(
      "href",
      "/projects/phren",
    );
  });

  test("an unknown post shows the 404 page", async ({ page }) => {
    await page.goto("/blog/not-a-real-post");
    await expect(
      page.getByRole("heading", { level: 1, name: "Nothing here." }),
    ).toBeVisible();
  });
});
