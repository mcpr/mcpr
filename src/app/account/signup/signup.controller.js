'use strict';

angular.module('app')
    .controller('SignupCtrl', function ($scope, $http, auth, $state, $window) {
        $scope.user = {
            name: 'Noah Prail',
            username: 'nprail',
            email: 'noah@prail.net',
            password: 'fakepwd'
        };
        $scope.signup = function (user) {
            auth.signup(user)
                .then(function (res) {
                    auth.login(user)
                        .then(function (res) {
                            Materialize.toast('Login success!', 4000);
                            $state.go('profile').then(function (result) {
                                $window.location.reload();
                            });
                        })
                        .catch(function (err) {
                            if (err.status === 401) {
                                return Materialize.toast(err.data.message, 4000);
                            }
                            Materialize.toast(err.statusText, 4000);
                        });
                })
                .catch(function (err) {
                    if (err.status === 409) {
                        return Materialize.toast(err.data.message, 4000);
                    }
                    return Materialize.toast(err.statusText, 4000);
                });
        }
    });
