import axios, { AxiosResponse } from 'axios';

const baseUrl: string = 'http://localhost:4000';

export const getTodos = async (): Promise<AxiosResponse<ApiDataType>> => {
	try {
		const todos: AxiosResponse<ApiDataType> = await axios.get(baseUrl + '/todos', {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
			},
		});
		return todos;
	} catch (error) {
		console.log(error);
		throw new Error('hello');
	}
};

export const addTodo = async (formData: ITodo): Promise<AxiosResponse<ApiDataType>> => {
	try {
		const todo: Omit<ITodo, '_id'> = {
			name: formData.name,
			quantity: formData.quantity,
			status: false,
		};
		console.log(todo);
		const saveTodo: AxiosResponse<ApiDataType> = await axios.post(baseUrl + '/add-todo', todo);
		return saveTodo;
	} catch (error) {
		throw new Error('hello');
	}
};

export const updateTodo = async (todo: ITodo): Promise<AxiosResponse<ApiDataType>> => {
	try {
		const todoUpdate: Pick<ITodo, 'status'> = {
			status: true,
		};
		const updatedTodo: AxiosResponse<ApiDataType> = await axios.put(`${baseUrl}/edit-todo/${todo._id}`, todoUpdate, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
			},
		});
		return updatedTodo;
	} catch (error) {
		throw new Error('hello');
	}
};

export const deleteTodo = async (_id: string): Promise<AxiosResponse<ApiDataType>> => {
	try {
		const deletedTodo: AxiosResponse<ApiDataType> = await axios.delete(`${baseUrl}/delete-todo/${_id}`, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
			},
		});
		return deletedTodo;
	} catch (error) {
		throw new Error('hello');
	}
};
