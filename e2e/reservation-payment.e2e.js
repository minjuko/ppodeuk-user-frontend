import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

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
  await expect(
    page.locator(".reservation-list [role=button]").first(),
  ).toBeInViewport();
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

const getContrastRatio = (foreground, background) => {
  const luminance = (color) => {
    const [red, green, blue] = color.match(/[\d.]+/g).map(Number);
    const linearize = (channel) => {
      const normalized = channel / 255;
      return normalized <= 0.04045
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    };
    return (
      0.2126 * linearize(red) +
      0.7152 * linearize(green) +
      0.0722 * linearize(blue)
    );
  };
  const values = [luminance(foreground), luminance(background)].sort(
    (first, second) => second - first,
  );
  return (values[0] + 0.05) / (values[1] + 0.05);
};

const getAxeViolations = async (page, screenName) => {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  return results.violations.flatMap(({ id, impact, description, nodes }) =>
    nodes.map(({ target, failureSummary }) => ({
      id,
      impact,
      description,
      screenName,
      target,
      failureSummary: failureSummary?.split("\n").slice(0, 2).join(" "),
    })),
  );
};

const settleTransitions = async (page) => {
  await page.evaluate(async () => {
    const runningTransitions = document
      .getAnimations({ subtree: true })
      .filter((animation) => animation.playState === "running");
    await Promise.allSettled(
      runningTransitions.map((animation) => animation.finished),
    );
  });
};

const getSchedulePickerAxeViolations = async (page, screenName) => {
  await settleTransitions(page);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .include([".schedule-time-slots", ".schedule-duration-options"])
    .analyze();
  return results.violations.flatMap(({ id, impact, description, nodes }) =>
    nodes.map(({ target, failureSummary }) => ({
      id,
      impact,
      description,
      screenName,
      target,
      failureSummary: failureSummary?.split("\n").slice(0, 2).join(" "),
    })),
  );
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
  expect(
    await getAxeViolations(page, "payment approval failure dialog"),
    "payment failure dialog axe violations",
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.locator(".flow-primary-action")).toBeFocused();
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

test("E2E-08: 예약 및 결제 주요 화면이 대표 viewport 너비에 맞게 유지된다", async ({
  page,
}) => {
  for (const width of [320, 375, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await selectReservation(page);

    const layout = await page.evaluate(() => {
      const summary = document.querySelector(".grid-4").getBoundingClientRect();
      const action = document
        .querySelector(".flow-primary-action")
        .getBoundingClientRect();
      return {
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        summaryRight: summary.right,
        summaryBottom: summary.bottom,
        actionLeft: action.left,
        actionRight: action.right,
        actionTop: action.top,
      };
    });

    expect(
      layout.documentWidth,
      `document overflow at ${width}px`,
    ).toBeLessThanOrEqual(layout.viewportWidth);
    expect(
      layout.summaryRight,
      `payment summary clipped at ${width}px`,
    ).toBeLessThanOrEqual(layout.viewportWidth);
    expect(
      layout.actionLeft,
      `primary action clipped at ${width}px`,
    ).toBeGreaterThanOrEqual(0);
    expect(
      layout.actionRight,
      `primary action clipped at ${width}px`,
    ).toBeLessThanOrEqual(layout.viewportWidth);
    expect(
      layout.summaryBottom,
      `summary overlaps primary action at ${width}px`,
    ).toBeLessThanOrEqual(layout.actionTop);
  }
});

test("E2E-09: 검색 입력과 예약 선택 컨트롤을 키보드로 조작할 수 있다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(`/reservation?demoDate=${demoDate}`);

  const search = page.getByRole("textbox", { name: "세차장 이름 검색" });
  await expect(search).toBeVisible();
  const sheetHandle = page.getByRole("button", { name: "세차장 목록 펼치기" });
  await page.keyboard.press("Tab");
  await expect(sheetHandle).toBeFocused();
  await expect(sheetHandle).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Tab");
  await expect(search).toBeFocused();
  const searchHasFocusIndicator = await search.evaluate((element) => {
    const style = getComputedStyle(element);
    return style.outlineStyle !== "none" || style.boxShadow !== "none";
  });
  expect(searchHasFocusIndicator).toBe(true);
  await search.fill("프리미엄");
  await expect(page.locator(".reservation-list [role=button]")).toHaveCount(1);
  const filter = page.getByRole("checkbox").first();
  await filter.focus();
  const filterHasFocusIndicator = await filter.evaluate(
    (element) => getComputedStyle(element.parentElement).boxShadow !== "none",
  );
  expect(filterHasFocusIndicator).toBe(true);
  await page.keyboard.press("Space");
  await expect(filter).toBeChecked();

  const carwash = page.locator(".reservation-list [role=button]").first();
  await carwash.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/carwashdetail\/108$/);

  const primary = page.locator(".carwash-detail-primary");
  await primary.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/bayselection\/108$/);
  const date = page.locator(".reservation-bay-date-picker button").nth(1);
  await date.focus();
  await page.keyboard.press("Enter");
  await expect(date).toHaveAttribute("aria-pressed", "true");
  const bay = page.locator(".reservation-bay-card").first();
  await bay.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/schedule\/108\/1081$/);

  await page.locator(".flow-primary-action").focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toBeVisible();

  const periodButtons = page
    .locator(".reservation-schedule-card")
    .nth(1)
    .locator("button");
  await expect(periodButtons.first()).toHaveAttribute("aria-pressed", "true");
  await periodButtons.nth(1).focus();
  await page.keyboard.press("Enter");
  await expect(periodButtons.nth(1)).toHaveAttribute("aria-pressed", "true");
  await periodButtons.first().focus();
  await page.keyboard.press("Enter");

  const startTimeButton = page.getByRole("button", {
    name: "11:00",
    exact: true,
  });
  await startTimeButton.focus();
  await page.keyboard.press("Enter");
  await expect(startTimeButton).toHaveAttribute("aria-pressed", "true");
  const durationButton = page
    .locator(".schedule-duration-options button")
    .nth(1);
  await durationButton.focus();
  await page.keyboard.press("Enter");
  await expect(durationButton).toHaveAttribute("aria-pressed", "true");

  const submit = page.locator(".flow-primary-action");
  await submit.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/payment$/);
});

test("E2E-10: 로그인 입력은 명시적인 접근 가능한 이름을 가진다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/login");
  await expect(page.getByRole("textbox", { name: "이메일" })).toBeVisible();
  await expect(page.getByLabel("비밀번호")).toBeVisible();
  await expect(page.getByRole("link", { name: "회원가입" })).toBeVisible();
  expect(await getAxeViolations(page, "login"), "login axe violations").toEqual(
    [],
  );

  await page.goto("/history");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(
    await getAxeViolations(page, "reservation history"),
    "reservation history axe violations",
  ).toEqual([]);
});

test("E2E-11: 예약·결제 주요 화면의 WCAG A/AA axe 검사가 통과한다", async ({
  page,
}) => {
  const violations = [];
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/reservation?demoDate=${demoDate}`);
  await expect(
    page.locator(".reservation-list [role=button]").first(),
  ).toBeVisible();
  violations.push(
    ...(await getAxeViolations(page, "reservation map and search")),
  );

  await page.locator(".reservation-list [role=button]").first().click();
  violations.push(...(await getAxeViolations(page, "carwash detail")));
  await page.locator(".carwash-detail-primary").click();
  await page.locator(".reservation-bay-date-picker button").nth(1).click();
  await page.locator(".reservation-bay-card").first().click();
  violations.push(
    ...(await getAxeViolations(page, "bay selection and date picker")),
  );

  const timeButton = page.getByRole("button", { name: "11:00", exact: true });
  const durationButton = page
    .locator(".schedule-duration-options button")
    .nth(1);
  const disabledDurationButton = page
    .locator(".schedule-duration-options button:disabled")
    .first();
  await expect(timeButton).toHaveAttribute("aria-pressed", "false");
  await expect(disabledDurationButton).toBeDisabled();
  violations.push(
    ...(await getSchedulePickerAxeViolations(
      page,
      "schedule initial and disabled",
    )),
  );

  await timeButton.click();
  await expect(timeButton).toHaveAttribute("aria-pressed", "true");
  await settleTransitions(page);
  const selectedTimeStyle = await timeButton.evaluate((button) => {
    const style = getComputedStyle(button);
    return {
      text: button.textContent.trim(),
      disabled: button.disabled,
      ariaPressed: button.getAttribute("aria-pressed"),
      className: button.className,
      color: style.color,
      backgroundColor: style.backgroundColor,
      opacity: style.opacity,
      parentOpacity: getComputedStyle(button.parentElement).opacity,
      transition: style.transition,
    };
  });
  expect(selectedTimeStyle.disabled).toBe(false);
  expect(selectedTimeStyle.ariaPressed).toBe("true");
  expect(selectedTimeStyle.color).toBe("rgb(255, 255, 255)");
  expect(selectedTimeStyle.backgroundColor).toBe("rgb(0, 104, 176)");
  expect(selectedTimeStyle.opacity).toBe("1");
  expect(
    getContrastRatio(
      selectedTimeStyle.color,
      selectedTimeStyle.backgroundColor,
    ),
  ).toBeGreaterThanOrEqual(4.5);
  violations.push(
    ...(await getSchedulePickerAxeViolations(page, "schedule time selected")),
  );

  await durationButton.click();
  await expect(durationButton).toHaveAttribute("aria-pressed", "true");
  const disabledDurationStyle = await disabledDurationButton.evaluate(
    (button) => {
      const style = getComputedStyle(button);
      return {
        color: style.color,
        backgroundColor: style.backgroundColor,
        opacity: style.opacity,
        parentOpacity: getComputedStyle(button.parentElement).opacity,
      };
    },
  );
  expect(disabledDurationStyle.opacity).toBe("1");
  expect(disabledDurationStyle.parentOpacity).toBe("1");
  expect(disabledDurationStyle.color).toBe("rgb(55, 65, 81)");
  expect(disabledDurationStyle.backgroundColor).toBe("rgb(243, 244, 246)");
  expect(
    getContrastRatio(
      disabledDurationStyle.color,
      disabledDurationStyle.backgroundColor,
    ),
  ).toBeGreaterThanOrEqual(4.5);
  await settleTransitions(page);
  const selectedDurationStyle = await durationButton.evaluate((button) => {
    const style = getComputedStyle(button);
    return {
      text: button.textContent.trim(),
      disabled: button.disabled,
      ariaPressed: button.getAttribute("aria-pressed"),
      className: button.className,
      color: style.color,
      backgroundColor: style.backgroundColor,
      opacity: style.opacity,
      parentOpacity: getComputedStyle(button.parentElement).opacity,
      transition: style.transition,
    };
  });
  expect(selectedDurationStyle.disabled).toBe(false);
  expect(selectedDurationStyle.ariaPressed).toBe("true");
  expect(selectedDurationStyle.color).toBe("rgb(255, 255, 255)");
  expect(selectedDurationStyle.backgroundColor).toBe("rgb(0, 104, 176)");
  expect(selectedDurationStyle.opacity).toBe("1");
  expect(
    getContrastRatio(
      selectedDurationStyle.color,
      selectedDurationStyle.backgroundColor,
    ),
  ).toBeGreaterThanOrEqual(4.5);
  violations.push(
    ...(await getSchedulePickerAxeViolations(
      page,
      "schedule duration selected",
    )),
  );

  const nextDate = page
    .locator(".reservation-schedule-date-picker button")
    .nth(1);
  await nextDate.click();
  await expect(nextDate).toHaveAttribute("aria-pressed", "true");
  await expect(timeButton).toHaveAttribute("aria-pressed", "false");
  await expect(durationButton).toHaveAttribute("aria-pressed", "false");
  violations.push(
    ...(await getSchedulePickerAxeViolations(
      page,
      "schedule after date change",
    )),
  );

  await timeButton.click();
  await expect(timeButton).toHaveAttribute("aria-pressed", "true");
  await durationButton.click();
  await expect(durationButton).toHaveAttribute("aria-pressed", "true");
  await settleTransitions(page);
  violations.push(...(await getAxeViolations(page, "schedule selection")));
  await page.locator(".flow-primary-action").click();
  await expect(page).toHaveURL(/\/payment$/);
  violations.push(...(await getAxeViolations(page, "payment")));

  await confirmPayment(page);
  await expect(page).toHaveURL(/\/paymentwaiting\?pg_token=/);
  violations.push(
    ...(await getAxeViolations(page, "payment approval waiting")),
  );
  await page.locator(".flow-primary-action").click();
  await expect(page).toHaveURL(/\/paymentresult$/);
  violations.push(...(await getAxeViolations(page, "payment result")));
  expect(violations, "axe-core WCAG A/AA violations").toEqual([]);
});

test("E2E-12: 모바일 터치와 키보드로 바텀시트를 조작하고 예약 목록을 사용할 수 있다", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    viewport: { width: 320, height: 640 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  const appOrigin = new URL(baseURL).origin;
  await context.addInitScript(() => {
    localStorage.setItem("token", "Bearer portfolio-demo-token");
  });
  await page.route("**/*", async (route) => {
    if (new URL(route.request().url()).origin !== appOrigin) {
      await route.abort("blockedbyclient");
      return;
    }
    await route.continue();
  });
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setTouchEmulationEnabled", {
    enabled: true,
    configuration: "mobile",
  });
  await page.goto(`/reservation?demoDate=${demoDate}`);
  const sheet = page.locator(".reservation-sheet");
  const handle = page.locator(".reservation-sheet-content > button");
  const firstCarwash = page.locator(".reservation-list [role=button]").first();
  await expect(firstCarwash).toBeVisible();

  const metrics = await page.evaluate(() => ({
    playwrightViewport: { width: innerWidth, height: innerHeight },
    innerWidth,
    innerHeight,
    clientWidth: document.documentElement.clientWidth,
    visualViewportWidth: window.visualViewport?.width,
    devicePixelRatio,
    sheet: document
      .querySelector(".reservation-sheet")
      .getBoundingClientRect()
      .toJSON(),
    handle: document
      .querySelector(".reservation-sheet-content > button")
      .getBoundingClientRect()
      .toJSON(),
  }));
  console.log("E2E-12 mobile viewport and sheet geometry", metrics);
  expect(metrics.playwrightViewport).toEqual({ width: 320, height: 640 });
  expect(metrics.innerWidth).toBe(320);
  expect(metrics.clientWidth).toBe(320);
  expect(metrics.visualViewportWidth).toBe(320);
  expect(metrics.sheet.width).toBe(320);
  const handleCenter = await handle.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const target = document.elementFromPoint(x, y);
    return {
      x,
      y,
      targetIsHandle: target === element || element.contains(target),
    };
  });
  expect(handleCenter.targetIsHandle).toBe(true);
  const receivedEvents = [];
  await handle.evaluate((element) => {
    window.__bottomsheetTouchEvents = [];
    for (const type of ["touchstart", "touchmove", "touchend"]) {
      element.addEventListener(type, () =>
        window.__bottomsheetTouchEvents.push(type),
      );
    }
  });

  const drag = async (startY, endY, x = handleCenter.x) => {
    const positions = [];
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y: startY, radiusX: 2, radiusY: 2, force: 1, id: 1 }],
    });
    const steps = 8;
    for (let index = 1; index <= steps; index += 1) {
      const y = startY + ((endY - startY) * index) / steps;
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x, y, radiusX: 2, radiusY: 2, force: 1, id: 1 }],
      });
      await page.waitForTimeout(12);
      positions.push(
        await sheet.evaluate((element) => element.getBoundingClientRect().top),
      );
    }
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    return positions;
  };
  const sheetTop = () =>
    sheet.evaluate((element) => element.getBoundingClientRect().top);

  const collapsedTop = await sheetTop();
  expect(collapsedTop).toBe(240);
  const dragPositions = await drag(handleCenter.y, 50);
  expect(Math.min(...dragPositions)).toBeLessThan(collapsedTop);
  await expect.poll(sheetTop).toBe(40);
  receivedEvents.push(
    ...(await page.evaluate(() => window.__bottomsheetTouchEvents)),
  );
  expect(receivedEvents).toContain("touchstart");
  expect(receivedEvents).toContain("touchmove");
  expect(receivedEvents).toContain("touchend");

  const list = page.locator(".reservation-list");
  const listMetrics = await list.evaluate((element) => ({
    scrollHeight: element.scrollHeight,
    clientHeight: element.clientHeight,
  }));
  expect(listMetrics.scrollHeight).toBeGreaterThan(listMetrics.clientHeight);
  const listBox = await list.boundingBox();
  const listScrollTop = await list.evaluate((element) => element.scrollTop);
  const listTouchX = listBox.x + listBox.width / 2;
  const listTouchStartY = Math.min(
    listBox.y + 220,
    page.viewportSize().height - 130,
  );
  const listTouchEndY = listTouchStartY - 100;
  expect(
    await list.evaluate(
      (element, point) =>
        element.contains(document.elementFromPoint(point.x, point.y)),
      { x: listTouchX, y: listTouchStartY },
    ),
  ).toBe(true);
  await drag(listTouchStartY, listTouchEndY, listTouchX);
  await expect
    .poll(() => list.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(listScrollTop);

  const search = page.getByRole("textbox", { name: "세차장 이름 검색" });
  await search.click();
  await search.fill("프리미엄");
  await expect(firstCarwash).toBeVisible();
  const filter = page.getByRole("checkbox").first();
  await page.locator(".reservation-filters label").first().click();
  await expect(filter).toBeChecked();

  const expandedHandleBox = await handle.boundingBox();
  const expandedHandleY = expandedHandleBox.y + expandedHandleBox.height / 2;
  await drag(expandedHandleY, 210);
  await expect.poll(sheetTop).toBe(240);
  const collapsedHandleBox = await handle.boundingBox();
  await drag(
    collapsedHandleBox.y + collapsedHandleBox.height / 2,
    collapsedHandleBox.y + collapsedHandleBox.height / 2 - 12,
  );
  await expect.poll(sheetTop).toBe(240);
  await drag(collapsedHandleBox.y + collapsedHandleBox.height / 2, 50);
  await expect.poll(sheetTop).toBe(40);
  await drag(50, 220);
  await expect.poll(sheetTop).toBe(240);

  await handle.focus();
  await expect(handle).toBeFocused();
  await expect(handle).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Enter");
  await expect(handle).toHaveAttribute("aria-expanded", "true");
  await expect.poll(sheetTop).toBe(40);
  await page.keyboard.press("Space");
  await expect(handle).toHaveAttribute("aria-expanded", "false");
  await expect.poll(sheetTop).toBe(240);

  await page.setViewportSize({ width: 320, height: 500 });
  await expect.poll(sheetTop).toBe(100);
  await handle.focus();
  await page.keyboard.press("Enter");
  await expect.poll(sheetTop).toBe(40);
  await page.setViewportSize({ width: 320, height: 640 });
  await expect.poll(sheetTop).toBe(40);
  await firstCarwash.click();
  await expect(page).toHaveURL(/\/carwashdetail\/108$/);
  await cdp.detach();
  await context.close();
});
