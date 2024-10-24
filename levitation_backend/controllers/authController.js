const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const emailExists = await User.findOne({ email });
        if (emailExists) return res.status(400).json({ error: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword });
        const savedUser = await user.save();

        const token = jwt.sign({ _id: user._id }, 'LevitationToken');
        res.header('auth-token', token).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Email not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ _id: user._id }, 'LevitationToken');
        res.header('auth-token', token).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register, login };
