import { CCounter } from "../crdts";



export const convertToProductEntry = (product: IProduct): ProductEntry<string, CCounter> => {
    return {
      key: product.key,
      value: new CCounter(product.key).inc(product.value),
      shoppingListId: product.shoppingListId,
      collection: product.collection,
    };
  }