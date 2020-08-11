const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');
const user = require('../models/user');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

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
    let order;
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            order = new Order({
                items: user.cart.items.map(item => {
                    return { product: { ...item.productId._doc }, quantity: item.quantity };
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

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error("Cannot find this order!"));
            }
            if (order.userId.toString() !== req.user._id.toString()) {
                return next(new Error("Cannot access this order!"));
            }
            const fileName = path.join('data', 'invoices', 'invoice_' + orderId + '.pdf');
            // generate invoice file(pdf)
            const docInvoice = new PDFDocument();
            docInvoice.fontSize(20).text("Invoice:", {
                align: 'center',
                underline: true,
            });
            docInvoice.fontSize(16).text('Order Id: ' + order._id);
            docInvoice.fontSize(16).text('List of products:');
            let totalPrice = 0;
            order.items.forEach(item => {
                totalPrice += item.product.price * item.quantity;
                docInvoice.fontSize(14).text(item.product._id + ": " + item.product.price + " * " + item.quantity);
            })
            docInvoice.fontSize(16).text('Total Price: ' + totalPrice);
            docInvoice.end();
            docInvoice.pipe(fs.createWriteStream(fileName));

            //Send file to client using stream -> send mutiple trunk data
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="' + fileName + '"');
            docInvoice.pipe(res);

            //Send file to client when fetched completely to memory
            // const invoiceFile = fs.readFile(fileName, (err, data) => {
            //     if (err) {
            //         return next(err);
            //     }
            //     console.log(data);
            //     res.setHeader('Content-Type', 'application/pdf');
            //     res.setHeader('Content-Disposition', 'attachment; filename="' + fileName + '"');
            //     res.send(data);
            // })
        })
        .catch(err => {
            return next(err);
        })
}
