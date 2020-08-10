const User = require('../models/user');
const bcript = require('bcryptjs');
const nodemailer = require('nodemailer')
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const { ESRCH } = require('constants');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lmtruong1512@gmail.com',
        pass: 'Levuhao2x'
    }
});

exports.getLogin = (req, res, next) => {
    const tmp = req.flash('error');
    res.render('auth/login', {
        errorMessage: tmp.length > 0 ? tmp : null,
        oldInput: {
            username: '',
            password: ''
        },
        validationErrors: []
    })
}

exports.postLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('auth/login', {
            errorMessage: "Please enter valid email and password!",
            oldInput: {
                username: username,
                password: password
            },
            validationErrors: errors.array()
        })
    }
    User.findOne({ username: username }).then(user => {
        if (!user) {
            req.flash('error', 'Username or password is invalid');
            return res.redirect('/login');
        }
        bcript.compare(password, user.password).then(doMatch => {
            if (doMatch) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                req.session.save(err => {
                    console.log(err);
                    res.redirect('/');
                })
            }
            else {
                req.flash('error', 'Username or password is invalid');
                res.redirect('/login');
            }
        })
            .catch(err => {
                console.log(err);
                res.redirect('/login');
            })

    })
        .catch(err => {
            console.log(err);
        })
}

exports.getSignUp = (req, res, next) => {
    const tmp = req.flash('error');
    res.render('auth/signup', {
        errorMessage: tmp.length > 0 ? tmp : null,
        oldInput: {
            username: '',
            password: '',
            passwordAgain: ''
        },
        validationErrors: []
    })
}

exports.postSignUp = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const passwordAgain = req.body.passwordAgain;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('auth/signup', {
            errorMessage: "Please enter valid email and password!",
            oldInput: {
                username: username,
                password: password,
                passwordAgain: passwordAgain
            },
            validationErrors: errors.array()
        })
    }
    User.findOne({ username: username }).then(user => {
        if (user) {
            req.flash('error', 'The username is existed, please choose another username!');
            return res.redirect('/signup');
        }
        bcript.hash(password, 12)
            .then(hashedPassword => {
                user = new User({
                    username: username,
                    password: hashedPassword,
                    cart: {
                        items: []
                    }
                });
                user.save()
                    .then(result => {
                        let message = `Your username: ${username} with password: ${password}\n Verify Token: ${Math.floor(Math.random() * 1000000)}`
                        let mailOptions = {
                            from: 'lmtruong1512@gmail.com',
                            to: username,
                            subject: 'Verify Account MTShop',
                            text: message,
                            html: `<b>MTShop<b> ${message}`
                        }
                        transporter.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Email sent :' + info.response);
                            }
                        })
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        })
                    })
            })
    })
        .catch(err => {
            console.log(err);
        })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}

exports.getReset = (req, res, next) => {
    const tmp = req.flash('error');
    res.render('auth/reset', {
        errorMessage: tmp.length > 0 ? tmp : null
    })
}

exports.postReset = (req, res, next) => {
    const username = req.body.username;
    User.findOne({ username: username })
        .then(user => {
            if (!user) {
                req.flash('error', "Username is not exist!");
                res.redirect('/reset');
            }
            crypto.randomBytes(32, (err, buf) => {
                if (err) {
                    console.log(err);
                    return res.redirect('/reset');

                }
                const token = buf.toString('hex');
                user.resetPasswordToken = token;
                user.resetPasswordExpiration = Date();
                user.save().then(result => {
                    let message = `<h3>You has requested to change your password in MTShop.</h3>
                    <p>Please click here to change: <a href="http://localhost:9898/reset/${token}">http://localhost:9898/reset/${token}</a></p>
                    <p> If not you, please check your account again!</p>
                    `;
                    transporter.sendMail({
                        from: 'lmtruong1512@gmail.com',
                        to: username,
                        subject: 'Reset Password',
                        html: message
                    }).then(result => {
                        // console.log(result);
                        req.flash('error', "Email was sent to your email, please check it!");
                        return res.redirect('/login');
                    }).catch(err => {
                        console.log(err);
                    })
                });

            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({
        resetPasswordToken: token, resetPasswordExpiration: { $gt: Date() - 60 * 60 * 1000 }
    }).then(user => {
        console.log(token);
        console.log(Date() - 60 * 60 * 1000);
        if (!user) {
            req.flash('error', "The link is not valid or expired!");
            return res.redirect('/login');
        }
        res.render('auth/reset-new-password', {
            username: user.username,
            userId: user._id,
        })
    }).catch(err => {
        console.log(err);
    })
}

exports.postNewPassword = (req, res, next) => {
    const userId = req.body.userId;
    const newPassword = req.body.password;
    let resetUser;
    User.findById(userId)
        .then(user => {
            resetUser = user;
            return bcript.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetPasswordToken = undefined;
            resetUser.resetPasswordExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            req.flash('error', "Your password was changed, now you can login to your account!");
            return res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        })
   
}