import { Document } from 'mongoose';

export interface ITodo extends Document {
	name: string;
	quantity: number;
	status: boolean;
}
