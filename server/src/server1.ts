import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import productRoutes from './routes';
import { Ormap } from './types/crdts';

const app: Express = express();

const PORT: string | number = process.env.PORT || 4001;

app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(productRoutes);

const uri: string = `mongodb+srv://up202005283:yGmygF3DjyGt1llR@cluster0.j3skbou.mongodb.net/Cluster0?retryWrites=true&w=majority`;
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
