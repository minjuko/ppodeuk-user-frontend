import { describe, expect, it, vi } from "vitest";
import { instance } from "./instance";
import { calculatePayment } from "./carwashes";

vi.mock("./instance", () => ({ instance: { post: vi.fn() } }));

describe("payment calculation API contract", () => {
  it("posts the reservation range to the selected bay payment endpoint", () => {
    const range = {
      startTime: "2026-08-11T10:00",
      endTime: "2026-08-11T11:00",
    };

    calculatePayment(12, range);

    expect(instance.post).toHaveBeenCalledWith(
      "/api/user/carwashes/12/payment",
      range,
    );
  });
});
