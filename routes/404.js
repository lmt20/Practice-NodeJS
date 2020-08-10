const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('This the Routes Home page')
});

module.exports = router;