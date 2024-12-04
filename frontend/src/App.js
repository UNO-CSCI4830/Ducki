import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./App.css";
import Ducki from "./assets/ducki.ico";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [recentResponse, setRecentResponse] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [bgColor, setBgColor] = useState("#33363b");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("")
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const models = [
    "gpt-4o-mini",
    "gpt-4",
    "gpt-4-turbo",
    "gpt-4o",
    "gpt-3.5-turbo"
  ]

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

  const toggleModel = async () => {
    const nextModelIndex = (models.indexOf(model) + 1) % models.length;
    const newModel = models[nextModelIndex];
    setModel(newModel);
  
    try {
      const response = await axios.post("/api/set_model", { model: newModel });
      console.log("Model changed successfully:", response.data.message);
    } catch (error) {
      console.error("Error changing model:", error);
    }
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
            <button onClick={toggleBackgroundColor}>
              Toggle to {bgColor === "white" ? "#33363b" : "White"}
            </button>
          </div>
          <div>
            <button onClick={openApiKeyModal}>Input API Key</button>
          </div>
          <br/>
          <div>
            Toggle Chat Model<br/>
            <button onClick={toggleModel}>Current Model: {model}</button>
          </div>
          <button onClick={closeSettings}>Close</button>
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
              Close
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
