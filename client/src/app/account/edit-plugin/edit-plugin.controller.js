'use strict';

angular.module('app')
    .controller('EditPluginCtrl', function ($scope, $http, $stateParams, auth, $state, $q, config, $transition$, setTitle) {
        var id = $transition$.params().id;
        setTitle('Edit ' + id);
        // get the current users details
        auth.currentUser()
            .then(function (res) {
                $scope.profile = res.data;
            })
            .catch(function (err) {
                handleErrors(err);
            });

        // get the current plugin data
        $http.get(config.apiUrl + '/plugins/' + id).then(function (res) {
            $scope.plugin = res.data;
            simplemde.value($scope.plugin.readme);
            $scope.loaded = true;
        }).catch(function (err) {
            console.log(err);
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

        // setup the markdown editor
        var simplemde = new SimpleMDE({
            element: document.getElementById('readme')
        });

        // update plugin
        $scope.update = function (plugin) {
            $scope.plugin.readme = simplemde.value();

            if ($scope.plugin.keywords.constructor !== Array) {
                $scope.plugin.keywords = $scope.plugin.keywords.split(',');
            }

            // update the plugin
            updatePlugin()
                .then(function (res) {
                    var plugin = res.data;
                    $state.go('plugin', {
                        id: plugin._id
                    });
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

        function updatePlugin() {
            var deferred = $q.defer()
            $http.put(config.apiUrl + '/plugins/' + id, $scope.plugin)
                .then(function (res) {
                    deferred.resolve(res);
                })
                .catch(function (err) {
                    deferred.reject(err);
                })
            return deferred.promise;
        }
    });
