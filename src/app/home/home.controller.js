'use strict';

angular.module('app')
    .controller('HomeCtrl', function ($scope, $http, config) {
        $scope.loaded = false;
        $http.get(config.apiUrl + '/plugins')
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
            return $http.post(config.apiUrl + '/plugins/search', {
                    query: search
                })
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
