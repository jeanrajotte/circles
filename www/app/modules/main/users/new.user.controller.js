// newuser.controller.js

(function() {
  'use strict';

  angular.module('OriaPortal')
    .controller('NewUser', ['$log', '$scope', function($log, $scope) {
      $log.info('Created New User Controller');

      $scope.stages = [{
        heading: 'User Details',
        route: '.step1'
      }, {
        heading: 'Select Plan',
        route: '.step2'
      }, {
        heading: 'Configure Plan',
        route: '.step3'
      }, {
        heading: 'Device Setup',
        route: '.step4'
      }];

      $scope.initialTabSetup('main.users.new', $scope.stages);

      $scope.userStep1 = {
        fname: {
          value: '',
          missing: false
        }
      };

      $scope.wizardProgress = function(direction) {
        var i, currStage = 0,
          route;
        if (direction === 'cancel') {
          $scope.$state.go('main.users');
        } else {
          for (i = 0; i < $scope.stages.length; i++) {
            if ($scope.stages[i].route === $scope.$state.current.name) {
              currStage = i;
              break;
            }
          }
          if (direction === 'next') {
            if (currStage === $scope.stages.length - 1) {
              // we're done!
            } else {

              // ZZZZZZZ brutish demonstration!

              if (currStage === 0) {
                $scope.userStep1.fname.missing = $scope.userStep1.fname.value === '';
                if ($scope.userStep1.fname.missing) {
                  return;
                }
              }

              $scope.$state.go($scope.stages[currStage + 1].route);

            }
          } else if (direction === 'previous') {
            if (currStage === 0) {
              // we're at start, can't go back further!
            } else {
              $scope.$state.go($scope.stages[currStage - 1].route);
            }
          }
        }
      };

      $scope.plans = [{
        deviceId: 'D001-H',
        macAddress: 'A8:4F:45:56',
        extension: '23556'
      }, {
        deviceId: 'D001-H',
        macAddress: 'A8:4F:45:56',
        extension: '23556'
      }];

      $scope.bundles = [{
        'name': 'Service 1',
        'basic': true,
        'silver': true,
        'gold': true,
        'diamond': true
      }, {
        'name': 'Service 2',
        'basic': true,
        'silver': true,
        'gold': true,
        'diamond': true
      }, {
        'name': 'Service 3',
        'basic': false,
        'silver': true,
        'gold': true,
        'diamond': true
      }, {
        'name': 'Feature 1',
        'basic': true,
        'silver': true,
        'gold': true,
        'diamond': true
      }, {
        'name': 'Feature 2',
        'basic': false,
        'silver': true,
        'gold': true,
        'diamond': true
      }, {
        'name': 'Feature 3',
        'basic': false,
        'silver': true,
        'gold': true,
        'diamond': true
      }];

    }]);
})();

