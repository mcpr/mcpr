'use strict';

angular.module('app')
    .filter('urlfilter', function () {
        return function (input) {
            input = input || '';
            var filtered = input.replace(new RegExp('^https?://'), '');
            return filtered;
        };
    });
