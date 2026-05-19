import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HitlStatusBadge } from "./hitl-status-badge";

describe("HitlStatusBadge", () => {
  it("renders pending label", () => {
    render(<HitlStatusBadge status="pending" />);
    expect(screen.getByText("Pending")).toBeTruthy();
  });

  it("renders executed label", () => {
    render(<HitlStatusBadge status="executed" />);
    expect(screen.getByText("Executed")).toBeTruthy();
  });
});
