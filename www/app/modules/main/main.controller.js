/*main.controller.js*/

(function() {
  'use strict';

  angular.module('Circles')
    .controller('Main', ['$scope', '$rootScope', '$timeout', '$log', function($scope, $rootScope, $timeout, $log) {

      $scope.hello = 'world';

    }]);

}());

