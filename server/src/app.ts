import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import productRoutes from './routes';
import { Ormap } from './types/crdts';

const app: Express = express();

const PORT: string | number = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(productRoutes);

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
