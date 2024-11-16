import React, { useState } from "react";
import axios from "axios";
import './App.css';
import Ducki from './assets/ducki.ico';

const Chatbot = () => {
  const [message, setMessage] = useState("");  
  const [recentResponse, setRecentResponse] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [bgColor, setBgColor] = useState("#33363b");
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

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

  const saveApiKey = () => {
    console.log("API Key saved:", apiKey);
    setShowApiKeyModal(false);
    setApiKey(""); // Clear API key input after saving
  };

  const toggleBackgroundColor = () => {
    setBgColor(prevColor => prevColor === "white" ? "#33363b" : "white");
  };

  return (
    <div className="container" style={{ backgroundColor: bgColor }}>
      <button className="settings-button" onClick={toggleSettings}>
        ⚙️ Settings
      </button>

      <h1 align="center" style={{ color: bgColor === "white" ? "black" : "white" }}>Ducki Chatbot</h1>

      <div className="DuckiImage">
        <img src={Ducki} alt="Ducki icon" />
      </div>

      <div>
        {recentResponse && (
          <div>
            <p><strong>You:</strong> {recentResponse.user}</p>
            <p><strong>Ducki:</strong> {recentResponse.bot}</p>
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
          <input
            type="text"
            value={apiKey}
            onChange={handleApiKeyChange}
            placeholder="Enter your API key"
          />
          <button onClick={saveApiKey}>Save API Key</button>
          <button onClick={closeApiKeyModal}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
