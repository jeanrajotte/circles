<?php

define( 'FORMAT_DATE', 'Y-m-d');
define( 'FORMAT_TIME', 'H:i');
define( 'FORMAT_DATE_TIME', FORMAT_DATE . ' ' . FORMAT_TIME);
define( 'FORMAT_DATE_TIME_NAME', 'Ymd_Hi');

$homepage = wire('pages')->get('/');
$config = wire('config');

function pluralize( $singular, $plural, $n) {
  return $n>1 ? $plural : $singular;
}

// utilities
function find_first() {
  $arr = func_get_args();
  // _trace($arr, 'find_first');
  $obj = array_shift( $arr );
  // echo $obj->count();
  foreach( array_filter( $arr) as $selector ) {
    $res = $obj->find( $selector );
    // echo $selector . ' ======= ' . $res->count();
    if ($res->count()) { 
      // _trace( "find_first result from: $selector" );
      return $res; 
    }
  }
  return new PageArray();
}

function _trace( $obj, $label='' ) {
  echo "<!-- TRACE: {$label}:\n";
  print_r( $obj );
  echo "\n-->\n";
}
function _trace_js( $obj, $label='' ) {
  echo "/* TRACE: {$label}:\n";
  print_r( $obj );
  echo "\n*/\n";
}

function char_limit( $html, $limit=100, $endStr = ' (…)') {
  $str = strip_tags($html);
  if(strlen($str) <= $limit) return $str;
  $out = substr($str, 0, $limit);
  $pos = strrpos($out, " ");
  if ($pos>0) {
      $out = substr($out, 0, $pos);
  }
  return $out . $endStr;
}

function include_js( $fname ) {
  echo '<script>';
  readfile( './js/' . $fname . (wire('config')->debug ? '' : '.min') . '.js' );
  echo '</script>';
}

function renderJSErrorMessageDefs( $err_msgs ) {
  $out = 'var ERR_MSGS = ' . json_encode( $err_msgs );
  $sep = ',';
  foreach($err_msgs as $key => $val) {
    $out .= "{$sep} {$key} = '{$key}'";
  }
  return $out . ';';
}

// each param is an array where:
// [0] = scope object
// [1] = template name
// [2] = for obj only, the field name
function cachedLookupIds( $lkup, $obj ) {
  $cache = wire('modules')->get("MarkupCache");
  $key = $obj[0]->name . '_' . $obj[2];
  if(!$ids = $cache->get( $key )) {
    // _trace( $key, "generate");
    // _trace( $lkup[0]->find( "template={$lkup[1]}" )->count() );
    foreach( $lkup[0]->find( "template={$lkup[1]}" ) as $item ) {
      $id = $item->id;
      $slctr = "has_parent={$obj[0]->id}, template={$obj[1]}, {$obj[2]}={$id}";
      // _trace( $slctr );
      // _trace( wire('pages')->find( $slctr )->count() );
      // _trace( wire('pages')->get( $slctr )->id, 'found obj id' );
      if ( wire('pages')->get( $slctr )->id ) {
        $ids .= "|{$id}";
      }
    }
    // _trace( $ids );
    $ids = substr($ids, 1);
    $cache->save($ids);
  }
  return $ids;
}


// display funcs

function banner() {
  $page = wire('page');
  $W = 1140;
  $h = $page->template->name === 'home' ? 370 : 140;
  $works = $page->parents->reverse()->prepend( $page );
  $x = wire('pages')->get('/');
  foreach( $works as $p) {
    if ($p->images->find('tags~=banner')->count()) {
      $x = $p;
      break;
    } 
  }
  // _trace( $x->name );
  // _trace( $x->images->find('tags~=banner')->count() );
  if ($x->images->find('tags~=banner')->count() > 1) {
    
    ?>
    <div id="carousel-header" class="carousel slide" data-ride="carousel">
      <ol class="carousel-indicators">
    <?php
    
    $n=0;
    foreach( $x->images->find('tags~=banner') as $image) {
      $c = ($n==0) ? ' class="active"' : '';
      echo "<li data-target='#carousel-header' data-slide-to='{$n}'$c></li>";            
      $n++;
    }

    ?>
      </ol>
    <div class="carousel-inner">
    <?php

    $n = 0;
    foreach( $x->images->find('tag~=banner') as $image) {
      $img = $image->size($W,$h);
      $c = ($n++==0) ? ' active' : '';
      echo "<div class='item$c'>
        <img src='{$img->url}' alt='{$image->description}' title='{$image->description}'>
        <div class='carousel-caption'>{$image->description}</div>
      </div>";
    } 
    
    ?>
    </div>
    <a class="left carousel-control" href="#carousel-header" data-slide="prev">
      <span class="glyphicon glyphicon-chevron-left"></span>
    </a>
    <a class="right carousel-control" href="#carousel-header" data-slide="next">
      <span class="glyphicon glyphicon-chevron-right"></span>
    </a>
  </div>
  <?php
  
  } else {
    // _trace($x->images->find('tags~=banner'));
_trace($x->title);
    $image = $x->images->find('tags~=banner')->first();
    echo "<div class='img' style='background-image:url({$image->url});'>&nbsp;</div>";
  }
}

// mapping page->options keys
define('TITLE_MENU', 'title_menu');
define('TITLE_BREADCRUMBS', 'title_bcrumbs');

function title( $pg = false, $mode = false ) {
  if ($pg===false) { $pg = wire('page'); }
  $res = false;
  if ($mode) {
    $opt = $pg->options->get("key={$mode}");
    if ($opt) {
      $res = $opt->value;
    }
  }
   
  if (!$res) {
    $res = $pg->get('title');
  }
  return $res;
}

function make_icon( $icon ) {
  return strpos( $icon, 'glyphicon-')===0
    ? "<span class='glyphicon {$icon}'></span>"
    : (strpos( $icon, 'fa-')===0
      ? "<span class='fa {$icon}'></span>"
      : $icon);
}

function image_attrs( $image ) {
  if ($image->description) {
    return " alt='{$image->description}' title='{$image->description}";
  } 
  return "";
}

function image_sizes( $image ) {
  return " width='{$image->width}' height='{$image->height}'";
}

function video_embed($id, $w=420) {
  $h = round( $w / 4 * 3, 0);
  return "<iframe width='$w' height='{$h}' src='//www.youtube.com/embed/{$id}' frameborder='0' allowfullscreen></iframe>";
}

/////// helper for app config

Wire::setFuel( 'app', new WireData());
function app_config_push( $array_var_name, $value ) {
  $arr = wire('app')->get( $array_var_name);
  if (!is_array($arr)) {
    throw new WireException( "app_config_push expects the name of an array in 1st arg but received '$array_var_name'.");
  }
  $arr[] = $value;
  wire('app')->set( $array_var_name, $arr);
}


