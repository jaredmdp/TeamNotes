const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


//register new user
router.post('/register', async (req, res) => {
    try {
        const {username, password} = req.body;

        const existingUser = await User.findOne({username});
        if (existingUser) {
            return res.status(400).json({error : 'Username already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password : hashedPassword
        });

        await newUser.save();

        res.status(201).json({message : 'User created successfully'});
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({error : 'Failed to register user'});
    }
});

//login user
router.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});

        if (!user) {
            return res.status(401).json({error : 'Invalid username or password'});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect) {
            return res.status(401).json({error : 'Invalid username or password'});
        }

        const token = jwt.sign({username : user.username}, process.env.JWT_SECRET, {expiresIn : '1h'});

        res.status(200).json({token});
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({error : 'Failed to login user'});
    }
});

module.exports = router;