import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [message, setMessage] = useState('');
    const [responses, setResponses] = useState([]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (message.trim() === '') return;

        try {
            const response = await axios.post('http://localhost:5000/api/message', {
                text: message
            });
            
            // Add both the sent message and the response from the backend
            setResponses((prev) => [
                ...prev,
                { user: message, bot: response.data.confirmation }
            ]);

            // Clear the input after sending the message
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
