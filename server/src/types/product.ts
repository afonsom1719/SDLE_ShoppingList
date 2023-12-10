import { Document, Types } from 'mongoose';
import { IShoppingList } from './shoppingList';
import { CCounter } from './crdts';


export interface IProduct extends Document {
	name: string;
	quantity: string;
	shoppingList: string; // Reference to a ShoppingList
  }
