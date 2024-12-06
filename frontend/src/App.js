import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./App.css";
import Ducki from "./assets/ducki.ico";

// Helper class for managing settings (background color and visibility)
class Settings {
  constructor() {
    this.bgColor = "#33363b"; // Initial background color (dark mode)
    this.showSettings = false;
    this.showApiKeyModal = false;
  }

  // Methods to toggle settings and background color
  toggleBackgroundColor(setBgColor) {
    this.bgColor = this.bgColor === "white" ? "#33363b" : "white"; 
    setBgColor(this.bgColor); // Update the state externally
  }

  toggleSettings(setShowSettings) {
    this.showSettings = !this.showSettings; 
    setShowSettings(this.showSettings); // Update the state externally
  }

  openApiKeyModal(setShowApiKeyModal) {
    this.showApiKeyModal = true;
    setShowApiKeyModal(this.showApiKeyModal); // Update the state externally
  }

  closeApiKeyModal(setShowApiKeyModal) {
    this.showApiKeyModal = false;
    setShowApiKeyModal(this.showApiKeyModal); // Update the state externally
  }

  reset(setShowSettings, setShowApiKeyModal) {
    this.showSettings = false;
    this.showApiKeyModal = false;
    setShowSettings(false);
    setShowApiKeyModal(false); // Reset both states
  }
}

class EditUserBubble {
  openEditModal(setShowEditModal, setEditedText, currentText) {
    setEditedText(currentText); // Pre-fill the text area
    setShowEditModal(true);     // Show the modal
  }

  closeEditModal(setShowEditModal) {
    setShowEditModal(false);
  }

  saveEditedMessage(setRecentResponse, editedText, setShowEditModal) {
    setRecentResponse((prev) => ({
      ...prev,
      user: editedText,
    }));
    this.closeEditModal(setShowEditModal); // Close after saving
  }

  clearBothMessages(setRecentResponse, setShowEditModal) {
    setRecentResponse({
      user: "",
      bot: "",
    });
    this.closeEditModal(setShowEditModal); // Close after clearing
  }
}

function useChatbot() {
  const [message, setMessage] = useState("");
  const [recentResponse, setRecentResponse] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [bgColor, setBgColor] = useState("#33363b");
  const [showSettings, setShowSettings] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // For editing
  const [editedText, setEditedText] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  const settings = new Settings(); // Initialize settings object
  const editUserBubble = new EditUserBubble();

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    setRecentResponse({
      user: message,
      bot: "",
    });

    try {
      const response = await axios.post("/api/message", { text: message });
      setRecentResponse({
        user: message,
        bot: response.data.response,
      });
      setMessage("");
    } catch (error) {
      console.error("Error communicating with backend", error);
    } finally {
      clearMessageBox();
    }
  };

  // function to clear Message box upon sending message to Ducki
  const clearMessageBox = () => {
    setMessage("");
  };

  const sendAPIKey = async (e) => {
    e.preventDefault();

    if (apiKey.trim() === "") {
      console.error("API key is required");
      return;
    }

    try {
      const response = await axios.post("/api/api_key", { api_key: apiKey });
      console.log("API key sent successfully:", response.data.message);
      settings.closeApiKeyModal(setShowApiKeyModal);
      setApiKey(""); // Clear the API key input field after submission
    } catch (error) {
      console.error("Error sending API key to backend", error);
    }
  };

  return {
    message,
    setMessage,
    recentResponse,
    setRecentResponse,
    settings,
    apiKey,
    setApiKey,
    bgColor,
    setBgColor,
    showSettings,
    setShowSettings,
    showApiKeyModal,
    setShowApiKeyModal,
    sendMessage,
    sendAPIKey,
    editUserBubble,
    editedText,
    setEditedText,
    showEditModal,
    setShowEditModal,
  };
}

const Chatbot = () => {
  const {
    message,
    setMessage,
    recentResponse,
    setRecentResponse,
    settings,
    apiKey,
    setApiKey,
    bgColor,
    setBgColor,
    showSettings,
    setShowSettings,
    showApiKeyModal,
    setShowApiKeyModal,
    sendMessage,
    sendAPIKey,
    editUserBubble,
    editedText,
    setEditedText,
    showEditModal,
    setShowEditModal,
  } = useChatbot();

  return (
    <div className="container" style={{ backgroundColor: bgColor }}>
      <button className="settings-button" onClick={() => settings.toggleSettings(setShowSettings)}>
        ⚙️ Settings
      </button>

      <h1 align="center" style={{ color: bgColor === "white" ? "black" : "white" }}>
        Ducki Chatbot
      </h1>

      <div className="DuckiImage">
        <img src={Ducki} alt="Ducki icon" />
      </div>

      {recentResponse && (recentResponse.user || recentResponse.bot) && (
        <div className="chat-container">
          <div className="chat-bubble user-bubble">
            <strong>You:</strong> {recentResponse.user}
          </div>
          <button
            className="edit-button-user"
            onClick={() =>
              editUserBubble.openEditModal(setShowEditModal, setEditedText, recentResponse.user)
            }
          >
            Edit
          </button>
          <div className="chat-bubble bot-bubble">
            <strong>Ducki:</strong> <ReactMarkdown>{recentResponse.bot}</ReactMarkdown>
          </div>
        </div>
      )}

      <div className="bottom-div">
        <form align="center" onSubmit={sendMessage}>
          <div className="input-container">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.shiftKey) {
                  e.preventDefault();
                  setMessage((prev) => prev + "\n");
                }
              }}
              placeholder="Type a message to Ducki"
            />
            <button type="submit">Send</button>
          </div>
        </form>
      </div>

      {showEditModal && (
        <div className="edit-modal">
          <h2>Edit Your Message</h2>
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
          <div>
            <button onClick={() => editUserBubble.clearBothMessages(setRecentResponse, setShowEditModal)}>
              Clear
            </button>
            <button onClick={() => editUserBubble.saveEditedMessage(setRecentResponse, editedText, setShowEditModal)}>
              Send
            </button>
            <button onClick={() => editUserBubble.closeEditModal(setShowEditModal)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="settings-modal">
          <h2>Settings</h2>
          <p>Adjust your settings here.</p>
          <div>
            <label>Select Background Color:</label>
            <button onClick={() => settings.toggleBackgroundColor(setBgColor)}>
              Toggle to {bgColor === "white" ? "#33363b" : "White"}
            </button>
          </div>
          <div>
            <button onClick={() => settings.openApiKeyModal(setShowApiKeyModal)}>
              Input API Key
            </button>
          </div>
          <button onClick={() => settings.reset(setShowSettings, setShowApiKeyModal)}>
            Cancel
          </button>
        </div>
      )}

      {showApiKeyModal && (
        <div className="settings-modal">
          <h2>Enter API Key</h2>
          <form onSubmit={sendAPIKey}>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
            />
            <button type="submit">Save API Key</button>
            <button type="button" onClick={() => settings.closeApiKeyModal(setShowApiKeyModal)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  ); 
};

export default Chatbot;

