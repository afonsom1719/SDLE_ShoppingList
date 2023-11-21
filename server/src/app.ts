import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import todoRoutes from './routes';
import { CCounter } from './types/ccounter';

const app: Express = express();

const PORT: string | number = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(todoRoutes);

const uri: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.j3skbou.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
};

mongoose
	.connect(uri, options)
	.then(() => console.log('Database connected'))
	.then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
	.catch((error) => {
		console.error('Error connecting to MongoDB:', error);
		process.exit(1); // Exit the application if MongoDB connection fails
	});

	// Create two instances of CCounter with different ids

let x = new CCounter("a");
let y = new CCounter("b");

x.inc(4);
x.dec();
y.dec();

console.log("x = " + x.read()); // x = 3
console.log("y = " + y.read()); // y = -1

x.join(y);
y.join(x);

console.log("x = " + x.read()); // x = 2
console.log("y = " + y.read()); // y = 2

x.reset();

console.log("x = " + x.read()); // x = 0

