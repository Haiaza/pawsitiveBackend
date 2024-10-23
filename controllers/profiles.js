const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Pet = require('../models/pet');
const verifyToken = require('../middleware/verify-token')

router.get('/:userId', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('adoptedPets')

        console.log(`This is what is included inside of the user : ${user}`)
        if (!user) {
            res.status(404);
            throw new Error('Profile not found.');
        }
        res.json({ user });
    } catch (error) {
        if (res.statusCode === 404) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});


router.delete('/:petId/pets/:userId ', verifyToken, async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.petId) // aka updatePet
        const theUser = req.user._id

        // Find the user
        const user = await User.findById(theUser);
        if (!user) {
            res.status(404);
            throw new Error('User not found.');
        }

        // Check if the pet is in the adoptedPets array
        const petIndex = user.adoptedPets.includes(pet)
        if (petIndex === -1) {
            res.status(404);
            throw new Error('Pet not found in the user\'s adopted pets.');
        }

        // Remove the pet from the adoptedPets array
        user.adoptedPets.splice(petIndex, 1);
        await user.save();

        // Optionally, delete the pet from the Pet collection (if pets are removed completely)
        await Pet.findByIdAndDelete(petId);

        res.json({ message: `The pet with ID ${petId} has been prepared to go home with the user.` });
    } catch (error) {
        if (res.statusCode === 404) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

module.exports = router;
