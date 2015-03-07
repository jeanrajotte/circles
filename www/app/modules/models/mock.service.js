(function() {

  'use strict';

  angular.module('OriaPortal').factory('Mock', [function() {

    return {

      mockAll: true,

      endPoints: {
        company: {
          one: {
            name: 'ACME',
            links: [{
              name: 'Company Map',
              url: 'https://www.google.ca/maps/place/Mitel+Networks/@45.340233,-75.909522,17z/data=!3m1!4b1!4m2!3m1!1s0x4cd1fff1517da8a9:0xe6bc8a721e90f2a5',
              image: 'images/link.png'
            }, {
              name: 'Google Drive',
              url: 'http://google.ca',
              image: 'images/link.png'
            }, {
              name: 'Directory Listing',
              url: 'http://imdb.com',
              image: 'images/link.png'
            }],
            videos: [{
              name: 'vid1',
              title: 'Setting up sub call flows',
              type: 'youtube',
              youtubeId: '7YQ1PhOnM3I',
              description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
            }, {
              name: 'vid2',
              title: 'Streamlining Team Work',
              type: 'youtube',
              youtubeId: 'DvVEeoKrm48',
              description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
            }, {
              name: 'vid1',
              title: 'Setting up sub call flows',
              type: 'youtube',
              youtubeId: '7YQ1PhOnM3I',
              description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
            }, {
              name: 'vid2',
              title: 'Streamlining Team Work',
              type: 'youtube',
              youtubeId: 'DvVEeoKrm48',
              description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
            }]
          },
          many: [{
            name: 'ACME 1',
            links: [{
              name: 'Company Map',
              url: 'https://www.google.ca/maps/place/Mitel+Networks/@45.340233,-75.909522,17z/data=!3m1!4b1!4m2!3m1!1s0x4cd1fff1517da8a9:0xe6bc8a721e90f2a5',
              image: 'images/link.png'
            }, {
              name: 'Google Drive',
              url: 'http://google.ca',
              image: 'images/link.png'
            }, {
              name: 'Directory Listing',
              url: 'http://imdb.com',
              image: 'images/link.png'
            }]

          }, {
            name: 'ACME 2',
            links: [{
              name: 'Company Map',
              url: 'https://www.google.ca/maps/place/Mitel+Networks/@45.340233,-75.909522,17z/data=!3m1!4b1!4m2!3m1!1s0x4cd1fff1517da8a9:0xe6bc8a721e90f2a5',
              image: 'images/link.png'
            }, {
              name: 'Google Drive',
              url: 'http://google.ca',
              image: 'images/link.png'
            }, {
              name: 'Directory Listing',
              url: 'http://imdb.com',
              image: 'images/link.png'
            }]

          }, {
            name: 'ACME 3',
            links: [{
              name: 'Company Map',
              url: 'https://www.google.ca/maps/place/Mitel+Networks/@45.340233,-75.909522,17z/data=!3m1!4b1!4m2!3m1!1s0x4cd1fff1517da8a9:0xe6bc8a721e90f2a5',
              image: 'images/link.png'
            }, {
              name: 'Google Drive',
              url: 'http://google.ca',
              image: 'images/link.png'
            }, {
              name: 'Directory Listing',
              url: 'http://imdb.com',
              image: 'images/link.png'
            }]

          }]
        },
        notification: {
          one: {
            id: 1,
            type: 'warning',
            message: 'be careful'
          },
          many: [{
            id: 1,
            type: 'warning',
            message: 'be careful'
          }, {
            id: 2,
            type: 'danger',
            message: 'bad bad bad!'
          }, {
            id: 3,
            type: 'warning',
            message: "Let's try to go somewhere",
            link: '#/company/hours'
          }]
        },
        user: {
          one: {
            name: 'Raoul',
            address: '123 Street, Maryville, ON'
          },
          many: [{
            name: 'Raoul',
            address: '123 Street, Maryville, ON'
          }, {
            name: 'Raoul',
            address: '123 Street, Maryville, ON'
          }, {
            name: 'Raoul',
            address: '123 Street, Maryville, ON'
          }, ]
        },
        userProfile: {
          one: {
            name: 'Raoul',
            address: '123 Street, Maryville, ON'
          },
          many: [{
            name: 'Raoul',
            address: '123 Street, Maryville, ON'
          }, {
            name: 'Raoul',
            address: '123 Street, Maryville, ON'
          }, {
            name: 'Raoul',
            address: '123 Street, Maryville, ON'
          }, ]
        }
      },

      // endPointName and action SHOULD have been validated by the caller
      serve: function(endPointName, action, data, cb) {
        var self = this;
        cb(getRes());

        function getRes() {

          switch (action) {
            case 'browse':
              if (self.endPoints[endPointName]) {
                return {
                  success: true,
                  data: self.endPoints[endPointName].many
                };
              }
              throw Error('Invalid Mock endpoint: ' + endPointName);
            case 'create':
              return {
                success: true
              };
            case 'read':
            case 'update':
              if (self.endPoints[endPointName]) {
                return {
                  success: true,
                  data: self.endPoints[endPointName].one
                };
              }
              throw Error('Invalid Mock endpoint: ' + endPointName);
            case 'delete':
              return {
                success: true
              };
          }
        }
      },

    };

  }]);

}());