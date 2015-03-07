/*menu-items.controller.js*/

(function() {
  'use strict';
  angular.module('OriaPortal')
    .controller('MenuItems', ['$scope', '$state', 'Access', 'locale', '$log', 'localeEvents', function($scope, $state, Access, locale, $log, localeEvents) {
      $scope.items = [{
        img: 'Company.png',
        localeKey: 'common.company',
        route: '.company',
        endPoint: 'company',
        action: 'read'
      }, {
        img: 'User.png',
        localeKey: 'common.users',
        route: '.users',
        endPoint: 'user',
        action: 'browse'
      }, {
        img: 'Team.png',
        localeKey: 'common.teams',
        route: '.teams',
        endPoint: 'team',
        action: 'browse'
      }, {
        img: 'Devices.png',
        localeKey: 'common.sharedDevices',
        route: '.devices',
        endPoint: 'device',
        action: 'browse'
      }, {
        img: 'CallFlow.png',
        localeKey: 'common.callFlows',
        route: '.callflows',
        endPoint: 'callflow',
        action: 'browse'
      }].filter(function(item) {
        return Access.canDo(item.endPoint, item.action);
      });
    }]);
}());

