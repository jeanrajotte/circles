<?php

/*event template*/

wire('jsScripts')->add('map');
wire('jsScripts')->add('jq-ui');
wire('jsScripts')->add('jq-ui-touch');

wire('app')->banner_from_map = true;

$content .= "allo";