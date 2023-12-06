import { Document } from 'mongoose';
import { DotContext } from './crdts';


export interface IShoppingList extends Document {
    name: string;
    context: DotContext; // Reference to a DotContext
    // other fields as needed
  }