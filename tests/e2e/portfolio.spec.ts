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
  // One author, one database: these steps build on each other.
  test.describe.configure({ mode: "serial" });

  const stamp = Date.now();
  const title = `An end-to-end post ${stamp}`;
  const slug = `an-end-to-end-post-${stamp}`;

  test("the index renders with its own metadata", async ({ page, request }) => {
    await page.goto("/blog");
    await expect(page).toHaveTitle(/Blog \| Ala Arab/);
    await expect(page.getByRole("heading", { level: 1, name: "Blog" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Subscribe to the feed" })).toHaveAttribute("href", "/blog/feed.xml");

    const html = await (await request.get("/blog")).text();
    expect(html).toContain("<title>Blog | Ala Arab</title>");
    expect(html).toContain('rel="canonical" href="https://alaarab.com/blog"');
    expect(html).toContain('type="application/atom+xml"');
  });

  test("the editor asks for sign-in and the API refuses without it", async ({ page, request }) => {
    await page.goto("/write");
    await expect(page.getByRole("link", { name: "Sign in with GitHub" })).toHaveAttribute("href", "/auth/github?next=%2Fwrite");

    const shell = await request.get("/write");
    expect(shell.headers()["x-robots-tag"]).toBe("noindex");
    expect(await shell.text()).toContain('<meta name="robots" content="noindex" />');

    expect((await request.get("/api/admin/posts")).status()).toBe(401);
    const write = await request.post("/api/admin/posts", {
      data: { title: "x", slug: "x", summary: "x", date: "2026-01-01", source: "x", draft: false },
    });
    expect(write.status()).toBe(401);
  });

  test("GitHub sign-in reports when it isn't configured", async ({ page }) => {
    await page.goto("/auth/github?next=/write");
    await expect(page).toHaveURL(/\/write\?error=config$/);
    await expect(page.getByRole("alert")).toContainText("isn't set up");
  });

  test("the author writes a draft that stays private, then publishes it", async ({ page, request }) => {
    await page.goto("/write");
    await page.evaluate(() => fetch("/auth/test-login", { method: "POST" }));
    await page.goto("/write");
    await expect(page.getByText("Signed in as test-author.")).toBeVisible();

    await page.getByRole("link", { name: "New post" }).click();
    await page.getByLabel("Title").fill(title);
    await expect(page.getByLabel("Slug")).toHaveValue(slug);
    await page.getByLabel("Summary").fill("A post written by the end-to-end tests.");
    await page.getByLabel("Post", { exact: true }).fill(
      "First paragraph with a [link](https://example.com) and `code`.\n\n## A heading\n\n- one\n- two",
    );
    await page.getByRole("button", { name: "Save draft" }).click();
    await expect(page.getByRole("status")).toContainText("Draft saved");
    await expect(page).toHaveURL(new RegExp(`/write/${slug}$`));

    // A draft is private.
    expect((await request.get(`/blog/${slug}`)).status()).toBe(404);
    expect(await (await request.get("/blog/feed.xml")).text()).not.toContain(slug);
    expect(await (await request.get("/blog")).text()).not.toContain(title);

    await page.getByRole("button", { name: "Preview" }).click();
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "A heading" })).toHaveAttribute("id", "a-heading");
    await page.getByRole("button", { name: "Edit" }).click();

    await page.getByRole("button", { name: "Publish" }).click();
    await expect(page.getByRole("status")).toContainText("Published");

    const res = await request.get(`/blog/${slug}`);
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain(`<title>${title} | Ala Arab</title>`);
    expect(html).toContain('property="og:type" content="article"');
    expect(html).toContain(`rel="canonical" href="https://alaarab.com/blog/${slug}"`);
    expect(html).toContain('"@type":"BlogPosting"');
    expect(html).toContain("A post written by the end-to-end tests.");

    expect(await (await request.get("/blog")).text()).toContain(title);
    expect(await (await request.get("/blog/feed.xml")).text()).toContain(`https://alaarab.com/blog/${slug}`);
    expect(await (await request.get("/sitemap.xml")).text()).toContain(`https://alaarab.com/blog/${slug}`);

    await page.goto(`/blog/${slug}`);
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
    await expect(page.getByRole("link", { name: "link", exact: true })).toHaveAttribute("href", "https://example.com");
  });

  test("writes are refused from other origins, and published slugs are fixed", async ({ page }) => {
    await page.goto("/write");
    await page.evaluate(() => fetch("/auth/test-login", { method: "POST" }));
    const post = await (await page.request.get(`/api/admin/posts/${slug}`)).json();

    const foreign = await page.request.put(`/api/admin/posts/${slug}`, {
      headers: { origin: "https://evil.example" },
      data: post,
    });
    expect(foreign.status()).toBe(403);

    const renamed = await page.request.put(`/api/admin/posts/${slug}`, {
      headers: { origin: "http://localhost:3210" },
      data: { ...post, slug: `${slug}-renamed` },
    });
    expect(renamed.status()).toBe(409);
  });

  test("unpublishing hides the post and deleting removes it", async ({ page, request }) => {
    await page.goto("/write");
    await page.evaluate(() => fetch("/auth/test-login", { method: "POST" }));
    await page.goto(`/write/${slug}`);
    await page.getByRole("button", { name: "Unpublish" }).click();
    await expect(page.getByRole("status")).toContainText("Unpublished");
    expect((await request.get(`/blog/${slug}`)).status()).toBe(404);

    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: "Delete" }).click();
    await expect(page).toHaveURL(/\/write$/);
    expect((await page.request.get(`/api/admin/posts/${slug}`)).status()).toBe(404);

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page.getByRole("link", { name: "Sign in with GitHub" })).toBeVisible();
  });

  test("an unknown post shows the 404 page", async ({ page }) => {
    await page.goto("/blog/not-a-real-post");
    await expect(page.getByRole("heading", { level: 1, name: "Nothing here." })).toBeVisible();
  });
});
