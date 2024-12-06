import { render, fireEvent, screen } from "@testing-library/react";
import Chatbot from "../../App.js";

describe("Settings modal Cancel button functionality", () => {
  it("should close the settings modal when Cancel is clicked", () => {
    
    render(<Chatbot />);

   
    const settingsButton = screen.getByText("⚙️ Settings");
    fireEvent.click(settingsButton);

  
    expect(screen.getByText("Settings")).toBeInTheDocument();

 
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });
});
