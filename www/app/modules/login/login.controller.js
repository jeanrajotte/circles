/*Login.controller.js*/

(function() {

  'use strict';

  angular.module('Steward')
    .controller('Login', ['$scope', 'Session', function($scope, Session) {

      Session.clear();

      $scope.state = {
        error: false,
        welcome: true
      };
      $scope.login = function() {
        if (!Session.authenticate($scope.username)) {
          $scope.state.error = true;
          $scope.state.welcome = false;
        } else {
          $scope.$state.go('main');
        }
      };

    }]);
}());

