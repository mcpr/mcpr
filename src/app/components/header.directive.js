'use strict';

angular.module('app')
    .directive('header', function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                user: '='
            }, 
            templateUrl: 'layout/header.html',
            controller: ['$scope', '$filter', 'auth', function ($scope, $filter, auth) {
                auth.currentUser().then(function (res) {
                    console.log(res.data);
                    $scope.profile = res.data;
                }).catch(function (err) {
                    console.log(err);
                    $scope.error = err;
                });

                $scope.logout = auth.logout;
            }]
        };
    });