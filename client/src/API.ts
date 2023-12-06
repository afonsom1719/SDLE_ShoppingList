import axios, { AxiosResponse } from 'axios';
import { CCounter, Ormap } from './crdts';

const baseUrl: string = 'http://localhost:4000';

function customSerializer(key: string, value: any): any {
	if (value instanceof Map) {
	  const entries = Array.from(value.entries())
		.map(([subKey, subValue]) => ` '${subKey}' => ${subValue}`)
		.join(', ');
	  return `Map(${value.size}) {${entries}}`;
	  console.log('Map: ', key);
	} else if (value instanceof Set) {
	  const values = Array.from(value.values())
		.map((subValue) => ` ${subValue}`)
		.join(', ');
	  return `Set(${value.size}) {${values}}`;
	} else if (value instanceof Object && !(value instanceof Array)) {
	  const serializedObject: any = {};
	  for (const [subKey, subValue] of Object.entries(value)) {
		serializedObject[subKey] = customSerializer(subKey, subValue);
	  }
	  return serializedObject;
	}
  
	return value;
  }

export const syncProducts = async (currentProducts: Ormap): Promise<AxiosResponse<ApiDataType>> => {
  try {
    console.log('Ormap before server: ', currentProducts);
    const serializedObject = JSON.stringify(currentProducts, customSerializer);
    console.log('Serialized object: ', serializedObject);
	console.log('Deserialized object: ', JSON.parse(serializedObject));
    const products: AxiosResponse<ApiDataType> = await axios.post(baseUrl + '/products', serializedObject, {
		headers: {
			'Content-Type': 'application/json',
		},});
    return products;
  } catch (error) {
    console.log(error);
    throw new Error('hello');
  }
};

export const getShoppingLists = async (): Promise<AxiosResponse<ApiDataType>> => {
  try {
    const shoppingLists: AxiosResponse<ApiDataType> = await axios.get(baseUrl + '/shopping-lists');
    return shoppingLists;
  } catch (error) {
    console.log(error);
    throw new Error('hello');
  }
};

export const addProduct = async (formData: ProductEntry<string, CCounter>): Promise<AxiosResponse<ApiDataType>> => {
  try {
    const product: Omit<ProductEntry<string, CCounter>, '_id'> = {
      key: formData.key,
      value: formData.value,
    };
    console.log(product);
    const saveProduct: AxiosResponse<ApiDataType> = await axios.post(baseUrl + '/add-product', product);
    return saveProduct;
  } catch (error) {
    throw new Error('hello');
  }
};

export const deleteProduct = async (_id: string): Promise<AxiosResponse<ApiDataType>> => {
  try {
    const deletedProduct: AxiosResponse<ApiDataType> = await axios.delete(`${baseUrl}/delete-product/${_id}`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      },
    });
    return deletedProduct;
  } catch (error) {
    throw new Error('hello');
  }
};
