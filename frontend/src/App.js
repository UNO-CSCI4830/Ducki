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

// Custom hook to manage the chatbot state and logic
function useChatbot() {
  const [message, setMessage] = useState("");
  const [recentResponse, setRecentResponse] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [bgColor, setBgColor] = useState("#33363b");
  const [showSettings, setShowSettings] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

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
    }
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
    showSettings,
    setShowSettings,
    showApiKeyModal,
    setShowApiKeyModal,
    sendMessage,
    sendAPIKey,
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

      <div>
        {recentResponse && (
          <div>
            <p>
              <strong>You:</strong> {recentResponse.user}
            </p>
            <p>
              <strong>Ducki:</strong>
              <ReactMarkdown>{recentResponse.bot}</ReactMarkdown>
            </p>
          </div>
        )}
      </div>

      <div className="bottom-div">
        <form align="center" onSubmit={sendMessage}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message to Ducki"
          />
          <button type="submit">Send</button>
        </form>
      </div>

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

