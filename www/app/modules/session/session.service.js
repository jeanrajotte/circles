/*session.service.js*/

(function() {
  'use strict';

  angular.module('OriaPortal')
    .factory('Session', ['$cookieStore', '$log', function($cookieStore, $log) {
      var users = [{
        id: 'boball',
        password: '123',
        firstName: 'Bob',
        lastName: 'All-Rights',
        access: { // B,R,E,A,D
          company: [1, 1, 1, 1, 1],
          user: [1, 1, 1, 1, 1],
          team: [1, 1, 1, 1, 1],
          device: [1, 1, 1, 1, 1],
          callflow: [1, 1, 1, 1, 1],
          notification: [1, 1, 1, 1, 1],
        }
      }, {
        id: 'bobco',
        password: '123',
        firstName: 'Bob',
        lastName: 'Company-Only',
        access: { // B,R,E,A,D
          company: [1, 1, 1, 1, 1],
          user: [0, 0, 0, 0, 0],
          team: [0, 0, 0, 0, 0],
          device: [0, 0, 0, 0, 0],
          callflow: [0, 0, 0, 0, 0],
          notification: [1, 1, 1, 1, 1],
        }
      }, {
        id: 'bobsome',
        password: '123',
        firstName: 'Bob',
        lastName: 'Co-Users-Teams',
        skinName: 'acme',
        access: { // B,R,E,A,D
          company: [1, 1, 1, 1, 1],
          user: [1, 1, 1, 1, 1],
          team: [1, 1, 1, 1, 1],
          device: [0, 0, 0, 0, 0],
          callflow: [0, 0, 0, 0, 0],
          notification: [1, 1, 1, 1, 1],
        }
      }];

      return {
        dev: false,
        user: null,
        clear: function() {
          this.user = null;
          $cookieStore.remove('app_user');
        },
        getUser: function() {
          $log.debug('session.getUser() in dev:', this.dev);
          if (!this.user && this.dev) {
            var u = $cookieStore.get('app_user');
            if (u) {
              this.authenticate(u.id, u.pwd);
            }
          }
          return this.user;
        },
        authenticate: function(id, password) {
          // look up via HTTP when we grow
          var skin,
            res = users.filter(function(o) {
            return (id && password && o.id.toLowerCase() == id.toLowerCase() && o.password == password);
          });
          if (res.length === 1) {
            this.user = res[0];
            this.user.fullName = this.user.firstName + ' ' + this.user.lastName;
            skin = this.user.skinName || 'default';
            this.user.skin = {
              name: skin,
              logo: 'skins/' + skin + '/logo.html',
            };
            if (this.dev) {
              $cookieStore.put('app_user', {
                id: this.user.id,
                pwd: this.user.password
              });
            }
            return true;
          }
          return false;
        }
      };
    }]);
}());

