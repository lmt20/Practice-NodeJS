const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: String,
    resetPasswordExpiration: String,
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true
            }
        }],
    }
})

userSchema.methods.addToCart = function (productId) {
    if (!this.cart.items) {
        this.cart.items = [];
    }
    let itemIndex = this.cart.items.findIndex(item => {
        return productId.toString() === item.productId.toString();
    });

    if (itemIndex === -1) {
        this.cart.items.push({ productId: productId, quantity: 1 });
    }
    else {
        this.cart.items[itemIndex].quantity += 1;
    }
    return this.save();
}

module.exports = mongoose.model('User', userSchema);

// class User {
//     constructor(name, email, cart, _id) {
//         this.name = name;
//         this.email = email;
//         this.cart = cart;
//         this._id = _id ? new mongodb.ObjectId(_id) : null;
//     }

//     save() {
//         return getDb().collection('users').insertOne(this)
//             .then(result => {
//                 console.log(result);
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }

//     static fetchById(userId) {
//         return getDb().collection('users').findOne({ _id: new mongodb.ObjectId(userId) })
//             .then(user => {
//                 return user;
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }

//     getCart() {
//         const productIdList = this.cart.items.map(item => {
//             return item.productId;
//         })
//         return getDb().collection('products').find({ _id: { $in: productIdList } })
//             .toArray()
//             .then(products => {
//                 return products.map(product => {
//                     return {
//                         product: product, quantity: this.cart.items.find(item => {
//                             return item.productId.toString() === product._id.toString();
//                         }).quantity
//                     };
//                 })
//             })
//     }

//     addToCart(productId) {
//         if (!this.cart.items) {
//             this.cart.items = [];
//         }
//         let itemIndex = this.cart.items.findIndex(item => {
//             return productId === item.productId.toString();
//         });

//         if (itemIndex === -1) {
//             this.cart.items.push({ productId: new mongodb.ObjectId(productId), quantity: 1 });
//         }
//         else {
//             this.cart.items[itemIndex].quantity += 1;
//         }
//         return getDb().collection('users').updateOne({ _id: this._id }, { $set: this })
//             .then(result => {
//                 return result;
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }
//     deleteItemInCart(productId) {
//         let updateItems = [...this.cart.items];
//         const itemIndex = updateItems.findIndex(item => {
//             return item.productId.toString() === productId;
//         })
//         updateItems.splice(itemIndex, 1);
//         this.cart.items = updateItems;
//         return getDb().collection('users').updateOne({ _id: this._id }, { $set: this })
//             .then(result => {
//                 return result;
//                 // console.log(result);
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }

//     getOrder() {
//         return getDb().collection('orders').find({ 'user.userId': this._id })
//             .toArray()
//             .then(orders => {
//                 return orders.map(order => {
//                     return { _id: order._id, items: order.items };
//                 });
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }

//     addOrder() {
//         return this.getCart().then(items => {
//             let order = {
//                 items: items,
//                 user: {
//                     userId: this._id,
//                     name: this.name
//                 }
//             };
//             return getDb().collection('orders').insertOne(order)
//                 .then(result => {
//                     this.cart.items = [];
//                     getDb().collection('users').updateOne({ _id: this._id }, { $set: this })
//                     return result;
//                 })
//                 .catch(err => {
//                     console.log(err);
//                 })

//         })

//     }

// }

// module.exports = User;