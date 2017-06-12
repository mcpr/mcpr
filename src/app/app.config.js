'use strict';

angular
    .module('app')
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

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
            .state('how', {
                url: '/how/:id',
                templateUrl: 'how/how.html',
                controller: 'HowCtrl'
            });

        $urlRouterProvider.otherwise('/');
    });