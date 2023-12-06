import { Document, Types } from 'mongoose';
import { IShoppingList } from './shoppingList';


export interface IProduct extends Document {
	name: string;
	quantity: number;
	shoppingList: string; // Reference to a ShoppingList
  }
