<?php 
	function remoteFileExists($url){
	    $ch = curl_init();
	    curl_setopt($ch, CURLOPT_URL, $url);
	    curl_setopt($ch, CURLOPT_NOBODY, 1);
	    curl_setopt($ch, CURLOPT_FAILONERROR, 1);
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	    if (curl_exec($ch)) return true;
	    else return false;
	}

 ?>