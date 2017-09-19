'use strict';

angular.module('app')
    .controller('ReleaseCtrl', function ($scope, $http, $stateParams, auth, $state, $q, config) {
        // get the current users details
        auth.currentUser()
            .then(function (res) {
                $scope.profile = res.data;
            })
            .catch(function (err) {
                handleErrors(err);
            });

        $scope.release = {
            plugin: $stateParams.id
        }

        // setup the markdown editor
        var simplemde = new SimpleMDE({
            element: document.getElementById('notes')
        });

        // create a plugin, create a version, and upload it.
        $scope.create = function (release) {
            $scope.release.notes = simplemde.value();

            createVersion(release)
                .then(function (vRes) {
                    var version = vRes.data;
                    console.log(version);

                    // upload the version
                    uploadVersion(version)
                        .then(function (res) {
                            console.log(res);
                            $state.go('plugin', {
                                id: version.plugin
                            });
                        })
                        .catch(function (err) {
                            handleErrors(err);
                        })
                })
                .catch(function (err) {
                    handleErrors(err);
                    Materialize.toast('Redirecting to plugin.', 4000);
                    setTimeout(function () {
                        $state.go('plugin', {
                            id: plugin._id
                        });
                    }, 5000);
                })
        };

        function handleErrors(err) {
            console.log(err);
            if (err.status === 401) {
                return Materialize.toast(err.data.message, 4000);
            } else if (err.data.message) {
                return Materialize.toast(err.data.message, 4000);
            } else if (err.data.errors) {
                var errors = err.data.errors

                Object.keys(errors).forEach(function (key) {
                    console.log(errors[key].message);
                    Materialize.toast(errors[key].message, 4000);

                });
            } else {
                Materialize.toast(err.statusText, 4000);
            }
        }

        function createVersion(plugin) {
            var deferred = $q.defer()
            $scope.release.release_notes = simplemde.value();
            console.log($scope.release)

            $http.post(config.apiUrl + '/versions', $scope.release)
                .then(function (res) {
                    deferred.resolve(res);
                })
                .catch(function (err) {
                    deferred.reject(err);
                })
            return deferred.promise;
        }

        function uploadVersion(version) {
            var deferred = $q.defer()
            var uploadUrl = config.apiUrl + '/versions/' + version.plugin + '/' + version.version + '/upload';
            var fd = new FormData();
            fd.append('jar', $scope.jar);
            $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .then(function (res) {
                    deferred.resolve(res);
                })
                .catch(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }
    });
