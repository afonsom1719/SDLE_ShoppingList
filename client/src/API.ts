import axios, { AxiosResponse } from 'axios';
import { CCounter } from './crdts';
import { JsonSerializer } from 'typescript-json-serializer';
import { customSerializer } from './utils/typeConversion';
const baseUrl: string = 'http://localhost:4000';

export const syncProducts = async (shoppingListId: string): Promise<AxiosResponse<ApiDataType>> => {

  try {
    const products: AxiosResponse<ApiDataType> = await axios.get(baseUrl + '/api/products', {
      params: {
        shoppingListId: shoppingListId,
      },
    });


    // console.log('syncProducts: ', products);
    return products;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to sync products');
  }
};

export const getShoppingLists = async (): Promise<AxiosResponse<ApiDataType>> => {
  try {
    const shoppingLists: AxiosResponse<ApiDataType> = await axios.get(baseUrl + '/api/shopping-lists');
    return shoppingLists;
  } catch (error) {
    console.log(error);
    throw new Error('hello');
  }
};

export const addProducts = async (formData: ProductEntry<string, CCounter>[]): Promise<AxiosResponse<ApiDataType>> => {
  const defaultSerializer = new JsonSerializer();
  try {
    const serializedFormData = defaultSerializer.serialize(formData);
    const stringifiedFormData = JSON.stringify(serializedFormData, customSerializer);
    // const parsedFormData = JSON.parse(stringifiedFormData);
    // console.log('stringifiedFormData: ', stringifiedFormData);
    // console.log('parsedFormData: ', parsedFormData);

    // console.log('serializedFormData: ', serializedFormData);
    const saveProduct: AxiosResponse<ApiDataType> = await axios.post(baseUrl + '/api/add-product', stringifiedFormData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return saveProduct;
  } catch (error) {
    throw new Error('hello');
  }
};

// Add shopping list
export const addShoppingList = async (formData: IShoppingList): Promise<AxiosResponse<ApiDataType>> => {
  try {
    const stringifiedFormData = JSON.stringify(formData, customSerializer);
    const saveShoppingList: AxiosResponse<ApiDataType> = await axios.post(
      baseUrl + '/api/add-shopping-list',
      stringifiedFormData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      );
    return saveShoppingList;
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
