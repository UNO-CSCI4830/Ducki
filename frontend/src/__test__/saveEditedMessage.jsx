import React from "react";
import { act } from "@testing-library/react";
import EditUserBubble from "App.js" ;

describe("EditUserBubble - saveEditedMessage", () => {
  let editUserBubble;
  let setRecentResponse;

  beforeEach(() => {
    editUserBubble = new EditUserBubble();
    setRecentResponse = jest.fn((updateFn) => {
      const initialResponse = { user: "Old message", bot: "Hello" };
      return updateFn(initialResponse);
    });
    setShowEditModal = jest.fn();
  });

  test("should update recentResponse user message and close the modal", () => {
    const editedText = "Update message";

    let updatedResponse;
    act(() => {
      updatedResponse = editUserBubble.saveEditedMessage(
        setRecentResponse,
        editedText,
        setShowEditModal
      );
    });

    // Extract the updated state from the mock
    const finalResponse = setRecentResponse.mock.results[0].value;
    expect(finalResponse.user).toBe(editedText);
    expect(finalResponse.bot).toBe("Hello");
    expect(setShowEditModal).toHaveBeenCalledWith(false);
  });
});
