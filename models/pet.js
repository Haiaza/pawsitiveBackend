const mongoose = require('mongoose')

const petSchema = new mongoose.Schema({
    name:           String,
    breed:          String,
    age:            Number,
    isAdopted: {
        type:       Boolean,
        default:    false
    },
    pic: {
        type:       String,
        unique:     true
    }
})

const Pet = mongoose.model('Pet', petSchema)
module.exports = Pet