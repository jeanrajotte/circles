// client-side language support 

$(document).ready(function() {

	APP.LANGS_INDEX = ['fr'];
	APP.LANGS_DEFAULT = 'en';
	APP.LANGS = {
		'Please first select a city in order to book a space.' : [
			"Veuillez d'abord selectioner une ville afin de réserver un espace.",
		]
		
	};

	APP.lang = function( txt ) {
		var cur = $('html').attr('lang'),
			idx, res;
		if (!cur) { return txt; }
		if (cur === APP.LANGS_DEFAULT) { return txt; }
		if( !APP.LANGS.hasOwnProperty( txt )) { return txt; }	// don't translate if none avail...
		res = APP.LANGS[ txt];
		idx = APP.LANGS_INDEX.indexOf( cur );
		if (idx === -1) { APP.error( 'lang: Unknown language: ' + cur); }
		return res[ idx ];
	};

});
