<?php


/**
 * Handles dynamic loading of classes as registered with spl_autoload_register
 *
 */
function APP_ClassLoader($className) {
	$className = str_replace('\\', '/', $className);
	$file = "includes/$className.php";
	if(is_file($file)) {
		require($file);
	}
}

spl_autoload_register('APP_ClassLoader');

