/*video-embed.directive.js*/

(function() {

	// 'use strict';

	angular.module('OriaPortal').directive('videoEmbed', ['ModalService', '$window', function(ModalService, $window) {

		function play(scope) {
			var video = scope.videoEmbed;
			console.log(video);

			switch (video.type) {
				case 'youtube':

					$window.open('//www.youtube.com/watch?v=' + video.youtubeId);
					break;
				default:
					iElm.html('<p>Unkonwn video.type = ' + video.type + '</p>');
					break;
			}
			
			// doesn't work "yet"

			// scope.modalTitle = video.title;
			// ModalService.showModal({
			// 	templateUrl: 'modal-dlg.html'
			// 	// controller: "ModalController"
			// }).then(function(modal) {

			// 	//it's a bootstrap element, use 'modal' to show it
			// 	modal.element.modal();
			// 	modal.close.then(function(result) {
			// 		console.log(result);
			// 	});
			// });

		}


		return {
			restrict: 'A',
			scope: {
				videoEmbed: '=',
				modalTpl: '@'
			},
			link: function(scope, iElm, iAttrs) {
				var video = scope.videoEmbed,
					s = '';
				switch (video.type) {
					case 'youtube':
						s = '<img class="thumb" src="http://img.youtube.com/vi/' +
							video.youtubeId +
							'/default.jpg" alt="' +
							video.title + '"/>' +
							'<span class="play-btn"></span>';
						$(iElm[0])
							.html(s)
							.on('click', function(ev) {
								play(scope);
							});
						break;
					default:
						iElm.html('<p>Unkonwn video.type = ' + video.type + '</p>');
						break;

				}
			}
		};


	}]);

}());