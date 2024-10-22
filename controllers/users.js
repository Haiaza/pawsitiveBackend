const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const Pet = require('../models/pet')
const verifyToken = require('../middleware/verify-token')
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


router.put('/:userId/pets', verifyToken, async (req, res) => {
    try {
        const { petId } = req.body;

        // Find the user by ID
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the specific pet
        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Check if the pet is already adopted
        if (pet.isAdopted) {
            return res.status(400).json({ message: 'This pet is already adopted' });
        }

        // Check if the user has already adopted this pet
        if (user.adoptedPets.includes(pet.id)) {
            return res.status(400).json({ message: 'Pet already adopted by this user' });
        }

        // Add the pet to the user's adopted pets array
        user.adoptedPets.push(pet.id);
        pet.isAdopted = true;  // Mark the pet as adopted

        // Save both user and pet changes
        await Promise.all([user.save(), pet.save()]);

        // Respond with success and the new pet data
        res.json({ 
            message: 'Pet adopted successfully', 
            adoptedPets: user.adoptedPets,
            newPet: {
                id: pet.id,
                name: pet.name,
                breed: pet.breed
            }
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


//* show
router.get('/:userId/pets', async (req, res) => {
    try {
        const petInDatabase = await User.findById(req.params.id)
        if (!petInDatabase) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.json(petInDatabase)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


module.exports = router;
