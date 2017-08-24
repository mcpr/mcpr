'use strict';

angular
    .module('app')
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, jwtOptionsProvider, $uiViewScrollProvider, $showdownProvider) {
        jwtOptionsProvider.config({
            tokenGetter: ['auth', '$window', function (auth, $window) {
                return $window.localStorage['id_token'];
            }],
            unauthenticatedRedirector: ['$state', function ($state) {
                $state.go('login');
            }],
            whiteListedDomains: ['mcpr.io']
        });
        $httpProvider.interceptors.push('jwtInterceptor');
        $locationProvider.html5Mode(true);
        $uiViewScrollProvider.useAnchorScroll();
        $showdownProvider.setOption('headerLevelStart', 3)

        $urlRouterProvider.otherwise(function ($injector, $location) {
            var $state = $injector.get('$state');
            $state.go('home');
        });

        $stateProvider
            /**
             * Home States
             */
            .state('home', {
                url: '/',
                templateUrl: 'home/home.html',
                controller: 'HomeCtrl',
                data: {
                    name: 'Home'
                }
            })
            .state('how-single', {
                url: '/how/:id',
                templateUrl: 'how/how.html',
                controller: 'HowCtrl',
                data: {
                    name: 'How'
                }
            })
            .state('why', {
                url: '/why',
                templateUrl: 'why/why.html',
                controller: 'WhyCtrl',
                data: {
                    name: 'Why'
                }
            })
            .state('how', {
                url: '/how',
                templateUrl: 'how/how.html',
                controller: 'HowCtrl',
                data: {
                    name: 'How'
                }
            })
            /**
             * Plugin States
             */
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
            /**
             * User States
             */
            .state('user', {
                url: '/~:username',
                templateUrl: 'user/user.html',
                controller: 'UserCtrl'
            })
            /**
             * Account States
             */
            .state('profile', {
                url: '/me',
                templateUrl: 'account/profile/profile.html',
                controller: 'ProfileCtrl',
                data: {
                    requiresLogin: true,
                    name: 'Profile'
                }
            })
            .state('create', {
                url: '/create',
                templateUrl: 'account/create/create.html',
                controller: 'CreateCtrl',
                data: {
                    requiresLogin: true,
                    name: 'Create Plugin'
                }
            })
            .state('edit-profile', {
                url: '/me/edit',
                templateUrl: 'account/edit-profile/edit-profile.html',
                controller: 'EditProfileCtrl',
                data: {
                    requiresLogin: true,
                    name: 'Edit Profile'
                }
            })
            .state('edit-password', {
                url: '/me/password',
                templateUrl: 'account/edit-password/edit-password.html',
                controller: 'EditPasswordCtrl',
                data: {
                    requiresLogin: true,
                    name: 'Edit Password'
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'account/login/login.html',
                controller: 'LoginCtrl',
                data: {
                    name: 'Login'
                }
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'account/signup/signup.html',
                controller: 'SignupCtrl',
                data: {
                    name: 'Signup'
                }
            })
            .state('notfound', {
                url: '/notfound',
                templateUrl: 'notfound/notfound.html',
                controller: 'NotFoundCtrl',
                data: {
                    name: 'Not Found!'
                }
            });

        $urlRouterProvider.otherwise('/notfound');
    })
    .constant('config', {
        apiUrl: '/api/v1'
    });