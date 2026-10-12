export const DEMO_LOCATION = {
  latitude: 35.143066,
  longitude: 126.922375,
};

export const resolveDemoMode = ({ demoMode, screenshotMode }) => {
  const isDemo = demoMode === "true";
  const isScreenshot = isDemo && screenshotMode === "true";

  return {
    isDemoMode: isDemo,
    isScreenshotMode: isScreenshot,
    showDemoUi: isDemo && !isScreenshot,
  };
};

export const { isDemoMode, isScreenshotMode, showDemoUi } = resolveDemoMode({
  demoMode: import.meta.env.VITE_DEMO_MODE,
  screenshotMode: import.meta.env.VITE_SCREENSHOT_MODE,
});

export const startDemoWorker = async (loadWorker) => {
  const { worker } = await loadWorker();
  await worker.start({
    onUnhandledRequest(request, print) {
      if (new URL(request.url).pathname.startsWith("/api/")) return;
      print.warning();
    },
  });
};
