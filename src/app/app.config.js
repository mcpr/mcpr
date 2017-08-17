'use strict';

angular
    .module('app')
    .run(function (authManager, $rootScope, $transitions) {
        authManager.checkAuthOnRefresh();
        authManager.redirectWhenUnauthenticated();
        $rootScope.$on('tokenHasExpired', function () {
            console.log('Your session has expired!');
            Materialize.toast('Your session has expired!', 4000);
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
    })
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, jwtOptionsProvider, $uiViewScrollProvider) {
        jwtOptionsProvider.config({
            tokenGetter: ['auth', '$window', function (auth, $window) {
                return $window.localStorage['id_token'];
            }],
            unauthenticatedRedirector: ['$state', function ($state) {
                $state.go('login');
            }]
        });
        $httpProvider.interceptors.push('jwtInterceptor');
        $locationProvider.html5Mode(true);
        $uiViewScrollProvider.useAnchorScroll();

        $urlRouterProvider.otherwise(function ($injector, $location) {
            var $state = $injector.get('$state');
            $state.go('home');
        });

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/home.html',
                controller: 'HomeCtrl'
            })
            .state('plugin', {
                url: '/plugin/:id',
                templateUrl: 'plugin/plugin.html',
                controller: 'PluginCtrl'
            })
            .state('bukkit-plugin', {
                url: '/plugin/@bukkitdev/:id',
                templateUrl: 'plugin/plugin.html',
                controller: 'BukkitPluginCtrl'
            })
            .state('how-single', {
                url: '/how/:id',
                templateUrl: 'how/how.html',
                controller: 'HowCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'login/login.html',
                controller: 'LoginCtrl'
            })
            .state('profile', {
                url: '/user/profile',
                templateUrl: 'profile/profile.html',
                controller: 'ProfileCtrl',
                data: {
                    requiresLogin: true
                }
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'signup/signup.html',
                controller: 'SignupCtrl'
            })
            .state('why', {
                url: '/why',
                templateUrl: 'why/why.html',
                controller: 'WhyCtrl'
            })
            .state('how', {
                url: '/how',
                templateUrl: 'how/how.html',
                controller: 'HowCtrl'
            })
            .state('notfound', {
                url: '/notfound',
                templateUrl: 'notfound/notfound.html',
                controller: 'NotFoundCtrl'
            });

        $urlRouterProvider.otherwise('/notfound');
    });
