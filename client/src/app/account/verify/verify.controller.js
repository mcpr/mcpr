'use strict';

angular.module('app')
    .controller('VerifyCtrl', function ($scope, $transition$, $state, $http, config) {
        var id = $transition$.params().id;
        var verificationCode = $transition$.params().verificationCode
        var verifyApi = config.apiUrl + '/users/me/verify/' + id + '/' + verificationCode;
        
        $http.get(verifyApi)
            .then(function (res) {
                Materialize.toast('Email verified!', 5000);
                $state.go('login');
            })
            .catch(function (err) {
                $scope.error = err.data.message;
                console.log(err.status);
            });
    });
