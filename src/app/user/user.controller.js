'use strict';

angular.module('app')
    .controller('UserCtrl', function ($scope, $http, $transitions, $transition$, $rootScope, setTitle, config) {
        $scope.username = $transition$.params().username;
        setTitle('@' + $scope.username);

        $http.get(config.apiUrl + '/users/' + $scope.username)
            .then(function (res) {
                $scope.profile = res.data;
                if ($rootScope.username === $scope.username) {
                    $scope.currentUser = true;
                }
            }).catch(function (err) {
                console.log(err);
                $scope.error = err;
            });
        $http.get(config.apiUrl + '/users/' + $scope.username + '/plugins')
            .then(function (res) {
                $scope.plugins = res.data;
            }).catch(function (err) {
                console.log(err);
                $scope.error = err;
            });
    });
