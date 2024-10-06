const axios = require("axios")

const assignPetPic(pet)  =>   {
    const breedName = pet.breed.toLowerCase().replace(' ',"-")
    const apiURL = `https://dog.ceo/api/breed/${breedName}/images/random/`

    try {
        const response = await axios.get(apiURL)
        if (response.data.message === 'success'){
            console.log(response.data)

        }
    } catch (error) {
        console.error(error)
    }
}