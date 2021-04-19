const mongoose = require('mongoose');
const validator = require('validator');

const userSchema =  new mongoose.Schema({
    fullname: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true,
        validate: [ validator.isEmail, 'invalid email' ]
    },
    password: {
        type: String,
        required: true 
    }
    
})

module.exports = mongoose.model('User',userSchema);