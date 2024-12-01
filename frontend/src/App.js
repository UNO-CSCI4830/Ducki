import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown"; // Import react-markdown
import './App.css';
import Ducki from './assets/ducki.ico';

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [recentResponse, setRecentResponse] = useState(null);

  const sendMessage = async (e) => {
    e.preventDefault(); 
    if (message.trim() === "") return;

    try {
      const response = await axios.post("/api/message", {
        text: message,
      });

      setRecentResponse({
        user: message,
        bot: response.data.response,
      });

      setMessage("");
    } catch (error) {
      console.error("Error communicating with backend", error);
    }
  };

  return (
    <div className="container">
      <h1 align="center" style={{ color: "white" }}>Ducki Chatbot</h1>
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
    </div>
  ); 
};

export default Chatbot;
