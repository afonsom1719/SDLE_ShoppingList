import { model, Schema } from "mongoose";
import { IShoppingList } from "../types/shoppingList";
import { DotContext } from "../types/crdts";

const shoppingListSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  context: {
    type: Schema.Types.Mixed,
    required: true,
  },
});

export const ShoppingList = model<IShoppingList>("ShoppingList", shoppingListSchema);
