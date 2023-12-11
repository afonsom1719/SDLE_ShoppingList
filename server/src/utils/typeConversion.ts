import { ProductEntry } from '../types/crdts';
import { CCounter, Pair } from '../types/crdts/ccounter';
import { DotContext } from '../types/crdts/dotcontext';
import { IProduct } from '../types/product';
import * as s from 'serialijse';

export const convertToProductEntry = (product: IProduct): ProductEntry<string, CCounter> => {
  console.log('Name: ', product.name);
  // Convert dot set
  const quantity: CCounter = JSON.parse(product.quantity);
  
  return {
    key: product.name,
    value: quantity,
    shoppingListId: product.shoppingList,
    collection: 'products',
  };
};

export function customSerializer(key: string, value: any): any {
  if (value instanceof Map) {
    let obj: { [key: string]: any } = {};
    const entries: { key: any[]; value: any }[] = [];
    value.forEach((val, k) => {
      // Convert Map entries to an array of objects with structured information
      entries.push({
        key: Array.isArray(k) ? k : [k],
        value: val,
      });
    });
    obj = {
      size: value.size,
      entries: entries,
    };
    return obj;
    console.log('customSerializer: ', key);
  } else if (value instanceof Set) {
    // Convert Set to an array
    return Array.from(value);
  } else if (value instanceof Object && !(value instanceof Array)) {
    if (typeof value.toJSON === 'function') {
      return value.toJSON();
    }

    const serializedObject: any = {};
    for (const [subKey, subValue] of Object.entries(value)) {
      serializedObject[subKey] = customSerializer(subKey, subValue);
    }
    return serializedObject;
  }

  return value;
}



