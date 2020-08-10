const express = require('express');
const router = express.Router();
const authController = require('../controllers/authentication');;
const { check, body } = require('express-validator/check');

router.get('/login', authController.getLogin);
router.post('/login', [
    body('username')
        .isEmail()
        .withMessage('Please enter valid email address!')
        .normalizeEmail(), 
    body('password', 'Please enter valid password at least 5 characters')
        .isLength({min: 5})
        .isString()
        .trim()
], authController.postLogin);
router.get('/signup', authController.getSignUp);
router.post('/signup', [
    body('username', 'Please enter valid email')
        .isEmail()
        .normalizeEmail(),
    body('password', 'Please enter valid password!')
        .isString()
        .isLength({min: 5})
        .trim(),
    body('passwordAgain', 'Please enter the same password above!')
        .custom((value, {req}) => {
            if(value === req.body.password){
                return true;
            }
            throw new Error('Passwords have to match!');
        })
], authController.postSignUp);
router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/reset-new-password', authController.postNewPassword);
module.exports = router;    