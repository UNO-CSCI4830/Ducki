import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Chatbot from "../../App";

describe("Chatbot Settings - Background Color Toggle", () => {
  it("should toggle the background color between white and dark mode", async() => {
    // Render the Chatbot component
    render(<Chatbot />);

    // Get the settings button and click to open the modal
    const settingsButton = screen.getByRole("button", { name: /⚙️ Settings/i });
    fireEvent.click(settingsButton);

    // Check that the settings modal is open and find the toggle color button
    var toggleColorButton = screen.getByRole("button", { name: /toggle to/i });

    // Get the container using the test ID
    var container = screen.getByTestId("chatbot-container");

    // Verify initial state (dark mode background)
    expect(container).toHaveStyle({ backgroundColor: "rgb(51, 54, 59)" });

    // Simulate clicking the toggle color button
    fireEvent.click(toggleColorButton);

    // Verify the background color is now white
    await waitFor(() => expect(container).toHaveStyle({ backgroundColor: "rgb(255, 255, 255)" }));

    // Simulate another click to toggle back to dark mode
    fireEvent.click(toggleColorButton);

    // Verify the background color is back to dark mode
    await waitFor(() => expect(container).toHaveStyle({ backgroundColor: "rgb(51, 54, 59)" }));
  });
});
