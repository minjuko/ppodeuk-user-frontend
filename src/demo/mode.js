export const DEMO_LOCATION = {
  latitude: 35.143066,
  longitude: 126.922375,
};

export const FALLBACK_RECOMMENDED_CARWASH = {
  id: 101,
  name: "버블샤인 세차장",
  image: { url: "/carouselimage1.jpg" },
  rate: 4.8,
  reviewCount: 12,
  distance: 850,
  location: {
    address: "광주광역시 북구 데모로 10",
    ...DEMO_LOCATION,
  },
};

export const resolveDemoMode = ({
  demoMode,
  screenshotMode,
  demoBuild = false,
}) => {
  const isDemo = demoBuild || demoMode === "true";
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
  demoBuild: __DEMO_BUILD__,
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
