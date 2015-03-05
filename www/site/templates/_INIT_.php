<?php

/***************************************************************************************
 * This is the global init file included before all template files.
 *
 * Use of this is optional and set via $config->prependTemplateFile in /site/config.php.
 * We are using this init file to define shared functions and variables. 
 * See _OUT_.php for the main markup file where everything is output.
 *
 */

/***************************************************************************************
 * SHARED FUNCTIONS
 *
 * We include a set of shared functions here so that they can be used by any of our
 * template files as needed. 
 *
 */

require_once('./includes/class_loader.php');
// include_once("./includes/langs.php"); 
include_once("./includes/js.php");
include_once("./includes/functions.php");
include_once("./includes/app.php");
// include_once("./includes/hooks.php");
// include_once('includes/social_functions.php');


/***************************************************************************************
 * SHARED VARIABLES
 *
 * These are the variables we've decided template files may choose to populate.
 * These variables are ultimately output by _OUT_.php. Here we are establishing 
 * default values for them. 
 *
 */

$browser_title = title( $page ); 	// what appears in the <title> tag (maybe there's more, determined in _OUT_)
$headline = title( $page); 	// primary h1 headline
$headline_url = $page->url;
$site_title = title( wire('pages')->get('/') );
$site_url = wire('config')->urls->root;
$content = ''; 	// bodycopy area

wire('app')->head_extras = array();		// additional stuff to put in the <head>
wire('app')->map_class = '';
wire('app')->map_zoom = false;
wire('app')->body_classes = array();
wire('app')->chosen_extra_options = '';
wire('app')->page_has_banner = true;
wire('app')->page_has_breadcrumbs = true;
wire('app')->map_has_geolocation = true;
wire('app')->page_has_images = $page->images;
wire('app')->page_has_socials = false;

// if the current page number is > 1, append that in the browser_title
if($input->pageNum > 1) $browser_title .= " - Page {$input->pageNum}";


