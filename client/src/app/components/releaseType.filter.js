'use strict';

angular.module('app')
    .filter('releaseType', function () {
        return function (input) {
            input = input || '';
            var out;
            if (input === 'R') {
                out = 'Release';
            } else if (input === 'A') {
                out = 'Alpha';
            } else if (input === 'B') {
                out = 'Beta';
            } else if (input === 'RC') {
                out = 'Release Candidate';
            } else {
                out = 'Invalid Release Type';
            }
            return out;
        };
    }).filter('reverse', function () {
        return function (items) {
            return items.slice().reverse();
        };
    });
