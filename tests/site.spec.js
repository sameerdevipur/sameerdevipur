import { expect, test } from "@playwright/test";

test("primary navigation, theme, and consent work without early analytics", async ({ page }) => {
  const analyticsRequests = [];
  page.on("request", (request) => {
    if (/google-analytics|googletagmanager|doubleclick/.test(request.url())) {
      analyticsRequests.push(request.url());
    }
  });

  await page.goto("/");
  await expect(page.locator("nav[aria-label='Primary navigation']")).toBeVisible();
  await expect(page.locator("#analytics-consent")).toBeVisible();
  expect(analyticsRequests).toEqual([]);

  const themeToggle = page.locator("#theme-toggle");
  await themeToggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(themeToggle).toHaveAttribute("aria-pressed", "true");
  await themeToggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await page.getByRole("button", { name: "Decline analytics" }).click();
  await expect(page.locator("#analytics-consent")).toBeHidden();
  expect(analyticsRequests).toEqual([]);
});

test("disclosures expose state and content accessibly", async ({ page }) => {
  await page.goto("/games.html");
  const firstButton = page.locator(".read-more-btn").first();
  const panelId = await firstButton.getAttribute("aria-controls");

  await expect(firstButton).toHaveAttribute("aria-expanded", "false");
  await firstButton.click();
  await expect(firstButton).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(`#${panelId}`)).toBeVisible();
  await firstButton.click();
  await expect(page.locator(`#${panelId}`)).toBeHidden();
});

test("pages have no horizontal overflow at the active viewport", async ({ page }) => {
  for (const path of ["/", "/work.html", "/blog.html", "/games.html", "/travel.html"]) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow, `${path} should not overflow horizontally`).toBe(false);
  }
});
