require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('ws');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const wss = new Server({ server });

wss.on('connection', (ws) => {
  console.log('ws connection established');
  ws.send(JSON.stringify({ message: 'ws connected!' }));
  ws.on('message', (msg) => console.log('Received:', msg));
  ws.on('close', () => console.log('ws connection closed'));
});

const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

const setupRoutes = require('./routes');
app.use('/api', setupRoutes(broadcast));

app.get('/', (req, res) => {
  res.send('Vehicle Dashboard API!');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});