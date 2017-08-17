'use strict';

angular.module('app')
    .service('auth', function ($http, $window, jwtHelper, $state, $q) {
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
                $http.get('/api/users/profile').then(function (res) {
                    return deferred.resolve(res);
                }).catch(function (err) {
                    deferred.reject(err);
                });
            }
            return deferred.promise;
        };

        var login = function (user) {
            console.log('Logging in!');
            $http.post('/api/users/login', user, {
                    skipAuthorization: true,
                })
                .then(function (res) {
                    var expToken = res.data.token;
                    saveToken(expToken);

                    var tokenPayload = jwtHelper.decodeToken(expToken);
                    var date = jwtHelper.getTokenExpirationDate(expToken);

                    $state.go('profile').then(function (result) {
                        $window.location.reload();
                    });
                }).catch(function (err) {
                    if (err.status === 401) {
                        return Materialize.toast(err.data.message, 4000);
                    }
                    Materialize.toast(err.statusText, 4000);
                });
        };

        var signup = function (user) {
            console.log('Signing up!');
            $http.post('/api/users/signup', user, {
                    skipAuthorization: true,
                })
                .then(function (res) {
                    login(user);
                }).catch(function (err) {
                    if (err.status === 409) {
                        return Materialize.toast(err.data.message, 4000);
                    }
                    Materialize.toast(err.statusText, 4000);
                });
        };
        return {
            signup: signup,
            login: login,
            saveToken: saveToken,
            getToken: getToken,
            logout: logout,
            isLoggedIn: isLoggedIn,
            currentUser: currentUser
        };
    });
