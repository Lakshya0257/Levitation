const express = require('express');
const { generateInvoice } = require('../controllers/pdfController');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

router.get('/generate-invoice', verifyToken, generateInvoice);

module.exports = router;
