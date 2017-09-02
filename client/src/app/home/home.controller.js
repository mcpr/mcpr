'use strict';

angular.module('app')
    .controller('HomeCtrl', function ($scope, $http, config) {
        $scope.loaded = false;
        $scope.externalShown = false;
        $scope.limit = 18;
        $scope.loadMore = function () {
            $scope.limit += 9;
            checkLoadMore()
        }
        $scope.showExternal = function () {
            $scope.loaded = false;
            $http.get(config.apiUrl + '/plugins?includeBukkitDev=true')
                .then(function (res) {
                    $scope.plugins = res.data;
                    $scope.loaded = true;
                    $scope.externalShown = true;
                    if (res.data === {}) {
                        $scope.noPlugins;
                    }
                    checkLoadMore()
                }).catch(function (err) {
                    console.log(err);
                });
        }
        $scope.hideExternal = function () {
            $http.get(config.apiUrl + '/plugins')
                .then(function (res) {
                    $scope.plugins = res.data;
                    $scope.loaded = true;
                    $scope.externalShown = false;
                    if (res.data === {}) {
                        $scope.noPlugins;
                    }
                    checkLoadMore()
                }).catch(function (err) {
                    console.log(err);
                });
        }
        $http.get(config.apiUrl + '/plugins')
            .then(function (res) {
                $scope.plugins = res.data;
                $scope.loaded = true;
                if (res.data === {}) {
                    $scope.noPlugins;
                }
                checkLoadMore()
            }).catch(function (err) {
                console.log(err);
            });

        function checkLoadMore() {
            if ($scope.plugins.length <= $scope.limit) {
                $scope.showLoadMore = false;
            } else {
                $scope.showLoadMore = true;
            }
        }

        $scope.searchFunc = function (search) {
            return $http.get(config.apiUrl + '/plugins/search?q=' + search)
                .then(function (res) {
                    return res.data;
                }).catch(function (err) {
                    console.log(err);
                });
        }
        $scope.searchComplete = function (search) {
            console.log(search)
        }
    });
