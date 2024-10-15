const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

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
    },
    id: {
        type: String,
        default: uuidv4,
        unique: true,
        required: true
    }
})

const Pet = mongoose.model('Pet', petSchema)
module.exports = Pet