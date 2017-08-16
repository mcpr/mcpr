const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

module.exports.profileRead = function (req, res) {
    // If no user ID exists in the JWT return a 401
    console.log(req.payload.id);
    if (!req.payload.id) {
        res.status(401).json({
            'message': 'UnauthorizedError: private profile'
        });
    } else {
        // Otherwise continue
        User
            .findById(req.payload.id)
            .exec(function (err, user) {
                if (err) {
                    return handleError(res, err);
                }
                res.status(200).json(user);
            });
    }
};

module.exports.showAll = function (req, res) {
    User
        .find()
        .exec(function (err, users) {
            if (err) {
                return handleError(res, err);
            }
            res.status(200).json(users);
        });
};

module.exports.register = function (req, res) {
    if (!req.body.email || !req.body.password) {
        res.json({
            success: false,
            message: 'Please enter email and password.'
        });
    } else {
        var newUser = new User({
            email: req.body.email,
            username: req.body.username,
            name: req.body.name,
            password: req.body.password
        });

        // Attempt to save the user
        newUser.save(function (err) {
            if (err) {
                if (err.code === 11000) {
                    return res.status(409).json({
                        success: false,
                        message: 'That email address or username already exists.'
                    });
                }
                console.log(err);
                return res.status(500).json(err);
            }
            res.json({
                success: true,
                message: 'Successfully created new user.'
            });
        });
    }

};

module.exports.login = function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) {
            handleError(res, err);
        }

        if (!user) {
            res.send({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else {
            // Check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // Create token if the password matched and no error was thrown
                    var token = jwt.sign({
                        id: user._id,
                        username: user.username
                    }, config.secret, {
                        expiresIn: 10080 // in seconds
                    });
                    res.json({
                        success: true,
                        token: token
                    });
                } else {
                    res.status(401).send({
                        success: false,
                        message: 'Authentication failed. Incorrect username or password.'
                    });
                }
            });
        }
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