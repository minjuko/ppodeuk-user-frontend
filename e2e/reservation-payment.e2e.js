import { expect, test } from "@playwright/test";

const demoDate = "2030-01-07";
const carwashId = 108;
const bayId = 1081;
const startTime = `${demoDate.slice(0, 8)}08T11:00`;
const endTime = `${demoDate.slice(0, 8)}08T12:00`;

test.beforeEach(async ({ context, page, baseURL }) => {
  const appOrigin = new URL(baseURL).origin;
  await context.addInitScript(() => {
    localStorage.setItem("token", "Bearer portfolio-demo-token");
  });

  // MSW handles same-origin demo APIs. Abort any attempted external navigation,
  // including a payment provider redirect, before it can leave the local demo.
  await page.route("**/*", async (route) => {
    const requestUrl = new URL(route.request().url());
    if (requestUrl.origin !== appOrigin) {
      await route.abort("blockedbyclient");
      return;
    }
    await route.continue();
  });
});

const selectReservation = async (page) => {
  await page.goto(`/reservation?demoDate=${demoDate}`);
  await expect(
    page.locator(".reservation-list [role=button]").first(),
  ).toBeVisible();
  await page.locator(".reservation-list [role=button]").first().click();
  await expect(page).toHaveURL(/\/carwashdetail\/108$/);
  await page.locator(".carwash-detail-primary").click();
  await expect(page).toHaveURL(/\/bayselection\/108$/);
  await page.locator(".reservation-bay-date-picker button").nth(1).click();
  await page.locator(".reservation-bay-card").first().click();
  await expect(page).toHaveURL(/\/schedule\/108\/1081$/);
  const scheduleUrl = page.url();
  await page.locator(".flow-primary-action").click();
  await expect(page).toHaveURL(scheduleUrl);
  await page.getByRole("button", { name: "11:30", exact: true }).click();
  await expect(
    page.locator(".schedule-duration-options button").nth(1),
  ).toBeDisabled();
  await page.getByRole("button", { name: "11:00", exact: true }).click();
  await page.locator(".schedule-duration-options button").nth(1).click();
  await expect(page.locator(".reservation-schedule-summary")).toContainText(
    "11",
  );
  await page.locator(".flow-primary-action").click();
  await expect(page).toHaveURL(/\/payment$/);
  await expect(page.locator(".grid-4").first()).toContainText("11");
  await expect(page.locator(".grid-4").first()).toContainText("12,000");
};

const readPersistedReservation = async (page) =>
  page.evaluate(() => {
    const serialized = JSON.parse(localStorage.getItem("persist:root") || "{}");
    return Object.fromEntries(
      Object.entries(serialized).map(([key, value]) => [
        key,
        JSON.parse(value),
      ]),
    );
  });

const confirmPayment = async (page) => {
  await expect(page.locator(".flow-primary-action")).toBeEnabled();
  await page.locator(".flow-primary-action").click();
};

test("E2E-01/02: 예약 요약에 선택 시간이 표시되고 새로고침 후 Persist에서 복원된다", async ({
  page,
}) => {
  await selectReservation(page);
  await expect(page.locator(".grid-4")).toContainText("12");
  await expect(page.locator(".grid-4")).toContainText("12,000");

  const saved = await readPersistedReservation(page);
  expect(saved).toMatchObject({
    selectedCarwashId: carwashId,
    selectedBayId: bayId,
    reservations: { startTime, endTime },
  });

  await page.reload();
  await expect(page).toHaveURL(/\/payment$/);
  await expect(page.locator(".grid-4")).toContainText("11");
  await expect(page.locator(".grid-4")).toContainText("12");
  expect(await readPersistedReservation(page)).toMatchObject({
    selectedCarwashId: carwashId,
    selectedBayId: bayId,
    reservations: { startTime, endTime },
  });
});

test("E2E-03: 잘못된 경로 ID와 존재하지 않는 베이로 결제 단계에 진입할 수 없다", async ({
  page,
}) => {
  await page.goto("/schedule/not-a-number/1011");
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.locator(".flow-primary-action")).toHaveCount(0);

  await page.goto("/schedule/101/9999");
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.locator(".flow-primary-action")).toHaveCount(0);
  expect(new URL(page.url()).pathname).toMatch(/^\/schedule\/101\/9999$/);
});

test("E2E-07: 다른 베이를 선택하면 이전에 고른 예약 시간이 초기화된다", async ({
  page,
}) => {
  await page.goto(`/reservation?demoDate=${demoDate}`);
  await page.locator(".reservation-list [role=button]").first().click();
  await page.locator(".carwash-detail-primary").click();
  await page.locator(".reservation-bay-date-picker button").nth(1).click();
  await page.locator(".reservation-bay-card").first().click();
  await page.getByRole("button", { name: "11:00", exact: true }).click();
  await page.locator(".schedule-duration-options button").nth(1).click();
  await page.locator(".flow-primary-action").click();
  await expect(page).toHaveURL(/\/payment$/);
  expect(
    await readPersistedReservation(page).then((value) => value.reservations),
  ).toEqual({
    startTime,
    endTime,
  });

  await page.goto("/bayselection/108");
  await page.locator(".reservation-bay-date-picker button").nth(1).click();
  await page.locator(".reservation-bay-card").nth(1).click();
  await expect(page).toHaveURL(/\/schedule\/108\/1082$/);
  expect(await readPersistedReservation(page)).toMatchObject({
    selectedBayId: 1082,
    reservations: [],
    tid: null,
  });
});

test("E2E-04: TID가 비어 있는 결제 준비 응답은 차단하고 예약 정보를 보존한다", async ({
  page,
}) => {
  await selectReservation(page);
  await page.context().setExtraHTTPHeaders({
    "x-ppodeuk-e2e-scenario": "ready-malformed",
  });

  await confirmPayment(page);
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page).toHaveURL(/\/payment$/);
  expect(await readPersistedReservation(page)).toMatchObject({
    reservations: { startTime, endTime },
    tid: null,
  });
});

test("E2E-05: 승인 실패 뒤 TID를 지우고 예약을 보존해 결제를 다시 시작할 수 있다", async ({
  page,
}) => {
  await selectReservation(page);
  await confirmPayment(page);
  await expect(page).toHaveURL(/\/paymentwaiting\?pg_token=/);
  expect(await readPersistedReservation(page)).toMatchObject({
    tid: "portfolio-demo-tid",
    reservations: { startTime, endTime },
  });
  await page.context().setExtraHTTPHeaders({
    "x-ppodeuk-e2e-scenario": "approve-fail",
  });

  await page.locator(".flow-primary-action").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.reload();
  await expect(page.locator(".flow-primary-action")).toBeEnabled();
  await page.locator(".flow-primary-action").click();
  await expect(page).toHaveURL(/\/payment$/);
  await expect(page.locator(".grid-4")).toContainText("11");
  expect(await readPersistedReservation(page)).toMatchObject({
    reservations: { startTime, endTime },
    tid: null,
  });
});

test("E2E-06: MSW 승인 성공은 결과 정보를 표시하고 예약 상태를 초기화한다", async ({
  page,
}) => {
  await selectReservation(page);
  await confirmPayment(page);
  await expect(page).toHaveURL(/\/paymentwaiting\?pg_token=/);
  await page.locator(".flow-primary-action").click();
  await expect(page).toHaveURL(/\/paymentresult$/);
  await expect(page.locator("h1")).toBeVisible();
  expect(await readPersistedReservation(page)).toMatchObject({
    selectedCarwashId: null,
    selectedBayId: null,
    reservations: [],
    tid: null,
  });
});
