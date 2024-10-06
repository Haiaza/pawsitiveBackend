const axios = require("axios")
const Pet = require('../models/pet')


const assignPetPic= async (pet)  =>   {
    const breedName = pet.breed.toLowerCase().replace(' ',"-")
    const apiURL = `https://dog.ceo/api/breed/${breedName}/images/random/`

    try {
        const response = await axios.get(apiURL)
        if (response.data.status === 'success'){
            console.log(response.data)
            //* Attempt to generate a pet picture with breed 
            const baseURL = response.data.message.split('/').slice(0, -1).join('/')
            //* "https://images.dog.ceo/breeds/germanshepherd"
            
            const fileName = response.data.message.split('/').pop()
            //* "n02106662_6931.jpg"

            const newPicURL = `${baseURL}/${fileName}`


            //*Assuming the API chose a pic the breed has already used , try again
            const preExistingPic = await Pet.findOne({ pic: newPicURL }) 
            if (preExistingPic) {
                console.log('Pic Already taken')
                return assignPetPic(pet)
            }
            //* The picture can now be applied now that we know its unique
            pet.pic = newPicURL
        } else {
            throw new Error('Failed to fetch dog picture')
        }
    } catch (error) {
        console.error(error)
    }

    return pet
}

const createPet = async (formData) => {
    try {
        
        let newPet =   new Pet(formData)
        newPet =  await assignPetPic(newPet)

        const savedPet = await newPet.save();
        console.log('Pet saved successfully:', savedPet);
        return savedPet;

    } catch (error) {
        console.error('Error creating pet:', error)
    }
}

module.exports = { assignPetPic, createPet }