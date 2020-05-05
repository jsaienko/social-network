const mongoose = require('mongoose');

const LikeSchema = mongoose.Schema({
    likeBy: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }],
});

module.exports = mongoose.model('Like', LikeSchema);
