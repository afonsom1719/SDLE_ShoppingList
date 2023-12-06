import { Response, Request } from 'express';
import { IProduct } from '../../types/product';
import Product from '../../models/product';
import { Ormap, CCounter, ProductEntry, DotContext } from '../../types/crdts';
import { Types } from 'mongoose';
import { ShoppingList } from '../../models/shoppingList';
import { IShoppingList } from '../../types/shoppingList';
import { convertToProductEntry } from '../../utils/typeConversion';

const getProducts = async (req: Request, res: Response): Promise<void> => {
  //construct ormap with current products
  console.log('getProducts INITIATE');

  try {
    console.log('getProducts');
    console.log(req.body);
    const body: Ormap = req.body as Ormap;
    const clientOrmap: Ormap = Ormap.createWithConfig(body.id, body.c, body.m);
    console.log('clientOrmap type: ');
    console.log('clientOrmap: ', clientOrmap);
    clientOrmap.m.forEach((product: ProductEntry<string, CCounter>) => {
      console.log('key: ', product.key);
      console.log('value type: ', typeof product.value);
    });

    if (body === undefined) {
      res.status(400).json({ message: req.body });
      return;
    }

    // get correct shopping list
    let shoppingListId: string = clientOrmap.id;

    // get products from db
    const dbProducts: IProduct[] = await Product.find({ shoppingList: shoppingListId }); // Use the correct field
    const dbShoppingList: IShoppingList | null = await ShoppingList.findOne({ name: shoppingListId });

    console.log('dbProducts: ', dbProducts);

    if (dbShoppingList === null) {
      ShoppingList.create(
        {
          name: shoppingListId,
          context: clientOrmap.c,
        },
        function (err: any, doc: any) {
          if (err) return console.error(err);
          console.log('Document inserted successfully!');
        }
      );
    }

    if (dbProducts.length === 0) {
      console.warn('No products found');
      clientOrmap.m.forEach((product: ProductEntry<string, CCounter>) => {
        console.log(product.value.read());
        Product.create(
          {
            name: product.key,
            quantity: product.value.read(),
            shoppingList: shoppingListId,
          },
          function (err: any, doc: any) {
            if (err) return console.error(err);
            console.log('Document inserted succussfully!');
          }
        );
      });
      res.status(200).json({ Products: body });
    } else {
      console.log('dbShoppingList: ', dbShoppingList);

      // construct ormap with db products
      let mappedResponse: ProductEntry<string, CCounter>[] = dbProducts.map((product) => {
        return convertToProductEntry(product);
      });
      const context: DotContext = dbShoppingList?.context as DotContext;
      const newContext = new DotContext(dbShoppingList?.context.cc, dbShoppingList?.context.dc);
      console.log('context: ', newContext);
      let dbOrmap = Ormap.createWithConfig(dbShoppingList?.name, newContext, mappedResponse);
      console.log('dbOrmap: ', dbOrmap);

      dbOrmap.join(clientOrmap);

      dbOrmap.m.forEach((product: ProductEntry<string, CCounter>) => {
        Product.updateOne(
          { name: product.key, shoppingList: shoppingListId },
          {
            name: product.key,
            quantity: product.value.read(),
            shoppingList: shoppingListId,
          },
          undefined,
          function (err: any, doc: any) {
            if (err) return console.error(err);
            console.log('Document updated succussfully!');
          }
        );
      });

      res.status(200).json({ Products: dbOrmap });
    }

    // return products
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
