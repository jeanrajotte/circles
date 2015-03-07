/*company.controller.js*/

(function() {
  'use strict';
  angular.module('OriaPortal')
    .controller('Company', ['$scope', 'CompanyModel', function($scope, CompanyModel) {

      $scope.items = [{
        heading: 'Welcome',
        route: '.welcome'
      }, {
        heading: 'Business Hours',
        route: '.hours'
      }, {
        heading: 'Default Key Setups',
        route: '.keydefaults'
      }];

      $scope.$on('mitelStateChanging', function(ev, toState) {
        // console.log( 'mitelStateChanging', toState);
        switch (toState.name) {
          case "main.company.welcome": // ZZZZZZZZ how to work w/ relative state
            CompanyModel.serve('company', 'read', {}, function(resp) {
              if (resp.success) {
                // console.log(resp);
                $scope.company = resp.data;
              }
            });
            break;
        }

      });

      $scope.initialTabSetup('main.company', $scope.items);

    }]);
}());

