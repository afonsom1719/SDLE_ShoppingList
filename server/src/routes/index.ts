import { Router } from 'express';
import { getProducts, getShoppingLists, addProduct, deleteProduct } from '../controllers/products';

const router: Router = Router();

router.post('/products', getProducts);

router.post('/add-product', addProduct);

router.delete('/delete-product/:id', deleteProduct);

router.get('/shopping-lists', getShoppingLists);

export default router;
