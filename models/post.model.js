const mongoose = require('mongoose');

const postSchema =  new mongoose.Schema({
    title: {
        type: String,
        required: true 
    },
    body: {
        type: String,
        required: true 
    },
    author: {
        type: String,
        required: true 
    },
    author_email: {
        type: String,
        required: true 
    }
}, 
{
    timestamps: true
})

// postSchema.set('timestamps', false);
module.exports = mongoose.model('Post',postSchema);