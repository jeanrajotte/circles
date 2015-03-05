<?php

/**
 * An individual FormField item to be part of an FormFieldArray for a Page
 *
 */
class DictionaryEntry extends WireData {

	/**
	 * We keep a copy of the $page that owns this FormField so that we can follow
	 * its outputFormatting state and change our output per that state
	 *
	 */
	protected $page; 

	/**
	 * Construct a new FormField
	 *
	 */
	public function __construct() {

		// define the fields that represent our FormField (and their default/blank values)
		$this->set('key', ''); 
		$this->set('value', ''); 
	}

	/**
	 * Set a value to the FormField: key, value
	 *
	 */
	public function set($key, $value) {

		if($key == 'page') {
			$this->page = $value; 
			return $this; 

		} else if( in_array( $key, array( 'key', 'value'))) {
			// regular text sanitizer
			// JRJR we're not minding whether key is one of the valid values as per the config
			$value = $this->sanitizer->text($value); 	
		}

		return parent::set($key, $value); 
	}

	/**
	 * Retrieve a value from the FormField: key, value
	 *
	 */
	public function get($key) {
		$value = parent::get($key); 

		// if the page's output formatting is on, then we'll return formatted values
		if($this->page && $this->page->of()) {

			if( in_array( $key, array( 'key', 'value' ))) {
				// return entity encoded versions of strings
				$value = $this->sanitizer->entities($value); 
			}
		}

		return $value; 
	}


	/**
	 * Provide a default rendering for an FormField
	 *
	 */
	public function renderDictionary() {
		// remember page's output formatting state
		$of = $this->page->of();
		// turn on output formatting for our rendering (if it's not already on)
		if(!$of) $this->page->of(true);
		$out = "$this->key : $this->value; ";	
		if(!$of) $this->page->of(false); 
		return $out; 
	}

	/**
	 * Return a string representing this FormField
	 *
	 */
	public function __toString() {
		return $this->renderDictionary();
	}

}

