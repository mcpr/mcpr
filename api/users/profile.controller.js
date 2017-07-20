const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports.profileRead = function (req, res) {

    // If no user ID exists in the JWT return a 401
    if (!req.payload._id) {
        res.status(401).json({
            'message': 'UnauthorizedError: private profile'
        });
    } else {
        // Otherwise continue
        User
            .findById(req.payload._id)
            .exec(function (err, user) {
                res.status(200).json(user);
            });
    }

};

module.exports.showAll = function (req, res) {
    User
        .find()
        .exec(function (err, users) {
            res.status(200).json(users);
        });
};
    
module.exports.create = function (req, res, next) {
    let user = req.body;

    return User
        .create(req.body, function (err, user) {
            if (err) {
                return handleError(res, err);
            }
            req.user = user;
            next();
        });
};

function handleError(res, err) {
    console.log('ERROR: ' + err);
    return res.status(500).send(err);
}

function handle404(res) {
    res.status(404);
    res.json({
        name: 'NotFound',
        statusCode: 404,
        message: '404: the resource that you requested could not be found'
    });
}