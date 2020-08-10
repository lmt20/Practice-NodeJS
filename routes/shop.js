const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');

// Get products list
router.get('/', shopController.getProducts);
router.get('/products', shopController.getProducts);
router.get('/shop/cart', shopController.getCart);
router.post('/shop/add-to-cart', shopController.postAddToCart);
router.post('/shop/delete-item-in-cart', shopController.postDeleteItemInCart);
router.get('/shop/order', shopController.getOrder);
router.post('/shop/add-order', shopController.postAddOrder);

module.exports = router;    