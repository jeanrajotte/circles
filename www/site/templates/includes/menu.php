<?php

// define possible menus
// returns an assoc array, each named after a menu.
// each menu contains an array, 
// where each item is either a string selector to create a PageArray,
// or a closure that returns a PageArray
function menu_config() {
  return array(
    'main' => array(
        'template.name=home',
        'name=events,sort=sort',
      ),
    'meta' => array(
        'template.name=blog',
        'template.name=contact_form,name=hello',
        'template.name=contact_form,name=booking',
      ),
    );
}

function menu( $name ) {
  $MENUS = menu_config();
  if (!array_key_exists($name, $MENUS)) {
    throw new WireException( "Unknown menu name: $name");
  }
  // build array of items
  $arr = new PageArray();
  foreach($MENUS[$name] as $mitem) {
    if (is_string($mitem)) {
      // a selector that returns a PageArray
      $ls = wire('pages')->find($mitem);
    } elseif ($mitem instanceof Closure) {
      // a function that returns a PageArray
      $ls = $mitem();
    } else {
      throw new WireException( "Unknown menu def: $mitem");
    }
    foreach($ls as $p) {
      $arr->add( $p );
    }

  }
  // compose menu
  $cur_p = wire('page');
  $res = '';
  foreach($arr as $p) {
    $title = title( $p, TITLE_MENU);
    if (!$title) { $title = $p->name; }
    $c = '';
    $c .= ($cur_p===$p)
      ? ' active'
      : '';
    $c .= $p->options->get('key=no_url')
      ? ' inert'
      : '';
    $x = $p->options->get('key=no_url') 
      ? "<span>{$title}</span>"
      : "<a href='{$p->url}'>{$title}</a>";
    $res .= "<li class='nav-{$p->name}{$c}'>{$x}</li>";
  }
  return $res;
}

