const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
    user: {
        type:   mongoose.Schema.Types.ObjectId,
        ref:    'User'
    },
    pet: {
        type:   mongoose.Schema.Types.ObjectId,
        ref:    'Pet'
    },
    status:     String,
    comments:   String,
})

const Application = mongoose.model('Application', applicationSchema)
module.exports = Application