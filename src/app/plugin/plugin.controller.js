'use strict';

angular.module('app')
    .controller('PluginCtrl', function ($scope, $http, $stateParams) {
        var id = $stateParams.id
        $http.get('/api/plugins/' + id).then(function (res) {
            $scope.plugin = res.data;
        }).catch(function (err) {
            console.log(err);
            if (err.status === 404) {
                $scope.notfound = true;
            } else {
                $scope.error = err;
            }
        });
    });