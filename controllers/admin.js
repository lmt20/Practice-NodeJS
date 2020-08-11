const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.find({userId: req.user._id})
        .then((products) => {
            res.render('admin/products', {
                title: 'Product List',
                path: 'admin/products',
                products: products
            })

        }).catch((err) => {
            console.log(err);
        });
}

exports.getProductById = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then((product) => {
            const isCreatedUser = product.userId.toString() === req.user._id.toString();
            res.render('admin/product', {
                title: 'Product',
                path: 'admin/product',
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
        path: 'admin/add-product',
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imgUrl = req.body.imgUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        title: title,
        imgUrl: imgUrl,
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
                path: 'admin/edit-product',
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
    const imgUrl = req.body.imgUrl;
    const price = req.body.price;
    const description = req.body.description;
    return Product.findById(productId)
        .then(product => {
            product.title = title;
            product.imgUrl = imgUrl;
            product.price = price;
            product.description = description;
            product.save();
        })
        .then( () => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
}