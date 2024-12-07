import React from "react";
import { act } from "@testing-library/react";
import EditUserBubble from "App.js"; 

describe("EditUserBubble - openEditModal", () => {
  let editUserBubble;
  let setShowEditModal;
 
  beforeEach(() => {
    editUserBubble = new EditUserBubble();
    setShowEditModal = jest.fn();
    setEditedText = jest.fn();
  });

  test("should set the edited text and show the edit modal", () => {
    const currentText = "Hello Ducki";

    act(() => {
      editUserBubble.openEditModal(setShowEditModal, setEditedText, currentText);
    });

    expect(setEditedText).toHaveBeenCalledWith(currentText);
    expect(setShowEditModal).toHaveBeenCalledWith(true);
  });
});
