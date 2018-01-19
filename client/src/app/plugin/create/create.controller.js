'use strict';

angular.module('app')
    .controller('CreateCtrl', function ($scope, $http, $stateParams, auth, $state, $q, config) {
        // get the current users details
        auth.currentUser()
            .then(function (res) {
                $scope.profile = res.data;
            })
            .catch(function (err) {
                handleErrors(err);
            });

        // get licenses from GitHub API
        $http.get('https://api.github.com/licenses', {
                headers: {
                    'Accept': 'application/vnd.github.drax-preview+json'
                }
            })
            .then(function (res) {
                $scope.licenses = res.data;
            })
            .catch(function (err) {
                handleErrors(err);
            });

        $scope.plugin = {}
        $scope.version = {}

        // setup the markdown editor
        var simplemde = new SimpleMDE({
            element: document.getElementById('readme')
        });

        // create a plugin, create a version, and upload it.
        $scope.create = function () {
            $scope.plugin.readme = simplemde.value();
            $scope.plugin.author = $scope.profile.username;
            $scope.plugin.keywords = $scope.keywords.split(',');
            console.log($scope.plugin)
            // create the plugin
            createPlugin()
                .then(function (pRes) {
                    var plugin = pRes.data;
                    console.log(plugin);

                    // create the version
                    createVersion(plugin)
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
                })
                .catch(function (err) {
                    handleErrors(err);
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

        function createPlugin() {
            var deferred = $q.defer()
            $http.post(config.apiUrl + '/plugins', $scope.plugin)
                .then(function (res) {
                    deferred.resolve(res);
                })
                .catch(function (err) {
                    deferred.reject(err);
                })
            return deferred.promise;
        }

        function createVersion(plugin) {
            var deferred = $q.defer()
            $scope.version.plugin = plugin._id;
            $scope.version.release_notes = simplemde.value();

            $http.post(config.apiUrl + '/versions', $scope.version)
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
        $scope.loadTestData = function () {
            $scope.plugin = {
                "title": "Test",
                "short_description": "Just a test",
                "source": "https://github.com/mcpr",
                "readme": "# Test\nThis is just a test. ",
                "license": "MIT",
                "keywords": "test,awesomeness"
            }
            $scope.keywords = "test,awesomeness";
            $scope.version = {
                "version": "2.4.6",
                "release_notes": "# Test\nThis is just a test. ",
                "game_versions": [
                    "1.8",
                    "1.9",
                    "1.10",
                    "1.11",
                    "1.12"
                ]
            }
        }
    });
