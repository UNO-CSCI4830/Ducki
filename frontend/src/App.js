import React, { useState } from "react";
import axios from "axios";
import './App.css'
import Ducki from './assets/ducki.ico'



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
  const [showSettings, setShowSettings] = useState(false);
  const [bgColor, setBgColor] = useState("#33363b");
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault(); 
    if (message.trim() === "") return; // Do nothing if the message is empty

    try {
      const response = await axios.post("/api/message", {
        text: message,
      });

      // Update the 'recentResponse' state with the new user message and bot's response
      setRecentResponse({
        user: message, // User message
        bot: response.data.response, // Ducki's response
      });

      // Clear the input field after the message is sent
      setMessage("");
    } catch (error) {
      console.error("Error communicating with backend", error);
    } finally {
      clearMessageBox();
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
      setShowApiKeyModal(false);
      setApiKey(""); // Clear the API key input field after submission
    } catch (error) {
      console.error("Error sending API key to backend", error);
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  const openApiKeyModal = () => {
    setShowApiKeyModal(true);
  };

  const closeApiKeyModal = () => {
    setShowApiKeyModal(false);
    setApiKey(""); // Clear API key input on cancel
  };

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const toggleBackgroundColor = () => {
    setBgColor((prevColor) => (prevColor === "white" ? "#33363b" : "white"));
  };

  return (
    <div className="container" style={{ backgroundColor: bgColor }}>
      <button className="settings-button" onClick={toggleSettings}>
        ⚙️ Settings
      </button>

      <h1
        align="center"
        style={{ color: bgColor === "white" ? "black" : "white" }}
      >
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
              <strong>Ducki:</strong> {recentResponse.bot}
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
            <button onClick={toggleBackgroundColor}>
              Toggle to {bgColor === "white" ? "#33363b" : "White"}
            </button>
          </div>
          <div>
            <button onClick={openApiKeyModal}>Input API Key</button>
          </div>
          <button onClick={closeSettings}>Cancel</button>
        </div>
      )}

      {showApiKeyModal && (
        <div className="settings-modal">
          <h2>Enter API Key</h2>
          <form onSubmit={sendAPIKey}>
            <input
              type="text"
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="Enter your API key"
            />
            <button type="submit">Save API Key</button>
            <button type="button" onClick={closeApiKeyModal}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

