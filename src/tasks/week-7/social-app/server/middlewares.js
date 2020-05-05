const User = require('./models/user');

const errorHandler = (req, res, next) => {
    res.sendHTTPError = (status, message) => {
        res.status(status).json({ message })
    }
    next()
}

const requireAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.sendHTTPError(403, 'Token is not provided')
    }
    const token = req.headers.authorization.split(' ')[1];
    User.verify(token)
      .then(user => {
          req.userId = user._id;
          next()
      })
      .catch(err => res.sendHTTPError(401, err.message))
};


module.exports = {
    errorHandler,
    requireAuth
};
