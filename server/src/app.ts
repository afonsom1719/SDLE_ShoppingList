// Install required packages:
// npm install express mongoose cors express-http-proxy

import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import proxy from 'express-http-proxy';

const app: Express = express();

const PORT: string | number = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const uri: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.j3skbou.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

mongoose
  .connect(uri, options)
  .then(() => console.log('Database connected'))
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

// Load Balancer with Round-Robin using express-http-proxy

const servers = [
  'http://localhost:4001',
  'http://localhost:4002',
  // Add more server instances as needed
];

let currentIndex = 0;

app.use(
  '/api',
  proxy(() => {
    const selectedServer = servers[currentIndex];
    currentIndex = (currentIndex + 1) % servers.length;
    return selectedServer;
  })
);

// Simulate Gossip Protocol with in-memory array

const gossipUpdates: string[] = [];

// Endpoint to simulate gossip updates
app.get('/gossip', (req, res) => {
  const update = `Update from ${req.headers.host}`;
  gossipUpdates.push(update);
  res.json({ update });
});

// Endpoint to get all gossip updates
app.get('/gossip/all', (req, res) => {
  res.json({ gossipUpdates });
});

// Start Express server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
