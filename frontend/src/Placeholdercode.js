import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("App Component - Background Color Toggle", () => {
  it("should toggle background color on button click", async () => {
    render(<App />);

    const toggleButton = screen.getByText(/Toggle to white/i);

    expect(document.querySelector(".container")).toHaveStyle("background-color: #33363b");

    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(document.querySelector(".container")).toHaveStyle("background-color: white");
    });

    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(document.querySelector(".container")).toHaveStyle("background-color: #33363b");
    });
  });
});


