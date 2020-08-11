const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');
const isAuth = require('../middleware/isAuth');

// Get products list
router.get('/', shopController.getProducts);
router.get('/products', shopController.getProducts);
router.get('/shop/cart', isAuth, shopController.getCart);
router.post('/shop/add-to-cart', isAuth, shopController.postAddToCart);
router.post('/shop/delete-item-in-cart', isAuth, shopController.postDeleteItemInCart);
router.get('/shop/order', isAuth, shopController.getOrder);
router.post('/shop/add-order', isAuth, shopController.postAddOrder);

module.exports = router;    