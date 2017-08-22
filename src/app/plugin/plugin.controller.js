'use strict';

angular.module('app')
    .controller('PluginCtrl', function ($scope, $http, $transition$, $timeout, setTitle, config) {
        var id = $transition$.params().id;
        $scope.modalVersion = {};
        $scope.setModalVersion = function (version) {
            getSingleVersion(version)
        }
        setTitle(id);

        $http.get(config.apiUrl + '/plugins/' + id).then(function (res) {
            $scope.plugin = res.data;
            $scope.loaded = true;
            $timeout(function () {
                addImgClass();
            });
            getVersions();
        }).catch(function (err) {
            console.log(err);
            if (err.status === 404) {
                $scope.notfound = true;
            } else {
                $scope.error = err;
            }
        });

        function getVersions() {
            $http.get(config.apiUrl + '/versions/' + id).then(function (res) {
                $scope.versions = res.data;
                $scope.versionsLoaded = true;
            }).catch(function (err) {
                console.log(err);
                $scope.error = err;
            });
        }

        function getSingleVersion(version) {
            $http.get(config.apiUrl + '/versions/' + id + '/' + version).then(function (res) {
                $scope.modalVersion = res.data;
            }).catch(function (err) {
                console.log(err);
                $scope.error = err;
            });
        }
    });
