'use strict';

angular.module('app')
    .controller('BukkitPluginCtrl', function ($scope, $http, $stateParams, $timeout) {
        var id = $stateParams.id;
        $http.get('/api/plugins/@bukkitdev/' + id).then(function (res) {
            $scope.plugin = res.data;
            $scope.loaded = true;
            $timeout(function () {
                addImgClass();
            });
        }).catch(function (err) {
            console.log(err);
            if (err.status === 404) {
                $scope.notfound = true;
            } else {
                $scope.error = err;
            }
        });
    });