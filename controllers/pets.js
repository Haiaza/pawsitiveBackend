const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const Pet = require('../models/pet')
const User= require('../models/user')
const { assignPetPic, createPet } = require('../services/petService')
const verifyToken = require('../middleware/verify-token')

//* create
router.post('/', async (req, res) => {
    try {
        //Create a new pet
        const newPet = await createPet(req.body);
        res.status(201).json(newPet)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

//* index
router.get('/', async (req, res) => {
    try {
        const petsInDatabase = await Pet.find()
        res.json(petsInDatabase)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.patch('/adopt/:petId', verifyToken, async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.petId) // aka updatePet
        const theUser = req.user._id



        if (!pet) return res.status(404).send('404 Pet Not Found')
        
            //if we can find the pet - update it
        pet.isAdopted = true
        await pet.save()

            //success!
            // now update the user
        const user = await User.findById(theUser)
        if (!user) return res.status(404).send('404 User Not Found')

            // success!
        user.adoptedPets.push(req.params.petId)
        await user.save()

        res.status(200).json({ message: 'Success! You have successfully adopted', pet})
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
})


//* show
router.get('/:id', async (req, res) => {
    try {
        const petInDatabase = await Pet.findById(req.params.id)
        if (!petInDatabase) {
            return res.status(404).json({ error: 'Pet not found' })
        }
        res.json(petInDatabase)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


module.exports = router;
