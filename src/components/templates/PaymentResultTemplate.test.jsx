import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import PaymentResultTemplate from "./PaymentResultTemplate";

vi.mock("../atoms/MapWithPin", () => ({
  default: () => <div data-testid="result-map" />,
}));

const renderResult = (reservationData) =>
  render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: "/paymentresult",
          state: reservationData ? { reservationData } : null,
        },
      ]}
    >
      <PaymentResultTemplate />
    </MemoryRouter>,
  );

describe("결제 결과 화면", () => {
  it("location state 없이 직접 접근해도 crash하지 않고 fallback을 표시한다", () => {
    renderResult();
    expect(
      screen.getByRole("heading", {
        name: "결제 완료 정보를 확인할 수 없습니다.",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("result-map")).not.toBeInTheDocument();
  });

  it("approve 성공 결과가 있으면 정상 결제 완료 정보를 표시한다", () => {
    renderResult({
      reservation: {
        time: { start: "2026-08-11T10:00", end: "2026-08-11T11:00" },
        price: 10000,
      },
      carwash: {
        name: "테스트 세차장",
        location: { latitude: 35.1, longitude: 126.9 },
      },
    });
    expect(screen.getByText("테스트 세차장")).toBeInTheDocument();
    expect(screen.getByTestId("result-map")).toBeInTheDocument();
  });
});
