const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
    },
    entityId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        // Instead of a hardcoded model name in `ref`, `refPath` means Mongoose
        // will look at the `onModel` property to find the right model.
        refPath: 'entityModel'
    },
    entityModel: {
        type: String,
        required: true,
        enum: ['Post']
    }  
}, 
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
})


module.exports = mongoose.model('Comment', CommentSchema);