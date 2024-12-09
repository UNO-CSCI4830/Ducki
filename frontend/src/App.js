import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./App.css";
import Ducki from "./assets/ducki.ico";
import DuckiNoise from "./assets/genericquack.mp3"


const playDuckSound = () => {
  const quackSound = new Audio(DuckiNoise); //DUCKI NOISE
  quackSound.play().catch((error) => {
    console.error('Audio playback error:', error);
  });
};

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

// Custom hook to manage the chatbot state and logic
function useChatbot() {
  const [message, setMessage] = useState("");
  const [recentResponse, setRecentResponse] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [bgColor, setBgColor] = useState("#33363b");
  const [showSettings, setShowSettings] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [fontResponse, setFontResponse] = useState("16px");
  const [model, setModel] = useState("gpt-4o-mini");
  const [editedText, setEditedText] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  const settings = new Settings();
  const editUserBubble = new EditUserBubble();

  const models = ["gpt-4o-mini", "gpt-4", "gpt-4-turbo", "gpt-4o", "gpt-3.5-turbo"];

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    setRecentResponse({ user: message, bot: "" });

    try {
      const response = await axios.post("/api/message", { text: message });
      setRecentResponse({ user: message, bot: response.data.response });
      playDuckSound();
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
      setApiKey("");
    } catch (error) {
      console.error("Error sending API key to backend", error);
    }
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
    setApiKey("");
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
    showExplanation,
    setShowExplanation,
    fontResponse,
    setFontResponse,
    toggleModel,
    model,
    closeApiKeyModal,
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
    toggleModel,
    model,
    sendAPIKey,
    showExplanation, // Add this
    openExplanation, // Add this
    closeExplanation, // Add this
    fontResponse,   // This is used correctly now
    setFontResponse, // This is used correctly now
    editUserBubble,
    editedText,
    setEditedText,
    showEditModal,
    setShowEditModal,
  } = useChatbot();

  
 
  const [isSpinning, setIsSpinning] = useState(false);
  const handleDuckiClick = () => {
    setIsSpinning(true);
    playDuckSound();
    setTimeout(() => setIsSpinning(false), 1000); // Remove the spin class after 1 second
  };

  return (
    <div className="container" style={{ backgroundColor: bgColor }}>
      <button className="settings-button" onClick={() => settings.toggleSettings(setShowSettings)} style={{ fontSize: fontResponse }}>
        ⚙️ Settings
      </button>

      <h1 align="center" style={{ color: bgColor === "white" ? "black" : "white" }} >
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
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message to Ducki"
            style={{ fontSize: fontResponse }} // Use fontResponse here
          />
          <button type="submit" style={{ fontSize: fontResponse }}>Send</button>
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
          <h2 className="settings-title" style={{ fontSize: fontResponse }}>
           Settings
          </h2>

          {/* Ducki Image */}
          <div className="duck-container">
            <img 
              src={Ducki} 
              alt="Ducki icon" 
              className={`settings-ducki-image ${isSpinning ? "spin" : ""}`} 
              onClick={handleDuckiClick} 
            />
          </div>

          <div className="settings-black-bar"></div>

          <div>
          <label style={{ fontSize: fontResponse }}>Select Background Color</label>

            <div className="background-toggle-buttons">
              <button onClick={() => setBgColor("#33363b")} className="black-button" style={{ fontSize: fontResponse }}>
                Black
              </button>
              <button onClick={() => setBgColor("#FFFDD0")} className="white-button" style={{ fontSize: fontResponse }}>
                White
              </button>
            </div>
          </div>

          <div>
          <label style={{ fontSize: fontResponse }}>Select Font Size</label>
            <div className="font-size-toggle-buttons">
              <button onClick={() => setFontResponse("12px")} className="font-size-button" style={{ fontSize: fontResponse }}>
                Small
              </button>
              <button onClick={() => setFontResponse("16px")} className="font-size-button" style={{ fontSize: fontResponse }}>
                Medium
              </button>
              <button onClick={() => setFontResponse("20px")} className="font-size-button" style={{ fontSize: fontResponse }}>
                Large
              </button>
            </div>
          </div>

          <div>
            <button onClick={() => settings.openApiKeyModal(setShowApiKeyModal)} style={{ fontSize: fontResponse }}>
              Input API Key
            </button>
          </div>
          <div>
            <button onClick={openExplanation} style={{ fontSize: fontResponse }} >What is this chatbot? </button>
          </div>
          <br/>
          <div>
            Toggle Chat Model<br/>
            <button style={{ fontSize: fontResponse }} onClick={toggleModel}>Current Model: {model}</button>
          </div>
          <button onClick={() => settings.reset(setShowSettings, setShowApiKeyModal)} style={{ fontSize: fontResponse }}>
            Cancel
          </button>
        </div>
      )}

      {showExplanation && (
        <div className="settings-modal">
          <h2 style={{ fontSize: fontResponse }}>About Ducki Chatbot</h2>
          <p style={{ fontSize: fontResponse }}>
            Greetings, Thanks for using Ducki! The following is a brief explanation
            of Ducki. The purpose of Ducki is to assist programmers like you with questions
            related to programming.
          </p>
          <button style={{ fontSize: fontResponse }} onClick={closeExplanation}>Close</button>
        </div>
      )}

      {showApiKeyModal && (
        <div className="settings-modal">
          <h2 style={{ fontSize: fontResponse }}>Enter API Key</h2>

          <form onSubmit={sendAPIKey}>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
            />
            <button type="submit" style={{ fontSize: fontResponse }}>Save API Key</button>
            <button type="button"style={{ fontSize: fontResponse }} onClick={() => settings.closeApiKeyModal(setShowApiKeyModal)}>
              Close
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
