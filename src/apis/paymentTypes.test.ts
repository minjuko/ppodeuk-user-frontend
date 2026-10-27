import { describe, expect, it } from "vitest";
import {
  isPaymentApprovalResponse,
  isPaymentCalculationResponse,
  isPaymentReadyResponse,
  resolvePaymentRedirectUrl,
} from "./paymentTypes";

describe("payment response guards", () => {
  it("accepts only finite numeric calculation prices", () => {
    expect(isPaymentCalculationResponse({ price: 12000 })).toBe(true);
    expect(isPaymentCalculationResponse({ price: "12000" })).toBe(false);
    expect(isPaymentCalculationResponse({ price: Number.NaN })).toBe(false);
  });

  it("requires a nonempty TID for a ready response", () => {
    expect(isPaymentReadyResponse({ tid: "tid-1" })).toBe(true);
    expect(isPaymentReadyResponse({ tid: "" })).toBe(false);
    expect(isPaymentReadyResponse({ next_redirect_pc_url: "https://pay.example" })).toBe(false);
  });

  it.each([
    "javascript:alert(1)",
    "data:text/html,attack",
    "//outside.example/pay",
    "http://outside.example/pay",
    "https://user:password@pay.example/ready",
    "https://[invalid",
  ])("rejects unsafe or malformed payment redirect URLs: %s", (url) => {
    expect(resolvePaymentRedirectUrl(url, "https://app.example")).toBeNull();
  });

  it("preserves same-origin relative and secure external payment redirects", () => {
    expect(
      resolvePaymentRedirectUrl("/callback?step=1", "https://app.example")?.href,
    ).toBe("https://app.example/callback?step=1");
    expect(
      resolvePaymentRedirectUrl("https://pay.example/ready", "https://app.example")?.href,
    ).toBe("https://pay.example/ready");
  });

  it.each([-1, 1.5, Number.MAX_SAFE_INTEGER + 1])(
    "rejects an invalid payment amount: %s",
    (price) => {
      expect(isPaymentCalculationResponse({ price })).toBe(false);
    },
  );

  it("checks the fields consumed by the payment result screen", () => {
    const valid = {
      reservation: {
        time: { start: "2026-08-11T10:00", end: "2026-08-11T11:00" },
        price: 12000,
      },
      carwash: { name: "Demo", location: { latitude: 35.1, longitude: 126.9 } },
    };
    expect(isPaymentApprovalResponse(valid)).toBe(true);
    expect(isPaymentApprovalResponse({ ...valid, carwash: undefined })).toBe(false);
  });
});
