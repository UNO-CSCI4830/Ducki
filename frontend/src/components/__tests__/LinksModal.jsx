import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LinkModal from "../LinksModal";

// Mock `window.open` to verify it gets called correctly
beforeEach(() => {
  window.open = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("LinkModal Component", () => {
  const links = [
    { name: "GitHub", url: "https://github.com/UNO-CSCI4830/Ducki/" },
    { name: "Stack Overflow", url: "https://stackoverflow.com" },
    { name: "GeeksForGeeks", url: "https://www.geeksforgeeks.org" },
  ];

  it("renders the modal with provided links", () => {
    render(<LinkModal links={links} onClose={jest.fn()} />);

    // Check modal title
    expect(screen.getByText("External Links")).toBeInTheDocument();

    // Check all link buttons
    links.forEach((link) => {
      expect(screen.getByText(link.name)).toBeInTheDocument();
    });

    // Check Close button
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("calls window.open with the correct URL when a link is clicked", () => {
    render(<LinkModal links={links} onClose={jest.fn()} />);

    // Simulate clicking the first link
    const githubButton = screen.getByText("GitHub");
    fireEvent.click(githubButton);

    // Assert window.open was called with the correct URL
    expect(window.open).toHaveBeenCalledWith(links[0].url, "_blank");
  });

  it("calls onClose when the Close button is clicked", () => {
    const mockOnClose = jest.fn();
    render(<LinkModal links={links} onClose={mockOnClose} />);

    // Simulate clicking the Close button
    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    // Assert the onClose function was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("handles an empty links array gracefully", () => {
    render(<LinkModal links={[]} onClose={jest.fn()} />);

    // Check modal title
    expect(screen.getByText("External Links")).toBeInTheDocument();

    // Assert no link buttons are rendered
    const linkButtons = screen.queryAllByRole("button", { name: /.+/ });
    expect(linkButtons).toHaveLength(1); // Only the Close button should be present
  });
});
