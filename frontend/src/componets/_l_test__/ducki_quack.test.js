import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Chatbot from "../../App.js"; 

test('should play sound when Ducki image is clicked', async () => {
  const playSpy = jest.spyOn(global.HTMLAudioElement.prototype, 'play').mockImplementation(() => Promise.resolve());

  render(<Chatbot />);

  // Open  settings 
  const settingsButton = screen.getByText('⚙️ Settings');
  fireEvent.click(settingsButton);

  // Find the Ducki image in the modal
  const duckiImage = await screen.findByAltText('Ducki icon settings');

  //QUAKING
  fireEvent.click(duckiImage);

  expect(playSpy).toHaveBeenCalledTimes(1);

  playSpy.mockRestore(); 
});
