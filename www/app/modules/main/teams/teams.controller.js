/*users.controller.js*/

(function() {
  'use strict';

  angular.module('OriaPortal')
    .controller('Teams', ['$scope', '$log', function($scope, $log) {
      $log.info('Created Teams controller');

      $scope.newTeam = function() {
        $scope.$state.go('^.new');
      };

      $scope.teams = [{
        'name': 'Reception',
        'userCount': '4 Users',
      }, {
        'name': 'Help Desk',
        'userCount': '10 Users',
      }, {
        'name': 'Shipping',
        'userCount': '7 Users',
      }, {
        'name': 'Emergency',
        'userCount': '3 Users',
      }, {
        'name': 'Operator',
        'userCount': '2 Users',
      }];

      $scope.teamByName = function(name) {
        var res = $scope.teams.filter(function(t) {
          return t.name.toLowerCase() === name.toLowerCase();
        });
        return res.length === 1 ? res[0] : null;
      };
    }]);
})();

