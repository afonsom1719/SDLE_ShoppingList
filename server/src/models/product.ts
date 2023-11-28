import { model, Schema, Document, Types } from "mongoose";
import { IProduct } from "../types/product";

const productSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    shoppingList: {
      type: Schema.Types.ObjectId,
      ref: "ShoppingList", // Reference to the ShoppingList model
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IProduct>("Product", productSchema);
