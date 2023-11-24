import { Response, Request } from 'express';
import { ITodo } from './../../types/todo';
import Todo from '../../models/todo';

const getTodos = async (req: Request, res: Response): Promise<void> => {
	try {
		const todos: ITodo[] = await Todo.find();
		console.log('getTodos: ', todos);
		res.status(200).json({ todos });
	} catch (error) {
		throw error;
	}
};

const addTodo = async (req: Request, res: Response): Promise<void> => {
	try {
		console.log('addTodo');
		console.log(req.body);
		const body = req.body as Pick<ITodo, 'name' | 'quantity' | 'status'>;
		if (body === undefined) {
			res.status(400).json({ message: req.body });
			return;
		}

		const todo: ITodo = new Todo({
			name: body.name,
			quantity: body.quantity,
			status: body.status,
		});

		const newTodo: ITodo = await todo.save();
		const allTodos: ITodo[] = await Todo.find();

		res.status(201).json({ message: 'Todo added', todo: newTodo, todos: allTodos });
	} catch (error) {
		throw error;
	}
};

const updateTodo = async (req: Request, res: Response): Promise<void> => {
	try {
		const {
			params: { id },
			body,
		} = req;
		const updateTodo: ITodo | null = await Todo.findByIdAndUpdate({ _id: id }, body);
		const allTodos: ITodo[] = await Todo.find();
		res.status(200).json({
			message: 'Todo updated',
			todo: updateTodo,
			todos: allTodos,
		});
	} catch (error) {
		throw error;
	}
};

const deleteTodo = async (req: Request, res: Response): Promise<void> => {
	try {
		const deletedTodo: ITodo | null = await Todo.findByIdAndRemove(req.params.id);
		const allTodos: ITodo[] = await Todo.find();
		res.status(200).json({
			message: 'Todo deleted',
			todo: deletedTodo,
			todos: allTodos,
		});
	} catch (error) {
		throw error;
	}
};

export { getTodos, addTodo, updateTodo, deleteTodo };
