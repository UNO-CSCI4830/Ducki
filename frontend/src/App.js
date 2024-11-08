import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [recentResponse, setRecentResponse] = useState(null);

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
    }
  };

  return (
    <div>
      <h1 className="">Ducki</h1>
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
