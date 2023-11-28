import { Response, Request } from 'express';
import { IProduct } from '../../types/product';
import Product from '../../models/product';
import { Ormap, CCounter } from '../../types/crdts';
import { Types } from 'mongoose';
import { ShoppingList } from '../../models/shoppingList';
import { IShoppingList } from '../../types/shoppingList';

const getProducts = async (req: Request, res: Response): Promise<void> => {
  //construct ormap with current products

  try {
    console.log('getProducts');
    console.log(req.body);

    const body: Ormap = req.body as Ormap;
    if (body === undefined) {
      res.status(400).json({ message: req.body });
      return;
    }
    console.log('body: ', body);
    console.log('body.id: ', body.id);

    // get correct shopping list
    let shoppingListId: Types.ObjectId = Types.ObjectId();
    let cleanId: string = body.id;
    if (cleanId.length !== 24) {
      console.error('Length is not 24 characters');
      console.warn('Adding characters to the end of the string to make it 24 characters long');
      while (cleanId.length < 24) {
        console.log('cleanId.length: ', cleanId.length);
        cleanId += '0';
      }
      while (cleanId.length > 24) {
        console.log('cleanId.length: ', cleanId.length);
        cleanId = cleanId.slice(0, -1);
      }
    }

    try {
      // Convert the string to a valid ObjectId
      shoppingListId = Types.ObjectId(cleanId);

      console.log('Valid ObjectId:', shoppingListId);
    } catch (error: any) {
      console.error('Invalid ObjectId format:', error.message);
    }

    // Verify if the shopping list ID is a valid ObjectId
    if (!Types.ObjectId.isValid(shoppingListId)) {
      res.status(400).json({ message: 'Invalid shopping list ID format' });
      return;
    }

    // get products from db
    const dbProducts: IProduct[] = await Product.find({ shoppingList: shoppingListId }); // Use the correct field

    console.log('dbProducts: ', dbProducts);

    // return products
    res.status(200).json({ Products: dbProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getShoppingLists = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('getShoppingLists');
    console.log(req.body);

	let shoppingLists: string[] = [];

    // get products from db
    const dbShoppingLists: IShoppingList[] = await ShoppingList.find(); // Use the correct field
	dbShoppingLists.forEach((shoppingList) => {
		shoppingLists.push(shoppingList.name);
	}
	);
	shoppingLists.push("shoppingList.name");

    console.log('dbShoppingLists: ', shoppingLists);

    // return products
    res.status(200).json({ ShoppingLists: shoppingLists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('addProduct');
    console.log(req.body);
    const body = req.body as Pick<IProduct, 'name' | 'quantity' | 'shoppingList'>;
    if (body === undefined) {
      res.status(400).json({ message: req.body });
      return;
    }

    const product: IProduct = new Product({
      name: body.name,
      quantity: body.quantity,
	  shoppingList: body.shoppingList,
    });

    const newProduct: IProduct = await product.save();

    const allProducts: IProduct[] = await Product.find();

    res.status(201).json({ message: 'Product added', product: newProduct, products: allProducts });
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedProduct: IProduct | null = await Product.findByIdAndRemove(req.params.id);
    const allProducts: IProduct[] = await Product.find();
    res.status(200).json({
      message: 'Product deleted',
      product: deletedProduct,
      products: allProducts,
    });
  } catch (error) {
    throw error;
  }
};

export { getProducts, getShoppingLists, addProduct, deleteProduct };
