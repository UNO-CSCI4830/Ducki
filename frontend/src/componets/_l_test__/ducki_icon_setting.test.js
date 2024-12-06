import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Chatbot from "../../App.js"; 

global.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn().mockResolvedValue(),
}));

describe("Chatbot Component", () => {
  it("should toggle settings modal when clicking the settings button", () => {
    render(<Chatbot />);

    const settingsButton = screen.getByText("⚙️ Settings");

   
    expect(screen.queryByText("Settings")).toBeNull();


    fireEvent.click(settingsButton);
    
    
    expect(screen.getByText("Settings")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));
    
   
    expect(screen.queryByText("Settings")).toBeNull();
  });
});
