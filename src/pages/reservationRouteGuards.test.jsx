import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import BaySelectionPage from "./BaySelectionPage";
import SchedulePage from "./SchedulePage";

vi.mock("../components/templates/BaySelectionTemplate", () => ({
  default: () => <div>bay selection loaded</div>,
}));
vi.mock("../components/templates/ScheduleTemplate", () => ({
  default: () => <div>schedule loaded</div>,
}));

describe("reservation route ID guards", () => {
  it("blocks an invalid carwash ID before rendering the bay query screen", () => {
    render(
      <MemoryRouter initialEntries={["/bayselection/not-an-id"]}>
        <Routes>
          <Route
            path="/bayselection/:carwashId"
            element={<BaySelectionPage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByText("bay selection loaded")).not.toBeInTheDocument();
  });

  it("blocks a zero or malformed bay ID before rendering schedule queries", () => {
    render(
      <MemoryRouter initialEntries={["/schedule/3/0"]}>
        <Routes>
          <Route
            path="/schedule/:carwashId/:bayId"
            element={<SchedulePage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByText("schedule loaded")).not.toBeInTheDocument();
  });
});
