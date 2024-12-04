// ImageComponent.test.js
import { render, screen } from '@testing-library/react';
import ImageComponent from '../ImageComponent.js';

test('renders image with correct alt attribute', () => {
  // Render the component
  render(<ImageComponent src="../../assets/ducki.ico" alt="Ducki" />);

  // Find the image element
  const imageElement = screen.getByRole('img');

  // Assert that the image has the correct alt attribute
  expect(imageElement).toHaveAttribute('alt', 'Ducki');

  // Optionally, you could check that the image has a non-empty src attribute
  expect(imageElement).toHaveAttribute('src');
});
