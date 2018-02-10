'use strict';

angular.module('app')
    .controller('BukkitPluginCtrl', function ($scope, $http, $transition$, $timeout, setTitle, $rootScope, config) {
        var id = $transition$.params().id;
        setTitle('@bukkitdev/' + id);
        
        $scope.downloadUrl = config.apiUrl + '/plugins/@bukkitdev/' + id + '/download';

        $http.get(config.apiUrl + '/plugins/@bukkitdev/' + id).then(function (res) {
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
