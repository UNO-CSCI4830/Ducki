// Import the function
import { showAlert } from '../alert.js';

describe('showAlert function', () => {
  // Mock the global alert function
  beforeEach(() => {
    global.alert = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should call alert with the correct message', () => {
    const testMessage = 'Test Alert Message';
    
    // Call the function
    showAlert(testMessage);

    // Expect global alert to have been called with the correct message
    expect(global.alert).toHaveBeenCalledWith(testMessage);
  });

  it('should call alert exactly once', () => {
    const testMessage = 'Another Alert Message';
    
    // Call the function
    showAlert(testMessage);

    // Expect global alert to be called once
    expect(global.alert).toHaveBeenCalledTimes(1);
  });
});
