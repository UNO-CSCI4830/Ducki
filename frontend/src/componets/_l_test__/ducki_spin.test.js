import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Chatbot from "../../App.js"; 

test('should play sound and spin Ducki image when clicked', async () => {
  const playSpy = jest.spyOn(global.HTMLAudioElement.prototype, 'play').mockImplementation(() => Promise.resolve());

  render(<Chatbot />);

 
  const settingsButton = screen.getByText('⚙️ Settings');
  fireEvent.click(settingsButton);

  const duckiImage = await screen.findByAltText('Ducki icon settings');

  
  expect(duckiImage).not.toHaveClass('spin');


  fireEvent.click(duckiImage);

 
  expect(duckiImage).toHaveClass('spin');

  // Wait for the timeout 
  await waitFor(() => {

    expect(duckiImage).not.toHaveClass('spin');

  }, { timeout: 1100 });  // 1001ms = 1.001 seconds

  expect(playSpy).toHaveBeenCalledTimes(1);

  playSpy.mockRestore();
});
