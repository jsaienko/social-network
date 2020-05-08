const mongoose = require('mongoose');

const friendsSchema = mongoose.Schema({
    requester: { type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
    recipient: { type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
    status: {
        type: Number,
        enums: [
            0,    //'add friend',
            1,    //'requested',
            2,    //'pending',
            3,    //'friends'
        ]
    }
}, {timestamps: true});
module.exports = mongoose.model('Friends', friendsSchema);
