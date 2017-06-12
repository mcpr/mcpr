'use strict';

angular.module('app')
    .controller('HomeCtrl', function ($scope, $http) {
        $http.get('/api/plugins').then(function (res) {
            $scope.plugins = res.data;
        });
    });