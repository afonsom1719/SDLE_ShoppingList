import PouchDB from 'pouchdb';
import { CCounter, DotContext } from '../crdts';

const productDB = new PouchDB('products');

// Function to save a product
const saveProduct = async (product: ProductEntry<string, CCounter>) => {
  try {
    product.collection = 'products';
    const response = await productDB.post(product);
    return response;
  } catch (error) {
    console.error('Error saving product:', error);
    throw error;
  }
};

// Function to save shopping list
const saveShoppingList = async (shoppingList: ShoppingListEntry<string, DotContext>) => {
  try {
    shoppingList.collection = 'shopping-lists';
    const response = await productDB.post(shoppingList);
    return response;
  } catch (error) {
    console.error('Error saving shopping list:', error);
    throw error;
  }
};

const getShoppingLists = async () => {
  try {
    const response = await productDB.allDocs({ include_docs: true });

    const shoppingLists = response.rows
      .map((row) => row.doc)
      .filter((doc) => {
        let newDoc = doc as IShoppingList;
        console.log('newDoc: ', newDoc);
        return newDoc.collection === 'shopping-lists';
      });

    console.log('Shopping lists response:', shoppingLists);
    return shoppingLists;
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

const getShoppingListContext = async (shoppingListId: string) => {
  try {
    const shoppingList = await productDB.get(shoppingListId);
    return shoppingList;
  } catch (error) {
    console.error('Error getting shopping list:', error);
    throw error;
  }
};

// Function to get all products
const getAllProducts = async (shoppingListId: string) => {
    try {
      const response = await productDB.allDocs({ include_docs: true });
      console.log(
        'response: ',
        response.rows.map((row) => row.doc)
      );
  
      return response.rows
        .map((row) => row.doc as IProduct)
        .filter((doc) => doc.collection === 'products' && doc.shoppingListId === shoppingListId);
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  };

// Function to delete a product
const deleteProduct = async (productId: string) => {
  try {
    const product = await productDB.get(productId);
    const response = await productDB.remove(product);
    return response;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

const deleteShoppingList = async (shoppingListName: string) => {
  try {
    console.log('shoppingListName: ', shoppingListName);

    // Use allDocs with include_docs to get all documents
    const response = await productDB.allDocs({
      include_docs: true,
    });

    const matchingDoc = response.rows.find((row) => {
      const newDoc = row.doc as IShoppingList;
      if (newDoc.name === shoppingListName) {
        return true;
      }
    });

    if (!matchingDoc) {
      // Document not found
      console.log('Shopping list not found');
      return null;
    }

    const removeResponse = await productDB.remove(matchingDoc.doc!);

    return removeResponse;
  } catch (error) {
    console.error('Error deleting shopping list:', error);
    throw error;
  }
};

export {
  saveProduct,
  saveShoppingList,
  getAllProducts,
  getShoppingListContext,
  getShoppingLists,
  deleteProduct,
  deleteShoppingList,
};
