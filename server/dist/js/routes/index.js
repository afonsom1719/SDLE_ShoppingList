"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_1 = require("../controllers/products");
const router = (0, express_1.Router)();
router.get('/products', products_1.getProducts);
router.post('/add-product', products_1.addProduct);
router.delete('/delete-product/:id', products_1.deleteProduct);
router.get('/shopping-lists', products_1.getShoppingLists);
router.post('/add-shopping-list', products_1.addShoppingList);
exports.default = router;
