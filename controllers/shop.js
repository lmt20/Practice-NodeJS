const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render('shop/products', {
                products: products,
                title: 'Product List',
                path: '/shop/products'
            });
        }).catch((err) => {
            console.log(err);
        });

}
exports.getCart = (req, res, next) => {
    if(!req.session.isLoggedIn){
        return res.redirect('/');
    }
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const detailItems = user.cart.items;
            res.render('shop/cart', {
                detailItems: detailItems,
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postAddToCart = (req, res, next) => {
    const productId = req.body.productId;
    req.user.addToCart(productId)
        .then(result => {
            res.redirect('/shop/cart');
        })
}

exports.postDeleteItemInCart = (req, res, next) => {
    const productId = req.body.productId;
    const updateItems = req.user.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });
    req.user.cart.items = updateItems;
    req.user.save()
        .then(result => {
            res.redirect('/shop/cart');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getOrder = (req, res, next) => {
    if(!req.session.isLoggedIn){
        return res.redirect('/');
    }
    Order.find({ userId: req.user })
        .then(orders => {
            res.render('shop/order', {
                orders: orders,
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postAddOrder = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const order = new Order({
                items: user.cart.items.map(item => {
                    return { product: {...item.productId._doc}, quantity: item.quantity };
                }),
                userId: req.user._id,
            })
            return order.save()
        })
        .then(result => {
            console.log("Order Saved!!");
            req.user.cart.items = [];
            return req.user.save();
        })
        .then(result => {
            res.redirect('/shop/cart');
        })
        .catch(err => {
            console.log(err);
        })

}
