'use strict';

angular.module('app')
    .service('setTitle', function () {
        var setTitle = function (title) {
            window.document.title = title + ' - MCPR Beta'
        }
        return setTitle;
    });
