const express = require('express');
const app = express();
const port = 9898;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');


const MONGODB_URI = "mongodb+srv://lmtruong1512:lmtruong1512@cluster0.lhnzg.mongodb.net/shop_mongoose";
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: "MySessions"
})

const authRoutes = require('./routes/auth.js');

const shopRoutes = require('./routes/shop.js');
const adminRoutes = require('./routes/admin.js');
const errorController = require('./controllers/error.js');
const User = require('./models/user.js');

const csrfProtection = csrf();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: "MyScret",
        store: store,
        resave: true,
        saveUninitialized: true

    })
);
app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        })
})
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn,
    res.locals.csrfToken = req.csrfToken();
    next();
})
app.use(authRoutes);

app.use(shopRoutes);

app.use('/admin', adminRoutes);
app.use(errorController.get404); 
app.use(errorController.get500);

mongoose.connect("mongodb+srv://lmtruong1512:lmtruong1512@cluster0.lhnzg.mongodb.net/shop_mongoose?retryWrites=true&w=majority")
    .then((result) => {
        app.listen(port);
    })
    .catch(err => {
        console.log(err);
    })