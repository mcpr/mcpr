'use strict';

angular.module('app')
    .service('authentication', authentication);

authentication.$inject = ['$http', '$window'];

function authentication($http, $window) {

    var saveToken = function (token) {
        $window.localStorage['mcpr-token'] = token;
    };

    var getToken = function () {
        return $window.localStorage['mcpr-token'];
    };

    var isLoggedIn = function () {
        var token = getToken();
        var payload;

        if (token) {
            payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };

    var logout = function () {
        $window.localStorage.removeItem('mcpr-token');
    };

    var currentUser = function () {
        if (isLoggedIn()) {
            var token = getToken();
            var payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);
            return {
                email: payload.email,
                name: payload.name
            };
        }
    };

    return {
        saveToken: saveToken,
        getToken: getToken,
        logout: logout,
        isLoggedIn: isLoggedIn,
        currentUser: currentUser
    };
}