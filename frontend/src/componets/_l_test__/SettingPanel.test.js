import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Chatbot from "./frontend/src/App.js"; // Import your Chatbot component

describe("Chatbot Settings Button", () => {
  test("should not show settings panel initially", () => {
    render(<Chatbot />);

    // Assert that the settings panel is not visible initially
    expect(screen.queryByText(/Settings/i)).not.toBeInTheDocument();
  });

  test("should show settings panel when settings button is clicked", () => {
    render(<Chatbot />);

    // Find the settings button and simulate a click
    fireEvent.click(screen.getByText(/⚙️ Settings/i));

    // Assert that the settings panel is visible
    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
  });

  test("should hide settings panel when settings button is clicked again", () => {
    render(<Chatbot />);

    // First click to show the settings panel
    fireEvent.click(screen.getByText(/⚙️ Settings/i));

    // Assert that the settings panel is visible
    expect(screen.getByText(/Settings/i)).toBeInTheDocument();

    // Second click to hide the settings panel
    fireEvent.click(screen.getByText(/⚙️ Settings/i));

    // Assert that the settings panel is hidden
    expect(screen.queryByText(/Settings/i)).not.toBeInTheDocument();
  });
});
