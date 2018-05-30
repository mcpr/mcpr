'use strict';

angular.module('app')
    .directive('footer', function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                user: '='
            },
            templateUrl: '/components/footer/footer.html',
            controller: ['$scope', function ($scope) {
                [].forEach.call(document.querySelectorAll('img[data-src]'), function (img) {
                    img.setAttribute('src', img.getAttribute('data-src'));
                    img.onload = function () {
                        img.removeAttribute('data-src');
                    };
                });
            }]
        };
    });
