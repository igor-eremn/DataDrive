require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('ws');

const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const wss = new Server({ server });

// Handle new WebSocket connections
wss.on('connection', (ws) => {
  console.log('WebSocket connection established');

  ws.send(JSON.stringify({ message: 'WebSocket connected!' }));
  ws.on('message', (msg) => console.log('Received:', msg));
  ws.on('close', () => console.log('WebSocket connection closed'));
});

// Broadcasts data to all connected WebSocket clients.
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Import and set up API routes, passing the broadcast function for real-time updates
const setupRoutes = require('./routes');
app.use('/api', setupRoutes(broadcast));

app.get('/', (req, res) => {
  res.send('Vehicle Dashboard API!');
});

// Start the server and listen on the specified port
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
