'use strict';

angular
    .module('app')
    .run(function (authManager, $rootScope, $transitions, auth) {
        console.log('Welcome to the JavaScript console of MCPR! \nAre you having issues? Please report them here: \nhttps://github.com/HexagonMinecraft/mc-registry/issues');
        authManager.checkAuthOnRefresh();
        authManager.redirectWhenUnauthenticated();
        $rootScope.$on('tokenHasExpired', function () {
            console.log('Your session has expired!');
            Materialize.toast('Your session has expired!', 4000);
        });

        auth.username().then(function (username) {
            $rootScope.username = username;
            console.log('Logged in as', $rootScope.username);
        });

        // collapse sidenav when transitioning
        $transitions.onStart({
            to: '*'
        }, function (trans) {
            $('.button-collapse').sideNav('hide');
        });

        // make sure the user is authenticated
        $transitions.onStart({
            to: '*'
        }, function (trans) {
            var auth = trans.injector().get('auth');
            var data = trans.targetState()._identifier.data;

            if (data) {
                if (data.requiresLogin) {
                    console.log('Requires login');
                    if (!auth.isLoggedIn()) {
                        // User isn't authenticated. Redirect to login
                        Materialize.toast('You must be logged in to view this page.', 4000);
                        return trans.router.stateService.target('login');
                    }
                }
            }
        });
    });
