<?php

/**
 * When included, this file outputs a Google Map
 *
 * It is basically a #map div, followed by a <script> that init's a Google 
 * Map and dynamically generates the markers from page dada. 
 *
 */


function render_map( $markers_js_var ) {

	ob_start();

?>
<div id='map'<?php echo wire('app')->map_class; ?>></div>

<script type='text/javascript'>
	$(document).ready(function() { 
		<?php
			// start out w/ an approximation for the centre and zoom
			// if there are map_markers, this will be tuned after the markers are positioned.
			if (wire('page')->map && wire('page')->map->lat) {
				// take center point from current page
				$lat = wire('page')->map->lat;
				$lng = wire('page')->map->lng; 
				$zoom = 8;
			} else { 
				// use center point in the middle-ish of the ontario
				$lat = 45.231171; 
				$lng = -76.485954; 
				$zoom = 6; 
			}
			// override
			if (wire('app')->map_zoom !== false) { $zoom = wire('app')->map_zoom; }
		?>
		// RCDMap.options.mapTypeId = <?php echo (wire('page')->template == 'cities') ? 'google.maps.MapTypeId.ROADMAP' : 'google.maps.MapTypeId.HYBRID'; ?>;
		RCDMap.options.mapTypeId = <?php echo 'google.maps.MapTypeId.ROADMAP'; ?>;
		RCDMap.options.zoom = <?php echo $zoom; ?>;
		RCDMap.init('map', <?php echo $lat?>, <?php echo $lng?>); 
		$("#content").addClass('has_map'); 
		RCDMap.loadMarkers( <?php echo $markers_js_var; ?>);
		<?php 
		
		if (wire('app')->map_has_geolocation) {
			echo 'RCDMap.geoLocation("' . __('You are here') . '");';
		}

		?>
	});
</script>	

<?php
	return ob_get_clean();
}
