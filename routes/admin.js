const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');

router.get('/products', isAuth, adminController.getProducts);

router.get('/product/:productId', isAuth, adminController.getProductById);

router.get('/add-product', isAuth, adminController.getAddProduct);

router.post('/add-product', isAuth, adminController.postAddProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);  

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)

router.post('/edit-product', isAuth, adminController.postEditProduct)

module.exports = router;