const express = require('express');
const axios = require('axios')
const { createProxyMiddleware } = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Frontend Route to render form
app.get('/', (req, res) => {
    res.send(`
        <h1>Ducki Frontend</h1>
        <form action="/send-message" method="POST">
            <input type="text" name="message" placeholder="Message for Ducki">
            <button type="submit">Send</button>
        </form>
    `);
});

// Route to handle POST requests and proxy them to Python backend
app.use('/api', createProxyMiddleware({
    target: 'http://localhost:5000',  // Python backend URL
    changeOrigin: true
}));

// Route to send message to the Python backend
app.post('/send-message', async (req, res) => {
    const message = req.body.message;

    try {
        // Send POST request to FastAPI backend
        const response = await axios.post('http://localhost:5000/api/message', {
            text: message
        });

        // Display confirmation from the backend
        res.send(`
            <h2>Backend says: ${response.data.confirmation}</h2>
            <a href="/">Send another message</a>
        `);
    } catch (error) {
        console.error('Error communicating with the backend', error);
        res.status(500).send('Error communicating with the backend');
    }
});

// Start the Node.js frontend server
app.listen(3000, () => {
    console.log('Node.js frontend running on http://localhost:3000');
});
