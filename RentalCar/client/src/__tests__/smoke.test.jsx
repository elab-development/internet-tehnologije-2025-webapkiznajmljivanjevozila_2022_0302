import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

function Demo() {
  return <h1>Client tests work</h1>;
}

test("renders demo", () => {
  render(<Demo />);
  expect(screen.getByText(/Client tests work/i)).toBeInTheDocument();
});
