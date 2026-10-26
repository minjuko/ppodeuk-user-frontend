import { describe, expect, it, vi } from "vitest";
import { instance } from "./instance";
import { cancelReservation, modifyReservation } from "./reservations";

vi.mock("./instance", () => ({ instance: { delete: vi.fn(), put: vi.fn() } }));

describe("reservation mutation API contracts", () => {
  it("sends cancellation as DELETE with the reservation id in the path", () => {
    cancelReservation(42);
    expect(instance.delete).toHaveBeenCalledWith("/api/user/reservations/42");
  });

  it("sends changed start and end times as a PUT JSON body", () => {
    modifyReservation("42", "2026-08-11T10:00", "2026-08-11T11:00");
    expect(instance.put).toHaveBeenCalledWith("/api/user/reservations/42", {
      startTime: "2026-08-11T10:00",
      endTime: "2026-08-11T11:00",
    });
  });
});
