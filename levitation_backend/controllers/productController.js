const Product = require('../models/Product');

const addProduct = async (req, res) => {
    try {
        const { productname, price, quantity } = req.body;

        const product = new Product({ productname, price, quantity });
        const savedProduct = await product.save();

        res.json(savedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addProduct, getProducts };
