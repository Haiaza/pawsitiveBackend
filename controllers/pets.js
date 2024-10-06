const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const Pet = require('../models/pet')
const { assignPetPic, createPet } = require('../services/petService')

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


//* show
router.get('/pets/:id', async (req, res) => {
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
