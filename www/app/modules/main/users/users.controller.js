/*users.controller.js*/

(function () {
  'use strict';

  angular.module('OriaPortal').controller('Users', ['$scope', '$log', function ($scope, $log) {
    $log.info('Created Users controller');

    $scope.newUser = function () {
      $scope.$state.go('^.new');
    };

    $scope.users = [
      {
        'firstName': 'Anders',
        'lastName': 'Fahrendorff',
        'email': 'anders@company.com',
        'homePhone': 'x4444',
        'mobilePhone': 'x4444',
      },
      {
        'firstName': 'Conor',
        'lastName': 'Nicol',
        'email': 'conor@company.com',
        'homePhone': 'x4444',
        'mobilePhone': 'x4444',
      },
      {
        'firstName': 'Hani',
        'lastName': 'Ezzadeen',
        'email': 'hani@company.com',
        'homePhone': 'x4444',
        'mobilePhone': 'x4444',
      },
      {
        'firstName': 'Ekwa',
        'lastName': 'Duala-Ekoko',
        'email': 'ekwa@company.com',
        'homePhone': 'x4444',
        'mobilePhone': 'x4444',
      },
      {
        'firstName': 'Douglas',
        'lastName': 'Riches',
        'email': 'douglas@company.com',
        'homePhone': 'x4444',
        'mobilePhone': 'x4444',
      },
    ];

  }]);
})();