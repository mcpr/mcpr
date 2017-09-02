'use strict';

angular.module('app')
    .controller('HomeCtrl', function ($scope, $http, config) {
        $scope.loaded = false;
        $scope.limit = 18;
        $scope.loadMore = function () {
            $scope.limit += 9;
        }
        $http.get(config.apiUrl + '/plugins?includeBukkitDev=true')
            .then(function (res) {
                $scope.plugins = res.data;
                $scope.loaded = true;
                if (res.data === {}) {
                    $scope.noPlugins;
                }
            }).catch(function (err) {
                console.log(err);
            });

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
