'use strict';

angular.module('app')
    .controller('PluginCtrl', function ($scope, $http, $transition$, $timeout, setTitle, config, $rootScope, auth, $state) {
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
            authData();
        }).catch(function (err) {
            console.log(err);
            if (err.status === 404) {
                $scope.notfound = true;
            } else {
                $scope.error = err;
            }
        });

        $scope.delete = function (confirmation) {
            console.log('Deleting ' + confirmation);
            if (confirmation === $scope.plugin._id) {
                $http.delete(config.apiUrl + '/plugins/' + id)
                    .then(function (res) {
                        $('#deleteModal').modal('close');
                        Materialize.toast('Plugin deleted!', 4000);
                        $state.go('home');
                    })
                    .catch(function (err) {
                        console.log(err);
                        if (err.status === 404) {
                            $scope.notfound = true;
                        } else {
                            $scope.error = err;
                        }
                    })
            } else {
                $scope.deleteError = 'The plugin ID does not match';
            }
        }

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

        function authData() {
            if ($rootScope.isAuthenticated) {
                auth.currentUser().then(function (res) {
                    $scope.profile = res.data;
                    $scope.isAuthor = function () {
                        return $scope.plugin.author === $scope.profile.username;
                    }
                }).catch(function (err) {
                    console.log(err);
                    $scope.error = err;
                });
            }
        }
    });
