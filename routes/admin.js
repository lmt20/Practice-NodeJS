const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

router.get('/products', adminController.getProducts);

router.get('/product/:productId', adminController.getProductById);

router.get('/add-product', adminController.getAddProduct);

router.post('/add-product', adminController.postAddProduct);

router.post('/delete-product', adminController.postDeleteProduct);  

router.get('/edit-product/:productId', adminController.getEditProduct)

router.post('/edit-product', adminController.postEditProduct)

module.exports = router;