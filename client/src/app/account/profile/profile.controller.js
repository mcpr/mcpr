'use strict';

angular.module('app')
    .controller('ProfileCtrl', function ($scope, $http, $stateParams, auth, config) {
        auth.currentUser().then(function (res) {
            $scope.profile = res.data;
            $http.get(config.apiUrl + '/users/' + $scope.profile.username + '/plugins')
                .then(function (res) {
                    $scope.plugins = res.data;
                }).catch(function (err) {
                    console.log(err);
                    $scope.error = err;
                });
        }).catch(function (err) {
            console.log(err);
            $scope.error = err;
        });
    });
