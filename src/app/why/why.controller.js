'use strict';

angular.module('app')
    .controller('WhyCtrl', function ($scope, $http) {
        $http.get('https://raw.githubusercontent.com/mcpr/mcpr/master/docs/about/why.md')
            .then(function (res) {
                $scope.markdown = res.data;
            })
            .catch(function (err) {
                console.log(err);
                $scope.error = '## An error occurred while loading this page... Please checkout it out [here](https://github.com/mcpr/mcpr/blob/master/docs/about/why.md).'
            });
    });
