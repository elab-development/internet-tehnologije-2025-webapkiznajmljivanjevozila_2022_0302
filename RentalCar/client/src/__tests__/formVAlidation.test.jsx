import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, vi} from "vitest";

function BookingForm({ onSubmit }) {
  const [pickup, setPickup] = React.useState("");
  const [ret, setRet] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pickup || !ret) {
      setError("pickupDate and returnDate are required");
      return;
    }
    setError("");
    onSubmit({ pickup, ret });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Pickup
        <input
          aria-label="pickupDate"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          placeholder="YYYY-MM-DD"
        />
      </label>

      <label>
        Return
        <input
          aria-label="returnDate"
          value={ret}
          onChange={(e) => setRet(e.target.value)}
          placeholder="YYYY-MM-DD"
        />
      </label>

      {error && <p role="alert">{error}</p>}
      <button type="submit">Reserve</button>
    </form>
  );
}

test("shows validation error if fields are empty", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  render(<BookingForm onSubmit={onSubmit} />);

  await user.click(screen.getByRole("button", { name: /reserve/i }));
  expect(screen.getByRole("alert")).toHaveTextContent(
    /pickupDate and returnDate are required/i,
  );
  expect(onSubmit).not.toHaveBeenCalled();
});

test("submits when fields are filled", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  render(<BookingForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText("pickupDate"), "2026-02-01");
  await user.type(screen.getByLabelText("returnDate"), "2026-02-07");
  await user.click(screen.getByRole("button", { name: /reserve/i }));

  expect(onSubmit).toHaveBeenCalledWith({
    pickup: "2026-02-01",
    ret: "2026-02-07",
  });
});
