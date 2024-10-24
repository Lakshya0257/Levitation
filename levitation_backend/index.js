// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const puppeteer = require('puppeteer');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB Atlas connection
// const MONGODB_URI = process.env.MONGODB_URI;

// mongoose.connect(MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log('Connected to MongoDB Atlas successfully!'))
// .catch((err) => console.error('Could not connect to MongoDB Atlas:', err));

// // Handle MongoDB connection errors
// mongoose.connection.on('error', err => {
//     console.error('MongoDB connection error:', err);
// });

// mongoose.connection.on('disconnected', () => {
//     console.log('MongoDB disconnected');
// });

// // Handle application termination
// process.on('SIGINT', async () => {
//     await mongoose.connection.close();
//     process.exit(0);
// });

// // User Schema
// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true }
// });

// // Product Schema
// const productSchema = new mongoose.Schema({
//     productname: { type: String, required: true },
//     price: { type: Number, required: true },
//     quantity: { type: Number, required: true }
// });

// const User = mongoose.model('User', userSchema);
// const Product = mongoose.model('Product', productSchema);

// // Middleware for JWT verification
// const verifyToken = (req, res, next) => {
//     // Get the token from the authorization header - note the lowercase
//     const authHeader = req.headers['authorization'];
//     if (!authHeader) return res.status(401).json({ error: 'Access denied. No token provided.' });

//     try {
//         // Remove 'Bearer ' from the token if it exists
//         const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
//         console.log('Token being verified:', token);
        
//         const verified = jwt.verify(token, 'LevitationToken');
//         req.user = verified;
//         next();
//     } catch (error) {
//         console.log('Token verification error:', error);
//         res.status(400).json({ error: 'Invalid token' });
//     }
// };

// // Register API
// app.post('/api/register', async (req, res) => {
//     try {
//         if(!req.body.name || !req.body.email || !req.body.password){
//             res.status(500).json({
//                 "status": "Invalid Arguments",
//                 "data": "Cannot register user."
//             })
//         }
//         const { name, email, password } = req.body;

//         // Check if user already exists
//         const emailExists = await User.findOne({ email });
//         if (emailExists) {
//             return res.status(400).json({ error: 'Email already exists' });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create new user
//         const user = new User({
//             name,
//             email,
//             password: hashedPassword
//         });

//         const savedUser = await user.save();
//         const token = jwt.sign({ _id: user._id }, 'LevitationToken');
//         res.header('auth-token', token).json({ token });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Login API
// app.post('/api/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Check if user exists
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ error: 'Email not found' });
//         }

//         // Validate password
//         const validPassword = await bcrypt.compare(password, user.password);
//         if (!validPassword) {
//             return res.status(400).json({ error: 'Invalid password' });
//         }

//         // Create and assign token
//         const token = jwt.sign({ _id: user._id }, 'LevitationToken');
//         res.header('auth-token', token).json({ token });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Add Product API (Protected route)
// app.post('/api/products', verifyToken, async (req, res) => {
//     try {
//         const { productname, price, quantity } = req.body;

//         const product = new Product({
//             productname,
//             price,
//             quantity
//         });

//         const savedProduct = await product.save();
//         res.json(savedProduct);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.get('/api/products', verifyToken, async (req,res)=>{
//     try{
//         res.json(await Product.find());
//     }catch (error){
//         res.status(500).json({error: error.message});
//     }
// })

// // Generate PDF API (Protected route)
// app.post('/api/generate-invoice', verifyToken, async (req, res) => {
//     // const { travellerName, email, totalAmount, gst, date } = req.body;

//     const products = await Product.find();
//     const totalAmount = 0;
//     const gst = 0;
//     const date = Date.now();

//     try {
//         // Launch Puppeteer
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();

//         // Prepare your HTML template
//         const htmlContent = `
//           <html>
//             <head>
//               <style>
//                 body { font-family: Arial, sans-serif; }
//                 .invoice-container { max-width: 800px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; background-color: #fff; }
//                 .header { text-align: center; }
//                 .header img { max-height: 50px; }
//                 .header h1 { margin-top: 10px; }
//                 .content { margin-top: 20px; }
//                 .content table { width: 100%; border-collapse: collapse; }
//                 .content table, th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
//                 .content th { background-color: #f2f2f2; }
//                 .total-section { margin-top: 20px; }
//                 .footer { text-align: center; margin-top: 50px; font-size: 12px; }
//               </style>
//             </head>
//             <body>
//               <div class="invoice-container">
//                 <div class="header">
//                   <img src="logo.png" alt="Logo">
//                   <h1>INVOICE</h1>
//                 </div>
//                 <div class="content">
//                   <table>
//                     <thead>
//                       <tr>
//                         <th>Product</th>
//                         <th>Qty</th>
//                         <th>Rate</th>
//                         <th>Total Amount</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       ${products.map(product => `
//                         <tr>
//                           <td>${product.name}</td>
//                           <td>${product.qty}</td>
//                           <td>${product.rate}</td>
//                           <td>${product.total}</td>
//                         </tr>
//                       `).join('')}
//                     </tbody>
//                   </table>
//                 </div>
//                 <div class="total-section">
//                   <p>Total Charges: $${totalAmount}</p>
//                   <p>GST (18%): $${gst}</p>
//                   <p><strong>Total Amount: ₹${parseFloat(totalAmount) + parseFloat(gst)}</strong></p>
//                 </div>
//                 <div class="footer">
//                   <p>Date: ${date}</p>
//                   <p>We are pleased to provide any further information you may require. Rest assured, it will receive our prompt and dedicated attention.</p>
//                 </div>
//               </div>
//             </body>
//           </html>
//         `;

//         await page.setContent(htmlContent);
//         await page.emulateMediaType('screen');

//         // Generate the PDF
//         const pdfBuffer = await page.pdf({
//             path: 'mypdf.pdf',
//             format: 'A4',
//             printBackground: true,
//             margin: {
//                 top: '20px',
//                 bottom: '20px',
//                 right: '10px',
//                 left: '10px'
//             }
//         });

//         await browser.close();

//         // Set response headers and send the PDF
//         res.set({
//             'Content-Type': 'application/pdf',
//             'Content-Disposition': `attachment; filename=invoice_${date}.pdf`,
//         });

//         res.send(pdfBuffer);
//     } catch (error) {
//         console.error('Error generating PDF:', error);
//         res.status(500).send('Failed to generate PDF');
//     }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const mongoose = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', pdfRoutes);

// Handle application termination
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
