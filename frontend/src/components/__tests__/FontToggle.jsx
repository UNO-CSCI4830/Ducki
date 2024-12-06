import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Chatbot from "../../App"; 
import '@testing-library/jest-dom';

describe("Font Size Toggle Button", () => {
  test("toggles the font size between default and increased values", () => {
    // Render the Chatbot component
    render(<Chatbot />);
    
    // Locate the font size toggle button
    const toggleButton = screen.getByRole("button", { name: /increase font size/i });
    const container = screen.getByTestId("chatbot-container");

    // Check that the initial font size is 16px
    expect(container).toHaveStyle({ fontSize: "16px" });

    // Click the button to increase the font size
    fireEvent.click(toggleButton);

    // Verify the font size increased
    expect(container).toHaveStyle({ fontSize: "20px" });
    expect(toggleButton).toHaveTextContent("Reset Font Size");

    // Click the button again to reset the font size
    fireEvent.click(toggleButton);

    // Verify the font size reset to 16px
    expect(container).toHaveStyle({ fontSize: "16px" });
    expect(toggleButton).toHaveTextContent("Increase Font Size");
  });
});
