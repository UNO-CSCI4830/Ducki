import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [message, setMessage] = useState('');
    const [responses, setResponses] = useState([]);

    const sendMessage = async (e) => {
        e.preventDefault();  // Prevents page reload on form submit
        if (message.trim() === '') return;  // Do nothing if the message is empty
    
        try {
            const response = await axios.post('http://localhost:5000/api/message', {
                text: message  // Send the user's message to the backend
            });
    
            // Update 'responses' array by appending the new user message and the bot's response
            setResponses((prev) => [
                ...prev,  // Spread the previous responses to retain the history
                { 
                    user: message,  // User's message
                    bot: response.data.confirmation  // Bot's response from the backend
                }
            ]);
    
            // Clear the input field after the message is sent
            setMessage('');
        } catch (error) {
            console.error('Error communicating with backend', error);
        }
    };

    return (
        <div>
            <h1>Ducki Chatbot</h1>
            <div>
                {responses.map((res, index) => (
                    <div key={index}>
                        <p><strong>You:</strong> {res.user}</p>
                        <p><strong>Ducki:</strong> {res.bot}</p>
                    </div>
                ))}
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
