'use strict'

angular
  .module('app')
  .run(function (
    authManager,
    $rootScope,
    $transitions,
    auth,
    $window,
    $location
  ) {
    console.log(
      'Welcome to the JavaScript console of MCPR! \nAre you having issues? Please report them here: \nhttps://github.com/mcpr/mcpr/issues'
    )
    authManager.checkAuthOnRefresh()
    authManager.redirectWhenUnauthenticated()
    $rootScope.$on('tokenHasExpired', function () {
      Materialize.toast('Your session has expired!')
      $window.localStorage.removeItem('id_token')
    })

    auth.username().then(function (username) {
      $rootScope.username = username
      console.log('Logged in as', $rootScope.username)
    })

    // collapse sidenav when transitioning
    $transitions.onStart(
      {
        to: '*'
      },
      function (trans) {
        $('.button-collapse').sideNav('hide')
      }
    )

    $transitions.onSuccess(
      {
        to: '*'
      },
      function (trans) {
        var setTitle = trans.injector().get('setTitle')
        var data = trans.router.stateService.current.data
        $window.gtag('send', 'pageview', $location.path())
        if (data && data.name) {
          setTitle(data.name)
        }
      }
    )
    // make sure the user is authenticated
    $transitions.onStart(
      {
        to: '*'
      },
      function (trans) {
        var auth = trans.injector().get('auth')
        var data = trans.targetState()._identifier.data
        var stateService = trans.router.stateService

        if (data && data.requiresLogin) {
          console.log('Requires login')
          if (!auth.isLoggedIn()) {
            // User isn't authenticated. Redirect to login
            Materialize.toast('You must be logged in to view this page.', 4000)
            return stateService.target('login')
          }
        }
      }
    )
  })
