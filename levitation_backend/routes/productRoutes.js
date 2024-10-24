const express = require('express');
const { addProduct, getProducts } = require('../controllers/productController');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

router.post('/products', verifyToken, addProduct);
router.get('/products', verifyToken, getProducts);

module.exports = router;
