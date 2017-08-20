'use strict';

angular.module('app')
    .controller('PluginCtrl', function ($scope, $http, $transition$, $timeout, setTitle,config) {
        var id = $transition$.params().id;
        setTitle(id);

        $http.get(config.apiUrl + '/plugins/' + id).then(function (res) {
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
