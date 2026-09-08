import { expect, test } from "@playwright/test";

test("original geometry, search, selection, explosion and downloads", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator(".part-card")).toHaveCount(70);
  await expect(page.getByText("Loading 70 source parts…")).not.toBeVisible({
    timeout: 30000,
  });
  await expect(page.locator("canvas")).toBeVisible();
  await page.getByRole("button", { name: "Toggle exploded view" }).click();
  await expect(page.getByLabel("Assembly explosion")).toHaveValue("0.55");
  await page.getByLabel("Search parts").fill("Dynamixel");
  await expect(page.locator(".part-card")).toHaveCount(15);
  await page.locator(".part-card").first().click();
  await expect(page.locator(".part-detail h2")).toHaveText("Dynamixel XL330");
  await page.getByRole("button", { name: "Isolate this part" }).click();
  await expect(
    page.getByRole("button", { name: "Show all parts" }),
  ).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download source mesh" }).click();
  expect((await download).suggestedFilename()).toBe("xl330.stl");
  const pack = await page.request.get("/models/microduck-designs.zip");
  expect(pack.ok()).toBeTruthy();
  expect((await pack.body()).subarray(0, 2).toString()).toBe("PK");
  expect(errors).toEqual([]);
});

test("cost calculation, persistence and CSV export", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Parts & costs", exact: true })
    .click();
  await expect(page.getByTestId("bom-total")).toContainText("$689.75");
  await page
    .getByRole("checkbox", { name: "Include optional perception" })
    .check();
  await expect(page.getByTestId("bom-total")).toContainText("$744.75");
  await page.getByLabel("Dynamixel XL330 servos unit price").fill("30");
  await expect(page.getByTestId("bom-total")).toContainText("$782.40");
  await page.reload();
  await page
    .getByRole("button", { name: "Parts & costs", exact: true })
    .click();
  await expect(
    page.getByLabel("Dynamixel XL330 servos unit price"),
  ).toHaveValue("30");
  await expect(page.getByTestId("bom-total")).toContainText("$727.40");
  const downloading = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  const download = await downloading;
  expect(download.suggestedFilename()).toBe("microduck-parts-estimate.csv");
});

test("checklist changes only on explicit checks and persists", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Build guide", exact: true }).click();
  await expect(page.locator(".check-list input:checked")).toHaveCount(0);
  await page.getByRole("button", { name: "Next stage" }).click();
  await expect(page.locator(".check-list input:checked")).toHaveCount(0);
  await page.getByRole("checkbox").first().check();
  const task = await page
    .getByRole("checkbox")
    .first()
    .evaluate((el) => el.parentElement!.textContent);
  await page.reload();
  await page.getByRole("button", { name: "Build guide", exact: true }).click();
  await page.getByRole("button", { name: "Next stage" }).click();
  await expect(page.getByRole("checkbox", { name: task! })).toBeChecked();
  const guide = await page.request.get("/docs/BUILD_GUIDE.md");
  expect(await guide.text()).toContain("# Build a Microduck replica");
  const worksheet = await page.request.get("/hardware/calibration.csv");
  expect(await worksheet.text()).toContain("right_hip_yaw");
});

test("mobile navigation and layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("button", { name: "Parts & costs", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Budget the real build." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
});

test("physics controls pause and reset a real running simulation", async ({
  page,
}) => {
  // Software WebGL and MuJoCo share the runner's CPU. Give this integration
  // test time to complete, and wait for each control response before reading state.
  test.setTimeout(120000);
  async function clickControl(name: string, action: string) {
    const completed = page.waitForResponse((response) =>
      response.url().endsWith("/api/control") &&
      response.request().method() === "POST" &&
      response.request().postDataJSON()?.action === action,
    );
    await page.getByRole("button", { name, exact: true }).click();
    const response = await completed;
    expect(response.ok()).toBeTruthy();
    await response.json();
  }
  const health = await page.request.get("/api/health");
  test.skip(
    !health.ok(),
    "Start uv run python -m lab.server to exercise real CPU physics.",
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Simulation", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Reset simulation" }),
  ).toBeEnabled();
  await clickControl("Reset simulation", "reset");
  await clickControl("Forward 0.30", "velocity");
  await clickControl("Run simulation", "play");
  await expect
    .poll(
      async () => (await (await page.request.get("/api/state")).json()).time,
    )
    .toBeGreaterThan(1);
  await clickControl("Pause", "pause");
  let s = await (await page.request.get("/api/state")).json();
  expect(s.paused).toBe(true);
  expect(s.steps).toBeGreaterThan(50);
  expect(s.bodies).toHaveLength(15);
  await clickControl("Reset simulation", "reset");
  s = await (await page.request.get("/api/state")).json();
  expect(s.paused).toBe(true);
  expect(s.steps).toBe(0);
  expect(s.time).toBe(0);
});
