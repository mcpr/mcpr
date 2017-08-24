'use strict';

angular.module('app')
    .service('auth', function ($http, $window, jwtHelper, $state, $q, config) {
        var saveToken = function (token) {
            $window.localStorage['id_token'] = token;
        };

        var getToken = function () {
            var token = $window.localStorage['id_token'];
            if (token != undefined || null || '') {
                return token;
            } else {
                return false;
            }
        };

        var isLoggedIn = function () {
            if (getToken()) {
                var expired = jwtHelper.isTokenExpired(getToken());
                if (expired) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        };

        var logout = function () {
            $window.localStorage.removeItem('id_token');
            console.log('Logging out!')
            $state.go('home').then(function (result) {
                $window.location.reload();
            });
        };

        var currentUser = function () {
            var deferred = $q.defer();
            if (isLoggedIn()) {
                $http.get(config.apiUrl + '/users/me/profile').then(function (res) {
                    return deferred.resolve(res);
                }).catch(function (err) {
                    return deferred.reject(err);
                });
            }
            return deferred.promise;
        };

        var username = function () {
            var deferred = $q.defer();
            currentUser()
                .then(function (res) {
                    return deferred.resolve(res.data.username);
                })
                .catch(function (err) {
                    return deferred.resolve(false);
                });
            return deferred.promise;
        }

        var updateProfile = function (user) {
            var deferred = $q.defer();
            $http.put(config.apiUrl + '/users/me/profile', user)
                .then(function (res) {
                    return deferred.resolve(res)
                })
                .catch(function (err) {
                    return deferred.reject(err)
                });
            return deferred.promise;
        };

        var updatePassword = function (user) {
            var deferred = $q.defer();
            $http.put(config.apiUrl + '/users/me/password', user)
                .then(function (res) {
                    return deferred.resolve(res)
                })
                .catch(function (err) {
                    return deferred.reject(err)
                });
            return deferred.promise;
        };

        var login = function (user) {
            console.log('Logging in!');
            var deferred = $q.defer();
            $http.post(config.apiUrl + '/users/me/login', user, {
                    skipAuthorization: true,
                })
                .then(function (res) {
                    var expToken = res.data.token;
                    saveToken(expToken);

                    var tokenPayload = jwtHelper.decodeToken(expToken);
                    var date = jwtHelper.getTokenExpirationDate(expToken);
                    return deferred.resolve(res);
                }).catch(function (err) {
                    return deferred.reject(err);
                });
            return deferred.promise;
        };

        var signup = function (user) {
            console.log('Signing up!');
            var deferred = $q.defer();
            $http.post(config.apiUrl + '/users/me/signup', user, {
                    skipAuthorization: true,
                })
                .then(function (res) {
                    return deferred.resolve(res);
                }).catch(function (err) {
                    return deferred.reject(err);
                });
            return deferred.promise;
        };
        return {
            signup: signup,
            login: login,
            saveToken: saveToken,
            getToken: getToken,
            logout: logout,
            isLoggedIn: isLoggedIn,
            currentUser: currentUser,
            updateProfile: updateProfile,
            updatePassword: updatePassword,
            username: username
        };
    });
