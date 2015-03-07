<?php

// normalize site language
$home = wire('pages')->get('/'); 
foreach(wire('languages') as $language) {
    $name = $language->isDefault ? 'name' : "name{$language->id}";
    $language->set('code', $home->get($name));
}

// respond to browser language preference the 1st time only
if(!$session->get('setLang')) {
    if (array_key_exists('HTTP_ACCEPT_LANGUAGE', $_SERVER)) {
        // find the first match we know
        $ls = preg_split( '/[;,]/', $_SERVER['HTTP_ACCEPT_LANGUAGE']);
        foreach($ls as $code) {
    		foreach($languages as $language) {
    			if ($language->get('code') === substr($code,0,2)) {
    				$url = $page->localUrl( $language->name );
    				$session->set('setLang','1');
    				$session->redirect( $url );
    			}
    		}
        }
    }
    $session->set('setLang','1');
}

// return user language code
function lang_code() {
	return wire('user')->language->code;
}
// return default language object
function lang_default() {
	foreach(wire('languages') as $language) {
    	if ($language->isDefault) { return $language; }
    }
    throw new Exception('Cannot locate default language!');
}

