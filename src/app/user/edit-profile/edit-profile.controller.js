'use strict';

angular.module('app')
    .controller('EditProfileCtrl', function ($scope, $http, $stateParams, auth, $state) {
        auth.currentUser()
            .then(function (res) {
                $scope.profile = res.data;
            })
            .catch(function (err) {
                console.log(err);
                $scope.error = err;
            });

        $scope.save = function (user) {
            auth.updateProfile(user)
                .then(function (res) {
                    Materialize.toast(res.data.message, 4000);
                    $state.go('profile');
                })
                .catch(function (err) {
                    Materialize.toast(err.statusText, 4000);
                });
        };
    });
