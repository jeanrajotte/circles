/*top-left.directive.js*/

//Logo Mitel Oria

(function() {
  'use strict';
  angular.module('OriaPortal')
    .directive('topLeft', [function() {
      return {
        link: function(scope, el, atts) {
          $(el)
            .html('Logo Mitel | Oria');
        }
      };
    }]);
}());

