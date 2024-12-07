import React from "react";
import { act } from "@testing-library/react";
import EditUserBubble from  "App.js"; 

describe("EditUserBubble - closeEditModal", () => {
  let editUserBubble;
  let setShowEditModal;

  beforeEach(() => {
    editUserBubble = new EditUserBubble();
    setShowEditModal = jest.fn();
  });

  test("should hide the edit modal", () => {
    act(() => {
      editUserBubble.closeEditModal(setShowEditModal);
    });

    expect(setShowEditModal).toHaveBeenCalledWith(false);
  });
});
