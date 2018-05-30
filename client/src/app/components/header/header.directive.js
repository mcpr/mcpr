'use strict'

angular.module('app').directive('header', function () {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      user: '='
    },
    templateUrl: '/components/header/header.html',
    controller: [
      '$scope',
      'auth',
      '$state',
      function ($scope, auth, $state) {
        var navExtendedClass = 'nav-extended'
        $scope.navExtended = false
        $scope.uiState = $state

        auth
          .currentUser()
          .then(function (res) {
            $scope.profile = res.data
          })
          .catch(function (err) {
            console.log(err)
            $scope.error = err
          })

        $scope.logout = auth.logout
      }
    ]
  }
})
