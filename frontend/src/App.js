import React, { useState } from "react";
import axios from "axios";
import './App.css';
import Ducki from './assets/ducki.ico';

const Chatbot = () => {
  const [message, setMessage] = useState("");  
  const [recentResponse, setRecentResponse] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [bgColor, setBgColor] = useState("#33363b");

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

  // Toggle background color between black and white
  const toggleBackgroundColor = () => {
    setBgColor(prevColor => prevColor === "white" ? "#33363b" : "white");
  };

  return (
    <div className="container" style={{ backgroundColor: bgColor }}> {/* Apply dynamic background color */}
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

      {/* Settings Modal */}
      {showSettings && (
        <div className="settings-modal">
          <h2>Settings</h2>
          <p>Adjust your settings here.</p>
          <div>
            <label>Select Background Color:</label>
            <button onClick={toggleBackgroundColor}>
              Toggle to {bgColor === "white" ? "Black" : "White"}
            </button>
          </div>
          <button onClick={closeSettings}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
