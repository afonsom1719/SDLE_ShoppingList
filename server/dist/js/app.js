"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const crdts_1 = require("./types/crdts");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(routes_1.default);
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.j3skbou.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
};
mongoose_1.default
    .connect(uri, options)
    .then(() => console.log('Database connected'))
    .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the application if MongoDB connection fails
});
let ormap = new crdts_1.Ormap('x');
let ormap2 = new crdts_1.Ormap('y');
ormap.get('macas').inc(2);
ormap2.get('macas').inc(3);
ormap2.get('peras').inc(2);
for (const kv of ormap.m) {
    console.log("Ormap x: ", kv.key, kv.value.read());
}
for (const kv of ormap2.m) {
    console.log("Ormap y: ", kv.key, kv.value.read());
}
ormap.join(ormap2);
for (const kv of ormap.m) {
    console.log("Ormap x: ", kv.key, kv.value.read());
}
for (const kv of ormap2.m) {
    console.log("Ormap y: ", kv.key, kv.value.read());
}
