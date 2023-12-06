import { ProductEntry } from "../types/crdts";
import { CCounter } from "../types/crdts/ccounter";
import { IProduct } from "../types/product";



export const convertToProductEntry = (product: IProduct): ProductEntry<string, CCounter> => {
    return {
      key: product.name,
      value: new CCounter(product.name).inc(product.quantity),
      shoppingListId: product.shoppingList,
      collection: "products",
    };
  }