'use strict';

angular.module('app')
    .controller('UserCtrl', function ($scope, $http, $transitions, $transition$, $rootScope) {
        $scope.username = $transition$.params().username;
        $http.get('/api/users/' + $scope.username)
            .then(function (res) {
                $scope.profile = res.data;
                if ($rootScope.username === $scope.username) {
                    $scope.currentUser = true;
                }
            }).catch(function (err) {
                console.log(err);
                $scope.error = err;
            });
        $http.get('/api/users/' + $scope.username + '/plugins')
            .then(function (res) {
                $scope.plugins = res.data;
            }).catch(function (err) {
                console.log(err);
                $scope.error = err;
            });
    });
