<?php

// a simple way to optimize loading scripts. 
// 1) throughout the code, request scripts by name
// 2) in _OUT_.php, request <script> with source being page /js/ and GET args from scripts() here.
// 3) see page/template /js/ for how the streaming is done

class JsScripts {

	// relative to the site template dir
	protected $scripts = false;

	private function _init() {
		// explicitly register here the templates that have scripts 
		// append, don't splice new ones in (for caching stability)
		$lang = function_exists('lang_code') ? '.' . lang_code() : '';
		$min =  wire('config')->debug ? '' : '.min' ;
		$this->scripts =  array(
		'jq' => './js/jquery' .$min . '.js',
		'jq-ui' => './js/jquery-ui' .$min. '.js',	// before bootstrap
		'jq-ui-touch' => './js/jquery.ui.touch-punch' .$min. '.js',	// after jquery-ui, before bootstrap
		'bs' => './js/bootstrap' .$min . '.js',
		'chosen' => './js/chosen.jquery' .$min . '.js',
		'gallery' => '../modules/JqueryFancybox215/JqueryFancybox215.min.js',
		'app' => './js/app' .$min. '.js',
		'lang' => './js/lang' .$min. '.js',
		'map' => './js/RCDMap' .$min. '.js',
		'parallax' => './js/parallax' .$min. '.js',
		'datetime' => './js/pickadate' .$lang.$min. '.js',
		// 'sticky' => './js/jquery.sticky-kit.min.js',
		'affix' => './js/affix' .$min. '.js',
		'calendar' => './js/calendar' .$min. '.js',
		'qaptcha' => './js/QapTcha.jquery' .$min. '.js',
		);
	}

	// the current list
	protected $ls;
	// the constants
	protected $NAMES;

	public function __construct() {
		$this->_init();
		// construct the names array from the scripts' keys
		$this->NAMES = array();
		foreach( $this->scripts as $name => $val) { 
			$this->NAMES[] = $name; 
		}
 		// init the script list
 		$this->ls = array();
		// were names passed in?
		foreach( func_get_args() as $name) {
			$this->add( $name );
		}
	}

	public function add( $name ) {
		$i = array_search( $name, $this->NAMES);
		if ($i===false) {
			throw new WireException( "jsScripts.add: unknown script name: $name");
		}
		if (!$this->has($name)) {
			$this->ls[] = $i;
		}
	}

	public function remove( $name ) {
		$i = array_search( $name, $this->NAMES);
		if ($i===false) {
			throw new WireException( "jsScripts.remove: unknown script name: $name");
		}
		$pos = array_search( $i, $this->ls);
		if ($pos !== false) {
			array_splice( $this->ls, $pos, 1);
		}
	}

	public function has( $name ) {
		$i = array_search( $name, $this->NAMES);
		return $i===false ? false : in_array( $i, $this->ls);
	}

	public function scripts() {
		sort($this->ls);
		return join(',', $this->ls);
	}

	public function stream( $i ) {
		$name = $this->NAMES[ $i ];
		if (!$name) {
			echo "\n\n alert( 'jsScripts->stream cannot locate reference: $i' ); \n\n";
		} else {
			$fname = $this->scripts[ $name ];
			if (!file_exists($fname)) {
				echo "\n\n alert( 'jsScripts->stream cannot locate $name : $fname' ); \n\n";
			} else { 
				// add air to ensure one file's comments don't mess up the next one
				echo file_get_contents( $fname ) . "\n\n" ;	
			}
		}
	}

}

Wire::setFuel( 'jsScripts', new JsScripts( 'jq', 'bs', 'app'));


