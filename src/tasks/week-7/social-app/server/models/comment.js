const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    body: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'User'
    },
    entityId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      refPath: 'entityModel'
    },
    entityModel: {
      type: String,
      required: true,
      enum: ['Post']
    }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('Comment', CommentSchema);
