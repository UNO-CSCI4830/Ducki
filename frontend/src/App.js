import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import Popup from "./components/popup"
import DuckiImageToggle from "./components/HideDucki";


// Helper class for managing settings (background color and visibility)
class Settings {
  constructor() {
    this.bgColor = "#33363b"; // Initial background color (dark mode)
    this.showSettings = false;
    this.showApiKeyModal = false;
  }

  // Methods to toggle settings and background color
  toggleBackgroundColor(setBgColor) {

    // Old Implementation
    // this.bgColor = this.bgColor === "#FFFFFF" ? "#33363b" : "#FFFFFF";
    // setBgColor(this.bgColor); // Update the state externally

    //New implementation
    setBgColor((prevColor) => (prevColor === "#FFFFFF" ? "#33363b" : "#FFFFFF"));
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


// Custom hook to manage the chatbot state and logic
function useChatbot() {

  // experimental popup
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [recentResponse, setRecentResponse] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [bgColor, setBgColor] = useState("#33363b");
  const [showSettings, setShowSettings] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [fontSize, setFontSize] = useState(16); // New state for font size

  const settings = new Settings(); // Initialize settings object

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
      settings.closeApiKeyModal(setShowApiKeyModal);
      setApiKey(""); // Clear the API key input field after submission
      setShowPopup(true); // Show the confirmation popup
    } catch (error) {
      console.error("Error sending API key to backend");
    }
  };


  return {
    message,
    setMessage,
    recentResponse,
    settings,
    apiKey,
    setApiKey,
    bgColor,
    setBgColor,
    fontSize,
    setFontSize,
    showSettings,
    setShowSettings,
    showApiKeyModal,
    setShowApiKeyModal,
    sendMessage,
    sendAPIKey,
    showPopup,
    setShowPopup
  };
}

const Chatbot = () => {
  const {
    message,
    setMessage,
    recentResponse,
    settings,
    apiKey,
    setApiKey,
    bgColor,
    setBgColor,
    fontSize,
    setFontSize,
    showSettings,
    setShowSettings,
    showApiKeyModal,
    setShowApiKeyModal,
    sendMessage,
    sendAPIKey,
    showPopup,
    setShowPopup
  } = useChatbot();

  const toggleFontSize = () => {
    setFontSize((prevSize) => (prevSize === 16 ? 20 : 16)); // Toggle between 16px and 20px
  };

  return (
    <div className="container" style={{ backgroundColor: bgColor, fontSize: `${fontSize}px`, }} data-testid="chatbot-container">
      <button className="settings-button" onClick={() => settings.toggleSettings(setShowSettings)}>
        ⚙️ Settings
      </button>

      <h1 align="center" style={{ color: bgColor === "#FFFFFF" ? "black" : "#ffc438" }}>
        Ducki Chatbot
      </h1>

      {/* Old implementation */}
      {/* <div className="DuckiImage">
        <ImageComponent src={Ducki} alt="Ducki" />
      </div> */}

      <button className="font-toggle-button" onClick={toggleFontSize}>
        {fontSize === 16 ? "Increase Font Size" : "Reset Font Size"}
      </button>

      <DuckiImageToggle />

      <div>
        {recentResponse && (
          <div>
            <p>
              <strong>You:</strong> {recentResponse.user}
            </p>
            <p>
              <strong>Ducki:</strong>
              <p>{recentResponse.bot}</p>
            </p>
          </div>
        )}
      </div>

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

      {showSettings && (
        <div className="settings-modal">
          <h2>Settings</h2>
          <p>Adjust your settings here.</p>
          <div>
            <label>Select Background Color:</label>
            <button onClick={() => settings.toggleBackgroundColor(setBgColor)}>
              Toggle to {bgColor === "#FFFFFF" ? "#33363b" : "#FFFFFF"}
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
      {showPopup && (
        <Popup
          message="API Key Successfully Submitted!"
          onClose={() => setShowPopup(false)} // Hide the popup on dismiss
        />
      )}
    </div>
  );
};

export default Chatbot;