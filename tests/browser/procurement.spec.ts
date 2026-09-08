import { expect, test } from "@playwright/test";

test("China comparison needs delivery charges, handles losses, and preserves the existing budget", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Parts & costs", exact: true }).click();
  await expect(page.getByRole("region", { name: "US purchasing and printing" })).toBeVisible();
  await page.getByText("Compare China delivered cost", { exact: true }).click();
  const result = page.getByRole("status");
  await expect(result).toContainText("Charges pending");
  await expect(result).toContainText("$5.84");
  await expect(result).toContainText("$266.03");

  await page.getByLabel("Other delivered charges (USD)").fill("50");
  await expect(result).toContainText("$55.84");
  await expect(result).toContainText("$284.00 lower (83.6%)");
  await page.getByLabel("China goods (CNY)").fill("70");
  await expect(result).toContainText("$60.43");
  await page.getByLabel("Other delivered charges (USD)").fill("400");
  await expect(result).toContainText("$70.59 higher");
  await page.getByLabel("CNY per USD").fill("0");
  await expect(result).toContainText("positive exchange rate");
  await expect(result).not.toContainText("Infinity");
  await expect(page.getByTestId("bom-total")).toContainText("$689.75");
  await page.getByRole("checkbox", { name: "Include optional perception" }).check();
  await expect(page.getByTestId("bom-total")).toContainText("$744.75");

  const downloading = page.waitForEvent("download");
  await page.getByRole("link", { name: "China comparison CSV", exact: true }).click();
  expect((await downloading).suggestedFilename()).toBe("procurement-cn.csv");
  await page.getByRole("link", { name: "China sourcing guide", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("China sourcing for delivery to the United States");
});
