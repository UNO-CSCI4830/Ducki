import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DuckiImageToggle from "../HideDucki";

// Mock ImageComponent
jest.mock("../ImageComponent", () => ({ src, alt }) => <img src={src} alt={alt} />);

describe("DuckiImageToggle Component", () => {
  test("toggles visibility of Ducki image", () => {
    // Render the component
    render(<DuckiImageToggle />);

    // Verify the image is initially visible
    expect(screen.getByAltText("Ducki")).toBeInTheDocument();

    // Click the toggle button to hide the image
    fireEvent.click(screen.getByText("Hide Ducki Image"));

    // Verify the image is no longer visible
    expect(screen.queryByAltText("Ducki")).not.toBeInTheDocument();

    // Click the toggle button to show the image again
    fireEvent.click(screen.getByText("Show Ducki Image"));

    // Verify the image is visible again
    expect(screen.getByAltText("Ducki")).toBeInTheDocument();
  });
});
