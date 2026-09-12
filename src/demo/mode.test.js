import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("Screenshot Mode boundary", () => {
  it.each([
    ["Demo", "true", "false", true, false, true],
    ["Screenshot", "true", "true", true, true, false],
    ["Live", "false", "true", false, false, false],
  ])(
    "%s mode keeps the expected Demo UI boundary",
    async (
      _,
      demoMode,
      screenshotMode,
      expectedDemo,
      expectedScreenshot,
      expectedUi,
    ) => {
      const { resolveDemoMode } = await import("./mode");

      expect(resolveDemoMode({ demoMode, screenshotMode })).toEqual({
        isDemoMode: expectedDemo,
        isScreenshotMode: expectedScreenshot,
        showDemoUi: expectedUi,
      });
    },
  );
});

describe("Demo Mode 경계", () => {
  it("Demo mode에서는 MSW worker를 활성화한다", async () => {
    const start = vi.fn().mockResolvedValue(undefined);
    const { startDemoWorker } = await import("./mode");

    await startDemoWorker(async () => ({ worker: { start } }));
    expect(start).toHaveBeenCalledOnce();
  });

  it("Live mode 값은 false여서 bootstrap이 MSW module을 선택하지 않게 한다", async () => {
    vi.stubEnv("VITE_DEMO_MODE", "false");
    const { isDemoMode } = await import("./mode");

    expect(isDemoMode).toBe(false);
  });
});
