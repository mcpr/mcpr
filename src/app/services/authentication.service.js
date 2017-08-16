'use strict';

angular.module('app')
    .service('auth', function ($http, $window, jwtHelper, $state, $q) {
        var saveToken = function (token) {
            $window.localStorage['id_token'] = token;
            console.log('Token saved!', token);
        };

        var getToken = function () {
            return $window.localStorage['id_token'];
        };

        var isLoggedIn = function () {
            var expired = jwtHelper.isTokenExpired(getToken());
            if (expired) {
                return false;
            } else {
                return true;
            }
        };

        var logout = function () {
            $window.localStorage.removeItem('id_token');
        };

        var currentUser = function () {
            var deferred = $q.defer();
            console.log(isLoggedIn);
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
                    console.log(tokenPayload);
                    console.log(date);
                    $state.go('profile');
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