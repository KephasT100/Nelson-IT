<?php

function mne_errorhandler_showarray( $a, $insert )
{
	foreach ($a as $i => $v )
	{
	    if ( is_array($v) )
	    {
	    	file_put_contents ( 'php://stderr', $insert . $i . ":\n");
	    	mne_errorhandler_showarray($v, $insert . "    ");
	    }
	    else
	    {
	    	file_put_contents ( 'php://stderr', $insert . $i . ": " . $v . "\n");
	    }
	}
	
}
function mne_errorhandler($errno, $errstr, $errfile, $errline, $errcontext)
{

    if ( error_reporting() == 0 ) return true;
    file_put_contents ( 'php://stderr', 'Fehler: ' . $errno . ' ' . $errstr . "\n" );
    if ( $errno & 0x700 )
    	exit($errno >> 8);
    
    if (isset ( $errfile )) file_put_contents ( 'php://stderr', '                Datei: ' . $errfile . ' Zeile:' . $errline . "\n" );
    if (isset ( $errcontext)) mne_errorhandler_showarray($errcontext, '                ');

    exit(255);
}

set_error_handler("mne_errorhandler");
?>