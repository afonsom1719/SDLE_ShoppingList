import { Router } from 'express';
import { getProducts, getShoppingLists, addProduct, deleteProduct, addShoppingList } from '../controllers/products';

const router: Router = Router();

router.get('/products', getProducts);

router.post('/add-product', addProduct);

router.delete('/delete-product/:id', deleteProduct);

router.get('/shopping-lists', getShoppingLists);

router.post('/add-shopping-list', addShoppingList);

export default router;
