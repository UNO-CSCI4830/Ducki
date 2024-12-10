import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Chatbot from "./Chatbot"; // Make sure the import path is correct
import axios from "axios";

// Mock axios to avoid making actual API calls
jest.mock("axios");

describe("Chatbot Component", () => {
  it("should toggle background color on button click", async () => {
    render(<Chatbot />); // Render the Chatbot component

    // Find the toggle button for background color
    const toggleButton = screen.getByText(/Toggle to white/i);

    // Initial background color should be dark (default)
    expect(document.querySelector(".container")).toHaveStyle(
      "background-color: #33363b"
    );

    // Click the toggle button to change background color
    fireEvent.click(toggleButton);

    // Wait for the background color to change to white
    await waitFor(() => {
      expect(document.querySelector(".container")).toHaveStyle(
        "background-color: white"
      );
    });

    // Click the button again to toggle back to the initial color
    fireEvent.click(toggleButton);

    // Verify the background color is back to dark mode
    await waitFor(() => {
      expect(document.querySelector(".container")).toHaveStyle(
        "background-color: #33363b"
      );
    });
  });

  it("should open the API key modal when button is clicked", async () => {
    render(<Chatbot />); // Render the Chatbot component

    // Find the button to open the API key modal
    const openApiKeyModalButton = screen.getByText(/Input API Key/i);

    // Click the button to open the modal
    fireEvent.click(openApiKeyModalButton);

    // Check if the modal appears
    expect(screen.getByText(/Enter API Key/i)).toBeInTheDocument();
  });

  it("should submit the API key when form is submitted", async () => {
    axios.post.mockResolvedValue({ data: { message: "API key saved successfully" } });

    render(<Chatbot />); // Render the Chatbot component

    // Open the API key modal
    fireEvent.click(screen.getByText(/Input API Key/i));

    // Find the input and the submit button
    const apiKeyInput = screen.getByPlaceholderText("Enter your API key");
    const saveButton = screen.getByText(/Save API Key/i);

    // Type a valid API key into the input field
    fireEvent.change(apiKeyInput, { target: { value: "1234-API-KEY" } });

    // Click the save button
    fireEvent.click(saveButton);

    // Wait for the mock API call to complete and check if it's called with the correct data
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/api/api_key", {
        api_key: "1234-API-KEY",
      });
    });

    // Check that the modal is closed after submission
    expect(screen.queryByText(/Enter API Key/i)).not.toBeInTheDocument();
  });

  it("should handle empty API key gracefully", async () => {
    render(<Chatbot />); // Render the Chatbot component

    // Open the API key modal
    fireEvent.click(screen.getByText(/Input API Key/i));

    // Find the save button without filling in the input
    const saveButton = screen.getByText(/Save API Key/i);

    // Click the submit button with an empty input
    fireEvent.click(saveButton);

    // Expect an error message to be logged in the console or handle it gracefully
    // (You can mock console.error if needed)
  });
});
