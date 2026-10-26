import { describe, expect, it } from "vitest";
import {
  isPaymentApprovalResponse,
  isPaymentCalculationResponse,
  isPaymentReadyResponse,
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
