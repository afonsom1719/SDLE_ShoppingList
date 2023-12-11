"use strict";
// Install required packages:
// npm install express mongoose cors express-http-proxy
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)({ origin: 'http://localhost:3000' }));
app.use(express_1.default.json());
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.j3skbou.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
};
mongoose_1.default
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
app.use('/api', (0, express_http_proxy_1.default)(() => {
    const selectedServer = servers[currentIndex];
    currentIndex = (currentIndex + 1) % servers.length;
    return selectedServer;
}));
// Simulate Gossip Protocol with in-memory array
const gossipUpdates = [];
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
