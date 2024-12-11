import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Chatbot from "../../App";

describe("Popup Window Functionality", () => {
  it("should display and close the popup when an API key is submitted", async () => {
    // Render the Chatbot component
    render(<Chatbot />);

    // Click neccessary buttons
    const settingsButton = screen.getByRole("button", { name: /⚙️ Settings/i });
    fireEvent.click(settingsButton);

    const apiKeyButton = screen.getByRole("button", { name: /Input API Key/i });
    fireEvent.click(apiKeyButton);

    // Input test API key
    const apiKeyInput = screen.getByPlaceholderText("Enter your API key");
    expect(apiKeyInput).toBeInTheDocument();
    fireEvent.change(apiKeyInput, { target: { value: "test-api-key" } });
    const saveButton = screen.getByRole("button", { name: /Save API Key/i });
    fireEvent.click(saveButton);

    // Verify the popup is displayed with the success message and dismiss button
    const popupMessage = await screen.findByText("API Key Successfully Submitted!");
    expect(popupMessage).toBeInTheDocument();
    
    const dismissButton = screen.getByRole("button", { name: /Dismiss/i });
    expect(dismissButton).toBeInTheDocument();

    // Dismiss the popup
    fireEvent.click(dismissButton);

    // Verify the popup is no longer displayed
    await waitFor(() => {
      expect(screen.queryByText("API Key Successfully Submitted!")).not.toBeInTheDocument();
    });
  });
});
