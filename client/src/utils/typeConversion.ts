import { CCounter, DotContext, DotKernel } from '../crdts';

export const convertToProductEntry = (product: IProduct): ProductEntry<string, CCounter> => {
  const context: DotKernel = JSON.parse(product.context as string, customSerializer);
  let newCC = new CCounter(product.key);
  if (product.key === 'Pao') {
    console.log('convertToProductEntry: ', product);
    console.log('convertToProductEntry: ', context);
  }
  if ('entries' in context.c.cc) {
    const newccEntries = Object.entries(context.c.cc.entries);
    const ccMap = new Map(newccEntries.map((entry: any) => [entry[1].key, entry[1].value]));

    const mappedCC = Array.from(ccMap).map(([k, v]) => {
      return { first: k, second: v };
    });

    // Convert dc to Set
    const dcSet: any = new Set(context.c.dc);
    const newdotContext = DotContext.createWithConfig(mappedCC, Array.from(dcSet));
    if ('entries' in context.ds) {
      const dots = Object.entries(context.ds.entries);
      if (product.key === 'milk') {
        console.log(dots);
      }
      const mappedDots = Array.from(dots).map((dot) => {
        return { first: product.shoppingListId!, second: dot[1].value };
      });
      newCC = CCounter.createWithConfig(product.key, newdotContext, mappedDots);
    }

    return {
      key: product.key,
      value: newCC,
      context: JSON.parse(product.context as string),
      shoppingListId: product.shoppingListId,
      collection: product.collection,
    };
  }
  return {
    key: product.key,
    value: newCC,
    context: JSON.parse(product.context as string),
    shoppingListId: product.shoppingListId,
    collection: product.collection,
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

export function serializeForMongoDB(data: any): any {
  const serialize = (value: any): any => {
    if (value instanceof Map) {
      return {
        _type: 'Map',
        _value: Array.from(value.entries()), // Convert Map to array
      };
    } else if (value instanceof Set) {
      return {
        _type: 'Set',
        _value: Array.from(value), // Convert Set to array
      };
    } else if (typeof value === 'object' && value !== null) {
      const serializedObject: { [key: string]: any } = {};
      for (const key of Object.keys(value)) {
        serializedObject[key] = serialize(value[key]); // Recursively serialize nested objects
      }
      return serializedObject;
    }
    return value;
  };

  return serialize(data);
}
