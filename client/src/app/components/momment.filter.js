'use strict';

angular.module('app')
    .filter('moment', function () {
        return function (input) {
            input = input || '';
            var out = moment(input).format('MMM Do YYYY');
            return out;
        };
    })
    .filter('momentUnix', function () {
        return function (input) {
            input = input || '';
            var out = moment.unix(input).format('MMM Do YYYY');
            return out;
        };
    });