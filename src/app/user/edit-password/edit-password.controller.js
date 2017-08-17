'use strict';

angular.module('app')
    .controller('EditPasswordCtrl', function ($scope, $http, $stateParams, auth, $state) {
        auth.currentUser()
            .then(function (res) {
                $scope.profile = res.data;
            })
            .catch(function (err) {
                console.log(err);
                $scope.error = err;
            });

        $scope.save = function (user) {
            $scope.errors = [];
            if (user != undefined) {
                if (user.currentPassword === undefined || null || '') {
                    $scope.currentError = 'Please specify your current password.';
                    $scope.currentValid = 'invalid';
                } else {
                    $scope.currentValid = 'valid';
                }

                if (user.newPassword != user.verifyNewPassword) {
                    $scope.verifyError = 'Passwords do not match!';
                    $scope.verifyValid = 'invalid';
                } else {
                    $scope.verifyValid = 'valid';
                }

                if (user.currentPassword && user.newPassword === user.verifyNewPassword) {
                    var passwords = {
                        userID: $scope.profile._id,
                        current: user.currentPassword,
                        new: user.newPassword
                    }
                    auth.updatePassword(passwords)
                        .then(function (res) {
                            Materialize.toast(res.data.message, 4000);
                            $state.go('profile');
                        })
                        .catch(function (err) {
                            console.log(err);
                            Materialize.toast(err.data.message, 4000);
                        });
                }
            } else {
                var errorMessage = 'Please fill out the form...';
                $scope.verifyValid = 'invalid';
                $scope.currentValid = 'invalid';
                $scope.currentError = errorMessage;
                $scope.verifyError = errorMessage;
            }
        };
    });
