/* eslint-disable prettier/prettier */
import { describe, expect, it, vi } from "vitest";
import { instance } from "./instance";
import { pgapprove, pgpayment } from "./payment";

vi.mock("./instance", () => ({ instance: { post: vi.fn() } }));

describe("payment API", () => {
  it("uses ready and approve endpoints with their payloads", () => {
    const ready = { requestDto: { cid: "TC0ONETIME" }, saveDTO: { bayId: 2 } };
    const approve = { payApprovalRequestDTO: { tid: "tid", pg_token: "token" } };
    pgpayment(ready);
    pgapprove(approve);
    expect(instance.post).toHaveBeenNthCalledWith(1, "/api/user/payment/ready", ready, { withCredentials: true });
    expect(instance.post).toHaveBeenNthCalledWith(2, "/api/user/payment/approve", approve);
  });
});
