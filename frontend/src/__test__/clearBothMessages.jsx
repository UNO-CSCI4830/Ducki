import React from "react";
import { act } from "@testing-library/react";
import EditUserBubble from "App.js"; 

describe("EditUserBubble - clearBothMessages", () => {
  let setRecentResponse;
  let setShowEditModal;

  beforeEach(() => {
    editUserBubble = new EditUserBubble();
    setRecentResponse = jest.fn((newState) => newState);
    setShowEditModal = jest.fn();
  });

  test("should clear user and bot messages and close the modal", () => {
    let clearedState;
    act(() => {
      clearedState = editUserBubble.clearBothMessages(
        setRecentResponse,
        setShowEditModal
      );
    });

    // Check if recentResponse was cleared
    const finalResponse = setRecentResponse.mock.results[0].value;
    expect(finalResponse.user).toBe("");
    expect(finalResponse.bot).toBe("");
    expect(setShowEditModal).toHaveBeenCalledWith(false);
  });
});
