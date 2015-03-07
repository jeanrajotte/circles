/*http-mitel.service.js*/


(function() {

  'use strict';
  angular.module('OriaPortal').factory('HttpMitel', ['$http', 'Mock', function($http, Mock) {

    return {

      endPoints: {
        company: {
          BREAD: [false, false, false, false, false],
          browseUrl: '/companies',
          url: '/company/{id}'
        },
        notification: {
          BREAD: [false, false, false, false, false],
          browseUrl: '/notifications',
          url: '/notification/{id}'
        },
        user: {
          BREAD: [false, false, false, false, false],
          browseUrl: '/users',
          url: '/user/{id}'
        },
        userProfile: {
          BREAD: [false, false, false, false, false],
          browseUrl: '/users/profile',
          url: '/user/{id}/profile'
        }
      },

      serve: function(endPoint, action, data, cb) {
        var self = this;

        assertEndPoint(endPoint, action);
        if (Mock.mockAll || !endPointReady(endPoint, action)) {
          Mock.serve(endPoint, action, data, cb);
        } else {
          // $http stuff here
          cb({
            success: false,
            message: 'HTTP service not set up'
          });
        }

        function assertEndPoint(endPoint, action) {
          if (typeof self.endPoints[endPoint] == 'undefined') {
            throw Error('Invalid HttpMitel endpoint: ' + endPoint);
          }
          if (breadIndex(action) === false) {
            throw Error('Invalid HttpMitel request: ' + endPoint + '/' + action);
          }
        }

        function breadIndex(action) {
          switch (action) {
            case 'browse':
              return 0;
            case 'read':
              return 1;
            case 'edit':
              return 2;
            case 'add':
              return 3;
            case 'delete':
              return 4;
            default:
              return false;
          }
        }

        function endPointReady(endPoint, action) {
          return endPoints[endPoint].BREAD[breadIndex(action)];
        }


      }
    };

  }]);

}());