// newuser.controller.js

(function() {
  'use strict';

  angular.module('OriaPortal')
    .controller('NewTeam', ['$log', '$scope', function($log, $scope) {
      var i;

      $log.debug('Created New Team Controller');

      $scope.steps = [{
        heading: 'Team Details',
        route: '.step1'
      }, {
        heading: 'Users',
        route: '.step2'
      }, {
        heading: 'Call Flow',
        route: '.step3'
      }, {
        heading: 'Advanced',
        route: '.step4'
      }];

      $scope.initialTabSetup('main.teams.new', $scope.steps);
      for (i = 1; i < $scope.steps.length; i++) {
        $scope.steps[i].disabled = true;
      }

      $scope.fields = {
        teamName: {
          type: 'text',
          required: true,
          label: 'Team name',
          placeholder: 'Enter a unique team name',
          value: '',
          messages: {
            required: {
              type: 'danger',
              text: 'Team Name is required.',
            },
            unique: {
              type: 'warning',
              text: 'This Team Name already exists',
            }
          }
        },
        ringAction: {
          type: 'select',
          required: false,
          label: 'Ring Action',
          options: [{
            value: 1,
            data: 'Ring'
          }, {
            value: 2,
            data: 'Hunt'
          }, {
            value: 3,
            data: 'Pickup'
          }, {
            value: 4,
            data: 'Page'
          }]
        }
      };

      $scope.lastStep = false;
      $scope.setLastStep = function(n) {
        $scope.lastStep = n === $scope.steps.length - 1;
      };

      // ZZZZZZZ this ought to be a global utility
      function getStep(route) {
        var a = route.split('.');
        return a[a.length - 1];
      }

      $scope.routeEnabled = function(route) {
        $log.debug('routeEnabled', route);
        return true;
      };

      $scope.validateStep = function(step) {
        var msgs, fld, val;
        switch (getStep(step.route)) {
          case 'step1':
            fld = $scope.fields.teamName;
            $log.debug(fld);
            // $log.debug(step1.teamName);
            fld.messages.required.visible = fld.value === '';
            fld.messages.unique.visible = $scope.teamByName(fld.value) !== null;
            // $log.debug(step1, $scope);
            return !(fld.messages.required.visible || fld.messages.unique.visible);
          default:
            return true;
        }
      };

      $scope.wizardProgress = function(cmd) {

        function getCurrStep() {
          var i;
          for (i = 0; i < $scope.steps.length; i++) {
            if ($scope.steps[i].route === $scope.$state.current.name) {
              return i;
            }
          }
          return 0; // ??? 
        }

        var currStep, nextStep;
        switch (cmd) {
          case 'cancel':
            $scope.$state.go('main.teams');
            break;
          case 'next':
            currStep = getCurrStep();
            if (currStep === $scope.steps.length - 1) {
              // we're done!
            } else {
              if ($scope.validateStep($scope.steps[currStep])) {
                $log.debug('passed validation for', $scope.steps[currStep]);
                nextStep = currStep + 1;
                $scope.steps[nextStep].disabled = false;
                $scope.setLastStep(nextStep);
                $scope.$state.go($scope.steps[nextStep].route);
              }
            }
            break;
          case 'previous':
            currStep = getCurrStep();
            if (currStep === 0) {
              // we're at start, can't go back further!
            } else {
              nextStep = currStep - 1;
              $scope.setLastStep(nextStep);
              $scope.$state.go($scope.steps[nextStep].route);
            }
            break;
          case 'save':
            alert('Pretend saving!');
            break;
          default:
            throw new Exception('Undefined wizardProgress arg: ' + direction);
        }
      };

      $scope.user = {};

      $scope.$watch('user.selected', function() {
        // $log.debug('user.selected changed');
        if ($scope.user.selected) {
          // $log.debug('user.selected worked');
          $scope.users.existing.unshift($scope.user.selected);
          $scope.user.selected = null;
        }
      });

      $scope.users = {
        new: [{
          name: 'James Smith',
          ext: 'x2234',
          email: 'james.smith@mitel.com',
        }, {
          name: 'Mary Smith',
          ext: 'x22345',
          email: 'mary.smith@mitel.com',
        }, {
          name: 'Raoul Smith',
          ext: 'x2231',
          email: 'raoul.smith@mitel.com',
        }, {
          name: 'Mario Smith',
          ext: 'x222',
          email: 'mario.smith@mitel.com',
        }, {
          name: 'Peter Smith',
          ext: 'x22343',
          email: 'peter.smith@mitel.com',
        }, {
          name: 'Paul Smith',
          ext: 'x2236',
          email: 'paul.smith@mitel.com',
        }, ],

        existing: [{
          name: 'James Jones',
          ext: 'x1234',
          email: 'james.jones@mitel.com',
        }, {
          name: 'Mary Jones',
          ext: 'x1232',
          email: 'mary.jones@mitel.com',
        }, {
          name: 'Raoul Jones',
          ext: 'x1235',
          email: 'raoul.jones@mitel.com',
        }, {
          name: 'Mario Jones',
          ext: 'x1236',
          email: 'mario.jones@mitel.com',
        }, {
          name: 'Peter Jones',
          ext: 'x1237',
          email: 'peter.jones@mitel.com',
        }, {
          name: 'Paul Jones',
          ext: 'x1238',
          email: 'paul.jones@mitel.com',
        }]
      };

    }]);
})();

