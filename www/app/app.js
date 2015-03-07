(function() {
  'use strict';
  angular.module('Steward', [
      'ui.router',
      'ngAnimate',
      'ngMessages',
      'ui.bootstrap',
      'ui.select',
      'ngSanitize',
      'ngCookies'
    ])
    .config(['$urlRouterProvider', '$stateProvider', '$logProvider',
      function($urlRouterProvider, $stateProvider, $logProvider) {
        // gulp dist makes this 'false'
        $logProvider.debugEnabled(true);
        // routes
        $stateProvider.state('main', {
            url: '',
            templateUrl: './modules/main/main.html',
            controller: 'Main',
          })
          .state('main.events', {
            url: '/events',
            templateUrl: './modules/main/events/events.html',
            controller: 'Events',
            initial: '.current'
          })
          .state('main.events.current', {
            url: '/current',
            templateUrl: './modules/main/events/current/current.html',
          })
          .state('login', {
            url: '/login',
            templateUrl: './modules/login/login.html',
            controller: 'Login'
          });
        // redirection at startup
        $urlRouterProvider.otherwise('/login');
      }
    ]);

  angular.module('Steward')
    .controller('Steward', [
      '$rootScope',
      '$state',
      '$stateParams',
      '$timeout',
      'Session',
      '$log',
      function($rootScope, $state, $stateParams, $timeout, Session, $log) {

        $rootScope.appTitle = 'Circles Steward';
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.session = Session;

        Session.dev = true;
      }
    ]);
}());

