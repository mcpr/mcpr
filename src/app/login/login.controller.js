'use strict';

angular.module('app')
    .controller('LoginCtrl', function ($scope, $http, $stateParams) {
        $scope.login = function(){
            console.log($scope.user);
        };
    });