const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

// productSchema.methods.

module.exports = mongoose.model("Product", productSchema);

// class Product {
//     constructor(title, imgUrl, price, description, id, userId) {
//         this.title = title;
//         this.imgUrl = imgUrl;
//         this.price = price;
//         this.description = description;
//         this._id = id ? new mongodb.ObjectId(id) : null;
//         this.userId = userId;
//     }

//     save() {
//         let dbEx;
//         if(this._id){
//             dbEx = getDb().collection('products').updateOne({_id: this._id}, {$set: this});
//         }
//         else{
//             dbEx = getDb().collection('products').insertOne(this);
//         }
//         return dbEx.then(result => {
//                 console.log(result);
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }

//     static fetchAll() {
//         return getDb().collection('products').find().toArray()
//             .then(products => {
//                 return products;
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }

//     static fetchById(productId) {
//         return getDb().collection('products').find({_id: mongodb.ObjectId(productId)})
//             .next()
//             .then(product => {
//                 return product;
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }
    
//     static deleteById(productId) {
//         return getDb().collection('products')
//                 .deleteOne({_id: mongodb.ObjectId(productId)})
//                 .then(result => {
//                     console.log(result);
//                 })
//                 .catch(err => {
//                     console.log(err);
//                 })
//     }
// }

// module.exports = Product;