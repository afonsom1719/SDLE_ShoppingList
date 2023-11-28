import React, { useEffect, useRef, useState } from 'react';
// import ProductItem from './components/ProductItem';
import AddProduct from './components/AddProduct';
import { CCounter, DotContext, Ormap } from './crdts';
import {
  saveProduct,
  getAllProducts,
  // deleteProduct,
  saveShoppingList,
  getShoppingLists,
  deleteShoppingList,
} from './utils/databaseOps'; // Import PouchDB functions
import { Stack } from '@mui/material';
import ShoppingListSelector from './components/ShoppingLists/ShoppingLists';
import WarningModal from './components/WarningModal/WarningModal';

const App: React.FC = () => {
  const [shoppingList, setShoppingList] = useState<string>('My First Shopping List');
  // const [products, setProducts] = useState<ProductEntry<string, CCounter>[]>([]);
  const [shoppingLists, setShoppingLists] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalWarnLevel, setModalWarnLevel] = useState('');
  let productsCRDT = new Ormap(shoppingList);
  const isInitialRender = useRef(true);

  useEffect(() => {
    fetchShoppingLists();
  }, []);

  useEffect(() => {
    if (!isInitialRender.current) {
      // This block will run after the first render
      if (shoppingLists.length === 0) {
        addFirstShoppingList(shoppingList);
        fetchShoppingLists();
      }
    } else {
      // Update the ref to mark that the initial render is done
      setShoppingList(shoppingLists[0]);
      isInitialRender.current = false;
    }
  }, [shoppingLists]);

  useEffect(() => {
    fetchProducts();
  }
  , [shoppingList]);

  const constructModalMessage = (message: string, warnLevel: string): void => {
    setModalMessage(message);
    setModalWarnLevel(warnLevel);
    setIsModalOpen(true);
    console.log(`${warnLevel}: ${message}`);
  };

  const addFirstShoppingList = (shoppingListId: string): void => {
    setShoppingList(shoppingListId);
    productsCRDT = new Ormap(shoppingListId);
    saveShoppingList({ name: shoppingListId, context: productsCRDT.c });
    console.log('selected shopping list: ', shoppingListId);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchProducts = (): void => {
    console.log('fetching products: ', shoppingList);
    getAllProducts(shoppingList)
      // .then((response) => {
      //   // console.log('Received response: ', response);
      //   // let mappedResponse: ProductEntry<string, CCounter>[] = response.map((product) => {
          
      //   //   return product;
      //   // });

      //   // console.log('Mapped response products: ', mappedResponse);

      //   // if (mappedResponse !== undefined) {
      //   //   console.log('productsCRDT.m: ', mappedResponse);
      //   //   setProducts(products);
      //   // }
      // })
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
            return mappedShoppingList?.name;
          }
        );
        setShoppingLists(mappedResponse);
        console.log('Mapped response shopping lists: ', mappedResponse);
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
    formData.shoppingListId = shoppingList;
    e.preventDefault();
    saveProduct(formData)
      .then(() => fetchProducts())
      .catch((err: any) => console.log(err));
  };

  // const handleDeleteProduct = (productId: string): void => {
  //   deleteProduct(productId)
  //     .then(() => fetchProducts())
  //     .catch((err: any) => console.log(err));
  // };

  const handleDeleteShoppingList = (shoppingListId: string): void => {
    setShoppingList(shoppingLists[0]);
    deleteShoppingList(shoppingListId)
      .then(() => fetchShoppingLists())
      .catch((err: any) => console.log(err));
  };

  const handleShoppingListSelected = (shoppingListId: string) => {
    setShoppingList(shoppingListId);
    productsCRDT = new Ormap(shoppingListId);
    console.log('selected shopping list: ', shoppingListId);
  };

  const handleAddShoppingList = (e: React.FormEvent, formData: ShoppingListEntry<string, DotContext>): void => {
    console.log('Saving shopping list:', formData);
    e.preventDefault();
    setShoppingList(formData.name);
    console.log('shopping list: ', shoppingLists);
    console.log('shopping list contains: ', shoppingLists.includes(formData.name));
    if (shoppingLists.includes(formData.name)) {
      constructModalMessage('Shopping list already exists!', 'warning');

      return;
    }
    productsCRDT = new Ormap(formData.name, formData.context);
    saveShoppingList(formData)
      .then(() => fetchShoppingLists())
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
          onDeleteShoppingList={handleDeleteShoppingList}
        />
        <div style={{ flex: 3 }}>
          <h1>My Shopping List</h1>
          <AddProduct saveProduct={handleSaveProduct} />
          {/* {products.map((product: ProductEntry<string, CCounter>) => (
            <ProductItem key={product.key} deleteProduct={handleDeleteProduct} product={product} />
          ))} */}
        </div>
      </Stack>
      <WarningModal isOpen={isModalOpen} onClose={closeModal} message={modalMessage} level={modalWarnLevel} />
    </main>
  );
};

export default App;
