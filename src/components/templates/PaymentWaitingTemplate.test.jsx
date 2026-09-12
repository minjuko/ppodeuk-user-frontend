import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PaymentWaitingTemplate from "./PaymentWaitingTemplate";
import { CLEAR_PAYMENT } from "../../store/action";

const dispatch = vi.fn();
const approve = vi.fn();
const mutationState = vi.hoisted(() => ({ isPending: false }));

vi.mock("react-redux", () => ({
  useDispatch: () => dispatch,
  useSelector: (selector) =>
    selector({
      reservationProcess: {
        selectedCarwashId: 1,
        selectedBayId: 2,
        reservations: {
          startTime: "2026-08-11T10:00",
          endTime: "2026-08-11T11:00",
        },
        tid: "stale-tid",
      },
    }),
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: () => ({ mutate: approve, isPending: mutationState.isPending }),
}));

vi.mock("../../apis/payment", () => ({ pgapprove: vi.fn() }));
vi.mock("../atoms/CustomModal", () => ({ default: () => null }));

describe("결제 callback 검증", () => {
  beforeEach(() => {
    dispatch.mockClear();
    approve.mockClear();
    mutationState.isPending = false;
  });

  it("pg_token 없이 직접 접근하면 approve하지 않고 stale tid를 제거한다", async () => {
    render(
      <MemoryRouter initialEntries={["/paymentwaiting"]}>
        <PaymentWaitingTemplate />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", {
        name: "결제 승인 정보를 확인할 수 없습니다.",
      }),
    ).toBeInTheDocument();
    expect(approve).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({ type: CLEAR_PAYMENT }),
    );
  });

  it("approve 요청 중에는 완료 버튼을 비활성화한다", () => {
    mutationState.isPending = true;
    render(
      <MemoryRouter initialEntries={["/paymentwaiting?pg_token=token"]}>
        <PaymentWaitingTemplate />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("button", { name: "결제 승인 중..." }),
    ).toBeDisabled();
  });
});
