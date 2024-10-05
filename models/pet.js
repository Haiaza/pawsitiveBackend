const mongoose = require('mongoose')

const petSchema = new mongoose.Schema({
    name:           String,
    breed:          String,
    Age:            Number,
    isAdopted: {
        type:       Boolean,
        default:    false
    }
})

const Pet = mongoose.model('Pet', petSchema)