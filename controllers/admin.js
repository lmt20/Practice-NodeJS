const Product = require('../models/product');
const CONST = require('../utils/constant');

exports.getProducts = (req, res, next) => {
    const numberProductsPerPage = CONST.NUMBER_PRODUCTS_PER_PAGE;
    const pageIndex = +req.query.page || 1;
    Product.count()
        .then(numDocument => {
            return Product.find({ userId: req.user._id })
            .skip((pageIndex - 1) * numberProductsPerPage)
            .limit(numberProductsPerPage)
            .then((products) => {
                return res.render('shop/products', {
                    title: 'Product List',
                    products: products,
                    pageIndex: pageIndex,
                    lastPageIndex: Math.ceil(numDocument / numberProductsPerPage),
                    hasPreviousPage: pageIndex > 1,
                    hasNextPage: pageIndex < Math.ceil(numDocument / numberProductsPerPage),
                });
            })
        })
        .catch (err => {
            console.log(err);
            return next(err);
        })
}

exports.getProductById = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then((product) => {
            const isCreatedUser = product.userId.toString() === req.user._id.toString();
            res.render('admin/product', {
                title: 'Product',
                isCreatedUser: isCreatedUser,
                product: product
            })
        }).catch((err) => {
            console.log(err);
        });
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        title: 'Add Product',
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    if(!image){
        throw new Error("Wrong type of file!");
    }
    const product = new Product({
        title: title,
        image: image.path,
        price: price,
        description: description,
        userId: req.user._id
    });
    product.save()
        .then((result) => {
            console.log("created product!");
            res.redirect('/admin/products')
        }).catch((err) => {
            console.log(err);
        });
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByIdAndDelete(productId)
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            res.render('admin/edit-product', {
                title: 'Edit Product',
                product: product
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    return Product.findById(productId)
        .then(product => {
            product.title = title;
            product.image = image.path;
            product.price = price;
            product.description = description;
            product.save();
        })
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
}