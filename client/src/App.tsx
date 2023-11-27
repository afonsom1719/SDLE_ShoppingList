import React, { useEffect, useState } from 'react';
import ProductItem from './components/ProductItem';
import AddProduct from './components/AddProduct';
import { CCounter, DotContext, Ormap } from './crdts';
import { saveProduct, getAllProducts, deleteProduct, saveShoppingList, getShoppingLists } from './utils/databaseOps'; // Import PouchDB functions
import { Stack } from '@mui/material';
import ShoppingListSelector from './components/ShoppingLists/ShoppingLists';

const App: React.FC = () => {
  const [shoppingList, setShoppingList] = useState<string>('');
  const [products, setProducts] = useState<ProductEntry<string, CCounter>[]>([]);
  const [shoppingLists, setShoppingLists] = useState<string[]>([]);
  let productsCRDT = new Ormap(shoppingList);

  useEffect(() => {
    fetchProducts();
    fetchShoppingLists();
  }, []);

  const fetchProducts = (): void => {
    getAllProducts()
      .then((response) => {
        console.log('Received response: ', response);
        let mappedResponse: ProductEntry<string, CCounter>[] = response.map(
          (product: PouchDB.Core.ExistingDocument<PouchDB.Core.AllDocsMeta> | undefined) => {
            const mappedProduct = product as IProduct;
            const mappedQuantity = productsCRDT.get(mappedProduct?._id);
            return {
              key: mappedProduct?._id,
              value: mappedQuantity,
            };
          }
        );
        console.log('Mapped response: ', mappedResponse);
        if (products !== undefined) {
          productsCRDT.m = products;
          setProducts(productsCRDT.m);
        }
      })
      .catch((err: Error) => console.log(err));
  };

  // const fetchShoppingList = (): void => {
  //   getShoppingListContext(shoppingList)
  //     .then((response) => {
  //       console.log("Received response: ", response);
  //       productsCRDT = new Ormap(shoppingList, response);
  //       setProducts(productsCRDT.m);
  //     })
  //     .catch((err: Error) => console.log(err));
  // }

  const fetchShoppingLists = (): void => {
    getShoppingLists()
      .then((response) => {
        console.log('Received response: ', response);
        const mappedResponse: string[] = response.map(
          (shoppingList: PouchDB.Core.ExistingDocument<PouchDB.Core.AllDocsMeta> | undefined) => {
            const mappedShoppingList = shoppingList as IShoppingList;
            return mappedShoppingList?._id;
          }
        );
        setShoppingLists(mappedResponse);
      })
      .then(() => {
        if (shoppingList === '') {
          setShoppingList(shoppingLists[0]);
          productsCRDT = new Ormap(shoppingLists[0]);
        }
      })
      .catch((err: Error) => console.log(err));
  };

  const handleSaveProduct = (e: React.FormEvent, formData: ProductEntry<string, CCounter>): void => {
    console.log(formData);
    e.preventDefault();
    saveProduct(formData)
      .then(() => fetchProducts())
      .catch((err: any) => console.log(err));
  };

  const handleDeleteProduct = (productId: string): void => {
    deleteProduct(productId)
      .then(() => fetchProducts())
      .catch((err: any) => console.log(err));
  };

  const handleShoppingListSelected = (shoppingListId: string) => {
    setShoppingList(shoppingListId);
    productsCRDT = new Ormap(shoppingListId);
    console.log('selected shopping list: ', shoppingListId);
    fetchProducts();
  };

  const handleAddShoppingList = (e: React.FormEvent, formData: ShoppingListEntry<string, DotContext>): void => {
    console.log('Saving shopping list:', formData);
    e.preventDefault();
    setShoppingList(formData.key);
    productsCRDT = new Ormap(formData.key, formData.value);
    saveShoppingList(formData)
      .then(() => fetchProducts())
      .catch((err: any) => console.log(err));
  };

  return (
    <main className='App'>
      <Stack direction='row' spacing={20} style={{ width: '100%' }}>
        <ShoppingListSelector
          customStyle={{ flex: 1 }}
          shoppingLists={shoppingLists}
          onShoppingListSelected={handleShoppingListSelected}
          onAddShoppingList={handleAddShoppingList}
        />
        <div style={{ flex: 3 }}>
          <h1>My Shopping List</h1>
          <AddProduct saveProduct={handleSaveProduct} />
          {products.map((product: ProductEntry<string, CCounter>) => (
            <ProductItem key={product.key} deleteProduct={handleDeleteProduct} product={product} />
          ))}
        </div>
      </Stack>
    </main>
  );
};

export default App;
