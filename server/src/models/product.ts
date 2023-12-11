import { model, Schema, Document, Types } from "mongoose";
import { IProduct } from "../types/product";

const productSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    shoppingList: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IProduct>("Product", productSchema);
