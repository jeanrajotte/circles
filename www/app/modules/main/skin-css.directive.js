/*skin-css.directive.js*/

(function() {
  angular.module('OriaPortal')
    .directive('skinCss', ['Session', '$log', function(Session, $log) {
      return {
        link: function(scope, ele, attrs) {
          if (Session.user) {
            attrs.href = attrs.href.replace('/default/', '/' + Session.user.skin.name + '/');
          }
        }
      };
    }]);
}());

