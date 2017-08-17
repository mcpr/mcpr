'use strict';

angular.module('app')
    .controller('LoginCtrl', function ($scope, $http, $stateParams, auth) {
        $scope.user = {
            name: 'Noah Prail',
            username: 'nprail',
            email: 'noah@prail.net',
            password: 'fakepwd'
        };
        $scope.login = auth.login;
    });