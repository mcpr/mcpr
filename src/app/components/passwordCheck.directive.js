'use strict';

angular.module('app')
    .directive('pwCheck', [function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var firstPassword = '#' + attrs.pwCheck;
                elem.add(firstPassword).on('keyup', function () {
                    scope.$apply(function () {
                        var v = elem.val() === $(firstPassword).val();
                        console.log(v)
                        console.log(elem.val())
                        console.log($(firstPassword).val())
                        ctrl.$setValidity('pwmatch', v);
                    });
                });
            }
        }
    }]);
