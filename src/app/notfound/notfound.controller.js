'use strict';

angular.module('app')
    .controller('NotFoundCtrl', function ($scope, $stateParams) {
        $scope.url = $stateParams.url;
    });