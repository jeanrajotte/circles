<?php

/* app.php */

// possible types: generic, card
function render_page_data( $pages, $var_name, $type='generic' ) {
	$arr = get_map_data( $pages, $type );
	return $arr ? render_page_data_from_array( $arr, $var_name ) : '';
}

function render_page_data_from_array( $arr, $var_name ) {
	$json = count($arr)
		? json_encode($arr)
		: '[]';
	return "<script>\n{$var_name}={$json};</script>";
}

// return an array or false
function get_map_data( $pages, $type='generic' ) {
	if (!in_array($type, array('generic', 'card', 'logo'))) {
		throw new WireException("Unknown type for results data: $type.");
	}
	$arr = array();
	foreach($pages as $p) {
		$i = 0;
		$s = $p->title;
		if ($type!=='generic') {
			$s = '';
			foreach(explode('  ', $p->title) as $t) {
				$t = trim($t);
				if ($t) {
					$i++;
					$s .= "<span class='t{$i}'>{$t}</span>";
				}
			}
		}

		// _trace( $p->map->address );
		$item = array(
			'type' => $type,
			'id' => $p->id,
			'title' => $p->map->address,
			'url' => $p->url,
			'lat' => $p->map->lat,
			'lng' => $p->map->lng);
		if ($type=='card' || $type=='logo') {
			$image = $p->images->first();
		    if ($image) {
		    	$img = $image->size( 222, 148, true );
		    	$img_url = $img->url;
		    } else {
		    	$img_url = wire('config')->urls->templates . 'css/images/tsw-logo.jpg';
		    }
		    $item['img'] = $img_url;
		    $item['cap'] = $p->number_of_people ? $p->number_of_people->title : false;
		}
		$arr[] = $item;
	}
	return count($arr) ? $arr : false;
}
