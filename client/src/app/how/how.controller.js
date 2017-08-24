'use strict';

angular.module('app')
    .controller('HowCtrl', function ($scope, $http, $stateParams) {
        $scope.id = $stateParams.id;
    });