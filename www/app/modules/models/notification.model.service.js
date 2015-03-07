/*notification.model.service.js*/

(function() {

  'use strict';

  angular.module('OriaPortal').factory('NotificationModel', ['Access', 'HttpMitel', function(Access, HttpMitel) {
    return {

      serve: function(endPointName, action, data, cb) {
        if (Access.canDo(endPointName, action)) {
          HttpMitel.serve(endPointName, action, data, cb);
        }
      },

    };
  }]);

}());