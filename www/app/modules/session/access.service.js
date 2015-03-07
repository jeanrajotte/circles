/*access.service.js*/

(function() {

  'use strict';

  angular.module('OriaPortal')
    .factory('Access', ['Session', '$log', function(Session, $log) {

      return {
        // name: the data name (end point)
        // action: the verb (BREAD or HTTP methods)
        canDo: function(endPoint, action) {
          var ep,
            index = {
              browse: 0,
              read: 1,
              edit: 2,
              add: 3,
              delete: 4
            }[action],
            user = Session.getUser();
          if (!user) {
            return false;
          }
          if (index === undefined) {
            throw Error('Access.canDo() - Invalid action: ' + action);
          }
          ep = user.access[endPoint];
          if (ep === undefined) {
            throw Error('Access.canDo() - Invalid endPoint: ' + endPoint);
          }
          return ep[index] ? true : false;
        }

      };
    }]);

}());

