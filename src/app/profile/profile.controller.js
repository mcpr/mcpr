'use strict';

angular.module('app')
    .controller('ProfileCtrl', function ($scope, $http, $stateParams, auth) {
        auth.currentUser().then(function (res) {
            console.log(res);
            $scope.profile = res.data;
        }).catch(function (err) {
            console.log(err);
            $scope.error = err;
        });
    });