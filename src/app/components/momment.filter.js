'use strict';

angular.module('app')
    .filter('moment', function () {
        return function (input) {
            input = input || '';
            var out = moment(input).format('MMM Do YY');
            return out;
        };
    })