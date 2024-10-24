const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/check', async (req,res)=>{
    res.send("Verified");
});

module.exports = router;
