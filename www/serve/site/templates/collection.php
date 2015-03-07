<?php

/* collection template */

$content .= '<div class="container">';
$content .= '<div class="row">';
$content .= '<div class="col-xs-12">';

$content .= '<ul>';
foreach($page->children as $child) {
	$content .= "<li><a href='{$child->url}'>{$child->title}</a></li>";
}
$content .= '</ul>';

$content .= '</div>';
$content .= '</div>';
$content .= '</div>';
