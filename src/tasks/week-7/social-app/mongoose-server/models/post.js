const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    likesNumber: {
        type: Number,
        default: 0,
    },
    likes: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Like'
    }],
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Post', PostSchema);
