import { Document, Types } from 'mongoose';
import { IShoppingList } from './shoppingList';


export interface IProduct extends Document {
	name: string;
	quantity: number;
	shoppingList: Types.ObjectId | IShoppingList; // Reference to a ShoppingList
  }
