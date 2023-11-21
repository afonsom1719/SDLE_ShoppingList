"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const ccounter_1 = require("./types/ccounter");
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
// Create two instances of CCounter with different ids
let c1 = new ccounter_1.CCounter("c1");
let c2 = new ccounter_1.CCounter("c2");
// Increment c1 by 3 and c2 by 5
c1.inc(3);
c2.inc(5);
// Print the values of c1 and c2
console.log("c1 = " + c1.read()); // c1 = 3
console.log("c2 = " + c2.read()); // c2 = 5
// Join c1 and c2
c1.join(c2);
// Print the values of c1 and c2 after joining
console.log("c1 = " + c1.read()); // c1 = 8
console.log("c2 = " + c2.read()); // c2 = 8
// Decrement c1 by 2 and c2 by 4
c1.dec(2);
c2.dec(4);
// Print the values of c1 and c2 after decrementing
console.log("c1 = " + c1.read()); // c1 = 6
console.log("c2 = " + c2.read()); // c2 = 4
// Reset c1
c1.reset();
// Print the value of c1 after resetting
console.log("c1 = " + c1.read()); // c1 = 0
