// docker run --name social-network-mongo -d -p 27017:27017  mongo
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/social-network', {useNewUrlParser: true, useUnifiedTopology: true});