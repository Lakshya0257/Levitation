const puppeteer = require('puppeteer');
const Product = require('../models/Product');
const fs = require('fs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateInvoice = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    const userId = verified._id;
    console.log(userId);
    let browser = null;
    try {
        const products = await Product.find();
        const user = await User.findById(userId);
        // console.log(user);
        
        let totalCharges = 0;
        products.forEach(product => {
            totalCharges += product.price * product.quantity;
        });
        
        const gst = totalCharges * 0.18;
        const totalAmount = totalCharges + gst;
        const date = new Date().toLocaleDateString('en-GB');

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: white;
                    }
                    
                    .header {
                        background-color: #1a1f2e;
                        color: white;
                        padding: 20px;
                        border-radius: 8px;
                        margin-bottom: 20px;
                        position: relative;
                    }
                    
                    .person-name {
                        color: #98ff98;
                        margin: 5px 0;
                        font-size: 18px;
                    }
                    
                    .email {
                        color: #888;
                        font-size: 14px;
                    }
                    
                    .date {
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        color: white;
                    }
                    
                    .table-header {
                        background: linear-gradient(to right, #1a1f2e, #243447);
                        color: white;
                        padding: 10px;
                        border-radius: 8px;
                        display: grid;
                        grid-template-columns: 2fr 1fr 1fr 1fr;
                        margin-bottom: 10px;
                    }
                    
                    .table-row {
                        display: grid;
                        grid-template-columns: 2fr 1fr 1fr 1fr;
                        padding: 10px;
                        background-color: #f8f9fa;
                        border-radius: 4px;
                        margin-bottom: 5px;
                    }
                    
                    .totals {
                        width: 200px;
                        margin-left: auto;
                        margin-top: 20px;
                        padding: 10px;
                        border: 1px solid #dee2e6;
                        border-radius: 8px;
                    }
                    
                    .totals div {
                        display: flex;
                        justify-content: space-between;
                        margin: 5px 0;
                    }
                    
                    .total-amount {
                        border-top: 1px solid #dee2e6;
                        padding-top: 5px;
                        margin-top: 5px;
                        color: #0066ff;
                        font-weight: bold;
                    }
                    
                    .footer {
                        margin-top: 40px;
                        background-color: #1a1f2e;
                        color: white;
                        padding: 15px;
                        border-radius: 8px;
                        font-size: 14px;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <div>Traveller Name</div>
                        <div class="person-name">${user.name}</div>
                        <div class="email">${user.email}</div>
                    </div>
                    <div class="date">Date: ${date}</div>
                </div>
                
                <div class="table-header">
                    <div>Product</div>
                    <div>Qty</div>
                    <div>Rate</div>
                    <div>Total Amount</div>
                </div>
                
                ${products.map(product => `
                    <div class="table-row">
                        <div>${product.productname}</div>
                        <div>${product.quantity}</div>
                        <div>${product.price}</div>
                        <div>USD ${product.price * product.quantity}</div>
                    </div>
                `).join('')}
                
                <div class="totals">
                    <div>
                        <span>Total Charges</span>
                        <span>$${totalCharges.toFixed(2)}</span>
                    </div>
                    <div>
                        <span>GST (18%)</span>
                        <span>$${gst.toFixed(2)}</span>
                    </div>
                    <div class="total-amount">
                        <span>Total Amount</span>
                        <span>₹${totalAmount.toFixed(2)}</span>
                    </div>
                </div>
                
                <div class="footer">
                    We are pleased to provide any further information you may require and look forward to assisting with your next
                    order. Rest assured, it will receive our prompt and dedicated attention.
                </div>
            </body>
            </html>
        `;

        // Launch browser with specific settings for PDF generation
        browser = await puppeteer.launch();

        const page = await browser.newPage();
        await page.setContent(htmlContent
    );

        // Generate PDF with specific settings
        await page.pdf(
            {
            format: 'A4',
            printBackground: true,
            path: "test2.pdf",
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            },
            preferCSSPageSize: true,
            displayHeaderFooter: false
        }
    );
        await page.close();
        await browser.close();

        const src = fs.createReadStream('./test2.pdf');
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="invoice_${Date.now()}.pdf"`,
            'Content-Transfer-Encoding': 'Binary'
        });

        src.pipe(res);

    } catch (error) {
        console.error('PDF Generation Error:', error);
        return res.status(500).json({ error: error.message || 'Failed to generate PDF' });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

module.exports = { generateInvoice };