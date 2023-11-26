import React, { useEffect, useState } from 'react';
import ProductItem from './components/ProductItem';
import AddProduct from './components/AddProduct';
import { CCounter, Ormap } from './crdts';
import { getProducts, addProduct, deleteProduct } from './API';
import { generateRandomId } from './utils/generateId';
import { Stack } from '@mui/material';
import ShoppingListSelector from './components/ShoppingLists/ShoppingLists';
const genId: string = generateRandomId();

const App: React.FC = () => {
  console.log('genId: ', genId);

  let productsCRDT = new Ormap(genId);
  const [products, setProducts] = useState<ProductEntry<string, CCounter>[]>(productsCRDT.m);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = (): void => {
    getProducts(productsCRDT)
      .then(({ data: { Products: products } }: Ormap | any) => (productsCRDT.m = products))
      .then(() => setProducts(productsCRDT.m))
      .catch((err: Error) => console.log(err));
  };

  const handleSaveProduct = (e: React.FormEvent, formData: ProductEntry<string, CCounter>): void => {
    console.log(formData);
    e.preventDefault();
    addProduct(formData)
      .then(({ status, data }) => {
        console.log(data);
        if (status !== 201) {
          throw new Error('Error! Product not saved');
        }
        // setProducts(data.products);
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteProduct = (_id: string): void => {
    deleteProduct(_id)
      .then(({ status }) => {
        if (status !== 200) {
          throw new Error('Error! Product not deleted');
        }
        // setProducts(data.products);
      })
      .catch((err) => console.log(err));
  };

  return (
    <main className='App'>
      <Stack direction='row' spacing={2} style={{ width: '100%' }}>
        <ShoppingListSelector customStyle={{ flex: 1 }} />
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
