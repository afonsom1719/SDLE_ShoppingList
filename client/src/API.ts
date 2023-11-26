import axios, { AxiosResponse } from 'axios';
import { CCounter, Ormap } from './crdts';

const baseUrl: string = 'http://localhost:4000';

export const getProducts = async (currentProducts: Ormap): Promise<AxiosResponse<ApiDataType>> => {
	try {
		const products: AxiosResponse<ApiDataType> = await axios.post(baseUrl + '/products', currentProducts);
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
}

export const addProduct = async (formData: ProductEntry<string, CCounter>): Promise<AxiosResponse<ApiDataType>> => {
	try {
		const product: Omit<ProductEntry<string, CCounter>, '_id'> = {
			key: formData.key,
			value: formData.value,
		};
		console.log(product);
		const saveProduct : AxiosResponse<ApiDataType> = await axios.post(baseUrl + '/add-product', product);
		return saveProduct;
	} catch (error) {
		throw new Error('hello');
	}
};


export const deleteProduct = async (_id: string): Promise<AxiosResponse<ApiDataType>> => {
	try {
		const deletedProduct : AxiosResponse<ApiDataType> = await axios.delete(`${baseUrl}/delete-product/${_id}`, {
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
