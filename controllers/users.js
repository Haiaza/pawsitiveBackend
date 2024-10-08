const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

const SALT_LENGTH = 12
//Landing page Btn - Sign up Page - Sign in Page


router.post('/signup', async (req, res) => {
    try {
      // Check if the username is already taken
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (userInDatabase) {
        return res.json({ error: 'Username already taken.' });
    }
      // Create a new user with hashed password
        const user = await User.create({
        username: req.body.username,
        hashedPassword: bcrypt.hashSync(req.body.password, SALT_LENGTH),
        email: req.body.email
    });
        const token = jwt.sign(
        { username: user.username, _id: user._id },
        process.env.JWT_SECRET
    );
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.post('/signin', async (req, res) => {
    try {
        // Hey DB Find this user
        const user = await User.findOne({ username: req.body.username });

        /// If we find a user, compare the password they supplied to the one in the DB
        if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
            
        
            //SUCCESS!!

            //Create a signed token now!
            const token = jwt.sign(
                
            { username: user.username, _id: user._id },
            process.env.JWT_SECRET
        );

        //
        res.status(200).json({ token });
    } else {
        res.status(401).json({ error: 'Invalid username or password.' });
    }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



module.exports = router;
