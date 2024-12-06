import { render, screen, fireEvent } from '@testing-library/react';
import Chatbot from "../../App.js";

test('shows explanation when "What is this chatbot?" is clicked', async () => {
  render(<Chatbot />);

  const settingsButton = screen.getByRole('button', { name: /⚙️ Settings/i });
  fireEvent.click(settingsButton);

 
  const explanationButton = await screen.findByRole('button', { name: /What is this chatbot\?/i });
  expect(explanationButton).toBeInTheDocument();

 
  fireEvent.click(explanationButton);


  const explanationText = await screen.findByText(/Greetings, Thanks for using Ducki!/i);
  expect(explanationText).toBeInTheDocument();

  // Close the explanation
  const closeButton = screen.getByRole('button', { name: /Close/i });
  fireEvent.click(closeButton);

  // Ensure the explanation modal is closed
  expect(explanationText).not.toBeInTheDocument();
});
