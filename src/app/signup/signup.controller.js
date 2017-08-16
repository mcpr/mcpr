'use strict';

angular.module('app')
    .controller('SignupCtrl', function ($scope, $http, auth) {
        $scope.user = {
            name: 'Noah Prail',
            username: 'nprail',
            email: 'noah@prail.net',
            password: 'fakepwd'
        };
        $scope.signup = auth.signup;
    });