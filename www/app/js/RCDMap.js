// RCDMap
// google map wrapper

RCDMap = {

	_markers: [], 
	
	registerMarker: function( marker) {
		this._markers.push(marker);
		return marker;
	},

	options: {
		zoom: 10,
		center: null, 
		mapTypeId: google.maps.MapTypeId.SATELLITE, 
		scrollwheel: false, 
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.DROPDOWN_MENU	
		}, 
		scaleControl: false
	}, 

	map: null,
	eleContainerOffset: {top:0, left:0},

	init: function(mapId, lat, lng) {
		var $ele = $('#' + mapId);
		if ($ele.length===0) { throw new Error('Cannot locate map element #' + mapId); }
		RCDMap.eleContainerOffset = $ele.offset(); 
		RCDMap.options.center = new google.maps.LatLng(lat, lng); 
		RCDMap.map = new google.maps.Map( $ele[0], RCDMap.options); 
		// google.maps.event.addListener(RCDMap, 'bounds_changed', RCDMap.boundsChanged );

		// inject a null APP.RCDMap if needed
		if (typeof APP.RCDMap === 'undefined') {
			APP.RCDMap = {
				markerDefine: function(dummy) { return false; },
				markerTitle : function(dummy) { return false; }
			};
		}
	}, 

	addMarker: function( o ) {
		if (!o.lat) { return false; }
		var marker = new google.maps.Marker({ 
				position: new google.maps.LatLng( o.lat, o.lng), 
				map: RCDMap.map
			});
		marker.id = o.id;
		marker.cargo = o;
		APP.RCDMap.markerDefine( marker );
		return RCDMap.registerMarker( marker );
	},

	loadMarkers: function( ls ) {
		// group markers by lat x long 
		var i, n=ls.length,
			vals = {}, key;
		for(i=0; i<n; i++) {
			key = ls[i].type + '/' + ls[i].lat + '/' + ls[i].lng;
			if (!vals[key]) {
				vals[key] = {
					type: ls[i].type,
					lat: ls[i].lat,
					lng: ls[i].lng,
					id: i,
					items: []
				}
			}
			vals[key].items.push( ls[i] );
		}
		for(key in vals) {
			vals[key].title =  APP.RCDMap.markerTitle( vals[key] ); 
			this.addMarker( vals[key]);
		}
		this.fitBounds();
	},

	fitBounds: function() {
		var bounds = new google.maps.LatLngBounds();
		var i;
		for(i=0; i<RCDMap._markers.length; i++)  {
			bounds.extend( RCDMap._markers[i].getPosition());
		}
		RCDMap.map.fitBounds( bounds);
		// don't let changing bounds zoom in beyond the original requested zoom	
		google.maps.event.addListenerOnce( RCDMap.map, 'zoom_changed', function() {
			if (RCDMap.map.getZoom() > RCDMap.options.zoom) {
			    RCDMap.map.setZoom(RCDMap.options.zoom);
			}
		});
	},

	getMarker: function( id ) {
		var i, arr = this._markers;
		for(var i=0; i<arr.length; i++)  {
			if (arr[i].id === id) { return arr[i]; }
		}
		return false;
	},

	// encapsulate creating gmap latlng objects
	latlng: function( lat, lng) {
		return new google.maps.LatLng(lat, lng);
	},

	fromLatLngToPoint: function( latLng ) {
		var map = RCDMap.map;
	    var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
	    var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
	    var scale = Math.pow(2, map.getZoom());
	    var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
	    return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
	},

	geocodeMarker: function( markerId, request, callback ) {
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode( request, function( geocodeResults, geocodeStatus ) {
			var marker, address, latlng;
			if (geocodeStatus==='OK') {
				// update mapmarker
				marker = RCDMap.getMarker( markerId );
				if (!marker) {
					APP.log( 'marker not found: ' + markerId);
				} else {
					// geocodeResults is an array of possibilities -- only use the 1st one
					if ( geocodeResults.length ) {
						address = geocodeResults[0].formatted_address;
						latlng = geocodeResults[0].geometry.location;
						marker.setPosition( latlng );
						RCDMap.fitBounds();
					} else {
						APP.log( 'geocoding said OK but returned nothing' );
					}
				}
				callback( true );
			} else {
				APP.log( 'geocoding: ' + geocodeStatus );
				callback( false );
			}
		});

	},

	// mark "here" on the map 
	geoLocation: function( msg ) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition( function(position) {
				// when available, always add the you-are-here marker to the map
				var marker = RCDMap.addMarker({
						id: -1, 
						title: msg, 
						url: false, 
						type: 'g',
						lat: position.coords.latitude, 
						lng: position.coords.longitude
					}),
					pos = marker && marker.getPosition();
				if (!marker) { return false; }
				// make the marker special
				marker.setIcon( {
					path: google.maps.SymbolPath.CIRCLE,
					scale: 10,
					fillColor: 'red',
					fillOpacity: 0.6,
					strokeColor: 'red',
					strokeWeight: 2
				});
				// should we change the map bounds to include you-are-here?
				// what's the current shape of the map?
				var n = 10;	// 2 seconds
				function _fitBounds() {
					var curBounds = RCDMap.map.getBounds();
					if (!curBounds) { 
						if (--n > 0) { setTimeout( _fitBounds, 200); }	// or give up
						return; 
					}
					var ne = curBounds.getNorthEast(),
						sw = curBounds.getSouthWest(),
						nw = new google.maps.LatLng( ne.lat(), sw.lng()),
						se = new google.maps.LatLng( sw.lat(), ne.lng());
					// console.log( ne );
					// what's the smallest distance between you-are-here and the bounds
					var d = Math.min( 
						APP.distance( ne, pos),
						APP.distance( sw, pos),
						APP.distance( nw, pos),
						APP.distance( se, pos));
					// if the distance is within 20km, ensure we see you-are-here marker
					if (d <= 20)	{
						RCDMap.fitBounds();	
					}
				}
				setTimeout( _fitBounds, 200);
			});
		}
	},


};
