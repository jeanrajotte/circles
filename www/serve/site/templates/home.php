<?php 

// segments should be enabled to permit hooks not based on pages
if ($this->input->urlSegment1) {
	if ($this->input->urlSegment1==='js') {
		if ($input->get->s) {
			header('content-type: application/javascript; charset=utf-8', true);
			// stream them in the order of the requested list
			foreach(explode(',', $input->get->s) as $i) {
				wire('jsScripts')->stream( $sanitizer->text($i) );
			}
			die();
		} else {
			throw new Wire404Exception();
		}
	}
}

$content .= '<div class="container">';
$content .= '<div class="page-header">';
$content .= $page->body;
$content .= '</div>';
$content .= '<div class="row">';
$content .= '<div class="col-xs-12">';
$x = $page->find('template.name=event')->first();
$content .= '<h4>The next event is <a href="'. $x->url .'">' . $x->title . '</a>.</h4>'; 

$content .= '</div>';
$content .= '</div>';
$content .= '</div>';


