import { Response, Request } from 'express';
import { IProduct } from '../../types/product';
import Product from '../../models/product';
import { Ormap, CCounter, ProductEntry, DotContext, Pair } from '../../types/crdts';
import { Types } from 'mongoose';
import { ShoppingList } from '../../models/shoppingList';
import { IShoppingList } from '../../types/shoppingList';
import { convertToProductEntry, customSerializer } from '../../utils/typeConversion';
import { JsonSerializer } from 'typescript-json-serializer';

const getProducts = async (req: Request, res: Response): Promise<void> => {
  console.log('getProducts INITIATE');
  const defaultSerializer = new JsonSerializer();

  try {
    console.log('PARAMS: ', req.params);
    if (!('shoppingListId' in req.query)) {
      res.status(400).json({ message: 'Missing shopping list ID' });
      return;
    }

    const shoppingListId = req.query.shoppingListId as string; // Assuming the shopping list ID is part of the URL parameters

    // Retrieve shopping list and products from the database
    const dbShoppingList: IShoppingList | null = await ShoppingList.findOne({ name: shoppingListId });
    const dbProducts: IProduct[] = await Product.find({ shoppingList: shoppingListId });

    if (dbShoppingList === null) {
      // Add shopping list to the database if it does not exist
      const newShoppingList: IShoppingList = new ShoppingList({
        name: shoppingListId,
        context: new DotContext(),
      });
    }

    console.log('dbShoppingList: ', dbShoppingList);
    if (!dbProducts.length) {
      res.status(200).json({ message: 'No products in database' });
      return;
    }

    // Convert database products to Ormap format
    const mappedResponse: ProductEntry<string, CCounter>[] = dbProducts.map((product: IProduct) => {
      return convertToProductEntry(product);
    });

    console.log('mappedResponse: ', mappedResponse[0].value.dk.ds);

    // Create Ormap with the retrieved data
    if (dbShoppingList !== null) {
      const context: DotContext = JSON.parse(dbShoppingList.context);

      console.log('context: ', context);
      // Convert CC entries to the expected type
      if ('entries' in context.cc && context.cc.entries.length > 0) {
        console.log('context.cc.entries: ', context.cc.entries);
        const entries = Object.entries(context.cc.entries);
        const ccEntries: Pair<string, number>[] = Array.from(entries).map(([k, v]) => {
          return { first: k, second: v };
        });

        // Convert DC entries to the expected type
        const dcEntries: [string, number][] = Array.from(context.dc).map((d) => {
          return [d[0], d[1]];
        });

        const newContext: DotContext = DotContext.createWithConfig(ccEntries, dcEntries);
        const serializedContext = JSON.stringify(newContext, customSerializer);
        const serializedMap = JSON.stringify(mappedResponse, customSerializer);

        // Return the Ormap in the response
        res.status(200).json({ listName: dbShoppingList?.name, context: serializedContext, products: serializedMap });
      } else if ('entries' in context.cc && context.cc.entries.length === 0) {
        console.log('context.cc.entries is empty: ', context.cc.entries);
        const newContext: DotContext = new DotContext();
        const serializedContext = JSON.stringify(newContext, customSerializer);
        const serializedMap = JSON.stringify(mappedResponse, customSerializer);

        // Return the Ormap in the response
        res.status(200).json({ listName: dbShoppingList?.name, context: serializedContext, products: serializedMap });
      }
    }
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
    });
    shoppingLists.push('shoppingList.name');

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
    if(req.body.length === 0) {
      res.status(400).json({ message: 'No products in body' });
      return;
    }
    const body: ProductEntry<string, CCounter>[] = req.body;
    console.log('body: ', body[0].value.dk.ds.entries);
    if (body === undefined) {
      res.status(400).json({ message: req.body });
      return;
    }
    const allProducts: IProduct[] = await Product.find();
    console.log('allProducts: ', allProducts);

    body.forEach(async (product: ProductEntry<string, CCounter>) => {
      // Check if the product already exists
      console.log('serializedCCounter: ', product);
      const serializedCCounter = product.value;
      const serializedCCounterString = JSON.stringify(serializedCCounter, customSerializer);
      const productExists = allProducts.find(
        (p) => p.name === product.key && p.shoppingList === product.shoppingListId
      );
    
      if (productExists) {
        // Update the product
        productExists.quantity = serializedCCounterString;
        productExists.shoppingList = product.shoppingListId!;
        await productExists.save();
      } else {
        // Create the product

        const newProduct: IProduct = new Product({
          name: product.key,
          quantity: serializedCCounterString,
          shoppingList: product.shoppingListId,
        });
        await newProduct.save();
      }
    });

    res.status(201).json({ message: 'Products added' });
  } catch (error) {
    throw error;
  }
};

const addShoppingList = async (req: Request, res: Response): Promise<void> => {
  console.log('addShoppingList');
  try {
    // Add ShoppingList to the database if it does not exist
    console.log(req.body);
    const shoppingListName = req.body.name;
    const shoppingListContext = JSON.stringify(req.body.context);
    const newShoppingList: IShoppingList = new ShoppingList({
      name: shoppingListName,
      context: shoppingListContext,
    });

    // find if shopping list already exists
    const shoppingListExists: IShoppingList | null = await ShoppingList.findOne({ name: shoppingListName });
    if (shoppingListExists) {
      // Update the shopping list
      shoppingListExists.context = shoppingListContext;
      await shoppingListExists.save();
    } else {
      // Create the shopping list
      await newShoppingList.save();
    }

    res.status(201).json({ message: 'Shopping list added' });
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

export { getProducts, getShoppingLists, addProduct, deleteProduct, addShoppingList };
