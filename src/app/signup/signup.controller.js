'use strict';

angular.module('app')
    .controller('SignupCtrl', function ($scope, $http) {
        $scope.user = {
            name: 'Noah Prail',
            username: 'nprail',
            email: 'noah@prail.net',
            password: 'fakepwd'
        };
        $scope.signup = function (user) {
            console.log(user);
        };
    });