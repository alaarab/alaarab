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

    for (const name of ["Portfolio Refresh", "Phren", "OGrid", "m4l-builder"]) {
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
    await expect(viewLinks).toHaveCount(7);

    await viewLinks.first().click();
    await expect(page).toHaveURL(/\/projects\/portfolio-refresh$/);
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
