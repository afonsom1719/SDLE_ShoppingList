import React, { useEffect, useRef, useState } from 'react';
import ProductItem from './components/ProductItem';
import AddProduct from './components/AddProduct';
import { CCounter, DotContext, Ormap, Pair } from './crdts';
import {
  saveProduct,
  getAllProducts,
  deleteProduct,
  saveShoppingList,
  getShoppingLists,
  deleteShoppingList,
  updateShoppingList,
} from './utils/databaseOps'; // Import PouchDB functions
import { Stack } from '@mui/material';
import ShoppingListSelector from './components/ShoppingLists/ShoppingLists';
import WarningModal from './components/WarningModal/WarningModal';
import { convertToProductEntry } from './utils/typeConversion';
import SyncButton from './components/SyncButton/SyncButton';
import { addProducts, addShoppingList, syncProducts } from './API';

const App: React.FC = () => {
  const [shoppingList, setShoppingList] = useState<string>('');
  const [products, setProducts] = useState<ProductEntry<string, CCounter>[]>([]);
  const [shoppingLists, setShoppingLists] = useState<Ormap[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalWarnLevel, setModalWarnLevel] = useState('');
  const [isSynced, setIsSynced] = useState(false);
  const isInitialRender = useRef(true);
  let productsCRDT: Ormap = new Ormap(shoppingList);
  productsCRDT.m = products;

  useEffect(() => {
    fetchShoppingLists();
  }, []);

  useEffect(() => {
    if (!isInitialRender.current) {
      if (shoppingLists.length === 0) {
        addFirstShoppingList('My Shopping List');
        fetchShoppingLists();
      }
    } else {
      if (shoppingLists.length > 0) {
        setShoppingList(shoppingLists[0].id);
      }
      isInitialRender.current = false;
    }
    fetchProductsForAllShoppingLists();
    const selectedShoppingList = shoppingLists.find((list) => list.id === shoppingList);
    if (selectedShoppingList) {
      const newContext = selectedShoppingList.c as DotContext;
      const newContext2 = new DotContext();
      newContext2.cc = newContext.cc;
      newContext2.dc = newContext.dc;
      productsCRDT = new Ormap(selectedShoppingList.id, newContext2);
      products.forEach((product) => {
        productsCRDT.get(product.key).inc(product.value.read());
      });
    }
    setIsSynced(false);
  }, [shoppingLists]);

  useEffect(() => {
    fetchProducts();
    const selectedShoppingList = shoppingLists.find((list) => list.id === shoppingList);
    if (selectedShoppingList) {
      productsCRDT = new Ormap(selectedShoppingList.id, selectedShoppingList.c);
    }
  }, [shoppingList]);

  useEffect(() => {
    setIsSynced(false);
  }, [products]);

  const constructModalMessage = (message: string, warnLevel: string): void => {
    setModalMessage(message);
    setModalWarnLevel(warnLevel);
    setIsModalOpen(true);
  };

  const addFirstShoppingList = (shoppingListId: string): void => {
    setShoppingList(shoppingListId);
    saveShoppingList({ name: shoppingListId, context: productsCRDT.c });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // const syncAllShoppingLists = async () => {
  //   const updatedShoppingLists = [...shoppingLists];

  //   for (let i = 0; i < shoppingLists.length; i++) {
  //     for (let j = 0; j < shoppingLists.length; j++) {
  //       if (i !== j) {
  //         console.log('Syncing ' + shoppingLists[i].id + ' with ' + shoppingLists[j].id);
  //         console.log('Before: ' + shoppingLists[i]);
  //         shoppingLists[i].join(shoppingLists[j]);
  //         console.log('After: ' + shoppingLists[i]);

  //         // Update the local state with the merged shopping list
  //         updatedShoppingLists[i] = shoppingLists[i];
  //       }
  //     }
  //   }

  //   // Update the database entries and fetch the latest data
  //   await Promise.all(
  //     updatedShoppingLists.map(async (list) => {
  //       // Update database entry for each shopping list
  //       console.log('Updated ' + list.m);
  //       await updateShoppingList({
  //         name: list.id,
  //         context: list.c,
  //         collection: 'shopping-lists',
  //       });
  //       list.m.forEach(async (product) => {
  //         const updateResponse = await updateProducts(product, list.id);
  //         if (updateResponse === null) {
  //           await saveProduct(product, list.id);
  //         }
  //       }
  //       );
  //     })
  //   );

  //   // Update the state with the latest shopping lists and products
  //   setShoppingLists(updatedShoppingLists);
  //   setIsSynced(true);
  //   fetchProductsForAllShoppingLists();
  //   fetchProducts();
  // };

  const syncWithServer = async () => {
    // console.log(productsCRDT.m[0].value);
    productsCRDT.m.forEach((product) => {
      product.shoppingListId = productsCRDT.id;
    }
    );
    const response = await syncProducts(productsCRDT.id);
    if (response !== null) {
      if (response.data.message === 'No products in database') {
        const newShoppingList: IShoppingList = {
          _id: productsCRDT.id,
          name: productsCRDT.id,
          context: productsCRDT.c,
          collection: 'shopping-lists',
        };
        const shoppingListAnswer = await addShoppingList(newShoppingList);
        const answer = await addProducts(productsCRDT.m);
        console.log('Answer: ', answer);
        console.log('Shopping list answer: ', shoppingListAnswer);
        setProducts(productsCRDT.m);
      }

      if (!('listName' in response.data)) {
        constructModalMessage('No list found on server', 'info');
        return;
      } else if (!('context' in response.data)) {
        constructModalMessage('No context found on server', 'warning');
        return;
      } else if (!('products' in response.data)) {
        constructModalMessage('No products found on server', 'warning');
        return;
      }

      const assertedContext: DotContext = JSON.parse(response.data.context as string);


      if ('entries' in assertedContext.cc) {
        console.log('assertedContext.cc.entries: ', assertedContext.cc.entries);
        const entries = Object.entries(assertedContext.cc.entries);
        const ccEntries: Pair<string, number>[] = Array.from(entries).map(([k, v]) => {
          return { first: k, second: v };
        });

        // Convert DC entries to the expected type
        const dcEntries: [string, number][] = Array.from(assertedContext.dc).map((d) => {
          return [d[0], d[1]];
        });

        const convertedContext = DotContext.createWithConfig(ccEntries, dcEntries);

        console.log('convertedContext: ', convertedContext);
        console.log('response.data.products: ', response.data.products);
        const parsedProducts: ProductEntry<string, CCounter>[] = JSON.parse(response.data.products as unknown as string); 
        console.log('parsedProducts: ', parsedProducts);

        const newOrmap = Ormap.createWithConfig(
          response.data.listName as string,
          convertedContext,
          parsedProducts
        );
        console.log('newOrmap before: ', newOrmap);
        productsCRDT.join(newOrmap);
        console.log('ProductsOrmap after: ', productsCRDT);


        // Update the database entries and fetch the latest data
        await Promise.all(
          [productsCRDT].map(async (list) => {
            // Update database entry for each shopping list
            await updateShoppingList({
              name: list.id,
              context: list.c,
              collection: 'shopping-lists',
            });
        
            list.m.forEach(async (product) => {
              const updateResponse = await saveProduct(product, list.id);
              if (updateResponse === null) {
                await saveProduct(product, list.id);
              }
            });
          })
        );

        // Send the updated shopping list to the server

        const newShoppingList: IShoppingList = {
          _id: productsCRDT.id,
          name: productsCRDT.id,
          context: productsCRDT.c,
          collection: 'shopping-lists',
        };
        const shoppingListAnswer = await addShoppingList(newShoppingList);
        console.log('Shopping list answer: ', shoppingListAnswer);
        const answer = await addProducts(productsCRDT.m);
        console.log(answer);
      }
    }
    setProducts(productsCRDT.m);

  };

  const fetchProducts = (): void => {
    getAllProducts(shoppingList)
      .then((response) => {
        let mappedResponse: ProductEntry<string, CCounter>[] = response.map((product) => {
          return convertToProductEntry(product);
        });
        if (mappedResponse !== undefined) {
          setProducts(mappedResponse);
        }
      })
      .catch((err: Error) => console.log(err));
  };

  const fetchProductsForAllShoppingLists = () => {
    let tempShoppingLists: Ormap[] = shoppingLists;
    tempShoppingLists.forEach((shoppingList) => {
      getAllProducts(shoppingList.id)
        .then((response) => {
          let mappedResponse: ProductEntry<string, CCounter>[] = response.map((product) => {
            return convertToProductEntry(product);
          });
          if (mappedResponse !== undefined) {
            shoppingList.m = mappedResponse;
          }
        })
        .catch((err: Error) => console.log(err));
    });
    setShoppingLists(tempShoppingLists);
  };

  const fetchShoppingLists = (): void => {
    getShoppingLists()
      .then((response) => {
        const mappedResponse: IShoppingList[] = response.map((shoppingList) => {
          return shoppingList as IShoppingList;
        });
        if (shoppingList === '' || shoppingList === undefined || shoppingList === null) {
          setShoppingList(mappedResponse[0].name);
        }
        const ormapResponse: Ormap[] = mappedResponse.map((shoppingList) => {
          const newContext = new DotContext();
          newContext.cc = shoppingList.context.cc;
          newContext.dc = shoppingList.context.dc;

          return new Ormap(shoppingList.name, newContext);
        });
        setShoppingLists(ormapResponse);
      })
      .catch((err: Error) => console.log(err));
  };

  const handleSaveProduct = async (e: React.FormEvent, formData: ProductEntry<string, CCounter>): Promise<void> => {
    e.preventDefault();
    const shoppingListToUpdate: ShoppingListEntry<string, DotContext> = {
      name: productsCRDT.id,
      context: productsCRDT.c,
      collection: 'shopping-lists',
    };

    try {
      productsCRDT.get(formData.key).inc(formData.value.read());

      saveProduct(formData, shoppingList).then(() => {
        fetchProducts();
        updateShoppingList(shoppingListToUpdate);
        fetchShoppingLists();
      });
    } catch (err) {
      console.log('Error saving product:', err);
    }
  };

  const handleDeleteProduct = async (productId: string): Promise<void> => {
    try {
      await deleteProduct(productId, shoppingList).then(() => {
        const productToDelete = products.find((product) => product.key === productId);
        if (productToDelete) {
          productsCRDT.erase(productToDelete.key);
        }
        updateShoppingList({
          name: productsCRDT.id,
          context: productsCRDT.c,
          collection: 'shopping-lists',
        });
      });
      fetchProducts();
    } catch (err) {
      console.log('Error deleting product:', err);
    }
  };

  const handleDeleteShoppingList = async (shoppingListId: string): Promise<void> => {
    if (shoppingListId === productsCRDT.id) {
      const newShoppingList = shoppingLists.find((list) => list.id !== shoppingListId);
      if (newShoppingList) {
        setShoppingList(newShoppingList.id);
      }
    }

    try {
      await deleteShoppingList(shoppingListId);
      fetchShoppingLists();
    } catch (err) {
      console.log('Error deleting shopping list:', err);
    }
  };

  const handleShoppingListSelected = (shoppingListId: string) => {
    setShoppingList(shoppingListId);
  };

  const handleAddShoppingList = async (
    e: React.FormEvent,
    formData: ShoppingListEntry<string, DotContext>
  ): Promise<void> => {
    e.preventDefault();
    setShoppingList(formData.name);

    if (shoppingLists.some((list) => list.id === formData.name)) {
      constructModalMessage('Shopping list already exists!', 'warning');
      return;
    }

    try {
      await Promise.all([saveShoppingList(formData), fetchShoppingLists()]);
    } catch (err) {
      console.log('Error adding shopping list:', err);
    }
  };

  return (
    <main className='App'>
      <Stack direction='row' spacing={20} style={{ width: '100%' }}>
        <ShoppingListSelector
          customStyle={{ flex: 1 }}
          shoppingLists={shoppingLists}
          currentShoppingList={productsCRDT}
          onShoppingListSelected={handleShoppingListSelected}
          onAddShoppingList={handleAddShoppingList}
          onDeleteShoppingList={handleDeleteShoppingList}
        />
        <div style={{ flex: 3 }}>
          <h1>My Shopping List</h1>
          <AddProduct saveProduct={handleSaveProduct} />
          {products.map((product: ProductEntry<string, CCounter>) => (
            <ProductItem key={product.key} deleteProduct={() => handleDeleteProduct(product.key)} product={product} />
          ))}
        </div>
      </Stack>
      <SyncButton isSynced={isSynced} onSyncClick={isSynced ? () => {} : syncWithServer} />
      <WarningModal isOpen={isModalOpen} onClose={closeModal} message={modalMessage} level={modalWarnLevel} />
    </main>
  );
};

export default App;
