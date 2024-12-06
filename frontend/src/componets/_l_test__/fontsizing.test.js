import { render, screen, fireEvent } from '@testing-library/react';
import Chatbot from "../../App.js"; 

test('changes font size when Small, Medium, and Large buttons are clicked', () => {
  // Render the component
  render(<Chatbot />);


  const settingsButton = screen.getByRole('button', { name: /⚙️ Settings/i });
  fireEvent.click(settingsButton);

  // font size buttons are visible
  const smallButton = screen.getByRole('button', { name: /Small/i });
  const mediumButton = screen.getByRole('button', { name: /Medium/i });
  const largeButton = screen.getByRole('button', { name: /Large/i });


  fireEvent.click(smallButton);
  
 
  const inputField = screen.getByPlaceholderText(/Type a message to Ducki/i);
  expect(inputField).toHaveStyle('font-size: 12px');


  fireEvent.click(mediumButton);
  
  
  expect(inputField).toHaveStyle('font-size: 16px');


  fireEvent.click(largeButton);
  
 
  expect(inputField).toHaveStyle('font-size: 20px');
});
