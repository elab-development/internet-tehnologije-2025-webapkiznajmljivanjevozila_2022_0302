import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect } from "vitest";

function LikeButton() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Like</button>
      <p>Likes: {count}</p>
    </div>
  );
}

import React from "react";

test("increments count on click", async () => {
  const user = userEvent.setup();
  render(<LikeButton />);

  expect(screen.getByText("Likes: 0")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /like/i }));
  await user.click(screen.getByRole("button", { name: /like/i }));

  expect(screen.getByText("Likes: 2")).toBeInTheDocument();
});
