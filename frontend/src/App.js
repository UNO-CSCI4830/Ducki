import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
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
        user: message,
        bot: response.data.response,
      });

      // Clear the input field after the message is sent
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
    <div>
      <h1>Ducki</h1>
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
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
