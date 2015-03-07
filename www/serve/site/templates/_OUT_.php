<?php

/*
 * MAIN OUTPUT TEMPLATE
 *
 * thanks to Ryan Cramer for the template framework
 *
 * This file expects the following variables to be populated: 
 *
 * 	- $browser_title: The text to place in the <title> tag. 
 * 	- $headline: The text to place in the <h1> tag. 
 * 	- $content: The text to place in the <div id='content'> tag, like the main body copy. 
 *
 */

require_once('./includes/menu.php');

// get smart about which scripts to include
if (wire('app')->page_has_images) { wire('jsScripts')->add('gallery'); }

// menu needs this always
wire('jsScripts')->add('affix');

?>
<!DOCTYPE html>
<html lang="en" xml:lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<title><?php 
	
		echo $browser_title;
	
	?></title>

	<link rel="stylesheet" type="text/css" href="<?php echo $config->urls->templates?>css/site.css" />

	<!--[if lt IE 9]>
		<script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
		<script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
	<![endif]-->
	
<?php if (wire('jsScripts')->has('map')) : ?>
	<script src="http://maps.google.com/maps/api/js?sensor=false"></script> 
<?php endif; ?>
	<script src="/js/?s=<?php echo wire('jsScripts')->scripts(); ?>"></script>
<?php echo implode( "\n", wire('app')->head_extras ); ?>

</head>

<body class="<?php 
	echo "{$page->name} {$page->template}";
	if (wire('app')->body_classes) {
		echo " " . implode( ' ', wire('app')->body_classes); 
	}
	?>">
	<div class="contain-all">

		<div class="page-header" >
			<div class="container">
				<h1><a href='<?php echo $site_url; ?>' title='<?php echo $site_title; ?>'><?php echo $site_title; ?></a></h1>
			</div>
		</div>
		<div class='affix-spacer'>
			<nav id='topnav' class="navbar navbar-inverse" data-affix-top='0' role="navigation">
		      <div class="container-fluid" >
		        <div class="navbar-header">
		          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
		            <span class="sr-only"><?php echo __('Toggle navigation'); ?></span>
		            <span class="icon-bar"></span>
		            <span class="icon-bar"></span>
		            <span class="icon-bar"></span>
		          </button>
		        </div>
		        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<div class='container'>
			          <ul class="nav navbar-nav">
			            <?php echo menu('main'); ?>
			          </ul>
			          <ul class="nav navbar-nav pull-right">
			            <?php echo menu('meta'); ?>
			          </ul>
			        </div>
		        </div>
		      </div>
		    </nav>
		</div>
		<?php 

	    if (wire('app')->page_has_banner) {
	    	// banner
	    	echo "<div class='banner'>";
	    	
	    	if(wire('app')->banner_from_map) {
            	echo '<script> $(function() { $( ".banner" ).resizable({' 
            		. ' helper: "ui-resizable-helper" '
            		. ', handles: "s",'
            		. '}); });</script>';
				$map_markers = new PageArray();
				$map_markers->add($page);
				$map_zoom = 10;		// region scale
				$markers_js_var = 'HERE';
				require_once("./includes/map.php");
				echo render_map( $markers_js_var ) 
            		. render_page_data( $map_markers, $markers_js_var);

	    	} else {
	    		banner();
	    	}
	    	echo "</div>";
	    }
	    if (wire('app')->page_has_breadcrumbs) {
			// breadcrumbs
			echo "<div class='breadcrumb-container'>";
			echo "<div class='container'>";
			echo "<ul class='breadcrumb'>";
				// generate a breadcrumb list by iterating through the current page's parents
				foreach($page->parents('template.name!=spaces|contact|admin|access-pages') as $parent) {
					$t = title( $parent );
					echo "<li><a href='{$parent->url}'>{$t}</a></li>"; 
				}
				$t = title( $page );
				echo "<li class='current'>{$t}</li>"; 
			echo "</ul>";
			echo "</div>";
			echo "</div>";
	    }
		
		?>
		<div id="content" >
			<?php 
			
			echo $content;

			// include("./includes/sidebar_links.php"); 

			?>
		</div>
		<div id='footer'>
			<div class='container'>
				<div class='row'>
					<div class='col-md-8'>
						<p id='copyright'>
							<span>
							&copy; <?php echo date("Y"); ?> This Space Works 
							&bull; Powered by <a href="http://processwire.com">ProcessWire Open Source CMS v<?php echo $config->version; ?></a>
							</span>
						</p>
						<?php // if($config->debug) foreach($db->getQueryLog() as $n => $query) echo "<p>$n. $query</p>"; ?>
					</div>
				</div>
			</div>
		</div>
	</div>

	<script>
		$(document).on( 'click', 'button[data-loading-text]', function(ev) {
			$(ev.currentTarget).button('loading');
		});
	</script>

<?php 

	// if this page is editable by the current user, then make an 'edit' link
	if($page->editable()) echo "<a id='editpage' href='{$config->urls->admin}page/edit/?id={$page->id}'>Edit</a>"; 


	if (wire('jsScripts')->has('gallery')):

?>
		<link rel="stylesheet" href='<?php echo $config->urls->siteModules ?>JqueryFancybox215/JqueryFancybox215.css?' type="text/css" media="screen" />
		<script>
			$(document).ready(function() {
				$('.body-copy a').closest( 'a').fancybox({
				    beforeShow : function() {
				        var alt = this.element.find('img').attr('alt');
				        this.inner.find('img').attr('alt', alt);
				        this.title = alt;
				    },
					helpers: {
						title: {
							type: 'inside'
						}
					}
				});
			});
		</script>
<?php

	endif;
	if (wire('jsScripts')->has( 'chosen' )):

?>
		<script>
	    	$(document).ready( function() {
	    		// small screen doesn't do well w/ this control. Don't bother
	    		if (window.innerWidth > 480) {
					$('form select').chosen({
						<?php echo wire('app')->chosen_extra_options; ?>
						placeholder_text_multiple: "<?php echo __('Click to select one or more...'); ?>",
						inherit_select_classes: false,
					    disable_search_threshold: 10,
					    no_results_text: "<?php echo __('Oops, nothing found!'); ?>",
					    width: "95%"
					  });
				}
	    	});
		</script>
<?php

	endif;
	if (wire('jsScripts')->has( 'datetime' )):

?>
		<script>
	    	$(document).ready( function() {
	    		APP.datetimeInputInit();
	    	});
		</script>
<?php

	endif;

?>
<script>
	$(document).ready( function() {
		$('.carousel').carousel()
		APP.pageId = <?php echo $page->id; ?>;
	});
</script>
</body>
</html>
