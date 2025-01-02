require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('ws');

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));
app.use(express.json());

// Environment Variables
const PORT = process.env.PORT || 3000;
const API_PREFIX = '/api';
const WS_PATH = '/ws';

const server = http.createServer(app);
const wss = new Server({ server, path: WS_PATH });

// Handle WebSocket Connections
wss.on('connection', (ws) => {
  console.log('WebSocket connection established');

  ws.send(JSON.stringify({ message: 'WebSocket connected!' }));

  ws.on('message', (msg) => {
    console.log('Received:', msg);
  });

  ws.on('close', () => console.log('WebSocket connection closed'));
});

// Broadcast Function for Real-Time Updates
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Import and Set Up API Routes, Passing the Broadcast Function
const setupRoutes = require('./routes');
app.use(API_PREFIX, setupRoutes(broadcast));

app.get('/', (req, res) => {
  res.send('Vehicle Dashboard API!');
});

// Start the Server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server running at ws://${server.address().address}:${PORT}${WS_PATH}`);
});