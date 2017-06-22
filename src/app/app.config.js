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
            .state('how', {
                url: '/how',
                templateUrl: 'how/how.html',
                controller: 'HowCtrl'
            })
            .state('notfound', {
                url: '/notfound',
                templateUrl: 'notfound/notfound.html',
                controller: 'NotFoundCtrl'
            })
            .state('why', {
                url: '/why',
                templateUrl: 'why/why.html',
                controller: 'WhyCtrl'
            });

        $urlRouterProvider.otherwise('/notfound');
    });